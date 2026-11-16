/* Sticker lane: shared rules. The grammar in words is muse-bank/stickers/METHOD.md;
 * this file is the same grammar as checks. If they differ, METHOD.md wins: fix this file. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const R = (...p) => path.join(ROOT, ...p);
export const J = f => { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return null; } };
export const WEEKS = R("muse-bank/stickers/weeks");

/* The paint box: 26 colours, all taken from the stickers already on the site. */
export const PAINT = {
  night: "#1f3140", indigo: "#1f3566", delft: "#3d5d86", sky: "#a9c4d6", sea: "#2c4a58",
  forest: "#2f4030", moss: "#6d8354", sage: "#9db08a",
  plum: "#6b4a7d", rose: "#d9a48f",
  umber: "#3a2f26", brown: "#7b5a3a", tan: "#b8a27c", pitch: "#15100b",
  oxblood: "#8a2f22", vermilion: "#c9562f",
  ochre: "#caa75c", straw: "#e3c687", amber: "#f0c274", lamp: "#f6e58a",
  paper: "#f3ead6", cream: "#e8dcbf", white: "#fffaf0", silver: "#d9dde0", slate: "#5b6b78"
};
const HEX = new Set(Object.values(PAINT));
export const LAYOUTS = ["horizon", "window", "shaft", "table", "branch", "road", "pair", "fall", "close"];
export const KINDS = ["Poem", "Passage", "Scripture", "Art"];
/* Stock symbols that stand for an idea instead of showing the work. A subject may not be one of these alone. */
export const STOCK = ["heart", "cross", "dove", "book", "quill", "star", "halo", "praying hands", "lightbulb", "crown", "anchor", "key", "scales", "candle", "rose", "letter", "initial", "monogram"];
const TAGS = new Set(["circle", "ellipse", "rect", "path", "line", "polygon", "polyline", "g"]);

/* The finished sticker: a 48-unit roundel, clipped to the disc, no ids, safe to print many times on one page. */
export function svgOf(s) {
  return `<svg viewBox="0 0 48 48" style="border-radius:50%"><circle cx="24" cy="24" r="24" fill="${PAINT[s.ground]}"/>${s.art}</svg>`;
}

export function loadAll() {
  const all = {};
  if (!fs.existsSync(WEEKS)) return all;
  for (const f of fs.readdirSync(WEEKS).filter(f => /^\d{4}-\d\d-\d\d\.json$/.test(f)).sort()) {
    const w = J(path.join(WEEKS, f)); if (!w) { all["!" + f] = { broken: true, week: f }; continue; }
    for (const [id, s] of Object.entries(w.stickers || {})) all[id] = { ...s, id, week: f.replace(".json", "") };
  }
  return all;
}

/* Every rule a machine can check. Returns { errors:[], warnings:[] }. */
export function lint(s) {
  const e = [], w = [], art = String(s.art || "");
  const need = ["work", "kind", "maker", "title", "first_used", "name", "anchor", "anchor_from", "scene", "subject", "layout", "ground", "art", "status"];
  for (const k of need) if (!s[k] || !String(s[k]).trim()) e.push(`missing "${k}"`);
  if (s.kind && !KINDS.includes(s.kind)) e.push(`kind "${s.kind}" is not one of ${KINDS.join(", ")}`);
  if (s.layout && !LAYOUTS.includes(s.layout)) e.push(`layout "${s.layout}" is not one of the nine`);
  if (s.ground && !PAINT[s.ground]) e.push(`ground "${s.ground}" is not a paint-box name`);
  if (s.status && !["draft", "approved", "redraw"].includes(s.status)) e.push(`status "${s.status}"`);
  if (s.id && !/^w-[a-z0-9-]+$/.test(s.id)) e.push("id must be w-<work id>, lower case and hyphens");
  /* the name: two to five words, never a single letter, never the work's own title */
  const words = String(s.name || "").trim().split(/\s+/).filter(Boolean);
  if (words.length < 2 || words.length > 5) e.push(`name is ${words.length} words; two to five`);
  if (s.name && s.title && s.name.trim().toLowerCase() === s.title.trim().toLowerCase()) w.push("name repeats the work's title; name the scene instead");
  /* the anchor: the words in the work the picture stands on */
  const aw = String(s.anchor || "").trim().split(/\s+/).filter(Boolean).length;
  if (aw > 14) e.push(`anchor is ${aw} words; fourteen at most`);
  /* the scene sentence must have a thing, a place and a happening */
  if (String(s.scene || "").trim().split(/\s+/).length < 6) e.push("scene sentence is too short to hold a thing, a place and a happening");
  const subj = String(s.subject || "").toLowerCase().split(/\s*,\s*/).filter(Boolean);
  if (subj.length < 2) e.push("subject needs at least two things (a lone thing is a symbol, not a scene)");
  if (subj.length && subj.every(x => STOCK.includes(x))) e.push(`subject is only stock symbols (${subj.join(", ")})`);
  /* the drawing */
  if (/<\s*(text|tspan|image|use|defs|style|script|filter|linearGradient|radialGradient|clipPath|mask|foreignObject|svg|a)\b/i.test(art)) e.push("art uses a banned tag (no letters, images, gradients, filters, clips or nested svg)");
  if (/\s(id|class|style|href|on[a-z]+)\s*=/i.test(art)) e.push("art carries id, class, style, href or a handler");
  const tags = [...art.matchAll(/<\s*([a-zA-Z]+)\b/g)].map(m => m[1]);
  for (const t of new Set(tags)) if (!TAGS.has(t)) e.push(`tag <${t}> is not allowed`);
  const shapes = tags.filter(t => t !== "g").length;
  if (shapes < 3) e.push(`${shapes} shapes; a scene needs at least three (place, thing, happening)`);
  if (shapes > 9) e.push(`${shapes} shapes; nine at most`);
  const cols = new Set([PAINT[s.ground]]);
  for (const m of art.matchAll(/(?:fill|stroke)="([^"]+)"/g)) { const c = m[1].toLowerCase(); if (c === "none") continue; if (!HEX.has(c)) e.push(`colour ${c} is not in the paint box`); cols.add(c); }
  if (cols.size > 5) e.push(`${cols.size} colours with the ground; five at most`);
  if (cols.size < 3) e.push(`${cols.size} colours; a scene needs at least three`);
  for (const m of art.matchAll(/stroke-width="([\d.]+)"/g)) if (+m[1] < 1.2) e.push(`stroke ${m[1]} is under 1.2 and vanishes beside a name`);
  for (const m of art.matchAll(/\br="([\d.]+)"/g)) if (+m[1] < 1) e.push(`a circle of radius ${m[1]} vanishes beside a name`);
  for (const m of art.matchAll(/transform="([^"]+)"/g)) if (!/^rotate\([-\d. ]+\)$/.test(m[1])) e.push("only rotate() transforms");
  if (/<(circle|ellipse|rect|path|line|polygon|polyline)\b(?![^>]*\b(fill|stroke)=)[^>]*>/.test(art)) e.push("a shape has neither fill nor stroke set (it would print black)");
  const bytes = Buffer.byteLength(svgOf(s));
  if (bytes > 1500) e.push(`${bytes} bytes; 1500 at most`);
  if ((art.match(/</g) || []).length !== (art.match(/\/>/g) || []).length + 2 * (art.match(/<g\b/g) || []).length) w.push("check that every shape is self-closed");
  return { errors: e, warnings: w, shapes, colours: cols.size, bytes };
}
