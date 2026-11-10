/* Poiesis — the forum (10 Nov 2026).
 *
 * Switched on by `forum: true` in config.js (with the Supabase address and
 * key filled in). It does three things and nothing else:
 *   1. the welcome page: a short walk through Poiesis and the sign-in card
 *   2. sends what you write at the table (first impressions, syntheses,
 *      replies) to the database, and brings back what others wrote
 *   3. remembers whether you asked for the daily letter
 * No notebook is stored. Rules (the gate, one impression a day, three days
 * open) live in the database: supabase/forum-v1.sql.
 *
 * Other people's writing reaches the page through app.js's own `Table`
 * (the same shelf the ?user= two-person test uses), so the Muse page
 * draws it exactly as it always has. Nothing arrives by itself: the page
 * asks again when you write, come back to the tab, or press Refresh.
 * All wording is in copy.js under forum.* and can be changed there.
 */
(function () {
  "use strict";
  const CFG = window.POIESIS_CONFIG || {};
  const APP = window.PoiesisApp;
  if (!CFG.forum || !CFG.supabaseUrl || !CFG.supabaseAnonKey || !APP || !APP.forum) return;

  const SDK = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.2/dist/umd/supabase.js";
  const T = (k, d) => APP.T(k, d);
  const h = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const PENDING = "poiesis.forum.pending";   // username / letter / beta word chosen before the account existed
  const LOOK = "poiesis.forum.looking";      // "just look around" for this visit
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-/i;
  // app.js keeps to itself; these are the few things it hands over (PoiesisApp.forum).
  const { Table, TABLE_KEY, DAYK, WK, when, synSubjects } = APP.forum;
  const today = APP.today, toast = APP.toast, render = () => APP.commit();   // commit() waits if someone is mid-sentence
  const S = new Proxy({}, { get: (_, k) => APP.state()[k], set: (_, k, v) => { APP.state()[k] = v; return true; } });

  let sb = null, user = null, me = null;     // me = my profiles row
  let gate = null, footerEl = null, lastPull = 0, pulling = null;
  const cache = { day: null, mine: {}, replies: {} };   // mine: "<kind>:<work>" -> post id; replies: rootId -> [{n,t,w,mine}]

  function loadSdk() {
    return new Promise((resolve, reject) => {
      if (window.supabase && window.supabase.createClient) return resolve();
      const s = document.createElement("script");
      s.src = SDK; s.async = true; s.crossOrigin = "anonymous";
      s.onload = resolve; s.onerror = () => reject(new Error("sdk"));
      document.head.appendChild(s);
    });
  }
  const here = () => location.origin + location.pathname;
  const pending = () => { try { return JSON.parse(localStorage.getItem(PENDING) || "{}") || {}; } catch (e) { return {}; } };
  const setPending = (o) => { try { o ? localStorage.setItem(PENDING, JSON.stringify(o)) : localStorage.removeItem(PENDING); } catch (e) {} };
  const looking = () => { try { return sessionStorage.getItem(LOOK) === "1"; } catch (e) { return false; } };

  function friendly(error) {
    if (!navigator.onLine) return T("forum.err.offline", "You’re offline. Try again when you’re back.");
    const m = (error && (error.message || "")) || "", c = error && error.code;
    if (c === "54000" || /rate limit|too many/i.test(m)) return T("forum.err.slow", "Slow down a little. Try again in a few minutes.");
    if (/invalid login/i.test(m)) return T("forum.err.login", "That email and password don’t match.");
    if (/already registered/i.test(m)) return T("forum.err.exists", "That email already has an account. Sign in instead.");
    if (/not confirmed/i.test(m)) return T("forum.err.confirm", "Open the email we sent you and press the link first.");
    if (/password/i.test(m) && /6|short|weak/i.test(m)) return T("forum.err.pw", "Choose a password of at least 6 characters.");
    return m || T("forum.err.generic", "That didn’t go through. Try again in a moment.");
  }

  /* ---------------------------------------------------------------- start */
  async function start() {
    buildFooter();
    let known = false;                       // someone already signed in on this device: don't flash the welcome page
    try { known = Object.keys(localStorage).some((k) => /^sb-.*-auth-token$/.test(k)); } catch (e) {}
    if (!known && !looking()) openGate();
    try { await loadSdk(); } catch (e) { setGateMsg(T("forum.err.sdk", "Couldn’t reach the sign-in service. Check your connection and reload.")); return; }
    sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey);
    sb.auth.onAuthStateChange((event, session) => {
      const was = user && user.id;
      user = session ? session.user : null;
      if (user && user.id !== was) setTimeout(onSignedIn, 0);   // never call the database inside this callback
      if (!user && was) onSignedOut();
    });
    const { data } = await sb.auth.getSession();
    if (!data.session) { setStatus(); if (!looking()) openGate(); }
    document.addEventListener("visibilitychange", () => { if (!document.hidden && user && Date.now() - lastPull > 60000) refresh(); });
  }

  async function onSignedIn() {
    const { data } = await sb.from("profiles").select("id,username").eq("id", user.id).maybeSingle();
    me = data || { id: user.id, username: null };
    const p = pending();
    if (!me.username && p.username) {
      const r = await claim(p.username, p.word);
      if (r !== "ok" && r !== "have") { openGate("name", nameMessage(r)); setStatus(); return; }
    }
    if (p.letter != null) { try { await sb.rpc("set_letter", { yes: !!p.letter }); } catch (e) {} }
    setPending(null);
    if (!me.username) { openGate("name"); setStatus(); return; }
    closeGate(); setStatus();
    await sendMine();
    await refresh();
  }
  function onSignedOut() { me = null; cache.mine = {}; cache.replies = {}; writeTable(DAYK(), []); setStatus(); render(); if (!looking()) openGate(); }

  async function claim(name, word) {
    const { data, error } = await sb.rpc("claim_username", { u: name, word: word || null });
    if (error) return "error";
    if (data === "ok" || data === "have") {
      const r = await sb.from("profiles").select("id,username").eq("id", user.id).maybeSingle();
      if (r.data) me = r.data;
    }
    return data;
  }
  function nameMessage(r) {
    return r === "taken" ? T("forum.name.taken", "Someone already has that name. Try another.")
      : r === "bad" ? T("forum.name.bad", "3 to 24 characters: small letters, numbers and _ only.")
      : r === "word" ? T("forum.name.word", "That beta word didn’t work. Check it with whoever invited you.")
      : T("forum.err.generic", "That didn’t go through. Try again in a moment.");
  }

  /* ------------------------------------------------- the table, both ways */
  // Bring today's writing down (the database returns only what I may read).
  function refresh() {
    if (!user || !me || !me.username) return Promise.resolve();
    if (pulling) return pulling;
    pulling = (async () => {
      const day = DAYK();
      try {
        const { data: posts, error } = await sb.from("posts").select("id,author_id,kind,work,works,parent_id,body,created_at").eq("day", day).order("created_at").limit(1000);
        if (error) throw error;
        const ids = [...new Set(posts.map((p) => p.author_id))];
        const names = {};
        if (ids.length) { const r = await sb.from("profiles").select("id,username").in("id", ids); (r.data || []).forEach((p) => (names[p.id] = p.username || "")); }
        const rows = [], mine = {}, replies = {};
        let restored = false;
        posts.forEach((p) => {
          const at = new Date(p.created_at).getTime(), own = p.author_id === user.id, name = names[p.author_id] || T("forum.someone", "someone");
          if (p.kind === "reply") {
            (replies[p.parent_id] = replies[p.parent_id] || []).push({ n: own ? T("forum.you", "You") : name, t: p.body, w: when(at), mine: own });
          } else if (own) {
            mine[p.kind + ":" + p.work] = p.id;
            restored = restoreMine(day, p, at) || restored;
          } else if (p.kind === "impression") {
            rows.push({ id: p.id, on: day + ":" + p.work, by: p.author_id, name, at, day, text: p.body });
          } else {
            p.works.forEach((w) => rows.push({ id: p.id + "~" + w, on: day + ":" + w, by: p.author_id, name, at, day, text: p.body, via: p.work }));
          }
        });
        cache.day = day; cache.mine = mine; cache.replies = replies;
        writeTable(day, rows);
        lastPull = Date.now();
        render();   // commit(): keeps anything restored, then redraws
      } catch (e) { toast(friendly(e)); }
      finally { pulling = null; }
    })();
    return pulling;
  }
  // Replace that day's shelf with what the database returned (other days are left alone).
  function writeTable(day, rows) {
    try {
      const all = Table.all();
      Object.keys(all).forEach((k) => { if (k.indexOf(day + ":") === 0) delete all[k]; });
      rows.forEach((r) => (all[r.on] = all[r.on] || []).push(r));
      localStorage.setItem(TABLE_KEY, JSON.stringify(all));
    } catch (e) {}
  }
  // On a second device: my own writing for the day comes back, so I'm not asked twice.
  function restoreMine(day, p, at) {
    try {
      if (p.kind === "impression") {
        if (S.sealed[day + ":" + p.work]) return false;
        S.sealed[day + ":" + p.work] = { text: p.body, at };
        return true;
      }
      let ch = false;
      if (!S.syn[day + ":" + p.work]) { S.syn[day + ":" + p.work] = { text: p.body, at }; ch = true; }
      p.works.forEach((w) => { if (!S.sealed[day + ":" + w]) { S.sealed[day + ":" + w] = { text: p.body, at, via: p.work }; ch = true; } });
      return ch;
    } catch (e) { return false; }
  }

  async function insert(row) {
    const { data, error } = await sb.from("posts").insert(row).select("id").single();
    if (error) { if (error.code === "23505") return null; throw error; }   // already there: fine
    return data.id;
  }
  // Anything written on this device today that the database doesn't have yet goes up.
  async function sendMine() {
    if (!user || !me || !me.username) return;
    const day = today();
    try {
      const { data } = await sb.from("posts").select("id,kind,work").eq("day", day).eq("author_id", user.id).neq("kind", "reply");
      const have = {}; (data || []).forEach((p) => (have[p.kind + ":" + p.work] = p.id));
      for (const k of Object.keys(S.syn || {})) {
        if (k.indexOf(day + ":") !== 0) continue;
        const id = k.slice(day.length + 1), s = S.syn[k];
        if (s && s.text && !have["link:" + id]) { let ws; try { ws = synSubjects(id); } catch (e) { continue; } await insert({ kind: "link", day, work: id, works: ws, body: s.text }); }
      }
      for (const k of Object.keys(S.sealed || {})) {
        if (k.indexOf(day + ":") !== 0) continue;
        const id = k.slice(day.length + 1), s = S.sealed[k];
        if (s && s.text && !s.via && !have["impression:" + id]) await insert({ kind: "impression", day, work: id, body: s.text });
      }
    } catch (e) { toast(friendly(e)); }
  }
  // app.js calls these three the moment something is written.
  function wrote() {
    if (!user) { try { sessionStorage.removeItem(LOOK); } catch (e) {} openGate(null, T("forum.gate.towrite", "Sign in to bring what you wrote to the table. It’s kept on this device meanwhile.")); return; }
    if (DAYK() !== today()) return;
    sendMine().then(refresh);
  }
  async function replied(pid, text) {
    if (!user || !me || !me.username) return;
    let parent = null; pid = String(pid);
    if (pid.indexOf("me_") === 0) {
      const w = pid.slice(3), s = S.sealed[WK(w)];
      parent = (s && s.via && cache.mine["link:" + s.via]) || cache.mine["impression:" + w];
    } else if (UUID.test(pid)) parent = pid.split("~")[0];
    if (!parent) return;                       // a sample post, or mine not sent yet
    try { await insert({ kind: "reply", parent_id: parent, day: DAYK(), work: "-", body: text }); await refresh(); }
    catch (e) { toast(friendly(e)); }
  }
  // Replies that came from the database, for one post on the page.
  function repliesFor(pid) {
    pid = String(pid || ""); let root = null;
    if (pid.indexOf("me_") === 0) {
      const w = pid.slice(3), s = S.sealed[WK(w)];
      root = (s && s.via && cache.mine["link:" + s.via]) || cache.mine["impression:" + w];
    } else if (UUID.test(pid)) root = pid.split("~")[0];
    const list = (root && cache.day === DAYK() && cache.replies[root]) || [];
    const local = ((S.replies || {})[WK(pid)] || []).map((r) => r.t);
    return list.filter((r) => !(r.mine && local.includes(r.t)));    // my own are already on the page
  }

  /* --------------------------------------------- the footer line + Refresh */
  function buildFooter() {
    const f = document.querySelector("footer"); if (!f) return;
    const span = f.querySelector("span");
    if (span) span.textContent = T("site.footer.live", "A working sketch, 2026.");
    footerEl = document.createElement("span"); footerEl.className = "syncline"; f.appendChild(footerEl);
    footerEl.addEventListener("click", async (e) => {
      const a = e.target.closest("[data-fa]"); if (!a) return;
      if (a.dataset.fa === "in") { try { sessionStorage.removeItem(LOOK); } catch (x) {} openGate(); }
      if (a.dataset.fa === "out") { await sb.auth.signOut(); }
      if (a.dataset.fa === "letter") { const yes = a.dataset.on !== "1"; try { await sb.rpc("set_letter", { yes }); toast(yes ? T("forum.letter.on", "You’re on the list for the daily letter.") : T("forum.letter.off", "You’re off the letter list.")); } catch (x) { toast(friendly(x)); } setStatus(); }
    });
    setStatus();
  }
  async function setStatus() {
    if (!footerEl) return;
    if (!user || !me || !me.username) { footerEl.innerHTML = `<button class="linkbtn" data-fa="in">${h(T("forum.foot.signin", "Sign in to join the table"))}</button>`; return; }
    let on = false;
    try { const r = await sb.from("letter_list").select("wants").maybeSingle(); on = !!(r.data && r.data.wants); } catch (e) {}
    footerEl.innerHTML = `${h(T("forum.foot.as", "Signed in as "))}<b>@${h(me.username)}</b> · <button class="linkbtn" data-fa="letter" data-on="${on ? 1 : 0}">${h(on ? T("forum.foot.letter.on", "Daily letter: yes") : T("forum.foot.letter.off", "Daily letter: no"))}</button> · <button class="linkbtn" data-fa="out">${h(T("forum.foot.out", "Sign out"))}</button>`;
  }
  // app.js calls this after every draw: a Refresh button at the head of the conversation.
  function afterRender() {
    const box = document.querySelector("#responses h3");
    if (!box || !user || box.querySelector(".forum-refresh")) return;
    const b = document.createElement("button");
    b.type = "button"; b.className = "btn small ghost forum-refresh"; b.textContent = T("forum.refresh", "↻ Refresh");
    b.onclick = () => { b.disabled = true; refresh(); };
    box.appendChild(b);
  }

  /* ----------------------------------- the welcome page and the sign-in card */
  const STEPS = [
    ["forum.walk.1.title", "Each morning, four works arrive", "forum.walk.1.line", "A reading from Scripture, a poem, a passage and a painting, gathered around one theme."],
    ["forum.walk.2.title", "Write your first impression", "forum.walk.2.line", "One sentence is enough. You write before you read anyone else’s."],
    ["forum.walk.3.title", "Then the table opens", "forum.walk.3.line", "See how the same work sang in others, and write back."],
    ["forum.walk.4.title", "Come back tomorrow", "forum.walk.4.line", "A new theme every day. That is the whole habit."],
  ];
  let mode = "create", gateMsg = "";
  function openGate(m, msg) {
    if (m) mode = m; else if (mode === "name") mode = "in";
    gateMsg = msg || "";
    if (!gate) { gate = document.createElement("div"); gate.className = "fgate"; gate.setAttribute("role", "dialog"); gate.setAttribute("aria-label", "Welcome to Poiesis"); document.body.appendChild(gate); document.documentElement.classList.add("fgate-open"); gate.addEventListener("click", onGateClick); gate.addEventListener("submit", onGateSubmit); }
    drawGate();
  }
  function closeGate() { if (gate) { gate.remove(); gate = null; document.documentElement.classList.remove("fgate-open"); } }
  function setGateMsg(t) { gateMsg = t; const el = gate && gate.querySelector(".fmsg"); if (el) el.textContent = t; }

  function drawGate() {
    if (!gate) return;
    const keep = {}; gate.querySelectorAll("input[id]").forEach((i) => (keep[i.id] = i.type === "checkbox" ? i.checked : i.value));
    const p = pending();
    const field = (id, label, type, extra) => `<label class="authlab">${h(label)}<input id="${id}" type="${type}" ${extra || ""}></label>`;
    const tabs = `<div class="ftabs" role="tablist"><button type="button" role="tab" data-g="tab-create" aria-selected="${mode === "create"}">${h(T("forum.tab.create", "Create account"))}</button><button type="button" role="tab" data-g="tab-in" aria-selected="${mode === "in"}">${h(T("forum.tab.in", "Sign in"))}</button></div>`;
    const emailF = field("fEmail", T("forum.email", "Email"), "email", 'autocomplete="email" inputmode="email" autocapitalize="none" spellcheck="false" required');
    const nameF = field("fName", T("forum.name", "Username (what others see)"), "text", 'autocomplete="username" autocapitalize="none" spellcheck="false" maxlength="24" required');
    const wordF = CFG.betaWord ? field("fWord", T("forum.word", "Beta word"), "text", 'autocomplete="off" autocapitalize="none" spellcheck="false"') : "";
    const letterF = `<label class="fcheck"><input id="fLetter" type="checkbox"> <span>${h(T("forum.letter.ask", "Send me the daily letter when it begins"))}</span></label>`;
    let card;
    if (mode === "name") {
      card = `<h3>${h(T("forum.name.title", "Choose a username"))}</h3><p class="fline">${h(T("forum.name.line", "This is the name others see beside what you write."))}</p>
        <form data-f="name">${nameF}${wordF}${letterF}<button class="btn primary authwide">${h(T("forum.name.go", "Come in"))}</button></form>
        <button type="button" class="linkbtn" data-g="out">${h(T("forum.notyou", "Not you? Sign out"))}</button>`;
    } else if (mode === "create") {
      card = `${tabs}<form data-f="create">${emailF}${nameF}
        ${field("fPw", T("forum.pw.new", "Password (6 or more characters)"), "password", 'autocomplete="new-password" minlength="6" required')}
        ${wordF}${letterF}<button class="btn primary authwide">${h(T("forum.create.go", "Come in"))}</button></form>`;
    } else {
      card = `${tabs}<form data-f="in">${emailF}
        ${field("fPw", T("forum.pw", "Password"), "password", 'autocomplete="current-password"')}
        <button class="btn primary authwide">${h(T("forum.in.go", "Sign in"))}</button></form>
        ${CFG.emailLink ? `<button type="button" class="linkbtn" data-g="link">${h(T("forum.link", "Email me a sign-in link instead"))}</button>` : ""}`;
    }
    gate.innerHTML = `<div class="fpage">
      <header class="fhead"><img src="mark.png" alt="" class="fmark"><h1>${h(T("forum.title", "Poiesis"))}</h1><p class="fsub">${h(T("forum.sub", "A daily habit of inspiration."))}</p></header>
      <ol class="fwalk">${STEPS.map((s, i) => `<li><span class="fnum">${i + 1}</span><b>${h(T(s[0], s[1]))}</b><span>${h(T(s[2], s[3]))}</span></li>`).join("")}</ol>
      <section class="fcard">${card}<p class="fmsg authmsg" role="status">${h(gateMsg)}</p></section>
      <button type="button" class="linkbtn flook" data-g="look">${h(T("forum.look", "Just look around first"))}</button>
    </div>`;
    Object.keys(keep).forEach((id) => { const i = gate.querySelector("#" + id); if (i) { if (i.type === "checkbox") i.checked = keep[id]; else i.value = keep[id]; } });
    if (p.username && gate.querySelector("#fName") && !gate.querySelector("#fName").value) gate.querySelector("#fName").value = p.username;
  }

  async function onGateClick(e) {
    const b = e.target.closest("[data-g]"); if (!b) return;
    const g = b.dataset.g;
    if (g === "tab-create") { mode = "create"; gateMsg = ""; drawGate(); }
    if (g === "tab-in") { mode = "in"; gateMsg = ""; drawGate(); }
    if (g === "look") { try { sessionStorage.setItem(LOOK, "1"); } catch (x) {} closeGate(); }
    if (g === "out") { await sb.auth.signOut(); mode = "in"; drawGate(); }
    if (g === "link") {
      const email = (gate.querySelector("#fEmail").value || "").trim();
      if (!email) return setGateMsg(T("forum.link.need", "Type your email first."));
      const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: here() } });
      setGateMsg(error ? friendly(error) : T("forum.link.sent", "Check your email for the link."));
    }
  }
  async function onGateSubmit(e) {
    e.preventDefault();
    if (!sb) return setGateMsg(T("forum.err.sdk", "Couldn’t reach the sign-in service. Check your connection and reload."));
    const f = e.target.dataset.f, val = (id) => ((gate.querySelector("#" + id) || {}).value || "").trim();
    const btn = e.target.querySelector("button.primary"); if (btn) btn.disabled = true;
    const done = (msg) => { if (btn) btn.disabled = false; if (msg != null) setGateMsg(msg); };
    try {
      if (f === "in") {
        if (!val("fPw")) return done(T("forum.pw.need", "Type your password."));
        const { error } = await sb.auth.signInWithPassword({ email: val("fEmail"), password: gate.querySelector("#fPw").value });
        return done(error ? friendly(error) : "");
      }
      const name = val("fName").toLowerCase(), word = val("fWord"), letter = !!(gate.querySelector("#fLetter") || {}).checked;
      if (!/^[a-z0-9_]{3,24}$/.test(name)) return done(nameMessage("bad"));
      if (f === "name") {
        const r = await claim(name, word);
        if (r !== "ok" && r !== "have") return done(nameMessage(r));
        try { await sb.rpc("set_letter", { yes: letter }); } catch (x) {}
        closeGate(); setStatus(); await sendMine(); await refresh(); return;
      }
      const free = await sb.rpc("username_free", { u: name });
      if (free.data === false) return done(nameMessage("taken"));
      setPending({ username: name, word, letter });        // claimed the moment the account is signed in
      const { data, error } = await sb.auth.signUp({ email: val("fEmail"), password: gate.querySelector("#fPw").value, options: { emailRedirectTo: here() } });
      if (error) { setPending(null); return done(friendly(error)); }
      done(data.session ? "" : T("forum.create.confirm", "Check your email and press the link to finish."));
    } catch (x) { done(friendly(x)); }
  }

  window.PoiesisForum = { wrote, replied, repliesFor, afterRender, refresh, get user() { return user; }, get username() { return me && me.username; } };
  start();
})();
