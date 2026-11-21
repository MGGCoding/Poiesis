/* Poiesis: writing on a phone with the keyboard up (21 Nov 2026, keyboard chat).
 *
 * A phone keyboard takes half the screen. While someone is typing:
 *   - the Muse/Notebook bar and the quick pen step aside;
 *   - the line being typed stays just above the keyboard (the page follows);
 *   - a slim strip at the top: ? (the questions), the works to peek at, and
 *     Submit (the pen's replacement); anything others will see asks once;
 *   - the questions and notes around the box fold away; ? brings them back.
 * 21 Nov, afternoon (Niko): Submit sat on his own typing, so it moved into the
 * top strip; on iPhone Safari the address pill floats over the bottom, so the
 * caret is kept clear of it too.
 *
 * Also fixes the jump after ~5 lines: the old autogrow collapsed the box to
 * "auto" on every keystroke, so iOS chased a caret that moved up and then
 * down again. Boxes are now measured on a hidden twin and never collapse.
 *
 * Loads before app.js; app.js's autogrow() calls PoiesisKB.grow().
 * Words come from copy.js (kb.*) through PoiesisApp.T, read when first needed.
 */
(function(){
"use strict";
const R=document.documentElement;
const touch=matchMedia("(hover: none) and (pointer: coarse)");
const isField=el=>!!el&&(el.tagName==="TEXTAREA"||el.isContentEditable||(el.tagName==="INPUT"&&!/^(checkbox|radio|button|submit|reset|range|color|file|image|hidden)$/i.test(el.type)));
const T=(k,d)=>(window.PoiesisApp&&window.PoiesisApp.T)?window.PoiesisApp.T(k,d):d;

/* ---------- the hidden twin: measures a box without touching it ---------- */
const PROPS=["fontFamily","fontSize","fontWeight","fontStyle","fontVariant","fontFeatureSettings","letterSpacing","wordSpacing","lineHeight","textTransform","textIndent","tabSize",
 "paddingTop","paddingBottom","paddingLeft","paddingRight","borderTopWidth","borderBottomWidth","borderLeftWidth","borderRightWidth","borderTopStyle","borderBottomStyle","borderLeftStyle","borderRightStyle",
 "boxSizing","whiteSpace","wordBreak","overflowWrap"];
let M=null;
function twin(t){
 if(!M){ M=document.createElement("textarea"); M.setAttribute("aria-hidden","true"); M.tabIndex=-1; M.readOnly=true;
  M.style.cssText="position:absolute;top:0;left:-9999px;visibility:hidden;overflow:hidden;height:0;min-height:0;max-height:none;pointer-events:none;resize:none";
  document.body.appendChild(M); }
 const cs=getComputedStyle(t); for(const k of PROPS) M.style[k]=cs[k];
 M.style.width=cs.width; return cs;
}
function contentH(t,text){ M.value=text; return M.scrollHeight; }

/* grow a box to fit its words, with no collapse in between */
function grow(t){
 if(!t) return;
 if(!t.offsetWidth){ t.style.height="auto"; t.style.height=Math.max(44,t.scrollHeight)+"px"; return; }
 twin(t); const h=Math.max(44,contentH(t,t.value))+"px";
 if(t.style.height!==h) t.style.height=h;
}

/* where the caret's line ends, in page (client) pixels */
function caretBottom(t){
 if(t.tagName!=="TEXTAREA"||!t.offsetWidth) return t.getBoundingClientRect().bottom;
 const cs=twin(t), pos=t.selectionEnd==null?t.value.length:t.selectionEnd;
 const h=contentH(t,t.value.slice(0,pos))-parseFloat(cs.paddingBottom||0);
 const r=t.getBoundingClientRect();
 return Math.min(r.bottom, r.top+parseFloat(cs.borderTopWidth||0)+h-t.scrollTop);
}
function lineH(t){ const v=parseFloat(getComputedStyle(t).lineHeight); return isNaN(v)?28:v; }

/* ---------- what can be submitted from which box ---------- */
/* public: others will see it, so Submit asks once first */
const TARGETS={
 draft:   {sel:'[data-act="seal"]',   pub:true,  peek:true},
 synDraft:{sel:'[data-act="pubsyn"]', pub:true,  peek:true},
 layerIn: {sel:'#laterF button',      pub:true,  peek:true},
 nbAnswer:{sel:'[data-nbact="makepage"]', pub:false},
 pkText:  {sel:'[data-nbact="pocket"]',   pub:false}
};
function targetFor(el){ const d=el&&TARGETS[el.id]; if(!d) return null; const b=document.querySelector(d.sel); return b?{btn:b, pub:d.pub, peek:!!d.peek}:null; }

/* ---------- the pieces on screen ---------- */
let sub=null, conf=null, peek=null, qbtn=null, chips=null, body=null, active=null, tgt=null, marked=[];
/* iPhone Safari (not the home-screen app) floats its address pill above the keyboard */
const iosPill=(/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1))&&!navigator.standalone;
const keep=e=>e.preventDefault();            /* a tap here must not close the keyboard */
function build(){
 if(sub) return;
 peek=document.createElement("div"); peek.className="kbpeek"; peek.hidden=true;
 peek.addEventListener("pointerdown",e=>{ if(e.target.closest("button")) keep(e); }); peek.addEventListener("mousedown",e=>{ if(e.target.closest("button")) keep(e); });
 const row=document.createElement("div"); row.className="kbpeek-row";
 qbtn=document.createElement("button"); qbtn.type="button"; qbtn.className="kbq"; qbtn.textContent="?"; qbtn.hidden=true;
 qbtn.onclick=()=>{ const on=!R.classList.contains("kb-showq"); R.classList.toggle("kb-showq",on); qbtn.setAttribute("aria-pressed",String(on)); follow(); };
 chips=document.createElement("div"); chips.className="kbpeek-chips";
 sub=document.createElement("button"); sub.type="button"; sub.className="kbsub"; sub.hidden=true;
 sub.addEventListener("click",onSubmit);
 row.append(qbtn,chips,sub);
 body=document.createElement("div"); body.className="kbpeek-body"; body.hidden=true;
 peek.append(row,body);
 conf=document.createElement("div"); conf.className="kbconfirm"; conf.hidden=true; conf.setAttribute("role","dialog");
 conf.addEventListener("pointerdown",keep); conf.addEventListener("mousedown",keep);
 document.body.append(peek, conf);
}
/* fold away what sits around the box: questions and notes (? brings those back), and the row with the page's own button (Submit stands in for it) */
function fold(el){
 unfold(); const host=el.parentElement; if(!host) return;
 for(const c of host.children){ if(c===el) continue;
  const cls=(tgt&&c.contains(tgt.btn))?"kb-hide":"kb-q";
  c.classList.add(cls); marked.push([c,cls]); }
 qbtn.hidden=!marked.some(m=>m[1]==="kb-q");
 R.classList.remove("kb-showq"); qbtn.setAttribute("aria-pressed","false");
}
function unfold(){ marked.forEach(([c,cls])=>c.classList.remove(cls)); marked=[]; R.classList.remove("kb-showq"); }
function showStrip(){ if(peek) peek.hidden=!(!sub.hidden||!qbtn.hidden||chips.children.length); }
function syncSub(){
 if(!sub||!active) return;
 if(!tgt){ sub.hidden=true; return; }
 sub.textContent=T("kb.submit","Submit");
 sub.hidden=false;
 sub.disabled=tgt.btn.disabled||!(active.value||"").trim();
}
function onSubmit(){
 if(!tgt||sub.disabled) return;
 if(!tgt.pub){ fire(); return; }
 conf.innerHTML="";
 const p=document.createElement("p"); p.textContent=T("kb.confirm","Publish this? Others will see it.");
 const row=document.createElement("div"); row.className="kbconfirm-row";
 const no=document.createElement("button"); no.type="button"; no.className="btn ghost small"; no.textContent=T("kb.confirm.no","Keep writing");
 const yes=document.createElement("button"); yes.type="button"; yes.className="btn primary small"; yes.textContent=T("kb.confirm.yes","Publish");
 no.onclick=()=>{ conf.hidden=true; };
 yes.onclick=()=>{ conf.hidden=true; fire(); };
 row.append(no,yes); conf.append(p,row); conf.hidden=false; place();
}
function fire(){
 const b=tgt&&tgt.btn; if(!b) return;
 if(document.activeElement&&document.activeElement.blur) document.activeElement.blur();
 off(); b.click();
}
const strip=s=>new DOMParser().parseFromString(String(s||""),"text/html").body.textContent;
function buildPeek(){
 chips.innerHTML=""; body.innerHTML=""; body.hidden=true;
 if(!tgt||!tgt.peek||!window.PoiesisApp||!window.PoiesisApp.peek) return;
 let works=[]; try{ works=window.PoiesisApp.peek(active.id)||[]; }catch(_){ works=[]; }
 if(!works.length) return;
 const row=chips;
 works.forEach((w,i)=>{
  const b=document.createElement("button"); b.type="button"; b.textContent=w.kind||w.title||"";
  b.setAttribute("aria-expanded","false"); b.title=strip(w.title);
  b.onclick=()=>{
   const open=b.getAttribute("aria-expanded")==="true";
   row.querySelectorAll("button").forEach(x=>x.setAttribute("aria-expanded","false"));
   if(open){ body.hidden=true; place(); return; }
   b.setAttribute("aria-expanded","true");
   body.innerHTML="";
   const h=document.createElement("p"); h.className="kbpeek-t"; h.textContent=strip(w.title);
   const by=document.createElement("p"); by.className="kbpeek-by"; by.textContent=strip([w.maker,w.date].filter(Boolean).join(" · "));
   const tx=document.createElement("div"); tx.className="kbpeek-x"; tx.textContent=strip(w.text);
   body.append(h); if(by.textContent) body.append(by); if(tx.textContent) body.append(tx);
   body.hidden=false; body.scrollTop=0; place();
  };
  row.append(b);
 });
}

/* ---------- placing them in the part of the screen the keyboard leaves ---------- */
function place(){
 const vv=window.visualViewport;
 const top=vv?vv.offsetTop:0, h=vv?vv.height:innerHeight;
 R.style.setProperty("--kbt",top+"px"); R.style.setProperty("--kbh",h+"px");
 R.style.setProperty("--kbs",((peek&&!peek.hidden)?peek.getBoundingClientRect().height:0)+"px");
}

/* keep the caret's line above the keyboard and below the peek strip */
let raf=0;
function follow(){
 cancelAnimationFrame(raf);
 raf=requestAnimationFrame(()=>{
  const t=active; if(!t||document.activeElement!==t) return;
  const vv=window.visualViewport, top=vv?vv.offsetTop:0, H=vv?vv.height:innerHeight;
  const ph=(peek&&!peek.hidden)?peek.getBoundingClientRect().height:0;
  const reserve=iosPill?72:18;   /* clear of Safari's address pill */
  const cb=caretBottom(t), ct=cb-lineH(t);
  let d=0;
  if(cb>top+H-reserve) d=cb-(top+H-reserve);
  else if(ct<top+ph+8) d=ct-(top+ph+8);
  if(Math.abs(d)>1) window.scrollBy(0,Math.round(d));
 });
}

/* ---------- on and off ---------- */
function on(el){
 build(); active=el; tgt=targetFor(el);
 R.classList.add("kb");
 conf.hidden=true; syncSub(); buildPeek(); if(TARGETS[el.id]) fold(el); else { unfold(); qbtn.hidden=true; } showStrip(); place();
 follow(); setTimeout(()=>{ place(); follow(); },320);   /* again once the keyboard has risen */
}
function off(){
 active=null; tgt=null; R.classList.remove("kb"); unfold();
 if(sub){ sub.hidden=true; conf.hidden=true; peek.hidden=true; }
}
document.addEventListener("focusin",e=>{
 if(!touch.matches||!isField(e.target)) return;
 if(e.target.closest(".penbox")){ build(); unfold(); active=e.target; tgt=null; R.classList.add("kb"); syncSub(); peek.hidden=true; place(); return; }
 on(e.target);
});
document.addEventListener("focusout",()=>{
 setTimeout(()=>{ const a=document.activeElement; if(!isField(a)) off(); },120);
});
/* after the page's own oninput has grown the box */
document.addEventListener("input",e=>{ if(e.target===active){ syncSub(); follow(); } });
document.addEventListener("selectionchange",()=>{ if(active&&document.activeElement===active) follow(); });
if(window.visualViewport){
 visualViewport.addEventListener("resize",()=>{ place(); if(active) follow(); });
 visualViewport.addEventListener("scroll",place);
}

window.PoiesisKB={ grow, follow, caretBottom };
})();
