#!/usr/bin/env node
/* Sticker lane: the contact sheet Niko looks at.
 *   node muse-bank/scripts/sticker-sheet.mjs 2026-11-16
 * Writes muse-bank/stickers/sheets/<week>.html: every sticker of that week at the
 * sizes it is really used (18 beside a name, 44 as your picture, 96 on a card),
 * on light and on dark paper, with the words it was drawn from. One file, no network.
 */
import fs from "node:fs";
import { R, loadAll, lint, svgOf } from "./sticker-lib.mjs";
const week = process.argv[2];
if (!/^\d{4}-\d\d-\d\d$/.test(week || "")) { console.error("usage: sticker-sheet.mjs YYYY-MM-DD (the week file's date)"); process.exit(2); }
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const list = Object.values(loadAll()).filter(s => s.week === week).sort((a, b) => a.first_used.localeCompare(b.first_used) || ["Scripture", "Poem", "Passage", "Art"].indexOf(a.kind) - ["Scripture", "Poem", "Passage", "Art"].indexOf(b.kind));
if (!list.length) { console.error("no stickers in week " + week); process.exit(1); }
const days = [...new Set(list.map(s => s.first_used))];
const st = (s, px) => `<span class="stk" style="width:${px}px;height:${px}px">${svgOf(s)}</span>`;
const card = s => { const L = lint(s); return `<article class="card${s.status === "redraw" ? " redo" : ""}">
 <div class="big">${st(s, 96)}</div>
 <div class="uses"><span class="row light">${st(s, 44)}<span class="who">${st(s, 18)} <b>A reader</b></span></span><span class="row dark">${st(s, 44)}<span class="who">${st(s, 18)} <b>A reader</b></span></span></div>
 <h3>${esc(s.name)}</h3>
 <p class="work">${esc(s.kind)} · ${esc(s.maker)} · <i>${esc(s.title)}</i></p>
 <p class="anchor">“${esc(s.anchor)}”<small> ${esc(s.anchor_from)}</small></p>
 <p class="scene">${esc(s.scene)}</p>
 <p class="meta">${esc(s.layout)} · ${esc(s.ground)} · ${L.shapes} shapes · ${L.colours} colours · <b>${esc(s.status)}</b>${s.note ? " · " + esc(s.note) : ""}</p>
 <p class="id">${esc(s.id)}</p>${L.errors.length ? `<p class="err">${L.errors.map(esc).join("<br>")}</p>` : ""}
</article>`; };
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Stickers, week of ${week}</title>
<style>
body{margin:0;padding:22px 18px 60px;background:#f6f0e2;color:#2b241d;font:15px/1.45 Georgia,serif}
h1{font-size:1.5rem;margin:0 0 4px}h2{font:600 .8rem/1 system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;margin:30px 0 10px;color:#6b5d4d;border-top:1px solid #d9cdb6;padding-top:14px}
.lede{margin:0 0 6px;color:#5a4d3f;max-width:62ch}
.strip{display:flex;flex-wrap:wrap;gap:6px;margin:14px 0 0}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:14px}
.card{background:#fffaf0;border:1px solid #d9cdb6;border-radius:6px;padding:14px;box-shadow:0 1px 2px rgba(60,40,10,.12)}
.card.redo{outline:2px dashed #c9562f}
.stk{display:inline-block;vertical-align:middle;line-height:0;border-radius:50%;filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}.stk svg{width:100%;height:100%;display:block}
.big{text-align:center;margin:2px 0 10px}
.uses{display:flex;gap:8px}.row{flex:1;display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:5px;font:13px system-ui,sans-serif}
.row.light{background:#f3ead6;color:#2b241d}.row.dark{background:#1f1a15;color:#efe6d2}.who{display:inline-flex;align-items:center;gap:5px;white-space:nowrap}
h3{margin:12px 0 2px;font-size:1.1rem}.work{margin:0;color:#5a4d3f}.anchor{margin:8px 0 0;font-style:italic}.anchor small{font-style:normal;color:#7a6c5b}
.scene{margin:6px 0 0}.meta,.id{margin:6px 0 0;font:12px system-ui,sans-serif;color:#7a6c5b}.id{font-family:ui-monospace,monospace;word-break:break-all}
.err{margin:8px 0 0;font:12px system-ui,sans-serif;color:#a02a1c}
</style></head><body>
<h1>Stickers, week of ${week}</h1>
<p class="lede">${list.length} stickers. Each is shown large, then as your picture (44) and beside a name (18), on light and on dark. Under it: the words in the work it stands on, and the scene in one sentence. Tell the chat <b>ok</b>, or <b>redraw</b> with the name and what is wrong.</p>
<div class="strip">${list.map(s => st(s, 34)).join("")}</div>
${days.map(d => `<h2>${d}</h2><div class="grid">${list.filter(s => s.first_used === d).map(card).join("\n")}</div>`).join("\n")}
</body></html>`;
const out = R("muse-bank/stickers/sheets", week + ".html");
fs.writeFileSync(out, html);
console.log(`${out} · ${list.length} stickers · ${Buffer.byteLength(html)} bytes`);
