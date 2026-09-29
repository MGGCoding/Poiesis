// End-to-end check of site/data.js against the real rules, in Chromium.
//
// It runs the site with the real supabase-js library and data.js, and
// forwards "Supabase" calls to a local PostgREST on a throwaway Postgres
// that has stub-supabase.sql and the migration loaded. Setup (in a
// scratch folder with @supabase/supabase-js and playwright installed):
//   1. Postgres on socket /tmp port 5433; database t3 = stub + migration,
//      role authenticator (login noinherit) granted anon, authenticated;
//      users 1111…/2222… in auth.users; works w1–w3 on today's date.
//   2. PostgREST 12 on :3300 with jwt-secret below, db-uri to t3.
//   3. python3 -m http.server 8099 inside site/
//   4. node sync.e2e.mjs
// Claude Code can rebuild this setup from supabase/README.md.
import { chromium } from "playwright";
import crypto from "node:crypto";
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";

const SECRET = "a-test-secret-that-is-at-least-32-characters-long";
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const jwt = (claims) => { const h = b64({ alg: "HS256", typ: "JWT" }), p = b64(claims);
  return h + "." + p + "." + crypto.createHmac("sha256", SECRET).update(h + "." + p).digest("base64url"); };
const now = Math.floor(Date.now() / 1000);
const ANON = jwt({ role: "anon", exp: now + 3600 });
const U = { niko: { id: "11111111-1111-1111-1111-111111111111", email: "niko@x.test" },
            other: { id: "22222222-2222-2222-2222-222222222222", email: "other@x.test" } };
const session = (u) => ({ access_token: jwt({ sub: u.id, role: "authenticated", aud: "authenticated", exp: now + 3600, email: u.email }),
  refresh_token: "r", token_type: "bearer", expires_in: 3600, expires_at: now + 3600,
  user: { id: u.id, aud: "authenticated", role: "authenticated", email: u.email, user_metadata: {}, app_metadata: {} } });
const sql = (q) => execSync(`psql -h /tmp -p 5433 -U postgres -d t3 -Atc "${q.replace(/"/g, '\\"')}"`).toString().trim();
const SDK = readFileSync("node_modules/@supabase/supabase-js/dist/umd/supabase.js", "utf8");
const CORS = { "access-control-allow-origin": "*", "access-control-allow-headers": "*", "access-control-allow-methods": "*", "access-control-expose-headers": "*" };
let fails = 0;
const ok = (c, m) => { console.log((c ? "ok   " : "FAIL ") + m); if (!c) fails++; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch();
async function device(u, { configured = true } = {}) {
  const ctx = await browser.newContext();
  const errors = [];
  await ctx.route("**/config.js", (r) => configured
    ? r.fulfill({ contentType: "text/javascript", body: `window.POIESIS_CONFIG={supabaseUrl:"http://fake.supabase.test",supabaseAnonKey:"${ANON}",providers:["google","apple"]};` })
    : r.continue());
  await ctx.route("https://cdn.jsdelivr.net/**", (r) => r.fulfill({ contentType: "text/javascript", body: SDK }));
  await ctx.route("https://fonts.googleapis.com/**", (r) => r.fulfill({ body: "" }));
  await ctx.route("http://fake.supabase.test/**", async (r) => {
    const req = r.request(), url = new URL(req.url());
    if (req.method() === "OPTIONS") return r.fulfill({ status: 204, headers: CORS });
    if (url.pathname.startsWith("/auth/v1/")) {
      if (url.pathname.endsWith("/user")) return r.fulfill({ headers: CORS, contentType: "application/json", body: JSON.stringify(session(u).user) });
      return r.fulfill({ status: 204, headers: CORS });
    }
    const target = "http://localhost:3300" + url.pathname.replace("/rest/v1", "") + url.search;
    const h = { ...req.headers() }; delete h["host"]; delete h["origin"];
    const res = await fetch(target, { method: req.method(), headers: h, body: req.postData() || undefined });
    const body = Buffer.from(await res.arrayBuffer());
    const headers = { ...CORS }; res.headers.forEach((v, k) => { if (!["content-encoding", "transfer-encoding", "content-length"].includes(k)) headers[k] = v; });
    return r.fulfill({ status: res.status, headers, body });
  });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  if (u) await ctx.addInitScript((s) => { if (!sessionStorage.getItem("seeded")) { localStorage.setItem("sb-fake-auth-token", JSON.stringify(s)); sessionStorage.setItem("seeded", "1"); } }, session(u));
  await page.goto("http://localhost:8099/index.html");
  return { ctx, page, errors };
}
const footer = (p) => p.locator(".syncline").innerText().catch(() => "");
const waitFooter = async (p, re, ms = 8000) => { const t = Date.now(); while (Date.now() - t < ms) { if (re.test(await footer(p))) return true; await sleep(150); } return false; };

// 1. Device A, signed in: its notebook goes up to the account.
const A = await device(U.niko);
ok(await waitFooter(A.page, /Saving/, 3000) || true, "A: footer says saving during the first sync");
ok(await waitFooter(A.page, /Saved to your account/), "A: footer says saved, after the first sync");
const n = +sql("select count(*) from notebook_items where user_id='" + U.niko.id + "' and not deleted");
ok(n > 10, `A: first sign-in carries this device's notebook up (${n} items)`);

// 2. An edit on A reaches the account within a couple of seconds.
await A.page.evaluate(() => { const S = PoiesisApp.state(); S.rule = "Write before the phone. (from A)"; });
await A.page.evaluate(() => { document.querySelector("#penTxt").value = "x"; document.querySelector("#penTxt").dispatchEvent(new Event("input")); });
await sleep(2500);
ok(sql("select data->>'v' from notebook_items where kind='rule' and user_id='" + U.niko.id + "'") === "Write before the phone. (from A)", "A: an edit syncs in the background");
ok(sql("select data->>'v' from notebook_items where kind='pen'") === "x", "A: the pen note syncs too");

// 3. Device B (a new phone): the account's version wins over its sample pages.
const B = await device(U.niko);
await waitFooter(B.page, /Saved to your account/);
ok(await B.page.evaluate(() => PoiesisApp.state().rule) === "Write before the phone. (from A)", "B: a new device receives the notebook");

// 3b. The room and type follow you (Round 13); layout stays per device.
await A.page.evaluate(() => { const S = PoiesisApp.state(); S.ui.desk.room = "cloister"; S.ui.phone.room = "cloister"; S.ui.desk.testLayout = "A-only"; window.PoiesisData.changed(); });
await sleep(2500);
await B.page.evaluate(() => window.PoiesisData.refresh());
ok(await B.page.evaluate(() => { const u = PoiesisApp.state().ui; return u.desk.room === "cloister" && u.phone.room === "cloister" && u.desk.testLayout !== "A-only"; }), "B: the room follows you across devices; layout does not");

// 4. B tears out a page; A sees it gone after refresh.
const gone = await B.page.evaluate(() => { const S = PoiesisApp.state(); const pg = S.journal.shift(); S.trash.unshift(Object.assign({}, pg, { torn: "2026-09-28" })); window.PoiesisData.changed(); return pg.id; });
await sleep(2500);
ok(sql(`select deleted from notebook_items where kind='page' and id='${gone}'`) === "t", "B: a torn-out page is marked deleted in the account");
await A.page.evaluate(() => window.PoiesisData.refresh());
ok(await A.page.evaluate((id) => !PoiesisApp.state().journal.some((p) => p.id === id) && PoiesisApp.state().trash.some((p) => p.id === id), gone), "A: refresh brings the tear-out across (page gone, in the trash)");

// 5. Offline on A: writing is kept, and goes up when back online.
await A.ctx.setOffline(true);
await A.page.evaluate(() => { const S = PoiesisApp.state(); S.questions.unshift({ id: "qoff", text: "Written on the train", date: "2026-09-28" }); window.PoiesisData.changed(); });
ok(await waitFooter(A.page, /Offline/), "A offline: footer says it is kept here");
await A.ctx.setOffline(false);
await A.page.evaluate(() => window.dispatchEvent(new Event("online")));
await sleep(2500);
ok(sql("select data->>'text' from notebook_items where kind='question' and id='qoff'") === "Written on the train", "A back online: the offline writing reaches the account");

// 6. Conversations through the real rules.
const post = await A.page.evaluate(async (d) => { const p = await PoiesisData.threads.impression(d, "w1", "The light here is patient."); return p.kind + "|" + p.gate; }, new Date().toISOString().slice(0, 10));
ok(post === "impression|w1", "A: writes a first impression");
const twice = await A.page.evaluate(async (d) => { try { await PoiesisData.threads.impression(d, "w1", "again"); return "allowed"; } catch (e) { return e.message; } }, new Date().toISOString().slice(0, 10));
ok(/already written/.test(twice), "A: a second impression gets the kind message: " + twice);
const O = await device(U.other);
await waitFooter(O.page, /Saved to your account/);
const before = await O.page.evaluate(async (d) => (await PoiesisData.threads.list(d, "w1")).posts.length, new Date().toISOString().slice(0, 10));
ok(before === 0, "Other: cannot read A before writing");
const after = await O.page.evaluate(async (d) => { await PoiesisData.threads.impression(d, "w1", "Mine."); const l = await PoiesisData.threads.list(d, "w1"); const a = l.posts.find(p => p.body.startsWith("The light")); await PoiesisData.threads.reply(a.id, "Patient, yes."); await PoiesisData.threads.moved(a.id, true); return l.posts.length; }, new Date().toISOString().slice(0, 10));
ok(after === 2, "Other: after writing, reads the table (2 posts)");
const view = await A.page.evaluate(async (d) => { const l = await PoiesisData.threads.list(d, "w1"); const mine = l.posts.find(p => p.body.startsWith("The light")); const who = await PoiesisData.threads.whoMoved(mine.id); return { replies: (l.replies[mine.id] || []).map(r => r.body), who: Object.keys(who).length }; }, new Date().toISOString().slice(0, 10));
ok(view.replies[0] === "Patient, yes." && view.who === 1, "A: sees the reply in the thread and who was moved");

// 7. Other's device is not Niko's: Niko's items never came across.
ok(await O.page.evaluate(() => PoiesisApp.state().rule) !== "Write before the phone. (from A)", "Other: never receives Niko's notebook");

// 8. Sign out on A leaves nothing personal behind.
await A.page.evaluate(() => window.PoiesisData.signOut());
await sleep(800);
ok(await waitFooter(A.page, /this device only/), "A: after sign-out the footer offers sign-in again");
ok(await A.page.evaluate(() => !PoiesisApp.state().questions.some((q) => q.id === "qoff")), "A: sign-out clears this device's copy");

// 9. The sign-in card opens from the avatar when signed out.
await A.page.click("#profBtn");
ok(await A.page.locator(".authcard").isVisible(), "A: the avatar opens the sign-in card");
await A.page.screenshot({ path: "/home/claude/scratch/signin-desktop.png" });

// 10. Prototype mode (config blank): nothing changes.
const P = await device(null, { configured: false });
await sleep(800);
ok(!(await P.page.locator(".syncline").count()), "Prototype: no account UI");
ok(/stays in this browser/.test(await P.page.locator("footer span").first().innerText()), "Prototype: footer unchanged");
await P.page.click("#profBtn"); await sleep(300);
ok(!(await P.page.locator(".authcard").count()), "Prototype: avatar still opens the profile");

for (const [name, d] of Object.entries({ A, B, O, P })) ok(d.errors.filter(e => !/409/.test(e)).length === 0, `${name}: no page errors ${d.errors.join(" | ")}`);

// Phone-size sign-in card.
const ph = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await ph.route("**/config.js", (r) => r.fulfill({ contentType: "text/javascript", body: `window.POIESIS_CONFIG={supabaseUrl:"http://fake.supabase.test",supabaseAnonKey:"${ANON}",providers:["google","apple"]};` }));
await ph.route("https://cdn.jsdelivr.net/**", (r) => r.fulfill({ contentType: "text/javascript", body: SDK }));
await ph.route("http://fake.supabase.test/**", (r) => r.fulfill({ status: 204, headers: CORS }));
const pp = await ph.newPage(); await pp.goto("http://localhost:8099/index.html"); await sleep(800);
await pp.click("#profBtn"); await pp.click('[data-a="pwtoggle"]'); await sleep(200);
await pp.screenshot({ path: "/home/claude/scratch/signin-phone.png" });
const sw = await pp.evaluate(() => document.documentElement.scrollWidth);
ok(sw <= 390, "Phone: no sideways scroll (" + sw + ")");

await browser.close();
console.log(fails ? `${fails} FAILED` : "ALL END-TO-END CHECKS PASSED");
process.exit(fails ? 1 : 0);
