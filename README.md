# Poiesis

A place to receive three works a day — a poem, a passage and a painting — say what strikes you before you read anyone else, and draw the lines between them.

Built on René Girard's idea of good mimesis: everyone aspires to a shared model instead of competing with each other. Comes out of GS, a high-school group that read a poem on the spot and talked about what it did to them. Working prototype, not a finished product.

## Layout

- `site/` — the deployed static app (GitHub Pages source). No build step: `index.html` links `styles.css`, `copy.js` (all UI wording — edit this to change the writing), `app.js` (behavior), `config.js` (which Supabase project, blank = prototype) and `data.js` (sign-in, notebook sync, conversations). Open `site/index.html` directly in a browser to run it.
- `supabase/` — the database: tables and rules (`migrations/`), the muse-bank seed, tests, and the setup steps (`supabase/README.md`). How it all fits: `docs/architecture.md`.
- `muse-bank/` — the content bank: daily calendar of works (`calendar/`), the works themselves (`works/poems`, `works/passages`, `works/paintings`), and `index.json` indexing them. See `muse-bank/README.md`.
- `docs/` — decisions log, project instructions, founder's notes, muse curriculum, daily letter.

## Running it

No build step, no server. With `site/config.js` blank it runs as the prototype and everything stays in the browser; fill it in (see `supabase/README.md`) to switch on accounts.

```
open site/index.html
```

## Deploying

GitHub Pages should point at `site/` (Settings → Pages → Deploy from a branch → `main` → `/site`). `site/.nojekyll` is there so Pages serves the files as-is.
