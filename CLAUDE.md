# Poiesis: notes for Claude Code

Poiesis is a daily place to receive a poem, a passage and a third work (Scripture from the v2 muse bank on, with the day's painting beside it), write a first impression before reading anyone else's, and keep what moves you in a Notebook. Read `docs/decisions-log.md` before proposing changes; later rounds override earlier ones. The five pillars in `docs/project-instructions.md` are the test for every feature.

## Working agreements
- Before building or editing a feature, ask Niko 4–10 clarifying questions, multiple choice with a recommended option first. Build after he answers. Push back when an idea conflicts with the pillars or with another decision.
- Never mention Revenue Recovery Co. anywhere in Poiesis.
- Muse stories must be true and sourced.
- Homey, handmade look (paper, notecards, handwriting); it must work on phones.

## Layout
- `site/`: the static site (GitHub Pages). No build step.
  - `index.html` loads `copy.js` → `app.js` → `config.js` → `data.js`.
  - `copy.js`: every word of the frame, as `key: value`. New UI wording goes here, read with `T("key", "default")`.
  - `app.js`: the page. State `S` lives in localStorage (`poiesis.v7`). `save()` also tells `data.js` something changed. `window.PoiesisApp` is the hook for `data.js` (`state`, `commit`, `reset`, `toast`, `T`, `today`).
  - `config.js`: Supabase URL, public anon key, and which sign-in providers are on. Blank means prototype mode (no accounts, nothing leaves the browser).
  - `data.js`: sign-in card, notebook sync (`COLLECTIONS` lists what syncs), and `PoiesisData.threads` (the conversation calls).
- `supabase/`: the database. `migrations/` (never edit one already applied; add a new dated file), `seed-from-muse-bank.mjs` → `seed.sql`, `tests/`, and `README.md` with the setup steps.
- `muse-bank/`: the content (calendar, works, `index.json`).
- `docs/`: decisions log, architecture (`docs/architecture.md`), project instructions, PDFs.

## Rules that must stay in the database, not the page
The gate, private notebooks, only-the-maker-sees-who-was-moved, one impression per work and one link per side per day, three days open, moderation. A future iOS or Android app must get them for free.

## Testing
- Database: run `supabase/tests/rules.test.sql` against a throwaway Postgres with `stub-supabase.sql` and the migrations loaded (Postgres 16 works). It must end with `ALL RULES PASSED`.
- Site: `supabase/tests/sync.e2e.mjs` (Playwright, a local PostgREST, and the real supabase-js). Also open `site/index.html` with `config.js` blank to confirm prototype mode is untouched.
- Check the phone width (390 px) for anything visible.

## Next up (see the end of docs/architecture.md)
Wire the Muse page's conversations to `PoiesisData.threads` as Twitter-style threads with a refresh button (nothing appears by itself). Then an empty first notebook for new accounts, public profiles and sticker shelves, photos to Storage, and email.
