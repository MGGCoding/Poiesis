# Running Poiesis on your own machine

Nothing here needs the internet. No build step, no npm install, no server software to configure. The fonts are in `fonts/`, the day is in `days.js`, and everything a visitor writes stays in their own browser.

## Start it

Open a terminal in this `site/` folder and run one of these:

```
python -m http.server 8000
```
```
npx serve -l 8000
```

Then open **http://localhost:8000** in a browser.

You can also just double-click `index.html`. That works for reading, but a few browsers block `file://` pages from loading `days.js` or the fonts, so the little server above is the safer habit. Keep the terminal window open while you work; `Ctrl+C` stops it.

## Change something and see it

There is no build. Edit the file, save it, reload the page.

| To change | Edit |
| --- | --- |
| Any word of the site's frame — prompts, buttons, headings | `copy.js` |
| Which poem, passage and Scripture appear on a day | `../muse-bank/calendar/<date>.md`, then run `node ../tools/build-days.mjs` |
| A work's text, its ⓘ story or its hover words | `../muse-bank/works/…`, then run the same command |
| The go-deeper questions, painting colours | `../muse-bank/site-extras.json`, then run the same command |
| How anything looks | `styles.css` |
| How anything behaves | `app.js` |

`days.js` is generated. Editing it by hand works until the next time you run the generator, which overwrites it.

If a change does not appear, the browser is holding an old copy: reload with `Ctrl+Shift+R` (`Cmd+Shift+R` on a Mac).

## Two people, one machine

Add `?user=` and a name to the address:

- http://localhost:8000/?user=niko
- http://localhost:8000/?user=tomas

Each name keeps its own notebook, stickers and impressions, so two tabs side by side behave like two people. They share one conversation: leave a first impression as one, and the other sees it — after writing their own, because the gate still holds. Rows are marked "Also writing in this browser" rather than "sample", so it is clear who is real.

Everything lives in that browser's storage on that computer. Clearing site data for `localhost` wipes it. Nothing is sent anywhere.

Leave `?user=` off and the site behaves exactly as it did before: one person, and the example members for company.

To wipe the shared conversation without touching anyone's notebook, open the browser console and run:

```js
PoiesisApp.table.clear(); location.reload();
```

## What to have installed before you lose signal

- **Python 3** (has `python -m http.server`) or **Node** (has `npx serve`). One is enough. Most machines already have one.
- A text editor.
- **Node**, separately, if you want to regenerate `days.js` from the muse bank while offline. The generator uses nothing but Node's own file reading, so it works with no network.

Nothing else. No package installs, no fonts to download, no API keys. `config.js` is blank, which means prototype mode: the site never tries to reach a server.

## Putting it back online

`git push` to `main`. The Pages workflow in `.github/workflows/pages.yml` publishes this folder. If the published site is showing the repository's README instead of the app, the fix is in **Settings → Pages → Build and deployment → Source: GitHub Actions** — not a file move.
