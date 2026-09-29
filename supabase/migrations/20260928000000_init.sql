-- =====================================================================
-- Poiesis — initial database (Round 11, 28 Sept 2026)
--
-- Everything that must stay true no matter which app talks to the
-- database (the website today, an iPhone or Android app later) lives
-- here, as database rules, not in the page's JavaScript:
--
--   * the gate: you read a conversation only after writing into it
--   * notebooks are private to their owner
--   * only the maker sees who was moved; there are no public counts
--   * one first impression per work and one link per side, per day;
--     a link is never blocked, and stands in as the first impression on
--     any work it touches that had none (Round 13)
--     (stickers are not here: since Round 9 they are a private
--     collection with gilding as a free finish, kept in notebook_items)
--     replies are unlimited (with a spam brake)
--   * a conversation takes new writing for 3 days, then closes;
--     nothing is deleted when it closes
--
-- Performance notes are marked PERF.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------

-- A conversation is open to new writing from the day before its date
-- (time-zone slack) until three days after it. Dates are UTC, the same
-- as the app's today().
create or replace function public.is_open(d date)
returns boolean
language sql stable
set search_path = ''
as $$
  select d between (current_date - 3) and (current_date + 1);
$$;

-- ---------------------------------------------------------------------
-- People
-- ---------------------------------------------------------------------

create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  handle       text unique check (handle ~ '^[a-z0-9_]{3,24}$'),
  display_name text not null default '' check (char_length(display_name) <= 60),
  line         text not null default '' check (char_length(line) <= 200),
  makes        text not null default '' check (char_length(makes) <= 200),
  avatar_path  text check (char_length(avatar_path) <= 300),
  created_at   timestamptz not null default now()
);

-- A profile is made automatically when someone signs up, by any method
-- (email link, password, Google, Apple).
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'full_name',
                  new.raw_user_meta_data ->> 'name', ''), 60)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Moderators. Added by hand in the dashboard.
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------
-- The muses (content). Seeded from muse-bank/index.json by
-- supabase/seed-from-muse-bank.mjs. Readable by everyone, written only
-- from the dashboard or the service key.
-- ---------------------------------------------------------------------

create table public.works (
  id      text primary key check (id ~ '^[a-z0-9-]{1,80}$'),
  slot    text not null check (slot in ('poem', 'passage', 'painting', 'scripture')),
  title   text not null,
  maker   text not null default '',
  meta    jsonb not null default '{}'
);

create table public.days (
  day   date primary key,
  theme text not null default ''
);

create table public.day_works (
  day     date     not null references public.days (day) on delete cascade,
  position smallint not null check (position between 1 and 5),
  work_id text     not null references public.works (id),
  primary key (day, work_id),
  unique (day, position)
);

-- ---------------------------------------------------------------------
-- Conversations: first impressions, links and replies, in one table.
--
--   impression — on one work          (gate = 'work-id')
--   link       — across 2 or 3 works  (gate = 'a+b' or 'a+b+c', sorted)
--   reply      — under any post; it inherits the day, works and gate of
--                the thread's first post, so it is gated the same way.
--
-- Threads read like Twitter: the first post, then its replies in time
-- order; root_id groups a whole thread for a single indexed read.
-- ---------------------------------------------------------------------

create type public.post_kind as enum ('impression', 'link', 'reply');

create table public.posts (
  id         uuid primary key default gen_random_uuid(),
  author_id  uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  kind       public.post_kind not null,
  day        date not null,
  work_ids   text[] not null default '{}',
  gate       text not null default '',
  parent_id  uuid references public.posts (id) on delete set null,
  root_id    uuid references public.posts (id) on delete set null,
  body       text not null check (char_length(btrim(body)) between 1 and 4000),
  created_at timestamptz not null default now(),
  edited_at  timestamptz,
  hidden_at  timestamptz   -- set by a moderator; the author still sees it
);

-- PERF: the three reads the app makes.
create index posts_by_gate    on public.posts (day, gate, created_at) where kind <> 'reply';
create index posts_by_root    on public.posts (root_id, created_at) where root_id is not null;
create index posts_by_author  on public.posts (author_id, created_at desc);
-- The daily limits: one impression per work, one link per side, one centre.
create unique index posts_one_per_gate
  on public.posts (author_id, day, gate) where kind <> 'reply';

-- Which conversations each person has unlocked by writing into them.
create table public.unlocks (
  user_id uuid not null references public.profiles (id) on delete cascade,
  day     date not null,
  gate    text not null,
  primary key (user_id, day, gate)
);
create index unlocks_by_day on public.unlocks (day, gate, user_id);   -- PERF: the table and counts

-- Fill in and check what the app sends. The app sends only:
--   impression: kind, day, work_ids = {work}, body
--   link:       kind, day, work_ids = {a, b[, c]}, body
--   reply:      kind, parent_id, body
create or replace function public.posts_before_insert()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
declare
  me     uuid := auth.uid();
  parent public.posts;
  root   public.posts;
  n_day  int;
  recent int;
begin
  if me is null then
    raise exception 'sign in to write' using errcode = '42501';
  end if;
  new.author_id  := me;
  new.created_at := now();
  new.edited_at  := null;
  new.hidden_at  := null;

  if new.kind = 'reply' then
    select * into parent from public.posts where id = new.parent_id;
    if not found or parent.hidden_at is not null then
      raise exception 'that note is no longer here' using errcode = 'P0002';
    end if;
    if parent.kind = 'reply' and parent.root_id is not null then
      select * into root from public.posts where id = parent.root_id;
    else
      root := parent;
    end if;
    new.root_id  := root.id;
    new.day      := parent.day;
    new.work_ids := parent.work_ids;
    new.gate     := parent.gate;
    -- You can only reply where you can read.
    if not exists (select 1 from public.unlocks u
                   where u.user_id = me and u.day = new.day and u.gate = new.gate) then
      raise exception 'write your own first impression first' using errcode = '42501';
    end if;
    -- Spam brake: at most 30 replies in 10 minutes.
    select count(*) into recent from public.posts
      where author_id = me and kind = 'reply' and created_at > now() - interval '10 minutes';
    if recent >= 30 then
      raise exception 'slow down a little' using errcode = '54000';
    end if;
  else
    new.parent_id := null;
    new.root_id   := null;
    select array_agg(distinct w order by w) into new.work_ids from unnest(new.work_ids) w;
    select count(*) into n_day from public.day_works dw
      where dw.day = new.day and dw.work_id = any (new.work_ids);
    if new.work_ids is null or n_day <> cardinality(new.work_ids) then
      raise exception 'those works are not on that day' using errcode = '22023';
    end if;
    if new.kind = 'impression' and cardinality(new.work_ids) <> 1 then
      raise exception 'a first impression is about one work' using errcode = '22023';
    end if;
    if new.kind = 'link' and cardinality(new.work_ids) not between 2 and 3 then
      raise exception 'a link joins two or three works' using errcode = '22023';
    end if;
    -- Round 13: links are never blocked. A link written before a work's
    -- first impression stands in as the first impression there (see
    -- posts_after_insert), so a separate one is then refused.
    if new.kind = 'impression' and exists (
         select 1 from public.unlocks u
         where u.user_id = me and u.day = new.day and u.gate = new.work_ids[1]) then
      raise exception 'you have already written here today' using errcode = '23505';
    end if;
    new.gate := array_to_string(new.work_ids, '+');
  end if;

  if not public.is_open(new.day) then
    raise exception 'this conversation has closed' using errcode = '42501';
  end if;
  return new;
end;
$$;

create trigger posts_before_insert
  before insert on public.posts
  for each row execute function public.posts_before_insert();

create or replace function public.posts_after_insert()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
begin
  if new.kind <> 'reply' then
    insert into public.unlocks (user_id, day, gate)
    values (new.author_id, new.day, new.gate)
    on conflict do nothing;
    -- A link opens each work it touches too, as that work's first
    -- impression if there was none yet (Round 13).
    if new.kind = 'link' then
      insert into public.unlocks (user_id, day, gate)
      select new.author_id, new.day, w from unnest(new.work_ids) w
      on conflict do nothing;
    end if;
  end if;
  return new;
end;
$$;

-- Only the body can be edited, by its author, while the conversation is open.
create or replace function public.posts_before_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if public.is_admin() and new.body = old.body then
    return new;                       -- moderators may only hide/unhide
  end if;
  if old.author_id <> auth.uid() or not public.is_open(old.day) then
    raise exception 'this can no longer be changed' using errcode = '42501';
  end if;
  new.id := old.id; new.author_id := old.author_id; new.kind := old.kind;
  new.day := old.day; new.work_ids := old.work_ids; new.gate := old.gate;
  new.parent_id := old.parent_id; new.root_id := old.root_id;
  new.created_at := old.created_at; new.hidden_at := old.hidden_at;
  new.edited_at := now();
  return new;
end;
$$;

create trigger posts_before_update
  before update on public.posts
  for each row execute function public.posts_before_update();

-- ---------------------------------------------------------------------
-- "Moved me". Private between the reader and the maker. No counts.
-- ---------------------------------------------------------------------

create table public.moved (
  post_id    uuid not null references public.posts (id) on delete cascade,
  user_id    uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);
create index moved_by_user on public.moved (user_id, post_id);

create trigger posts_after_insert
  after insert on public.posts
  for each row execute function public.posts_after_insert();

-- ---------------------------------------------------------------------
-- Reports (moderation). Readers can file; only moderators read them.
-- ---------------------------------------------------------------------

create table public.reports (
  id          bigint generated always as identity primary key,
  post_id     uuid not null references public.posts (id) on delete cascade,
  reporter_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  reason      text not null default '' check (char_length(reason) <= 500),
  created_at  timestamptz not null default now(),
  unique (post_id, reporter_id)
);

-- ---------------------------------------------------------------------
-- The Notebook. One row per thing (a page, a kept line, a question, the
-- rule of life...). The app keeps its own copy on the device and syncs
-- rows that changed since the last sync, so writing never waits on the
-- network, and a new notebook feature needs no new table.
-- ---------------------------------------------------------------------

create table public.notebook_items (
  user_id    uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  kind       text not null check (kind ~ '^[a-z_]{1,24}$'),
  id         text not null check (char_length(id) between 1 and 80),
  data       jsonb not null default '{}',
  deleted    boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, kind, id),
  -- Photos should move to Storage; until then, cap one item at ~1 MB.
  constraint notebook_item_size check (pg_column_size(data) < 1000000)
);
-- PERF: "what changed since my last sync" is one index range scan.
create index notebook_items_sync on public.notebook_items (user_id, updated_at);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.user_id := auth.uid();
  new.updated_at := clock_timestamp();
  return new;
end;
$$;

create trigger notebook_items_touch
  before insert or update on public.notebook_items
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------
-- Read helpers (called from the app with supabase.rpc)
-- ---------------------------------------------------------------------

-- One page of the first posts under a work on a day: its impressions,
-- plus every link that touches it, newest first. `before` is the
-- created_at of the last post already shown (for "show earlier").
-- Runs as the caller, so the gate still applies.
-- PERF: the day's gates that touch the work are worked out first, so the
-- read is a handful of index range scans on (day, gate, created_at).
create or replace function public.work_posts(
  d date, work text, before timestamptz default null, lim int default 20)
returns setof public.posts
language sql stable
set search_path = ''
as $$
  with ws as (
    select array_agg(work_id order by work_id) as a
    from public.day_works where day = d
  ), gates as (
    select array_to_string(array(
             select ws.a[i] from generate_subscripts(ws.a, 1) i
             where (m >> (i - 1)) & 1 = 1 order by i), '+') as g
    from ws, generate_series(1, (1 << cardinality(ws.a)) - 1) m
  )
  select p.* from public.posts p
  where p.day = d
    and p.kind <> 'reply'
    and p.gate = any (array(select g from gates where work = any (string_to_array(g, '+'))))
    and (before is null or p.created_at < before)
  order by p.created_at desc, p.id desc
  limit least(greatest(lim, 1), 100);
$$;

-- A Twitter-style page of a thread's replies for several threads at
-- once: the first `per_root` replies of each, oldest first. Runs as the
-- caller, so the gate still applies.
create or replace function public.thread_replies(root_ids uuid[], per_root int default 3)
returns setof public.posts
language sql stable
set search_path = ''
as $$
  select r.*
  from unnest(root_ids) as t(root_id)
  cross join lateral (
    select p.* from public.posts p
    where p.root_id = t.root_id
    order by p.created_at, p.id
    limit least(greatest(per_root, 1), 200)
  ) r;
$$;

-- "Who was at the table" for a day: each person once, with what kinds of
-- thing they gave (impression, link, whole). Never a total per person.
-- Only people who have written that day can open it.
-- PERF: read from unlocks (one row per person per thing given), not posts.
create or replace function public.day_table(d date)
returns table (user_id uuid, display_name text, handle text, avatar_path text, gave text[])
language sql stable security definer
set search_path = ''
as $$
  select pr.id, pr.display_name, pr.handle, pr.avatar_path,
         array_agg(distinct case
           when u.gate not like '%+%' then 'impression'
           when u.gate like '%+%+%'  then 'whole'
           else 'link' end)
  from public.unlocks u
  join public.profiles pr on pr.id = u.user_id
  where u.day = d
    and exists (select 1 from public.unlocks me where me.user_id = auth.uid() and me.day = d)
  group by pr.id, pr.display_name, pr.handle, pr.avatar_path;
$$;

-- How many people wrote today: the number beside the avatar stack.
-- It is public that people gave, not how much.
create or replace function public.day_count(d date)
returns int
language sql stable security definer
set search_path = ''
as $$
  select count(distinct user_id)::int from public.unlocks
  where day = d and auth.uid() is not null;
$$;

-- "N others wrote today" beside a work's title.
create or replace function public.work_count(d date, work text)
returns int
language sql stable security definer
set search_path = ''
as $$
  select count(*)::int from public.unlocks
  where day = d and gate = work and auth.uid() is not null
    and user_id <> auth.uid();
$$;

-- ---------------------------------------------------------------------
-- Row-level security. PERF: auth.uid() is wrapped in (select ...) so
-- Postgres evaluates it once per query, not once per row.
-- ---------------------------------------------------------------------

alter table public.profiles       enable row level security;
alter table public.admins         enable row level security;
alter table public.works          enable row level security;
alter table public.days           enable row level security;
alter table public.day_works      enable row level security;
alter table public.posts          enable row level security;
alter table public.unlocks        enable row level security;
alter table public.moved          enable row level security;
alter table public.reports        enable row level security;
alter table public.notebook_items enable row level security;

-- profiles: signed-in people can see each other; you edit your own.
create policy profiles_read   on public.profiles for select to authenticated using (true);
create policy profiles_update on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- content: anyone may read the muses.
create policy works_read     on public.works     for select to anon, authenticated using (true);
create policy days_read      on public.days      for select to anon, authenticated using (true);
create policy day_works_read on public.day_works for select to anon, authenticated using (true);

-- posts: THE GATE. You see your own writing, and others' writing only in
-- a conversation you have written into. Hidden posts vanish for others.
create policy posts_read on public.posts for select to authenticated using (
  author_id = (select auth.uid())
  or (select public.is_admin())
  or (hidden_at is null and exists (
        select 1 from public.unlocks u
        where u.user_id = (select auth.uid()) and u.day = posts.day and u.gate = posts.gate))
);
create policy posts_insert on public.posts for insert to authenticated
  with check (author_id = (select auth.uid()));
create policy posts_update on public.posts for update to authenticated
  using (author_id = (select auth.uid()) or (select public.is_admin()));
create policy posts_delete on public.posts for delete to authenticated
  using (author_id = (select auth.uid()) or (select public.is_admin()));

-- unlocks: you can see your own (the app uses them to show what is open).
create policy unlocks_read on public.unlocks for select to authenticated
  using (user_id = (select auth.uid()));

-- moved: the reader sees their own marks; the maker sees who was moved.
create policy moved_read on public.moved for select to authenticated using (
  user_id = (select auth.uid())
  or exists (select 1 from public.posts p
             where p.id = moved.post_id and p.author_id = (select auth.uid()))
);
create policy moved_insert on public.moved for insert to authenticated with check (
  user_id = (select auth.uid())
  and exists (select 1 from public.posts p          -- must be able to read it
              where p.id = moved.post_id and p.author_id <> (select auth.uid()))
);
create policy moved_delete on public.moved for delete to authenticated
  using (user_id = (select auth.uid()));

-- reports: file only; moderators read in the dashboard or here.
create policy reports_insert on public.reports for insert to authenticated
  with check (reporter_id = (select auth.uid()));
create policy reports_read on public.reports for select to authenticated
  using ((select public.is_admin()));

-- notebook: yours alone.
create policy notebook_own on public.notebook_items for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------
-- Column privileges: the app may only write the columns it owns.
-- ---------------------------------------------------------------------

revoke insert, update on public.posts from anon, authenticated;
grant insert (kind, day, work_ids, parent_id, body) on public.posts to authenticated;
grant update (body, hidden_at) on public.posts to authenticated;

revoke insert, update on public.profiles from anon, authenticated;
grant update (handle, display_name, line, makes, avatar_path) on public.profiles to authenticated;

revoke all on public.admins from anon, authenticated;
revoke insert, update, delete on public.works, public.days, public.day_works, public.unlocks
  from anon, authenticated;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.posts_before_insert() from public, anon, authenticated;
revoke execute on function public.posts_after_insert() from public, anon, authenticated;
