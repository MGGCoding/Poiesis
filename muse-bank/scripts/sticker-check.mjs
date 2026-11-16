#!/usr/bin/env node
/* Sticker lane: check every sticker against the grammar, and a week against itself.
 *   node muse-bank/scripts/sticker-check.mjs                 all weeks
 *   node muse-bank/scripts/sticker-check.mjs 2026-11-16      one week file
 *   node muse-bank/scripts/sticker-check.mjs --approve 2026-11-16 [--except id,id]
 *        Niko said yes: drafts in that week become approved (those named stay "redraw")
 *   node muse-bank/scripts/sticker-check.mjs --export
 *        writes muse-bank/stickers/approved.json (approved only) for the Build lane to pick up
 * Must end ALL STICKERS PASS.
 */
import fs from "node:fs";
import path from "node:path";
import { R, J, WEEKS, loadAll, lint, svgOf } from "./sticker-lib.mjs";
const args = process.argv.slice(2);
const flag = f => args.includes(f);
const val = f => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : null; };
const week = args.find(a => /^\d{4}-\d\d-\d\d$/.test(a));

if (flag("--approve")) {
  if (!week) { console.error("--approve needs the week's date"); process.exit(2); }
  const f = path.join(WEEKS, week + ".json"), w = J(f);
  if (!w) { console.error("no such week file: " + f); process.exit(2); }
  const except = new Set((val("--except") || "").split(",").filter(Boolean));
  let a = 0, r = 0;
  for (const [id, s] of Object.entries(w.stickers)) {
    if (except.has(id)) { s.status = "redraw"; r++; }
    else if (s.status === "draft") { s.status = "approved"; a++; }
  }
  for (const id of except) if (!w.stickers[id]) { console.error("not in this week: " + id); process.exit(2); }
  fs.writeFileSync(f, JSON.stringify(w, null, 1) + "\n");
  console.log(`${week}: ${a} approved, ${r} marked redraw.`);
}

const all = loadAll();
let bad = 0, warn = 0, n = 0;
const byDay = {}, list = Object.values(all).filter(s => !week || s.week === week);
for (const s of list) {
  if (s.broken) { console.log(`✗ ${s.week}: not valid JSON`); bad++; continue; }
  n++;
  const { errors, warnings } = lint(s);
  /* one work, one sticker; the same thing drawn twice inside four weeks looks like a stamp */
  const mine = String(s.subject).toLowerCase().split(/\s*,\s*/)[0];
  for (const o of Object.values(all)) {
    if (o.id === s.id || o.broken) continue;
    if (o.work === s.work) errors.push(`work "${s.work}" already has sticker ${o.id}`);
    const gap = Math.abs(new Date(o.first_used) - new Date(s.first_used)) / 864e5;
    if (gap <= 28 && o.id < s.id && String(o.subject).toLowerCase().split(/\s*,\s*/)[0] === mine) warnings.push(`leading thing "${mine}" was also drawn for ${o.id} (${o.first_used})`);
  }
  (byDay[s.first_used] ||= []).push(s);
  if (errors.length) { bad++; console.log(`✗ ${s.id}\n   ` + errors.join("\n   ")); }
  if (warnings.length) { warn += warnings.length; console.log(`· ${s.id}\n   ` + warnings.join("\n   ")); }
}
for (const [day, ss] of Object.entries(byDay)) {
  const seen = {};
  for (const s of ss) { const k = s.ground + " + " + s.layout; if (seen[k]) { bad++; console.log(`✗ ${day}: ${s.id} and ${seen[k]} share ground and layout (${k}); the day's stickers must tell apart at a glance`); } seen[k] = s.id; }
  const g = {}; for (const s of ss) (g[s.ground] ||= []).push(s.id);
  for (const [k, v] of Object.entries(g)) if (v.length > 1) { warn++; console.log(`· ${day}: ${v.join(" and ")} share the ground "${k}"`); }
}
if (week) { const c = {}; for (const s of list) c[s.layout] = (c[s.layout] || 0) + 1; for (const [k, v] of Object.entries(c)) if (v > Math.max(5, list.length / 3)) { warn++; console.log(`· ${week}: layout "${k}" used ${v} times`); } }

if (flag("--export")) {
  const out = {};
  for (const s of Object.values(all)) if (s.status === "approved") out[s.work] = { id: s.id, kind: s.kind, maker: s.maker, title: s.title, name: s.name, source: s.anchor_from, svg: svgOf(s) };
  fs.writeFileSync(R("muse-bank/stickers/approved.json"), JSON.stringify(out, null, 1) + "\n");
  console.log(`approved.json: ${Object.keys(out).length} stickers.`);
}
console.log(`\n${n} checked, ${warn} to look at.`);
console.log(bad ? `${bad} FAILED` : "ALL STICKERS PASS");
process.exit(bad ? 1 : 0);
