-- Tests for the rules in the init migration. Run against a throwaway
-- Postgres after stub-supabase.sql and the migration (supabase/README.md).
-- Any failure stops the run with the failing check's message.
\set ON_ERROR_STOP on
set client_min_messages = warning;

create schema tests;
grant usage on schema tests to anon, authenticated;

create function tests.ok(cond boolean, msg text) returns void language plpgsql as $$
begin
  if cond is distinct from true then raise exception 'FAILED: %', msg; end if;
  raise notice 'ok  %', msg;
end $$;

-- Runs a statement as the current role and passes only if it fails.
create function tests.fails(stmt text, msg text) returns void language plpgsql as $$
begin
  begin
    execute stmt;
  exception when others then
    raise notice 'ok  % (%)', msg, sqlerrm;
    return;
  end;
  raise exception 'FAILED: % — it was allowed', msg;
end $$;

create function tests.as_user(u uuid) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claim.sub', coalesce(u::text, ''), false);
end $$;

grant execute on all functions in schema tests to anon, authenticated;

-- ------------------------------------------------ setup (as the owner)
insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-0000-0000-00000000000a', 'a@x.test', '{"full_name":"Ana"}'),
  ('00000000-0000-0000-0000-00000000000b', 'b@x.test', '{}'),
  ('00000000-0000-0000-0000-00000000000c', 'c@x.test', '{}'),
  ('00000000-0000-0000-0000-0000000000ad', 'mod@x.test', '{}');
insert into public.admins values ('00000000-0000-0000-0000-0000000000ad');

insert into public.works (id, slot, title, maker) values
  ('w1', 'poem', 'Poem', 'P'), ('w2', 'passage', 'Passage', 'Q'), ('w3', 'painting', 'Painting', 'R');
insert into public.days (day, theme) values (current_date, 'light'), (current_date - 5, 'old');
insert into public.day_works values
  (current_date, 1, 'w1'), (current_date, 2, 'w2'), (current_date, 3, 'w3'),
  (current_date - 5, 1, 'w1');

select tests.ok((select display_name from public.profiles where id = '00000000-0000-0000-0000-00000000000a') = 'Ana',
  'a profile is made on sign-up, with the name from Google/Apple');

-- ------------------------------------------------ the gate
set role authenticated;

select tests.as_user('00000000-0000-0000-0000-00000000000b');
insert into public.posts (kind, day, work_ids, body) values ('impression', current_date, '{w1}', 'B on the poem');

select tests.as_user('00000000-0000-0000-0000-00000000000a');
select tests.ok((select count(*) from public.posts) = 0,
  'before writing, A cannot read anyone on the poem');
insert into public.posts (kind, day, work_ids, body) values ('impression', current_date, '{w1}', 'A on the poem');
select tests.ok((select count(*) from public.posts where 'w1' = any (work_ids)) = 2,
  'after writing, A reads the poem''s table');
select id as a_post from public.posts where body = 'A on the poem' \gset
select tests.ok((select author_id from public.posts where body = 'A on the poem') = '00000000-0000-0000-0000-00000000000a',
  'the author is always the signed-in person');
select tests.fails($$insert into public.posts (kind, day, work_ids, body) values ('impression', current_date, '{w1}', 'again')$$,
  'one first impression per work per day');
select tests.fails($$insert into public.posts (kind, day, work_ids, body, author_id) values ('impression', current_date, '{w2}', 'x', '00000000-0000-0000-0000-00000000000b')$$,
  'cannot write as someone else');
select tests.fails($$insert into public.posts (kind, day, work_ids, body) values ('impression', current_date, '{nope}', 'x')$$,
  'cannot write on a work that is not on that day');
select tests.fails($$insert into public.posts (kind, day, work_ids, body) values ('impression', current_date - 5, '{w1}', 'late')$$,
  'a conversation closes after three days');
select tests.fails($$insert into public.posts (kind, day, work_ids, body) values ('impression', current_date, '{w2}', '   ')$$,
  'an empty note is refused');

-- ------------------------------------------------ links (the sides)
-- Round 13: a link is never blocked. Written before a work's first
-- impression, it becomes your first impression there.
select tests.as_user('00000000-0000-0000-0000-00000000000b');
insert into public.posts (kind, day, work_ids, body) values ('impression', current_date, '{w2}', 'B on the passage');
select tests.as_user('00000000-0000-0000-0000-00000000000a');
select tests.ok((select count(*) from public.posts where body = 'B on the passage') = 0,
  'A cannot read the passage yet');
insert into public.posts (kind, day, work_ids, body) values ('link', current_date, '{w2,w1}', 'A links poem and passage');
select tests.ok(true, 'a link is never blocked, even before the passage has a first impression');
select tests.ok((select count(*) from public.posts where body = 'B on the passage') = 1,
  'the link counts as A''s first impression on the passage, so it opens the passage''s table');
select tests.fails($$insert into public.posts (kind, day, work_ids, body) values ('impression', current_date, '{w2}', 'A on the passage')$$,
  'after a link stood in as the first impression, no second first impression there');
select tests.ok((select gate from public.posts where kind = 'link') = 'w1+w2',
  'a link is keyed to its side, in a stable order');
select tests.ok((select count(*) from public.posts where work_ids @> '{w2}' and kind <> 'reply') = 2,
  'a link appears under every work it touches');
select tests.ok((select count(*) from public.work_posts(current_date, 'w1')) = 3,
  'work_posts: the poem shows its impressions and the link');
select tests.ok((select count(*) from public.work_posts(current_date, 'w3')) = 0,
  'work_posts: the painting shows nothing it is not part of');
select tests.fails($$insert into public.posts (kind, day, work_ids, body) values ('link', current_date, '{w1,w2}', 'second link')$$,
  'one link per side per day');

select tests.as_user('00000000-0000-0000-0000-00000000000b');
select tests.ok((select count(*) from public.posts where kind = 'link') = 0,
  'B cannot read the link until B writes a link on that side');

-- ------------------------------------------------ replies (threads)
insert into public.posts (kind, parent_id, body)
  select 'reply', id, 'B replies to A' from public.posts where body = 'A on the poem';
select tests.ok((select root_id from public.posts where body = 'B replies to A')
              = (select id from public.posts where body = 'A on the poem'),
  'a reply joins the thread of the post it answers');

select tests.as_user('00000000-0000-0000-0000-00000000000a');
insert into public.posts (kind, parent_id, body)
  select 'reply', id, 'A answers B' from public.posts where body = 'B replies to A';
select tests.ok((select root_id from public.posts where body = 'A answers B')
              = (select id from public.posts where body = 'A on the poem'),
  'a reply to a reply stays in the same thread');
insert into public.posts (kind, parent_id, body)
  select 'reply', id, 'A, a later thought' from public.posts where body = 'A on the poem';
select tests.ok(true, 'you can reply to yourself (later thoughts)');
select tests.ok((select count(*) from public.thread_replies(array(select id from public.posts where body = 'A on the poem'), 2)) = 2,
  'thread_replies returns the first N replies of a thread');

select tests.as_user('00000000-0000-0000-0000-00000000000c');
select tests.ok((select count(*) from public.thread_replies(array(select id from public.posts), 10)) = 0,
  'C, who has not written, sees no replies');
select tests.fails('insert into public.posts (kind, parent_id, body) values (''reply'', ' || quote_literal(:'a_post') || ', ''C sneaks in'')',
  'C cannot reply without writing first');

-- ------------------------------------------------ moved me
select tests.as_user('00000000-0000-0000-0000-00000000000b');
insert into public.moved (post_id) select id from public.posts where body = 'A on the poem';
select tests.fails($$insert into public.moved (post_id) select id from public.posts where body = 'B on the poem'$$,
  'you cannot mark your own note');
select tests.as_user('00000000-0000-0000-0000-00000000000a');
select tests.ok((select count(*) from public.moved) = 1, 'the maker sees who was moved');
select tests.as_user('00000000-0000-0000-0000-00000000000c');
select tests.ok((select count(*) from public.moved) = 0, 'no one else sees it');

-- ------------------------------------------------ editing
select tests.as_user('00000000-0000-0000-0000-00000000000a');
update public.posts set body = 'A on the poem, revised' where body = 'A on the poem';
select tests.ok((select edited_at is not null from public.posts where body = 'A on the poem, revised'),
  'an edit is marked as edited');
select tests.fails($$update public.posts set day = current_date - 1 where body = 'A on the poem, revised'$$,
  'only the words can be edited');
select tests.as_user('00000000-0000-0000-0000-00000000000b');
update public.posts set body = 'hijack' where body = 'A on the poem, revised';
select tests.ok((select count(*) from public.posts where body = 'hijack') = 0, 'no one can edit another''s note');
update public.posts set hidden_at = now() where body = 'B replies to A';
select tests.ok((select hidden_at is null from public.posts where body = 'B replies to A'),
  'authors cannot hide or unhide (only moderators)');

-- ------------------------------------------------ the table (avatars)
select tests.as_user('00000000-0000-0000-0000-00000000000c');
select tests.ok((select count(*) from public.day_table(current_date)) = 0, 'the table opens only once you have written');
select tests.ok(public.day_count(current_date) = 2, 'everyone signed in sees how many people wrote today');
select tests.as_user('00000000-0000-0000-0000-00000000000a');
select tests.ok((select count(*) from public.day_table(current_date)) = 2, 'A sees who was at the table');

-- ------------------------------------------------ counts
select tests.ok(public.work_count(current_date, 'w1') = 1, '"N others wrote today" counts the others on that work');

-- ------------------------------------------------ moderation
select tests.as_user('00000000-0000-0000-0000-00000000000b');
insert into public.reports (post_id, reason) select id, 'test' from public.posts where body = 'A answers B';
select tests.ok((select count(*) from public.reports) = 0, 'reporters cannot read the reports');
select tests.as_user('00000000-0000-0000-0000-0000000000ad');
select tests.ok((select count(*) from public.reports) = 1, 'moderators read reports');
update public.posts set hidden_at = now() where body = 'A answers B';
select tests.as_user('00000000-0000-0000-0000-00000000000b');
select tests.ok((select count(*) from public.posts where body = 'A answers B') = 0, 'a hidden note vanishes for others');
select tests.as_user('00000000-0000-0000-0000-00000000000a');
select tests.ok((select count(*) from public.posts where body = 'A answers B') = 1, 'its author still sees it');

-- ------------------------------------------------ the notebook
insert into public.notebook_items (kind, id, data) values ('page', 'j1', '{"title":"Two chairs"}');
select tests.ok((select user_id from public.notebook_items) = '00000000-0000-0000-0000-00000000000a', 'a notebook item belongs to its writer');
select tests.as_user('00000000-0000-0000-0000-00000000000b');
select tests.ok((select count(*) from public.notebook_items) = 0, 'no one else can read your notebook');
insert into public.notebook_items (kind, id, data, user_id) values ('page', 'j1', '{"title":"mine"}', '00000000-0000-0000-0000-00000000000a');
select tests.ok((select user_id from public.notebook_items where id = 'j1') = '00000000-0000-0000-0000-00000000000b',
  'writing into someone else''s notebook lands in your own');
insert into public.notebook_items (kind, id, data) values ('page', 'j1', '{"title":"again"}')
  on conflict (user_id, kind, id) do update set data = excluded.data, deleted = excluded.deleted;
select tests.ok((select data->>'title' from public.notebook_items where id = 'j1') = 'again', 'syncing the same page updates it');

-- ------------------------------------------------ signed out
reset role;
set role anon;
select tests.as_user(null);
select tests.ok((select count(*) from public.posts) = 0, 'signed-out visitors cannot read conversations');
select tests.ok((select count(*) from public.works) = 3, 'signed-out visitors can read the muses');
reset role;

select 'ALL RULES PASSED' as result;
