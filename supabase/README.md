# Supabase: setting it up (about 20 minutes)

Until these steps are done, the site runs as the prototype and nothing changes for anyone. See `docs/architecture.md` for what each part does.

## 1. Make the project
1. Sign up at supabase.com (the free plan is enough for the beta) and create a project called **poiesis**.
2. **Region:** choose the one closest to most of your readers. Pick East US if they are mostly in America, Central EU (Frankfurt) if mostly in Europe. You cannot change it later.
3. Save the database password somewhere safe. The site never needs it.

## 2. Build the database
1. In the dashboard, open **SQL Editor → New query**.
2. Paste all of `supabase/migrations/20260928000000_init.sql` and press **Run**.
3. On your computer, in the Poiesis folder, run `node supabase/seed-from-muse-bank.mjs`. It writes `supabase/seed.sql` from the muse bank.
4. Paste `supabase/seed.sql` into a new query and run it. Run it again whenever the muse bank changes.

## 3. Sign-in settings (Authentication)
1. **URL Configuration:** set *Site URL* to the live site (for GitHub Pages, `https://mggcoding.github.io/Poiesis/`). Under *Redirect URLs*, add that address and `http://localhost:8000/**` for testing.
2. **Email** is on by default. It covers both the sign-in link and passwords.
3. **Google (optional, free):** in Google Cloud Console, create an OAuth client (type *Web application*). Paste the redirect address Supabase shows you into Google, then paste Google's client ID and secret into Supabase. Then add `"google"` to `providers` in `site/config.js`.
4. **Apple (optional):** needs the Apple Developer Program ($99 a year). Follow Supabase's "Login with Apple" guide, then add `"apple"` to `providers`.
5. **Email sending:** Supabase's built-in sender only allows a few emails an hour. Before opening sign-up, go to *Authentication → Emails → SMTP Settings* and connect a sending service (for example Resend or Postmark). The daily letter will need one anyway.

## 4. Connect the site
Open **Project Settings → API** and copy the *Project URL* and the *anon* / *publishable* key into `site/config.js`. Both are meant to be public. **Never** paste the `service_role` / secret key into the site.

## 5. Make yourself a moderator
Sign in once on the site. Then, in the SQL editor:
```sql
insert into public.admins (user_id)
select id from auth.users where email = 'YOUR-EMAIL';
```

## Good to know
- **The free plan pauses a project after a week with no activity.** Press *Restore* in the dashboard, or upgrade (Pro is $25 a month) when real people depend on it.
- **Database changes go in new files** in `supabase/migrations/`, named with the date (`20261005000000_whatever.sql`). Never edit one that has already been run on the live project.
- With the Supabase CLI you can instead run `supabase link` then `supabase db push`, which applies the migrations for you.

## Tests
- `tests/rules.test.sql`: 47 checks of every rule (the gate, limits, privacy, closing, moderation). Load `tests/stub-supabase.sql` and the migration into a throwaway Postgres, then run the file. It must end with `ALL RULES PASSED`.
- `tests/sync.e2e.mjs`: the site in a real browser, syncing between two devices and going offline, against the real rules (setup is in its header).
