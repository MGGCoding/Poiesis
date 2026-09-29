/* Poiesis — the data layer: signing in, keeping the notebook in step
 * across devices, and reading and writing the conversations.
 *
 * How it stays fast: the page never waits for the network. Everything
 * is read from and written to this device first (app.js, localStorage);
 * this file copies changes to Supabase in the background and brings in
 * changes made on other devices. Offline writing simply waits here and
 * goes up when the connection comes back.
 *
 * With config.js left blank this file does nothing and the site runs as
 * the prototype.
 */
(function () {
  "use strict";

  const CFG = window.POIESIS_CONFIG || {};
  const APP = window.PoiesisApp;
  const ON = !!(CFG.supabaseUrl && CFG.supabaseAnonKey && APP);
  const SDK = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.2/dist/umd/supabase.js";
  const SYNC_KEY = "poiesis.sync.v1";
  const PROVIDERS = Array.isArray(CFG.providers) ? CFG.providers : [];
  const T = (k, d) => (APP ? APP.T(k, d) : d);

  /* ------------------------------------------------------------------
   * What in the app's state is the person's own, and syncs.
   *   list  — an array of things with ids (pages, kept lines…)
   *   map   — an object keyed by id (drafts, first impressions…)
   *   value — one value (the rule of life)
   *   pick  — a few top-level values kept together
 *   custom — its own get/set (the shared room and type)
   * Everything else (which tab is open, the selected page…) stays on
   * the device. Add a line here when the notebook gains something new;
   * the database needs no change.
   * ------------------------------------------------------------------ */
  const COLLECTIONS = [
    { kind: "page", key: "journal", type: "list" },
    { kind: "line", key: "lines", type: "list" },
    { kind: "question", key: "questions", type: "list" },
    { kind: "torn", key: "trash", type: "list" },
    { kind: "rule", key: "rule", type: "value" },
    { kind: "pen", key: "pen", type: "value" },
    { kind: "profile", key: "profile", type: "value" },
    { kind: "draft", key: "drafts", type: "map" },
    { kind: "link_draft", key: "synDrafts", type: "map" },
    { kind: "sticker", key: "owned", type: "map" },
    { kind: "drawn", key: "drawn", type: "map" },
    // Until the conversations are live, your own writing on the Muse page
    // is kept here too, so none of it is lost when they switch over.
    { kind: "impression", key: "sealed", type: "map" },
    { kind: "link", key: "syn", type: "map" },
    { kind: "reply", key: "replies", type: "map" },
    // Room and type are shared by phone and desktop (Round 13); layout stays per device.
    { kind: "prefs", type: "custom",
      get: (S) => (S.ui && S.ui.desk ? { room: S.ui.desk.room, font: S.ui.desk.font } : undefined),
      set: (S, d) => { if (!S.ui) return; ["desk", "phone"].forEach((x) => {
        if (!S.ui[x]) return; if (d.room) S.ui[x].room = d.room; if (d.font) S.ui[x].font = d.font; }); } },
    { kind: "ledger", keys: ["visits", "log", "recent"], type: "pick" },
  ];
  const BY_KIND = Object.fromEntries(COLLECTIONS.map((c) => [c.kind, c]));
  const SEP = "\u0001";

  // FNV-1a: a small, fast fingerprint so we only send what changed.
  function hash(str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return (h >>> 0).toString(36) + ":" + str.length;
  }

  // Every syncable thing in the state, as kind+id → { kind, id, data, h }.
  function snapshot(S) {
    const out = new Map();
    const put = (kind, id, data) => {
      id = String(id);
      if (!id || id.length > 80) return;
      const json = JSON.stringify(data);
      out.set(kind + SEP + id, { kind, id, data, h: hash(json) });
    };
    for (const c of COLLECTIONS) {
      if (c.type === "list") {
        (Array.isArray(S[c.key]) ? S[c.key] : []).forEach((it) => it && it.id != null && put(c.kind, it.id, it));
      } else if (c.type === "map") {
        const m = S[c.key] && typeof S[c.key] === "object" ? S[c.key] : {};
        Object.keys(m).forEach((id) => m[id] !== undefined && put(c.kind, id, { v: m[id] }));
      } else if (c.type === "value") {
        if (S[c.key] !== undefined) put(c.kind, "me", { v: S[c.key] });
      } else if (c.type === "pick") {
        const d = {};
        c.keys.forEach((k) => (d[k] = S[k] === undefined ? null : S[k]));
        put(c.kind, "me", d);
      } else if (c.type === "custom") {
        const d = c.get(S);
        if (d !== undefined) put(c.kind, "me", d);
      }
    }
    return out;
  }

  // Put one row from the server into the state.
  function applyRow(S, row) {
    const c = BY_KIND[row.kind];
    if (!c) return false;
    const d = row.data || {};
    if (c.type === "list") {
      if (!Array.isArray(S[c.key])) S[c.key] = [];
      const arr = S[c.key];
      const i = arr.findIndex((x) => x && String(x.id) === row.id);
      if (row.deleted) { if (i >= 0) arr.splice(i, 1); }
      else if (i >= 0) arr[i] = d;
      else arr.unshift(d);
    } else if (c.type === "map") {
      if (!S[c.key] || typeof S[c.key] !== "object") S[c.key] = {};
      if (row.deleted) delete S[c.key][row.id];
      else S[c.key][row.id] = d.v;
    } else if (c.type === "value") {
      if (!row.deleted) S[c.key] = d.v;
    } else if (c.type === "pick") {
      if (!row.deleted) c.keys.forEach((k) => { if (d[k] !== undefined && d[k] !== null) S[k] = d[k]; });
    } else if (c.type === "custom") {
      if (!row.deleted) c.set(S, d);
    }
    return true;
  }

  // The sync pieces are exposed for testing even in prototype mode.
  const core = { COLLECTIONS, snapshot, applyRow, hash, SEP };

  if (!ON) {
    window.PoiesisData = { enabled: false, core, changed() {}, threads: null };
    return;
  }

  /* ------------------------------------------------------------------
   * Connection
   * ------------------------------------------------------------------ */
  let sb = null;         // the Supabase client
  let user = null;       // the signed-in person, or null
  let shadow = null;     // what we last agreed with the server
  let timer = null, retryTimer = null, retryWait = 5000;
  let pushing = false, again = false, lastHidden = 0;
  const here = () => location.origin + location.pathname;

  function loadShadow() {
    try { return JSON.parse(localStorage.getItem(SYNC_KEY) || "null") || { owner: null, cursor: null, h: {} }; }
    catch (e) { return { owner: null, cursor: null, h: {} }; }
  }
  function saveShadow() { try { localStorage.setItem(SYNC_KEY, JSON.stringify(shadow)); } catch (e) {} }

  function loadSdk() {
    return new Promise((resolve, reject) => {
      if (window.supabase && window.supabase.createClient) return resolve();
      const s = document.createElement("script");
      s.src = SDK; s.async = true; s.crossOrigin = "anonymous";
      s.onload = resolve; s.onerror = () => reject(new Error("sdk"));
      document.head.appendChild(s);
    });
  }

  async function start() {
    shadow = loadShadow();
    buildFooter();
    guardProfileButton();
    try { await loadSdk(); }
    catch (e) { setStatus("offline"); window.addEventListener("online", () => location.reload(), { once: true }); return; }
    sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
    sb.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") openSheet("newpass");
      const next = session ? session.user : null;
      if ((next && next.id) === (user && user.id)) return;
      user = next;
      // Let the auth library finish before we make requests with it.
      setTimeout(() => (user ? onSignedIn() : onSignedOut()), 0);
    });
    window.addEventListener("online", () => { setStatus(); flushSoon(0); });
    window.addEventListener("offline", () => setStatus("offline"));
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") { lastHidden = Date.now(); flushSoon(0); }
      else if (user && Date.now() - lastHidden > 60000) pull().then(() => flushSoon(0));
    });
  }

  async function onSignedIn() {
    closeSheet();
    const S = APP.state();
    if (shadow.owner && shadow.owner !== user.id) {
      // This device's notebook belongs to someone else: start clean.
      APP.reset();
      shadow = { owner: user.id, cursor: null, h: {} };
    } else if (!shadow.owner) {
      // First sign-in on this device: what was written here comes along.
      shadow = { owner: user.id, cursor: null, h: {} };
    }
    saveShadow();
    setStatus("saving");
    if (S.profile && !S.profile.name && user.user_metadata && user.user_metadata.full_name) {
      S.profile.name = user.user_metadata.full_name; APP.commit();
    }
    await pull();
    await push();
    setStatus();
  }

  function onSignedOut() {
    setStatus();
  }

  /* ------------------------------------------------------------------
   * Sync: bring in what changed elsewhere, send what changed here.
   * ------------------------------------------------------------------ */

  // Called by app.js after every save().
  function changed() { if (user) flushSoon(1500); }
  function flushSoon(ms) {
    clearTimeout(timer);
    timer = setTimeout(push, ms);
  }

  async function pull() {
    if (!user || !navigator.onLine) return;
    const first = !shadow.cursor;
    // Look back a few seconds past the cursor so nothing that committed
    // late is missed; applying a row twice is harmless.
    const since = shadow.cursor ? new Date(new Date(shadow.cursor).getTime() - 5000).toISOString() : null;
    const S = APP.state();
    const before = snapshot(S);
    let applied = 0, cursor = shadow.cursor, from = 0;
    for (;;) {
      let q = sb.from("notebook_items").select("kind,id,data,deleted,updated_at")
        .order("updated_at", { ascending: true }).range(from, from + 999);
      if (since) q = q.gt("updated_at", since);
      const { data, error } = await q;
      if (error) { setStatus("error"); return; }
      for (const row of data) {
        const key = row.kind + SEP + row.id;
        const local = before.get(key);
        const lastAgreed = shadow.h[key];
        const editedHere = local && lastAgreed && local.h !== lastAgreed;
        // Something written here and not yet sent wins; it goes up next.
        if (!first && editedHere) continue;
        if (!row.deleted && local && local.h === hash(JSON.stringify(row.data))) { shadow.h[key] = local.h; continue; }
        if (applyRow(S, row)) applied++;
        if (row.deleted) delete shadow.h[key];
        else shadow.h[key] = hash(JSON.stringify(row.data));
        if (!cursor || row.updated_at > cursor) cursor = row.updated_at;
      }
      data.forEach((r) => { if (!cursor || r.updated_at > cursor) cursor = r.updated_at; });
      if (data.length < 1000) break;
      from += 1000;
    }
    shadow.cursor = cursor || new Date(0).toISOString();
    saveShadow();
    if (applied) APP.commit();
  }

  async function push() {
    if (!user) return;
    if (!navigator.onLine) { setStatus("offline"); return; }
    if (pushing) { again = true; return; }
    pushing = true; again = false;
    try {
      const snap = snapshot(APP.state());
      const rows = [], done = [];
      snap.forEach((it, key) => {
        if (shadow.h[key] !== it.h) {
          rows.push({ user_id: user.id, kind: it.kind, id: it.id, data: it.data, deleted: false });
          done.push([key, it.h]);
        }
      });
      Object.keys(shadow.h).forEach((key) => {
        if (!snap.has(key)) {
          const [kind, id] = key.split(SEP);
          rows.push({ user_id: user.id, kind, id, data: {}, deleted: true });
          done.push([key, null]);
        }
      });
      if (!rows.length) { setStatus(); return; }
      setStatus("saving");
      for (let i = 0; i < rows.length; i += 100) {
        const { error } = await sb.from("notebook_items")
          .upsert(rows.slice(i, i + 100), { onConflict: "user_id,kind,id" });
        if (error) throw error;
        done.slice(i, i + 100).forEach(([key, h]) => { if (h) shadow.h[key] = h; else delete shadow.h[key]; });
        saveShadow();
      }
      retryWait = 5000;
      setStatus();
    } catch (e) {
      setStatus(navigator.onLine ? "error" : "offline");
      clearTimeout(retryTimer);
      retryTimer = setTimeout(push, retryWait);
      retryWait = Math.min(retryWait * 3, 120000);
    } finally {
      pushing = false;
      if (again) flushSoon(0);
    }
  }

  function pending() {
    if (!user) return false;
    const snap = snapshot(APP.state());
    for (const [key, it] of snap) if (shadow.h[key] !== it.h) return true;
    return Object.keys(shadow.h).some((k) => !snap.has(k));
  }

  async function signOut() {
    await push();
    if (pending()) { APP.toast(T("auth.signout.wait", "Some writing hasn’t reached your account yet. Stay signed in until you’re back online.")); return; }
    await sb.auth.signOut();
    // Leave nothing personal on a shared device.
    APP.reset();
    shadow = { owner: null, cursor: null, h: {} };
    saveShadow();
    APP.toast(T("auth.signedout", "Signed out. Your notebook is safe in your account."));
  }

  /* ------------------------------------------------------------------
   * Conversations (the Muse page). Twitter-style threads: the first
   * posts under a work, newest first, each with its first replies.
   * Nothing arrives on its own; the page asks again when the reader
   * presses refresh.
   * ------------------------------------------------------------------ */
  const FRIENDLY = {
    "23505": ["write.twice", "You’ve already written here today. You can reply to yourself instead."],
    "42501": ["write.gate", ""],
    "54000": ["write.slow", "Slow down a little. Try again in a few minutes."],
  };
  function friendly(error) {
    if (!error) return null;
    if (!navigator.onLine) return T("write.offline", "You’re offline. Your words are still in the box; send them when you’re back.");
    const f = FRIENDLY[error.code];
    if (f && f[1]) return T("err." + f[0], f[1]);
    return error.message || T("err.generic", "That didn’t go through. Try again in a moment.");
  }

  const threads = {
    /* One page of a work's conversation.
     * Returns { posts, replies: {postId: [...]}, people: {id: profile},
     *           movedByMe: Set, more: bool } */
    async list(day, work, { before = null, limit = 20, perThread = 3 } = {}) {
      if (!user) return { posts: [], replies: {}, people: {}, movedByMe: new Set(), more: false, locked: true };
      const { data: posts, error } = await sb.rpc("work_posts", { d: day, work, before, lim: limit });
      if (error) throw new Error(friendly(error));
      const ids = posts.map((p) => p.id);
      const [rep, moved] = await Promise.all([
        ids.length ? sb.rpc("thread_replies", { root_ids: ids, per_root: perThread }) : { data: [] },
        ids.length ? sb.from("moved").select("post_id").eq("user_id", user.id).in("post_id", ids) : { data: [] },
      ]);
      const replies = {};
      (rep.data || []).forEach((r) => (replies[r.root_id] = replies[r.root_id] || []).push(r));
      const people = await threads.people([...posts, ...(rep.data || [])].map((p) => p.author_id));
      return { posts, replies, people, movedByMe: new Set((moved.data || []).map((m) => m.post_id)), more: posts.length === limit };
    },
    // The rest of one thread (after "show more replies").
    async thread(rootId) {
      const { data, error } = await sb.from("posts").select("*").eq("root_id", rootId).order("created_at");
      if (error) throw new Error(friendly(error));
      return { replies: data, people: await threads.people(data.map((p) => p.author_id)) };
    },
    async people(ids) {
      const uniq = [...new Set(ids)].filter(Boolean);
      if (!uniq.length) return {};
      const { data } = await sb.from("profiles").select("id,display_name,handle,avatar_path").in("id", uniq);
      return Object.fromEntries((data || []).map((p) => [p.id, p]));
    },
    // Which conversations today are open to me (I've written into them).
    async unlocked(day) {
      if (!user) return new Set();
      const { data } = await sb.from("unlocks").select("gate").eq("day", day);
      return new Set((data || []).map((u) => u.gate));
    },
    impression(day, work, body) { return write({ kind: "impression", day, work_ids: [work], body }); },
    link(day, works, body) { return write({ kind: "link", day, work_ids: works, body }); },
    reply(parentId, body) { return write({ kind: "reply", parent_id: parentId, body }); },
    async edit(id, body) {
      const { error } = await sb.from("posts").update({ body }).eq("id", id);
      if (error) throw new Error(friendly(error));
    },
    async remove(id) {
      const { error } = await sb.from("posts").delete().eq("id", id);
      if (error) throw new Error(friendly(error));
    },
    async moved(postId, on) {
      const q = on ? sb.from("moved").insert({ post_id: postId })
                   : sb.from("moved").delete().eq("post_id", postId).eq("user_id", user.id);
      const { error } = await q;
      if (error && error.code !== "23505") throw new Error(friendly(error));
    },
    // Only the maker gets names back; everyone else gets nothing.
    async whoMoved(postId) {
      const { data } = await sb.from("moved").select("user_id,created_at").eq("post_id", postId);
      return threads.people((data || []).map((m) => m.user_id));
    },
    async table(day) { const { data } = await sb.rpc("day_table", { d: day }); return data || []; },
    async report(postId, reason) {
      const { error } = await sb.from("reports").insert({ post_id: postId, reason: reason || "" });
      if (error && error.code !== "23505") throw new Error(friendly(error));
    },
    async count(day, work) {
      const { data } = work ? await sb.rpc("work_count", { d: day, work }) : await sb.rpc("day_count", { d: day });
      return data || 0;
    },
  };

  async function write(row) {
    if (!user) { openSheet(); throw new Error(T("write.signin", "Sign in to write at the table.")); }
    if (!navigator.onLine) throw new Error(friendly({}));
    row.body = String(row.body || "").trim();
    const { data, error } = await sb.from("posts").insert(row).select().single();
    if (error) throw new Error(friendly(error));
    return data;
  }

  /* ------------------------------------------------------------------
   * The small bits of page this file owns: the sign-in card and the
   * footer line. All wording comes from copy.js (auth.* and sync.*).
   * ------------------------------------------------------------------ */
  let footerEl = null, sheet = null;

  function buildFooter() {
    const f = document.querySelector("footer");
    if (!f) return;
    const span = f.querySelector("span");
    if (span) span.textContent = T("site.footer.live", "A working sketch, 2026. Paintings appear as color studies.");
    footerEl = document.createElement("span");
    footerEl.className = "syncline";
    f.appendChild(footerEl);
    setStatus();
  }

  function setStatus(state) {
    if (!footerEl) return;
    const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    if (!user) {
      footerEl.innerHTML = `${esc(T("sync.local", "Your notebook is on this device only."))} <button class="linkbtn" data-auth="open">${esc(T("auth.cta", "Sign in to keep it"))}</button>`;
    } else {
      const who = user.email || T("auth.you", "you");
      const line = state === "saving" ? T("sync.saving", "Saving…")
        : state === "offline" ? T("sync.offline", "Offline. Your writing is kept here and will save when you’re back.")
        : state === "error" ? T("sync.error", "Not saved yet. Trying again.")
        : T("sync.saved", "Saved to your account.");
      footerEl.innerHTML = `${esc(line)} <span class="syncwho">${esc(who)}</span> · <button class="linkbtn" data-auth="out">${esc(T("auth.signout", "Sign out"))}</button>`;
    }
    footerEl.onclick = (e) => {
      const b = e.target.closest("[data-auth]");
      if (!b) return;
      if (b.dataset.auth === "open") openSheet();
      if (b.dataset.auth === "out") signOut();
    };
  }

  // While signed out, the avatar opens the sign-in card instead of a profile.
  function guardProfileButton() {
    document.addEventListener("click", (e) => {
      if (user || !e.target.closest("#profBtn")) return;
      e.preventDefault(); e.stopImmediatePropagation();
      openSheet();
    }, true);
  }

  function openSheet(mode) {
    closeSheet();
    const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    sheet = document.createElement("div");
    sheet.className = "authveil";
    const newpass = mode === "newpass";
    sheet.innerHTML = `
      <div class="authcard" role="dialog" aria-modal="true" aria-labelledby="authTitle">
        <button class="authx" data-a="close" aria-label="${esc(T("auth.close", "Close"))}">×</button>
        <h3 id="authTitle">${esc(newpass ? T("auth.newpass.title", "Choose a new password") : T("auth.title", "Keep your notebook with you"))}</h3>
        <p class="authline">${esc(newpass ? "" : T("auth.line", "Sign in to write at the table and to find your notebook on any device."))}</p>
        ${newpass ? `
        <label class="authlab">${esc(T("auth.password", "Password"))}<input type="password" id="authNew" autocomplete="new-password" minlength="8"></label>
        <button class="btn primary authwide" data-a="setpass">${esc(T("auth.newpass.save", "Save password"))}</button>` : `
        ${PROVIDERS.includes("google") ? `<button class="btn authwide" data-a="google">${esc(T("auth.google", "Continue with Google"))}</button>` : ""}
        ${PROVIDERS.includes("apple") ? `<button class="btn authwide" data-a="apple">${esc(T("auth.apple", "Continue with Apple"))}</button>` : ""}
        ${PROVIDERS.length ? `<div class="author"><span>${esc(T("auth.or", "or with your email"))}</span></div>` : ""}
        <label class="authlab">${esc(T("auth.email", "Email"))}<input type="email" id="authEmail" autocomplete="email" inputmode="email"></label>
        <div class="authpw" hidden>
          <label class="authlab">${esc(T("auth.password", "Password"))}<input type="password" id="authPw" autocomplete="current-password"></label>
        </div>
        <button class="btn primary authwide" data-a="link">${esc(T("auth.link", "Send me a sign-in link"))}</button>
        <div class="authpw" hidden>
          <div class="authrow">
            <button class="btn primary" data-a="pwin">${esc(T("auth.pw.in", "Sign in"))}</button>
            <button class="btn ghost" data-a="pwup">${esc(T("auth.pw.up", "Create account"))}</button>
          </div>
          <button class="linkbtn" data-a="forgot">${esc(T("auth.forgot", "Forgot your password?"))}</button>
        </div>
        <button class="linkbtn" data-a="pwtoggle">${esc(T("auth.pw.toggle", "Use a password instead"))}</button>`}
        <p class="authmsg" role="status" aria-live="polite"></p>
      </div>`;
    document.body.appendChild(sheet);
    const $ = (s) => sheet.querySelector(s);
    const msg = (m) => ($(".authmsg").textContent = m || "");
    const email = () => ($("#authEmail") ? $("#authEmail").value.trim() : "");
    const busy = async (fn) => {
      sheet.querySelectorAll("button").forEach((b) => (b.disabled = true));
      try { await fn(); } catch (err) { msg(err.message || String(err)); }
      finally { sheet && sheet.querySelectorAll("button").forEach((b) => (b.disabled = false)); }
    };
    const needEmail = () => { if (!/.+@.+\..+/.test(email())) { msg(T("auth.email.need", "Write your email first.")); $("#authEmail").focus(); return false; } return true; };
    sheet.addEventListener("click", (e) => {
      if (e.target === sheet) return closeSheet();
      const b = e.target.closest("[data-a]"); if (!b) return;
      const a = b.dataset.a;
      if (a === "close") return closeSheet();
      if (a === "pwtoggle") {
        sheet.querySelectorAll(".authpw").forEach((x) => (x.hidden = !x.hidden));
        const pw = !sheet.querySelector(".authpw").hidden;
        $('[data-a="link"]').hidden = pw;
        b.textContent = pw ? T("auth.link.toggle", "Email me a link instead") : T("auth.pw.toggle", "Use a password instead");
        return;
      }
      if (a === "google" || a === "apple") return busy(async () => {
        const { error } = await sb.auth.signInWithOAuth({ provider: a, options: { redirectTo: here() } });
        if (error) throw error;
      });
      if (a === "link") { if (!needEmail()) return; return busy(async () => {
        const { error } = await sb.auth.signInWithOtp({ email: email(), options: { emailRedirectTo: here() } });
        if (error) throw error;
        msg(T("auth.link.sent", "Check your email. The link signs you in on the device you open it on."));
      }); }
      if (a === "pwin") { if (!needEmail()) return; return busy(async () => {
        const { error } = await sb.auth.signInWithPassword({ email: email(), password: $("#authPw").value });
        if (error) throw new Error(T("auth.pw.wrong", "That email and password don’t match."));
      }); }
      if (a === "pwup") { if (!needEmail()) return; return busy(async () => {
        const pw = $("#authPw").value;
        if (pw.length < 8) throw new Error(T("auth.pw.short", "Use at least 8 characters."));
        const { data, error } = await sb.auth.signUp({ email: email(), password: pw, options: { emailRedirectTo: here() } });
        if (error) throw error;
        if (!data.session) msg(T("auth.confirm", "Check your email to confirm, then come back."));
      }); }
      if (a === "forgot") { if (!needEmail()) return; return busy(async () => {
        const { error } = await sb.auth.resetPasswordForEmail(email(), { redirectTo: here() });
        if (error) throw error;
        msg(T("auth.forgot.sent", "Check your email for a link to choose a new password."));
      }); }
      if (a === "setpass") return busy(async () => {
        const pw = $("#authNew").value;
        if (pw.length < 8) throw new Error(T("auth.pw.short", "Use at least 8 characters."));
        const { error } = await sb.auth.updateUser({ password: pw });
        if (error) throw error;
        closeSheet(); APP.toast(T("auth.newpass.done", "Password saved."));
      });
    });
    sheet.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeSheet();
      if (e.key === "Enter" && e.target.id === "authEmail" && !$('[data-a="link"]').hidden) $('[data-a="link"]').click();
    });
    const first = $("#authEmail") || $("#authNew");
    setTimeout(() => first && first.focus(), 30);
  }

  function closeSheet() { if (sheet) { sheet.remove(); sheet = null; } }

  window.PoiesisData = {
    enabled: true,
    core,
    changed,
    threads,
    signIn: () => openSheet(),
    signOut,
    refresh: () => pull(),
    get user() { return user; },
  };

  start();
})();
