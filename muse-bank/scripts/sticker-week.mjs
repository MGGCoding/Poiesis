#!/usr/bin/env node
/* Sticker lane: the week's worklist.
 *   node muse-bank/scripts/sticker-week.mjs 2026-11-16 [days=7] [--short]
 * Prints, for each day, every work that needs a sticker and ONLY what the
 * sticker lane may draw from: the work's own text (poem, passage), the plain
 * sense of the Scripture (sermon card), and the moment and look-for of the
 * painting (art card). It never prints commentary, homilists, critics or
 * "why here": a sticker is drawn from the work, not from a reading of it.
 * Reads only. Writes nothing.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const R = (...p) => path.join(ROOT, ...p);
const J = f => { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return null; } };
const args = process.argv.slice(2);
const short = args.includes("--short");
const [start, n = "7"] = args.filter(a => !a.startsWith("--"));
if (!/^\d{4}-\d\d-\d\d$/.test(start || "")) { console.error("usage: sticker-week.mjs YYYY-MM-DD [days] [--short]"); process.exit(2); }

globalThis.window = {};
try { await import(R("site/days.js")); } catch {}
const LIVE = window.POIESIS_DAYS || {};
const { loadAll } = await import("./sticker-lib.mjs");
const REG = loadAll();
const slug = s => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const cap = (s, k) => { s = String(s || "").trim(); return s.length > k ? s.slice(0, k) + " […cut; open the work if the image is past here]" : s; };

function worksFor(iso) {
  const out = [], hom = J(R("muse-bank/homilies", iso + ".json")), art = J(R("muse-bank/art", iso + ".json"));
  const live = LIVE[iso], v2 = J(R("muse-bank/days-v2", iso + ".json"));
  const note = [];
  if (live) {
    for (const m of live.muses) {
      if (m.kind === "Scripture") continue;            /* taken from the sermon card below */
      if (m.kind === "Art") continue;                  /* taken from the art card below */
      out.push({ id: m.id, kind: m.kind, mk: m.mk, maker: m.maker, title: m.title, year: m.date, from: "site/days.js (live)", text: m.poem || m.quote || "" });
    }
  } else if (v2) {
    note.push("not on the site yet: every candidate pair is listed; draw only once Literature marks the pair chosen");
    for (const t of v2.themes || []) for (const k of ["poems", "passages"]) for (const w of t[k] || []) {
      if (t.pair && ![t.pair.poem, t.pair.passage].includes(w.id)) continue;
      out.push({ id: w.id, kind: k === "poems" ? "Poem" : "Passage", mk: slug(w.author), maker: w.author, title: w.title, year: w.year, from: `days-v2, theme "${t.title}" (candidate)`, text: w.text || "", source: w.source });
    }
  } else note.push("no literature for this day yet");
  if (hom) {
    const ref = hom.passage_choice?.ref || "";
    out.push({ id: "scripture-" + slug(ref), kind: "Scripture", mk: "scripture", maker: "Scripture", title: ref, from: `muse-bank/homilies/${iso}.json`, text: hom.reading?.plain_sense || "" });
  } else note.push("no sermon card for this day yet");
  if (art) out.push({ id: "art-" + slug(art.artist) + "-" + slug(art.title).split("-").slice(0, 4).join("-"), kind: "Art", mk: slug(art.artist), maker: art.artist, title: art.title, year: art.year, from: `muse-bank/art/${iso}.json`, text: `Moment: ${art.moment || ""}\nLook for: ${art.look_for || ""}\nRelation to the passage: ${art.relation || ""}\nImage (look at it): ${art.image_url || ""}` });
  else note.push("no art card for this day yet");
  return { out, note, theme: live?.theme || (v2?.themes || []).map(t => t.title).join(" / ") };
}

let todo = 0, done = 0;
const d0 = new Date(start + "T12:00:00Z");
console.log(`# Sticker worklist, ${start} for ${n} days\n`);
for (let i = 0; i < +n; i++) {
  const iso = new Date(+d0 + i * 864e5).toISOString().slice(0, 10);
  const { out, note, theme } = worksFor(iso);
  console.log(`## ${iso}${theme ? " · theme (do NOT draw the theme): " + theme : ""}`);
  note.forEach(x => console.log(`> ${x}`));
  for (const w of out) {
    const sid = "w-" + w.id, have = REG[sid];
    have ? done++ : todo++;
    console.log(`\n### ${w.kind} · ${w.maker} · ${w.title}${w.year ? " · " + w.year : ""}`);
    console.log(`sticker id: ${sid} · work: ${w.id} · mk: ${w.mk} · from: ${w.from}`);
    if (have) { console.log(`HAS A STICKER: "${have.name}" (${have.status}), first used ${have.first_used}. One work, one sticker: do not redraw unless Niko asked.`); continue; }
    console.log("NEEDS A STICKER");
    if (!short) console.log("```\n" + cap(w.text, w.kind === "Poem" ? 2400 : 1600) + "\n```");
  }
  console.log("");
}
console.log(`---\n${todo} to draw, ${done} already drawn.`);
