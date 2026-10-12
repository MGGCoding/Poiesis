/* Poiesis — the feedback page for friends trying it (feedback.html).
 *
 * 1. "Open a fresh Poiesis" opens the site as ?user=<this friend's id>&tester,
 *    which starts with an empty notebook (see TESTER in app.js).
 * 2. The form asks how it went. Nothing in it is prefilled: the only things
 *    filled in for them are facts (the day, and how many impressions, links
 *    and notebook pages their fresh Poiesis holds — never what they wrote).
 * 3. Sending: with a feedbackEmail in config.js the answers are emailed straight
 *    to Niko through FormSubmit (formsubmit.co). With a feedbackEndpoint (the
 *    Google Sheet script in tools/feedback/) they land as one row instead.
 *    If neither works the friend can still share, copy or email them.
 * Every word is in copy.js under "THE FEEDBACK PAGE".
 */
(function(){
"use strict";
/* ---- the copy file, read the same way app.js reads it ---- */
const COPY=(function(){ const o={}; String(window.POIESIS_COPY||"").split("\n").forEach(line=>{
  const s=line.trim(); if(!s||s.charAt(0)==="#") return; const i=line.indexOf(":"); if(i<1) return;
  const k=line.slice(0,i).trim(); if(!/^[a-z0-9.]+$/i.test(k)) return;
  o[k]=line.slice(i+1).replace(/^ /,"").replace(/\r$/,"").replace(/\\n/g,"\n"); }); return o; })();
const T=(k,d)=>COPY[k]===undefined?d:COPY[k];
const L=(k,d)=>T(k,d).split("|").map(x=>x.trim()).filter(Boolean);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const $=(s,r=document)=>r.querySelector(s);
const CFG=window.POIESIS_CONFIG||{};
const store={ get(k){ try{ return JSON.parse(localStorage.getItem(k)||"null"); }catch(e){ return null; } },
  set(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} } };
let tt; function toast(m){ const t=$("#toast"); t.textContent=m; t.hidden=false; clearTimeout(tt); tt=setTimeout(()=>t.hidden=true,2800); }

/* ---- who this friend is: one id per browser, kept so they can come back ---- */
let ID=store.get("poiesis.tester.id");
if(!ID){ ID="friend-"+Math.random().toString(36).slice(2,8); store.set("poiesis.tester.id", ID); }
const APP_URL=`./?user=${encodeURIComponent(ID)}&tester`;
const STATE_KEY="poiesis.v7."+ID;

/* ---- today's day, from the bank ---- */
const iso=(d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`)(new Date());
const DAY=(window.POIESIS_DAYS||{})[iso]||null;
const WORKS=DAY?DAY.muses.map(m=>({id:m.id, label:`${m.kind}: ${m.title}${m.kind==="Scripture"?"":" ("+m.maker+")"}`}))
 :[{id:"poem",label:"The poem"},{id:"passage",label:"The passage"},{id:"third",label:"The third work"}];

/* ---- what their fresh Poiesis holds: counts only, never the words ---- */
function activity(){
 const s=store.get(STATE_KEY); if(!s) return {opened:false};
 const n=o=>Object.keys(o||{}).length;
 return {opened:true, impressions:n(s.sealed), links:n(s.syn), pages:(s.journal||[]).length,
  lines:(s.lines||[]).length, stickers:n(s.owned), days:n(s.visits)};
}

/* ---- the questions ---- */
const Q=[
 {sec:T("fb.s.about","About you"), items:[
  {id:"name", type:"short", q:T("fb.q.name","Your name, so Niko knows who wrote (optional)")},
  {id:"device", type:"one", q:T("fb.q.device","What did you use?"), opts:L("fb.o.device","Phone | Laptop or desktop | Both")}]},
 {sec:T("fb.s.first","First look"), items:[
  {id:"first_clear", type:"scale", q:T("fb.q.firstclear","When you opened it, was it clear what to do?")},
  {id:"first_confused", type:"long", q:T("fb.q.firstconfused","What, if anything, confused you at first?")}]},
 {sec:T("fb.s.output","Was it clear?"), items:[
  {id:"output_clear", type:"scale", q:T("fb.q.outputclear","Was what Poiesis gave back to you clear: the works, the questions, what happened after you wrote?")},
  {id:"unclear", type:"many", q:T("fb.q.unclear","Which parts were unclear? Tick any."), opts:L("fb.o.unclear","Why these three works are together | The questions under the prompt | Why other people's writing is hidden until you write | Stickers and today's check | Writing a link between two works | Tying all three together | The notebook | The little column beside the day's word | The ⓘ stories")},
  {id:"unclear_why", type:"long", q:T("fb.q.unclearwhy","Say more about anything you ticked")}]},
 {sec:T("fb.s.incentive","Coming back, and writing back"), items:[
  {id:"wrote", type:"one", q:T("fb.q.wrote","Did you write a first impression?"), opts:L("fb.o.wrote","Yes, on all three | Yes, on one or two | No")},
  {id:"stopped", type:"long", q:T("fb.q.stopped","If you didn't write, or stopped early, what got in the way?")},
  {id:"come_back", type:"many", q:T("fb.q.comeback","What would bring you back tomorrow? Tick any."), opts:L("fb.o.comeback","The works themselves | A daily reminder | Seeing what friends wrote | Someone writing back to me | Knowing my writing moved someone | Fewer works a day | A quieter, shorter page | Honestly, nothing yet")},
  {id:"write_back", type:"long", q:T("fb.q.respond","What would make you write back to someone else's impression?")}]},
 {sec:T("fb.s.features","The features"), items:[
  {id:"feature", type:"grid", q:T("fb.q.features","How did each one land?"), rows:L("fb.o.featurerows","The three works of the day | The questions that guide your first impression | Writing before you can read others | Links between two works | Tying all three together | Stickers | The notebook | The day's saying (the column) | The ⓘ stories about each work"), cols:L("fb.o.featurecols","Loved it | Fine | Not for me | Didn't find it")},
  {id:"add", type:"long", q:T("fb.q.add","One thing you would add")},
  {id:"remove", type:"long", q:T("fb.q.remove","One thing you would take away")}]},
 {sec:T("fb.s.curriculum","Today's works"), items:[
  {id:"work", type:"grid", q:T("fb.q.works","How did each work land?"), rows:WORKS.map(w=>w.label), cols:L("fb.o.workcols","Moved me | Fine | Didn't land | Didn't read it")},
  {id:"together", type:"scale", q:T("fb.q.together","Did the three feel like they belonged together?")},
  {id:"length", type:"one", q:T("fb.q.length","How much was there to read?"), opts:L("fb.o.length","Too much | About right | I'd take more")},
  {id:"scripture", type:"one", q:T("fb.q.scripture","Having Scripture as one of the three felt…"), opts:L("fb.o.scripture","Natural | Fine | A bit odd | It put me off")},
  {id:"suggest", type:"long", q:T("fb.q.suggest","A poem, passage or painting you would want to see here")}]},
 {sec:T("fb.s.else","Anything else"), items:[
  {id:"else", type:"long", q:T("fb.q.else","Anything else Niko should know?")}]}
];

/* ---- drawing the form ---- */
const DRAFT_KEY="poiesis.feedback.draft";
let A=store.get(DRAFT_KEY)||{};
const nameOf=(it,i)=>`${it.id}${i==null?"":"__"+i}`;
function field(it){
 const v=A[it.id];
 if(it.type==="short") return `<input class="field" name="${it.id}" value="${esc(v||"")}" autocomplete="name">`;
 if(it.type==="long") return `<textarea class="field fb-long" name="${it.id}" rows="3">${esc(v||"")}</textarea>`;
 if(it.type==="one") return `<div class="fb-opts">${it.opts.map(o=>`<label class="fb-opt"><input type="radio" name="${it.id}" value="${esc(o)}" ${v===o?"checked":""}><span>${esc(o)}</span></label>`).join("")}</div>`;
 if(it.type==="many") return `<div class="fb-opts">${it.opts.map(o=>`<label class="fb-opt"><input type="checkbox" name="${it.id}" value="${esc(o)}" ${(v||[]).includes(o)?"checked":""}><span>${esc(o)}</span></label>`).join("")}</div>`;
 if(it.type==="scale") return `<div class="fb-scale"><span class="fb-end">${esc(T("fb.scale.low","Not at all"))}</span>${[1,2,3,4,5].map(n=>`<label class="fb-dot"><input type="radio" name="${it.id}" value="${n}" ${String(v)===String(n)?"checked":""}><span>${n}</span></label>`).join("")}<span class="fb-end">${esc(T("fb.scale.high","Completely"))}</span></div>`;
 if(it.type==="grid"){ const g=v||{};
  return `<div class="fb-grid">${it.rows.map((r,i)=>`<fieldset class="fb-row"><legend>${esc(r)}</legend><div class="fb-opts tight">${it.cols.map(c=>`<label class="fb-opt"><input type="radio" name="${nameOf(it,i)}" value="${esc(c)}" ${g[r]===c?"checked":""}><span>${esc(c)}</span></label>`).join("")}</div></fieldset>`).join("")}</div>`; }
 return "";
}
function formHTML(){
 return Q.map(s=>`<section class="fb-sec"><h3>${esc(s.sec)}</h3>${s.items.map(it=>`<div class="fb-item"><p class="fb-q">${esc(it.q)}</p>${field(it)}</div>`).join("")}</section>`).join("");
}
function read(form){
 const out={};
 Q.forEach(s=>s.items.forEach(it=>{
  if(it.type==="short"||it.type==="long"){ const t=(form.elements[it.id].value||"").trim(); if(t) out[it.id]=t; }
  else if(it.type==="one"||it.type==="scale"){ const el=form.querySelector(`[name="${it.id}"]:checked`); if(el) out[it.id]=it.type==="scale"?+el.value:el.value; }
  else if(it.type==="many"){ const v=[...form.querySelectorAll(`[name="${it.id}"]:checked`)].map(x=>x.value); if(v.length) out[it.id]=v; }
  else if(it.type==="grid"){ const g={}; it.rows.forEach((r,i)=>{ const el=form.querySelector(`[name="${nameOf(it,i)}"]:checked`); if(el) g[r]=el.value; }); if(Object.keys(g).length) out[it.id]=g; }
 }));
 return out;
}

/* ---- what gets sent: the answers as readable text, and as one flat row ---- */
function asText(a, act){
 const lines=[`Poiesis feedback · ${iso} · ${ID}`];
 Q.forEach(s=>{ const its=s.items.filter(it=>a[it.id]!==undefined); if(!its.length) return;
  lines.push("", s.sec.toUpperCase());
  its.forEach(it=>{ const v=a[it.id];
   if(it.type==="grid"){ lines.push(it.q); Object.entries(v).forEach(([r,c])=>lines.push(`  ${r}: ${c}`)); }
   else lines.push(`${it.q}\n  ${Array.isArray(v)?v.join("; "):v}${it.type==="scale"?" / 5":""}`); }); });
 lines.push("", act.opened?`(What they did: first impressions ${act.impressions} · links ${act.links} · notebook pages ${act.pages} · kept lines ${act.lines})`:"(They had not opened the fresh Poiesis on this browser.)");
 return lines.join("\n");
}
function asRow(a, act){
 const row={received:new Date().toISOString(), tester:ID, day:iso,
  works:DAY?DAY.muses.map(m=>m.title).join(" / "):"(built-in day)",
  screen:`${innerWidth}×${innerHeight}`};
 Q.forEach(s=>s.items.forEach(it=>{ const v=a[it.id]; if(v===undefined) return;
  if(it.type==="grid") Object.entries(v).forEach(([r,c])=>{ row[`${it.id}: ${r}`]=c; });
  else row[it.id]=Array.isArray(v)?v.join("; "):v; }));
 Object.entries(act).forEach(([k,v])=>{ row["did_"+k]=v; });
 return row;
}

/* ---- the page ---- */
const root=$("#fb");
function render(sent){
 const act=activity();
 const tryBtn=`<a class="btn primary" href="${APP_URL}" target="_blank" rel="noopener">${esc(act.opened?T("fb.try.again","Open my Poiesis again ›"):T("fb.try.button","Open a fresh Poiesis ›"))}</a>`;
 root.innerHTML=`<h1 class="fb-title">${esc(T("fb.title","Help shape Poiesis"))}</h1>
  <p class="fb-intro">${esc(T("fb.intro",""))}</p>
  <section class="fb-card"><h2>${esc(T("fb.try.heading","1. Try it"))}</h2><p>${esc(T("fb.try.line",""))}</p>${tryBtn}</section>
  <section class="fb-card"><h2>${esc(T("fb.tell.heading","2. Tell Niko how it went"))}</h2>
   ${sent?sentHTML(sent):`<form id="fbForm" novalidate>${formHTML()}<p class="fb-small">${esc(T("fb.included",""))}</p><button class="btn primary" type="submit">${esc(T("fb.send","Send my answers"))}</button></form>`}</section>`;
 const f=$("#fbForm");
 if(f){ f.oninput=f.onchange=()=>{ A=read(f); store.set(DRAFT_KEY, A); };
  f.onsubmit=e=>{ e.preventDefault(); const a=read(f); if(!Object.keys(a).length){ toast(T("fb.empty","Answer at least one question first.")); return; } submit(a); }; }
 wireSent(sent);
}
let LAST=null;
function sentHTML(s){
 const share=navigator.share?`<button class="btn primary" type="button" data-fb="share">${esc(T("fb.share","Share my answers…"))}</button>`:"";
 const mail=CFG.feedbackEmail?`<a class="btn" href="mailto:${encodeURIComponent(CFG.feedbackEmail)}?subject=${encodeURIComponent("Poiesis feedback · "+ID)}&body=${encodeURIComponent(s.text.slice(0,1800))}">${esc(T("fb.email","Email them"))}</a>`:"";
 return `<h3 class="fb-thanks">${esc(T("fb.sent.heading","Thank you."))}</h3>
  ${s.logged?`<p>${esc(T("fb.sent.logged","Your answers reached Niko."))}</p><div class="fb-actions"><button class="btn" type="button" data-fb="copy">${esc(T("fb.copy","Copy my answers"))}</button></div>`:`<p>${esc(T("fb.sent.share","Now send them to Niko, by text, WhatsApp or email, whichever you use with him."))}</p>
  <div class="fb-actions">${share}<button class="btn" type="button" data-fb="copy">${esc(T("fb.copy","Copy my answers"))}</button>${mail}</div>`}
  <pre class="fb-out">${esc(s.text)}</pre>
  <p><button class="btn ghost small" type="button" data-fb="edit">${esc(T("fb.edit","Change my answers"))}</button></p>`;
}
function wireSent(s){
 if(!s) return;
 root.onclick=async e=>{ const a=e.target.closest("[data-fb]")?.dataset.fb; if(!a) return;
  if(a==="share"){ try{ await navigator.share({title:"Poiesis feedback", text:s.text}); }catch(err){} }
  if(a==="copy"){ try{ await navigator.clipboard.writeText(s.text); toast(T("fb.copied","Copied. Paste them into a message to Niko.")); }
   catch(err){ const r=document.createRange(); r.selectNodeContents($(".fb-out")); getSelection().removeAllRanges(); getSelection().addRange(r); } }
  if(a==="edit"){ root.onclick=null; render(null); }
 };
}
async function submit(a){
 const act=activity(), text=asText(a, act), row=asRow(a, act);
 let logged=false;
 if(CFG.feedbackEndpoint){
  try{ await fetch(CFG.feedbackEndpoint, {method:"POST", mode:"no-cors", headers:{"Content-Type":"text/plain;charset=utf-8"}, body:JSON.stringify(row)}); logged=true; }
  catch(err){ logged=false; }
 } else if(CFG.feedbackEmail && CFG.feedbackEmailDirect!==false){
  /* straight to Niko's inbox through FormSubmit (formsubmit.co): free, no
     account. The very first submission makes FormSubmit email Niko an
     "Activate" link; until he clicks it this falls back to share / copy. */
  try{
   const r=await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(CFG.feedbackEmail)}`, {method:"POST",
    headers:{"Content-Type":"application/json", "Accept":"application/json"},
    body:JSON.stringify({_subject:`Poiesis feedback from ${a.name||ID}`, _template:"table", _captcha:"false",
     name:a.name||"(no name)", tester:ID, day:iso, works:row.works, answers:text})});
   const j=await r.json().catch(()=>({}));
   logged=r.ok&&String(j.success)==="true";
  }catch(err){ logged=false; }
 }
 const sent={text, logged, at:Date.now()};
 store.set("poiesis.feedback.sent", (store.get("poiesis.feedback.sent")||[]).concat([{at:sent.at, row}]));
 LAST=sent; render(sent); scrollTo({top:root.offsetTop-20, behavior:"smooth"});
}
render(null);
/* coming back from their Poiesis tab: refresh the "Open again" wording */
addEventListener("focus", ()=>{ if(!LAST&&$("#fbForm")){ const b=root.querySelector(".fb-card .btn.primary"); if(b&&activity().opened) b.textContent=T("fb.try.again","Open my Poiesis again ›"); } });
window.PoiesisFeedback={ questions:Q, read:()=>A, id:ID };
})();
