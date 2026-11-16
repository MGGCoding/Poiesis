# Work stickers: the method

*Updated 16 Nov 2026 · Owner: Sticker lane · Replaces the one-letter seal (`bankSticker` in `site/app.js`) once Build wires it. Supersedes, for bank works, the Round 6 line "stickers belong to a maker, not a muse" and the six-a-maker cap; the hand-drawn maker sets stay as they are.*

Every work Poiesis sends gets one sticker: a small scene taken from the work itself. A reader who writes a first impression draws it and may wear it as their picture. A letter, an initial or a lone symbol is never a sticker.

## 1. Scope (what this lane may touch)
| | |
| --- | --- |
| **Owns (writes only here)** | `muse-bank/stickers/`, `muse-bank/scripts/sticker-*.mjs` |
| **May read, through `sticker-week.mjs` only** | sermon cards (`muse-bank/homilies/<date>.json`: the passage and its plain sense), literature (`site/days.js` for live days, `muse-bank/days-v2/<date>.json` before that: the poem and passage texts), art cards (`muse-bank/art/<date>.json`: moment, look for, the image link) |
| **Never** | edit a card, a pair, a theme, a question or an art choice · propose or swap works · write stories, glosses or any reader-facing words except the sticker's name · open `site/`, the library shelf, or cards outside the week · draw from commentary (homilists, critics, "why here", the theme line) |

If a card looks wrong, put one dated line in `docs/feedback-inbox.md` and draw from what is there. The other lanes decide what a day holds; this lane only pictures it.

## 2. The sticker, physically
- A roundel on a 48-unit square, one flat ground colour, clipped to the disc. Shapes may run off the edge.
- **Three to nine shapes. Three to five colours with the ground, all from the paint box** (26 colours in `sticker-lib.mjs`, taken from the stickers already on the site).
- No letters, numerals, gradients, outlines round the disc, or faces. People are plain shapes: a head and a body, seen whole or from behind.
- No line under 1.2 units and no dot under radius 1: it must read at **18 px beside a name** and at **44 px as someone's picture**.
- The main thing sits inside the middle two-thirds, so a circle crop never cuts it.

## 3. Finding the scene (five moves, in order)
1. **Read only the work.** Poem or passage: the text. Scripture: the passage and the card's plain sense. Art: look at the picture; then the card's moment and look-for.
2. **List what you could point at:** things, places, weather, light, a posture. Never an idea, never the theme word.
3. **Choose by three tests.**
   - *It is in the work.* Quote the words it stands on (the **anchor**, fourteen words at most) and say where they are. For art the anchor is a detail of the picture.
   - *It is a scene, not a symbol.* One sentence with a thing, a place and something happening: "a ferry crosses dark water toward a lit house", not "a lamp". Stock signs alone fail: heart, cross, dove, book, quill, star, halo, candle, key, scales.
   - *It does not say what to think.* Draw the moment before the meaning, as the art cards do. Never picture the theme, the answer to the day's question, or a homilist's reading.
4. **If the work has no things** (an argument, a prayer), draw the situation the speaker is in: the posture and the place the words imply ("I long to sit silent by you" → two on a bench with a gap between).
5. **Pick one of nine layouts**, then draw: *horizon* (a line of land or sea, one thing on it) · *window* (a frame and what shows through) · *shaft* (light across the dark onto one thing) · *table* (things resting on a surface) · *branch* (a limb in from the edge, something on it) · *road* (a way leading off) · *pair* (two things facing across a gap) · *fall* (something coming down on something) · *close* (one thing filling the disc with one small happening; use rarely).

## 4. Rules between stickers
- **One work, one sticker, for good.** A work that returns keeps its sticker.
- **A day's stickers tell apart at a glance:** no two share ground and layout; try not to share a ground.
- **Scripture and the painting of the same passage take different moments.** The art sticker hangs on something only that picture has (Caravaggio: the hand and the beam; Scripture: the empty stool).
- **Scripture:** things and places of the passage. Christ and the saints are never drawn.
- **Art:** one detail or gesture, redrawn flat. Never a small copy of the painting.
- The same leading thing twice inside four weeks gets a warning; change one.
- **Name:** two to five words, the work's own words where it has them, never the work's title.

## 5. The weekly run
```
node muse-bank/scripts/sticker-week.mjs  <monday> 7     the worklist: each work, its text, whether it has a sticker
   … draw each one into muse-bank/stickers/weeks/<monday>.json (status "draft")
node muse-bank/scripts/sticker-check.mjs <monday>        must end ALL STICKERS PASS
node muse-bank/scripts/sticker-sheet.mjs <monday>        the contact sheet, muse-bank/stickers/sheets/<monday>.html
   … look at the sheet at 18 and 44 px; fix what does not read; Niko says ok or names redraws
node muse-bank/scripts/sticker-check.mjs --approve <monday> [--except id,id]
node muse-bank/scripts/sticker-check.mjs --export        approved.json, the only file Build reads
```
A week file is `{ week, drawn, by, stickers: { "w-<work id>": { work, kind, maker, title, first_used, name, anchor, anchor_from, scene, subject, layout, ground, art, status, note? } } }`. `ground` is a paint-box name; `art` is the shapes only, colours as paint-box hex; the script adds the disc. `subject` lists the things drawn, leading thing first.

Days not yet on the site list every candidate pair; draw only pairs Literature has marked chosen. A day with no art card gets its art sticker the week the card arrives.

## 6. Hand-off to Build (not done; needs a brief and Niko's yes)
`muse-bank/stickers/approved.json` maps work id → `{ name, source, svg }`. `tools/build-days.mjs` copies `svg` and `name` onto each muse; `bankSticker(m)` in `app.js` uses them and falls back to the letter seal only when a work has none. Scripture is matched by its reference (`scripture-<ref>`), art by `art-<artist>-<first four words>`. No change to the draw, the day's check, shelves or counts. Sticker shelves stay parked.

## 7. Learned from Niko
*(One dated line per correction, newest last. A line here outranks the sections above.)*
