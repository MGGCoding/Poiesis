(function(){
"use strict";
/* ---------- Copy: every word of the frame lives in copy.js ---------- */
const COPY=(function(){ const o={}; let raw="";
 try{ raw=(typeof window!=="undefined"&&window.POIESIS_COPY)||""; }catch(e){}
 String(raw).split("\n").forEach(line=>{ const s=line.trim(); if(!s||s.charAt(0)==="#") return;
  const i=line.indexOf(":"); if(i<1) return; const k=line.slice(0,i).trim(); if(!/^[a-z0-9.]+$/i.test(k)) return;
  o[k]=line.slice(i+1).replace(/^ /,"").replace(/\r$/,"").replace(/\\n/g,"\n"); });
 return o; })();
/* A line deleted from copy.js falls back to the built-in default.
   A line left BLANK hides that wording: an empty value is a decision. */
function T(k,d){ const v=COPY[k]; return v===undefined?d:v; }
function blank(k){ return COPY[k]===""; }
function applyStaticCopy(){
 const set=(sel,k,d)=>{ const el=document.querySelector(sel); if(el) el.textContent=T(k,d); };
 set('#switch [data-tab="muse"]',"site.tab.muse","Muse");
 set('#switch [data-tab="notebook"]',"site.tab.notebook","Notebook");
 set("#lookPop h3","site.rooms.title","Rooms"); set("#lookPop p","site.rooms.line","Where would you like to work today?");
 set("#fontPop h3","site.type.title","Type"); set("#fontPop p","site.type.line","Choose the letters you read and write in. Any type goes with any room.");
 set("#whyLink","site.why.link","Why Poiesis \u203a");
 set("footer span","site.footer","A working sketch, 2026. Other members are examples; what you write stays in this browser. Paintings appear as color studies.");
}
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const today=()=>new Date().toISOString().slice(0,10);
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const PENCIL='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16.5 3.5l4 4L8 20H4v-4z"/><path d="M14 6l4 4"/></svg>';
const BOOKMARK='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z"/></svg>';
const PROMPT=T("muse.prompt","How does this muse call to your own experience? What do you hear it singing?");

/* ---------- Muses ---------- */
/* ---------- Muses: the built-in day, used when the bank has no entry ---------- */
const BUILTIN_MUSES=[
 {id:"browning", mk:"browning", kind:"Poem", title:"Earth’s crammed with heaven", maker:"Elizabeth Barrett Browning", date:"Aurora Leigh, 1856",
  poem:"Why else do these things move him, leaf or stone?\nThe bird’s not moved that pecks at a springshoot;\nNor yet the horse, before a quarry a-graze:\nBut man, the twofold creature, apprehends\nThe twofold manner, in and outwardly,\nAnd nothing in the world comes single to him,\nA mere itself, cup, column, or candlestick,\nAll patterns of what shall be in the Mount;\nThe whole temporal show related royally,\nAnd built up to eterne significance\nThrough the open arms of God. “There’s nothing great\nNor small,” has said a poet of our day,\nWhose voice will ring beyond the curfew of eve\nAnd not be thrown out by the matin’s bell:\nAnd truly, I reiterate, nothing’s small!\nNo lily-muffled hum of a summer-bee,\nBut finds some coupling with the spinning stars;\nNo pebble at your foot, but proves a sphere;\nNo chaffinch, but implies the cherubim;\nAnd (glancing on my own thin, veinèd wrist)\nIn such a little tremor of the blood\nThe whole strong clamour of a vehement soul\nDoth utter itself distinct. Earth’s crammed with heaven,\nAnd every common bush afire with God;\nBut only he who sees, takes off his shoes—\nThe rest sit round it and pluck blackberries,\nAnd daub their natural faces unaware\nMore and more from the first similitude.", poemNote:"Book Seventh, 28 lines · 1856",
  deeper:"Read the six lines again and ask which one you were this morning: the one who took off his shoes, or one of the ones picking blackberries.",
  story:["<i>Aurora Leigh</i> is a novel written in blank verse — nine books, some eleven thousand lines, published in 1856. Its narrator is a woman trying to be a poet while everyone around her explains why she should be something else.",
   "Barrett Browning wrote most of it in Florence, at Casa Guidi, where she had lived since eloping with Robert Browning in 1846. She was in her late forties, and it was the longest thing she ever made.",
   "These six lines come near the end of Book Seven. The bush that burns without being consumed is Moses’ bush from Exodus 3, where he is told to take off his shoes because the ground is holy. Her argument is not that the bush is rare. It is that the seeing is."]},
 {id:"chesterton", mk:"chesterton", kind:"Passage", title:"Do it again", maker:"G. K. Chesterton", date:"Orthodoxy, 1908",
  quote:"Because children have abounding vitality, because they are in spirit fierce and free, therefore they want things repeated and unchanged. … It is possible that God says every morning, “Do it again” to the sun; and every evening, “Do it again” to the moon. … It may be that He has the eternal appetite of infancy; for we have sinned and grown old, and our Father is younger than we.",
  cite:"“The Ethics of Elfland,” Orthodoxy, 1908",
  deeper:"He says repetition can be appetite rather than machinery. Name one thing you do every day that has become machinery, and what it would take to say “do it again” to it.",
  story:["Chesterton wrote <i>Orthodoxy</i> in 1908 as the answer to a dare. In his preface he explains that the critic G. S. Street had said, of an earlier book of his, that he would not worry about his own philosophy until Chesterton had produced one.",
   "The chapter this comes from is called “The Ethics of Elfland.” Its argument is that fairy tales are not a holiday from reality but a training in it: in them nothing happens because it must, only because someone wills it.",
   "So the sun does not rise by necessity, the way a machine turns over. It rises the way a child on a knee says <i>again</i>, and again, and again, and is not tired of it. Monotony, he says, may be a sign not of death but of excess of life."]},
 {id:"hammershoi", mk:"hammershoi", kind:"Painting", title:"Interior in Strandgade, Sunlight on the Floor", maker:"Vilhelm Hammershøi", date:"1901", where:"SMK, Copenhagen · oil on canvas, 46.5 × 52 cm",
  plate:"p-strandgade", palette:["#cfcabc","#9a9384","#e8e0cb","#6b6355"],
  deeper:"He painted these rooms about sixty times. Look up at the room you are in and find the one thing the light is doing in it right now.",
  story:["From 1898 to 1909 Hammershøi and his wife Ida rented the first-floor apartment at Strandgade 30 in Christianshavn, in a Copenhagen townhouse finished in 1635. He had no studio: he painted in the rooms they lived in.",
   "He painted those rooms about sixty times — the doors, the panelling, the grey light from the courtyard. <i>Ida Reading a Letter</i> (1899) and <i>Sunbeams</i> (1901) came out of the same few doorways.",
   "Here almost everything has been let go: no story, no face, hardly any furniture. What is left is the light lying on the floorboards, painted by a man who saw the same floor every day for eleven years and did not stop looking at it."]}
];
/* The day’s shape */
const BUILTIN_DAY={theme:"familiar", line:"What we have seen a thousand times, and stopped seeing.",
 verse:"Most certainly I tell you, no prophet is acceptable in his hometown.", verseRef:"Luke 4:24 · World English Bible",
 maxim:"I pass the whole day in review before myself, and repeat all that I have said and done.", maximCite:"Seneca, On Anger III.36 · tr. Aubrey Stewart, 1900",
 reading:"Luke 4:22–30", readingNote:"The day’s reading in the Greek Orthodox calendar. It shapes the three works; it is never the point of them."};

/* ---------- The day, from the muse bank ----------
   tools/build-days.mjs writes site/days.js from muse-bank/. When it covers
   today, the day's three works are the chosen option's poem, passage and
   Scripture, and the painting sits beside the Scripture rather than being
   written on. Otherwise the built-in day above is used unchanged. */
function bankDay(){
 const all=(typeof window!=="undefined"&&window.POIESIS_DAYS)||null; if(!all) return null;
 const d=new Date(), iso=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
 return all[iso]||null;
}
const BANK=bankDay();
/* one plain seal per maker the bank brings in, until that maker has a set of six */
function bankSticker(m){
 const mk=m.mk; if(SETS[mk]) return;                       /* a hand-drawn set already exists */
 const ini=m.kind==="Scripture"?"✝":((m.maker||"?").replace(/[^A-Za-zÀ-ÿ ]/g,"").trim().split(/\s+/).slice(-1)[0][0]||"?");
 const grounds={Poem:"#2f4030", Passage:"#3d5d86", Scripture:"#6b4a7d"};
 const id="seal-"+mk;
 STICKERS[id]={series:m.maker, ed:1, name:m.title, source:[m.title,m.date].filter(Boolean).join(" · "),
  svg:`<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="${grounds[m.kind]||"#3a2f26"}"/><circle cx="24" cy="24" r="18" fill="none" stroke="#e8dcbf" stroke-width="1.1" opacity=".7"/><text x="24" y="31" text-anchor="middle" font-family="Georgia,serif" font-size="19" fill="#e8dcbf">${ini}</text></svg>`};
 SETS[mk]=[id];
 MAKERNAME[mk]=m.maker;
}
function bankMuses(b){
 return b.muses.map(m=>{
  const o={id:m.id, mk:m.mk, kind:m.kind, title:m.title, maker:m.maker, date:m.date,
   deeper:m.deeper||"", story:m.story||[], gloss:m.gloss||null};
  if(m.poem){ o.poem=m.poem; if(m.poemNote) o.poemNote=m.poemNote; }
  if(m.quote){ o.quote=m.quote; o.cite=m.cite||""; }
  if(m.painting) o.painting=m.painting;
  return o;
 });
}
const MUSES = BANK ? bankMuses(BANK) : BUILTIN_MUSES;
const DAY = BANK ? {theme:BANK.theme, line:BANK.line, verse:BANK.verse, verseRef:BANK.verseRef,
                    reading:BANK.reading, readingNote:BANK.readingNote,
                    maxim:BANK.maxim||BUILTIN_DAY.maxim, maximCite:BANK.maxim?BANK.maximCite:BUILTIN_DAY.maximCite} : BUILTIN_DAY;
/* the sample conversation belongs to the built-in day only */
const SAMPLES = !BANK;
const LINKS=[
 {id:"pp", a:MUSES[0].id, b:MUSES[1].id},
 {id:"pv", a:MUSES[1].id, b:MUSES[2].id},
 {id:"vp", a:MUSES[2].id, b:MUSES[0].id}
];
const LINK=Object.fromEntries(LINKS.map(l=>[l.id,l]));
const LINKS3={pp:[MUSES[0].id,MUSES[1].id], pv:[MUSES[1].id,MUSES[2].id], vp:[MUSES[0].id,MUSES[2].id]};
const SYNS=[
 {id:"y1", on:"pp", name:"Lena Vogt", at:"8:12 a.m.", text:"She says the bush is always burning and we are picking blackberries. He says the sun rises because someone keeps asking for it. Between them: the thing is not tired, we are.", moved:9, replies:[{n:"Jonah Weil", t:"“The thing is not tired, we are.” Ouch, and yes."}]},
 {id:"y2", on:"pv", name:"Marta Ilić", at:"9:26 a.m.", text:"Chesterton wants you to say do it again. Hammershøi actually did it — the same four doors, sixty times. One of them is an argument and the other is a life.", moved:12, replies:[]},
 {id:"y3", on:"vp", name:"Samuel Achterberg", at:"7:58 a.m.", text:"An empty floor with light on it is a common bush. He took his shoes off and painted it. She would have known exactly what he was doing.", moved:11, replies:[{n:"Ada Okonkwo", t:"A common bush. That’s the whole day."}]},
 {id:"y4", on:"whole", name:"Ada Okonkwo", at:"5:47 a.m.", text:"A bush, a sunrise, a floor. Nothing in today’s three is unusual. All that happens is that somebody looks at it as though for the first time, and the trick is that they had to look at it for the hundredth time first.", moved:15, replies:[{n:"Tomás Reyes", t:"The hundredth time first. Keeping that."},{n:"Lena Vogt", t:"Familiarity isn’t the enemy, then. Inattention is."}]},
 {id:"y5", on:"whole", name:"Tomás Reyes", at:"10:04 a.m.", text:"All three are about home: her Italian house, his sun over the same roofs, his four rooms. And the reading today is about a man they wouldn’t listen to at home. Maybe you only see the familiar if you let it be strange again.", moved:8, replies:[]}
];
const POSTS_NEW={
 browning:[{id:"e1", name:"Samuel Achterberg", at:"7:12 a.m.", first:"Blackberries. I have had a very productive week of picking blackberries.",
    later:{when:"later that morning", text:"Went out to the garden and stood in front of the hedge like an idiot for five minutes. Didn’t see God. Did see the hedge, which I have not done since April."}, moved:13, replies:[{n:"Lena Vogt", t:"“Did see the hedge” is doing a lot of work here and I love it."}]},
  {id:"e2", name:"Marta Ilić", at:"8:40 a.m.", first:"“Only he who sees, takes off his shoes.” Taking off your shoes is the part nobody wants. It means you’re staying, and it means the ground is not yours.", moved:9, replies:[]},
  {id:"e3", name:"Jonah Weil", at:"6:31 a.m.", first:"She wrote eleven thousand lines to get to six that everybody quotes. That is also a lesson about the common bush.", moved:7, replies:[{n:"Ada Okonkwo", t:"Eleven thousand lines of hedge."}]}],
 chesterton:[{id:"g1", name:"Ada Okonkwo", at:"5:41 a.m.", first:"Third night in a row on the same ward, same corridor, same charts. “Do it again” is either a curse or a vocation and today I get to decide which.",
    later:{when:"an hour later", text:"Said it out loud in the car park at six. Do it again. Felt ridiculous. Went back in less tired than I went out."}, moved:17, replies:[{n:"Samuel Achterberg", t:"Said it out loud in the car park — that’s the whole of religion right there."},{n:"Marta Ilić", t:"Carrying this into the workshop."}]},
  {id:"g2", name:"Tomás Reyes", at:"7:19 a.m.", first:"“Our Father is younger than we.” I have never once thought of God as young. I have thought of him as old, patient, slightly tired. That’s my projection, not his age.", moved:12, replies:[]},
  {id:"g3", name:"Lena Vogt", at:"8:02 a.m.", first:"Monotony as too much life rather than too little. I’d like to try believing that about the nine months I’ve spent on chapter three.", moved:8, replies:[{n:"Jonah Weil", t:"Chapter three is the sun. Do it again."}]}],
 hammershoi:[{id:"s1", name:"Marta Ilić", at:"6:58 a.m.", first:"No people, no story, no jug even. Just the floor doing what the floor does at that hour. It takes nerve to paint that and call it finished.",
    later:{when:"in the workshop", text:"Sat on the floor of the studio at four o’clock, which I never do, because the light comes across it then. Made nothing. Not wasted."}, moved:14, replies:[{n:"Tomás Reyes", t:"“Made nothing. Not wasted.” Framing that."}]},
  {id:"s2", name:"Jonah Weil", at:"9:11 a.m.", first:"Sixty paintings of four rooms. Either the man had no imagination or he had the only kind that matters.", moved:11, replies:[]},
  {id:"s3", name:"Samuel Achterberg", at:"7:35 a.m.", first:"Grey, grey, grey, and then that one warm parallelogram. He waited for that. Eleven years in the same flat is a long time to wait for the light to be in the right place.", moved:10, replies:[{n:"Ada Okonkwo", t:"That one warm parallelogram."}]}]
};
const LABELS_NEW={
 browning:{life:"1806–1861", medium:"Blank verse · Aurora Leigh, Book Seventh", ref:"First published 1856, London", blurb:"A novel in verse, written mostly at Casa Guidi in Florence. These six lines turn on Exodus 3: the bush burns for everyone, but only the one who sees takes off his shoes."},
 chesterton:{life:"1874–1936", medium:"Prose · from “The Ethics of Elfland”", ref:"Orthodoxy, 1908", blurb:"Written as an answer to a critic’s dare. The chapter argues that in fairy tales nothing happens by necessity — which is why the sunrise can be an act of will rather than a mechanism."},
 hammershoi:{life:"1864–1916", medium:"Oil on canvas · 46.5 × 52 cm", ref:"SMK — Statens Museum for Kunst, Copenhagen", blurb:"One of about sixty interiors he painted of the flat at Strandgade 30, where he lived from 1898 to 1909 and worked without a studio."}
};
const PLACES_NEW={browning:["FLORENCE","1856"], chesterton:["LONDON","1908"], hammershoi:["KØBENHAVN","1901"]};
const FIRSTLINE_NEW={browning:"Earth’s crammed with heaven, and every common bush afire with God", chesterton:"It is possible that God says every morning, “Do it again” to the sun."};
const GLY_NEW={
 browning:'<path d="M0 8c-6-4-9-10-6-14 2-3 6-2 6 2 0-4 4-5 6-2 3 4 0 10-6 14z" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linejoin="round"/><path d="M-7 9h14" stroke="currentColor" stroke-width="1.3"/>',
 chesterton:'<circle cx="0" cy="0" r="6" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M0 -11v3M0 8v3M-11 0h3M8 0h3M-8-8l2 2M6 6l2 2M8-8l-2 2M-6 6l-2 2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>',
 hammershoi:'<rect x="-9" y="-9" width="18" height="18" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M-4 9l5-7 4 4" stroke="currentColor" stroke-width="1.3" fill="none" stroke-linejoin="round"/>'
};
const RIB_NEW={browning:"#6b4a7d", chesterton:"#2f5d50", hammershoi:"#6b6355"};
const ART7={
 browning:`<path d="M150,300 c-40-26-56-58-38-82 14-18 34-12 38 10 4-22 24-28 38-10 18 24 2 56-38 82z" fill="var(--gold)" opacity=".18"/><path d="M150,300 c-28-20-40-44-28-60 10-13 24-9 28 7 4-16 18-20 28-7 12 16 0 40-28 60z" fill="none" stroke="currentColor" stroke-width="1.1" opacity=".35"/><path d="M96,318h108" stroke="currentColor" stroke-width="1.2" opacity=".3"/>${[0,1,2,3,4].map(i=>`<path d="M${112+i*20},318 c0,-14 ${i%2?6:-6},-26 0,-40" fill="none" stroke="currentColor" stroke-width=".9" opacity=".22"/>`).join("")}<circle cx="150" cy="120" r="30" fill="none" stroke="currentColor" stroke-width="1" opacity=".25"/>`,
 chesterton:`<circle cx="140" cy="140" r="46" fill="var(--gold)" opacity=".18"/><circle cx="140" cy="140" r="46" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".35"/>${[0,1,2,3,4,5,6,7].map(i=>{const a=i*45*Math.PI/180; return `<line x1="${140+Math.cos(a)*56}" y1="${140+Math.sin(a)*56}" x2="${140+Math.cos(a)*76}" y2="${140+Math.sin(a)*76}" stroke="currentColor" stroke-width="1.1" opacity=".3"/>`;}).join("")}${[0,1,2].map(i=>`<path d="M60,${250+i*34} a80,26 0 0 1 160,0" fill="none" stroke="currentColor" stroke-width="1" opacity="${.3-i*.07}"/>`).join("")}`
};
const PAST=[

 {id:"dickinson", mk:"dickinson", closed:true, day:"Tuesday, September 22", kind:"Poem", title:"There’s a certain Slant of light", maker:"Emily Dickinson", date:"c. 1861",
  poem:"There’s a certain Slant of light,\nWinter Afternoons –\nThat oppresses, like the Heft\nOf Cathedral Tunes –\n\nHeavenly Hurt, it gives us –\nWe can find no scar,\nBut internal difference –\nWhere the Meanings, are –\n\nNone may teach it – Any –\n’Tis the seal Despair –\nAn imperial affliction\nSent us of the Air –\n\nWhen it comes, the Landscape listens –\nShadows – hold their breath –\nWhen it goes, ’tis like the Distance\nOn the look of Death –", poemNote:"The whole poem · Fr320, J258",
  story:["Dickinson wrote this around 1861 and never printed it. She copied her poems in ink onto folded sheets, stitched them into small booklets now called <span class=\"def\" data-def=\"A small hand-sewn booklet of folded sheets. Dickinson made about forty of them and told almost no one.\">fascicles</span>, and put them in a drawer. This one sits in Fascicle 13.",
   "Fewer than a dozen of her roughly 1,800 poems appeared in print while she lived, most of them without her name and edited by other hands.",
   "It was first published in 1890, four years after her death, in <i>Poems by Emily Dickinson</i>, edited by Mabel Loomis Todd and Thomas Wentworth Higginson. They gave it the title “Winter” and replaced her dashes with commas. Thomas H. Johnson’s 1955 edition put the dashes back, which is how you are reading it here."]},
 {id:"thoreau", mk:"thoreau", closed:true, day:"Tuesday, September 22", kind:"Passage", title:"An infinite expectation of the dawn", maker:"Henry David Thoreau", date:"Walden, 1854",
  quote:"Morning is when I am awake and there is a dawn in me. Moral reform is the effort to throw off sleep. … We must learn to reawaken and keep ourselves awake, not by mechanical aids, but by an infinite expectation of the dawn, which does not forsake us in our soundest sleep.", cite:"“Where I Lived, and What I Lived For,” Walden",
  notebook:["4 July 1845: moves to the pond.","6 September 1847: moves back to town.","1846–1854: seven rounds of revision.","9 August 1854: the book is published."], notebookNote:"Dates from the Walden manuscript; the seven stages are the ones Digital Thoreau lays side by side",
  story:["Thoreau lived at Walden Pond for two years, two months and two days, in a house he built for about twenty-eight dollars. He left in September 1847 with a draft.",
   "Then he spent seven more years rewriting it. Scholars count seven stages of revision between 1846 and 1854; Digital Thoreau’s edition lets you watch the sentences change from one to the next.",
   "The passage about the dawn belongs to the chapter he rewrote most. A book about two years took nine years to make, and the man who wrote “simplify, simplify” kept complicating the pages until they were ready."]},
 {id:"vermeer", mk:"vermeer", closed:true, day:"Tuesday, September 22", kind:"Painting", title:"The Milkmaid", maker:"Johannes Vermeer", date:"c. 1658–1660", where:"Rijksmuseum, Amsterdam · 45.5 × 41 cm",
  plate:"p-milkmaid", palette:["#d8cfb8","#c8a13a","#2b5c90","#8a5a35"],
  story:["A kitchen maid pours milk from a jug. A window on the left does everything else: the bread, the wall, the seam of her sleeve. The canvas is smaller than a sheet of newspaper.",
   "In 2022 the Rijksmuseum scanned it with <span class=\"def\" data-def=\"Scans that map the chemical elements in paint, layer by layer, so the earlier stages of a picture can be read without touching it.\">macro-XRF and RIS</span>. Under the paint they found a rough sketch in light and dark, including a hasty thick black line beneath her left arm — evidence that Vermeer, long thought to have worked with cold precision, blocked the picture in quickly first.",
   "They also found what he took out: a rack of jugs on the wall behind her head, and a fire basket at the lower right, an object listed in the inventory of his own house. He painted them out and left the wall almost empty. What remains is a woman, a stream of milk and the light."]},

 {id:"hopkins", mk:"hopkins", closed:true, day:"Thursday, September 17", kind:"Poem", title:"God’s Grandeur", maker:"Gerard Manley Hopkins", date:"1877",
  poem:"The world is charged with the grandeur of God.\n    It will flame out, like shining from shook foil;\n    It gathers to a greatness, like the ooze of oil\nCrushed. Why do men then now not reck his rod?\nGenerations have trod, have trod, have trod;\n    And all is seared with trade; bleared, smeared with toil;\n    And wears man’s smudge and shares man’s smell: the soil\nIs bare now, nor can foot feel, being shod.\n\nAnd for all this, nature is never spent;\n    There lives the dearest freshness deep down things;\nAnd though the last lights off the black West went\n    Oh, morning, at the brown brink eastward, springs —\nBecause the Holy Ghost over the bent\n    World broods with warm breast and with ah! bright wings.", poemNote:"The whole sonnet · 1877",
  story:["When Hopkins became a Jesuit in 1868 he burned copies of his poems and resolved to write no more unless his superiors wished it. For seven years he kept that silence.",
   "In 1875 his rector remarked that someone ought to write a poem on the wreck of the Deutschland, in which five exiled nuns had drowned. Hopkins took it as permission. “God’s Grandeur” came two years later, in a burst of sonnets written in Wales.",
   "Almost none of his poems appeared while he lived. His friend Robert Bridges published them in 1918, nearly thirty years after Hopkins died."]},
 {id:"handel", mk:"handel", closed:true, day:"Saturday, September 19", kind:"Passage", title:"Messiah in twenty-four days", maker:"George Frideric Handel", date:"1741",
  notebook:["22 August 1741: begins the first part.","28 August: first part finished.","6 September: the second part.","12 September: the third.","14 September: the score is complete."], notebookNote:"Dates from Handel’s autograph score",
  quote:"Comfort ye, comfort ye my people, saith your God.", cite:"Isaiah 40:1, the opening words of Messiah",
  story:["Charles Jennens, a wealthy admirer, compiled the words from the King James Bible and the Book of Common Prayer and sent them to Handel in the summer of 1741, hoping for a setting worthy of them.",
   "Handel wrote the whole score in about twenty-four days. Then he took it to Dublin, where it was first performed on 13 April 1742 as a charity concert; the proceeds helped free prisoners held for debt and supported two hospitals.",
   "Jennens grumbled that Handel had rushed it. It has hardly stopped being performed since."]},
 {id:"keats", mk:"keats", closed:true, day:"Sunday, September 20", kind:"Poem", title:"On First Looking into Chapman’s Homer", maker:"John Keats", date:"1816",
  poem:"Much have I travell’d in the realms of gold,\nAnd many goodly states and kingdoms seen;\nRound many western islands have I been\nWhich bards in fealty to Apollo hold.\nOft of one wide expanse had I been told\nThat deep-brow’d Homer ruled as his demesne;\nYet did I never breathe its pure serene\nTill I heard Chapman speak out loud and bold:\n\nThen felt I like some watcher of the skies\nWhen a new planet swims into his ken;\nOr like stout Cortez when with eagle eyes\nHe stared at the Pacific—and all his men\nLook’d at each other with a wild surmise—\nSilent, upon a peak in Darien.", poemNote:"The whole sonnet · 1816",
  story:["One October night in 1816, Keats and his friend Charles Cowden Clarke sat up until dawn reading George Chapman’s 1616 translation of Homer aloud, shouting over the best passages.",
   "Keats walked home through London at daybreak. By ten that morning a sonnet was waiting on Clarke’s breakfast table. Keats was twenty and had never read a word of Greek.",
   "It is a poem about being set on fire by someone else’s work, which was itself a translation of someone else’s work. (He also got the explorer wrong: it was Balboa, not Cortez, who first saw the Pacific. Nobody minds.)"]},
 {id:"matthew", mk:"matthew", closed:true, day:"Monday, September 21", kind:"Painting", title:"The Calling of Saint Matthew", maker:"Caravaggio", date:"1599–1600", where:"San Luigi dei Francesi, Rome",
  plate:"p-matthew", palette:["#0e0a07","#5b4630","#d9bb7e","#8a2f22"], quote:"“Follow me.” And he arose, and followed him.", cite:"Matthew 9:9",
  story:["Caravaggio was not yet thirty and known for tavern scenes and fortune-tellers when he won his first public commission: two canvases for the Contarelli Chapel, a few streets from the Pantheon.",
   "He painted the calling of a tax collector as a scene from a Roman backstreet: men in fashionable clothes counting coins at a table. A shaft of light cuts in beside a figure almost hidden at the edge. His hand borrows the gesture of Adam’s hand from Michelangelo’s Sistine ceiling.",
   "The light in the picture falls from the same side as the chapel’s real window. The canvas still hangs where it was made to hang, and visitors still drop a coin in the box to light it."]},
 {id:"james", mk:"james", closed:true, day:"Friday, September 18", kind:"Passage", title:"The germ of The Spoils of Poynton", maker:"Henry James", date:"1893–1897",
  notebook:["Christmas Eve, a London dinner table.","A neighbour tells of a mother and her son","quarrelling over the furniture of a great house.","Ten words in, James stops listening.","He has what he needs."], notebookNote:"Margin note by Poiesis, after James’s preface to the novel",
  quote:"We work in the dark—we do what we can—we give what we have. Our doubt is our passion and our passion is our task. The rest is the madness of art.", cite:"Henry James, “The Middle Years,” 1893",
  story:["James called the seed of a story its <i>germ</i> or <i>donnée</i>: the thing given. In his preface to <i>The Spoils of Poynton</i> he describes hearing one at a Christmas Eve dinner and wishing the teller would stop, because every further detail spoiled what his imagination was already doing with it.",
   "He kept these seeds in private notebooks. In them he sometimes addressed his own creative spirit as <i>mon bon</i>, “my good one,” coaxing it like an old friend before a hard morning’s work.",
   "The line above comes from a story he wrote the same year, about a dying novelist who fears he never did his real work. It is the closest James came to a creed."]},
 {id:"starry", mk:"starry", closed:true, day:"Saturday, September 12", kind:"Painting", title:"The Starry Night", maker:"Vincent van Gogh", date:"June 1889", where:"Museum of Modern Art, New York",
  plate:"p-starry", palette:["#1f3566","#8eaad2","#f6e58a","#17251f"], quote:"This morning I saw the countryside from my window a long time before sunrise, with nothing but the morning star, which looked very big.", cite:"Letter to his brother Theo, Saint-Rémy, c. 2 June 1889",
  story:["In May 1889 van Gogh admitted himself to the asylum of Saint-Paul-de-Mausole in Saint-Rémy. From his east-facing bedroom window he could see a walled wheat field and the hills beyond, and he painted that view again and again.",
   "He wasn’t allowed to paint in his bedroom, so he made sketches there and worked on canvases by day in a ground-floor room given to him as a studio. The night sky, the village and its steeple were composed from memory and imagination.",
   "He mentioned the painting only briefly in his letters and did not count it among his successes. It is now one of the most reproduced images in the world."]},
 {id:"rublev", mk:"rublev", closed:true, day:"Sunday, September 13", kind:"Painting", title:"The Trinity (Hospitality of Abraham)", maker:"Andrei Rublev", date:"c. 1411–1425", where:"State Tretyakov Gallery, Moscow",
  plate:"p-rublev", palette:["#c9a65a","#3d5d86","#7b5a3a","#6d8354"], quote:"And he lift up his eyes and looked, and, lo, three men stood by him.", cite:"Genesis 18:2",
  story:["Icon painters did not set out to be original. They worked from patterns handed down, repeating the images of the painters before them. Tradition says they prepared with prayer and fasting, and most never signed their work.",
   "Rublev’s subject had been painted many times: three strangers visiting Abraham at the oaks of Mamre. He left out Abraham and Sarah, the servants and the slaughtered calf, and kept only the three guests at the table, their heads inclined toward one another.",
   "The front of the table is left open, and many viewers read that empty place as meant for them. The most famous icon of its tradition is, in form, an act of faithful imitation."]}
];

const ALL=[...MUSES,...PAST]; const MUSE=Object.fromEntries(ALL.map(m=>[m.id,m]));

const PEOPLE={
 "Samuel Achterberg":{c:"#3d5d86", role:"Retired surveyor, writes sonnets · Leiden", top:"keats", ring:"ink", badge:"Scribe"},
 "Lena Vogt":{c:"#6b4a7d", role:"Paralegal, drafting a first novel · Chicago", top:"james", ring:"laurel", badge:"Reader"},
 "Marta Ilić":{c:"#8a5a3b", role:"Potter · Zagreb", top:"matthew", ring:"terracotta", badge:"Apprentice"},
 "Jonah Weil":{c:"#4f6b5a", role:"Teaches Latin · Philadelphia", top:"hopkins", ring:"gold", badge:"Moderator"},
 "Ada Okonkwo":{c:"#5b7a4a", role:"Night-shift nurse, sketches on breaks · Houston", top:"starry", ring:"fresco", badge:"Early riser"},
 "Tomás Reyes":{c:"#9c2a1f", role:"Student, keeps a commonplace book · Rome", top:"handel", ring:"gold", badge:"Curator"}
};
const GOT={"Samuel Achterberg":"Sep 3","Lena Vogt":"Aug 19","Marta Ilić":"Sep 10","Jonah Weil":"Sep 17","Ada Okonkwo":"Sep 14","Tomás Reyes":"Sep 19"};
const POSTS={
 dickinson:[{id:"n1", name:"Samuel Achterberg", at:"7:12 a.m.", first:"Four o’clock in January, the hall light off, and the whole house suddenly means something. She got it exactly and I never had a word for it.",
    later:{when:"later that morning", text:"Looked it up: she never printed it. Wrote it, stitched it into a booklet, put it in a drawer. Sixty years of afternoons in that drawer."}, moved:11, replies:[{n:"Lena Vogt", t:"“Where the Meanings, are” — with that comma. I keep stopping there."}]},
  {id:"n2", name:"Marta Ilić", at:"8:40 a.m.", first:"Heavenly Hurt. My grandmother would have understood that as one word.", moved:6, replies:[]},
  {id:"n3", name:"Jonah Weil", at:"6:31 a.m.", first:"“The Landscape listens.” Everything in the room stops being scenery and starts being an audience. That happened to me once at a funeral.", moved:8, replies:[{n:"Ada Okonkwo", t:"Starts being an audience. Oh."}]}],
 thoreau:[{id:"t1", name:"Ada Okonkwo", at:"5:41 a.m.", first:"Night shift ends at six. Most mornings I am awake and there is no dawn in me at all. He is describing something I have to choose, not something I have.",
    later:{when:"an hour later", text:"Drove home the long way past the reservoir and sat in the car until it got light. Infinite expectation is a lot to ask. Ten minutes of it is not."}, moved:15, replies:[{n:"Samuel Achterberg", t:"Ten minutes of it is not. Thank you."},{n:"Marta Ilić", t:"This is the one I’ll carry today."}]},
  {id:"t2", name:"Tomás Reyes", at:"7:19 a.m.", first:"Two years at the pond and seven years rewriting it. The man who said simplify kept the sentences on the operating table for a decade. Comforting, if you are slow.", moved:9, replies:[]},
  {id:"t3", name:"Lena Vogt", at:"8:02 a.m.", first:"“Moral reform is the effort to throw off sleep.” I have called it discipline, procrastination, burnout. Sleep is the better word and the harder one.", moved:7, replies:[{n:"Jonah Weil", t:"It makes waking a moral act rather than a mood."}]}],
 vermeer:[{id:"v1", name:"Marta Ilić", at:"6:58 a.m.", first:"She is not thinking about being looked at. She is thinking about the milk. That is the whole picture and most of what I want.",
    later:{when:"in the workshop", text:"Cleared the shelf behind the wheel. Took down every jug except the one I use. The light on the wall changed immediately."}, moved:13, replies:[{n:"Tomás Reyes", t:"You did the Vermeer edit on your own room."}]},
  {id:"v2", name:"Jonah Weil", at:"9:11 a.m.", first:"He painted a rack of jugs and then painted it out. Everything I write needs that second decision and never gets it.", moved:10, replies:[]},
  {id:"v3", name:"Samuel Achterberg", at:"7:35 a.m.", first:"A thick black line under her arm, hidden for three hundred years. Even Vermeer sketched roughly first. I feel personally forgiven.", moved:12, replies:[{n:"Ada Okonkwo", t:"Personally forgiven — same."}]}],
 keats:[{id:"k1", name:"Samuel Achterberg", at:"7:12 a.m.", first:"Jealous of a twenty-year-old for about a minute. Then grateful to him for the rest of the morning.",
    later:{when:"later that day", poem:"I never read the Greek. I read a man\nwho read the Greek and set it down in oak;\nhis English creaks like timber. I began\nwhere Keats began: warm hands, and borrowed smoke."}, moved:9, replies:[{n:"Ada Okonkwo", t:"Borrowed smoke. Saving this."},{n:"Tomás Reyes", t:"Creaks like timber is exactly Chapman."}]},
  {id:"k2", name:"Lena Vogt", at:"7:40 a.m.", first:"He got the explorer wrong and it didn’t matter. Most freeing thing I’ve read all week.", moved:6, replies:[{n:"Jonah Weil", t:"Permission to be wrong on the way to something true."}]},
  {id:"k3", name:"Tomás Reyes", at:"8:15 a.m.", first:"Homer to Chapman to Keats to me, on a tram. A relay race nobody planned.", moved:4, replies:[]}],
 matthew:[{id:"c1", name:"Marta Ilić", at:"6:55 a.m.", first:"The light lands on the man who hasn’t noticed yet.", later:{when:"that afternoon", text:"Moved my wheel into the corridor, where the light comes in sideways at four. Three bowls today, all leaning a little toward the door."}, moved:11, replies:[{n:"Jonah Weil", t:"“Leaning toward the door” is the whole painting."}]},
  {id:"c2", name:"Jonah Weil", at:"8:03 a.m.", first:"I can’t tell which one is Matthew. Apparently scholars argue about it too. Maybe that’s the point.", moved:5, replies:[]},
  {id:"c3", name:"Ada Okonkwo", at:"6:10 a.m.", first:"Night shift. Someone is always pointing, and someone always hasn’t looked up yet.", moved:7, replies:[{n:"Marta Ilić", t:"Tonight, look up."}]}],
 james:[{id:"h1", name:"Lena Vogt", at:"7:21 a.m.", first:"Ten words and he stopped listening. I want that kind of trust in my own imagination.", later:{when:"on the train home", text:"Started a list of données. Today’s: a woman returning a wedding dress, alone, very calm. That’s chapter two."}, moved:8, replies:[{n:"Samuel Achterberg", t:"Calm is the frightening part. Keep going."}]},
  {id:"h2", name:"Marta Ilić", at:"9:02 a.m.", first:"I once stopped listening to a customer for the same reason. The bowl turned out better than the story.", moved:3, replies:[]}],
 starry:[{id:"s1", name:"Ada Okonkwo", at:"5:52 a.m.", first:"I work nights. I know exactly this hour.", later:{when:"that morning", sketch:true, text:"Parking garage, level 4, 5:40 a.m. Only one star made it through the city glow, but it looked very big."}, moved:12, replies:[{n:"Lena Vogt", t:"This is the one I’ll remember from today."}]},
  {id:"s2", name:"Jonah Weil", at:"7:30 a.m.", first:"“Which looked very big.” Such a plain sentence for such a sky.", moved:5, replies:[]}],
 rublev:[{id:"r1", name:"Tomás Reyes", at:"7:05 a.m.", first:"The open place at the front of the table. Who have I left no room for?", later:{when:"that evening", text:"Put a second chair at my desk. Nobody has sat in it yet. I wrote from there instead."}, moved:10, replies:[{n:"Marta Ilić", t:"A second chair. I want to make the cup for whoever sits in it."}]},
  {id:"r2", name:"Samuel Achterberg", at:"7:48 a.m.", first:"Three heads bowed, and not one of them is asking for anything.", moved:6, replies:[]}],
 hopkins:[{id:"o1", name:"Jonah Weil", at:"6:40 a.m.", first:"Shook foil. I went and found some in a kitchen drawer. It does flame out.", moved:18, replies:[{n:"Marta Ilić", t:"I did the same, then couldn’t stop."},{n:"Samuel Achterberg", t:"Seven years of silence, and then this."},{n:"Ada Okonkwo", t:"Doing this tonight."}]},
  {id:"o2", name:"Lena Vogt", at:"7:15 a.m.", first:"Seven years of not writing, and the poem still sounds like it had been waiting for him.", moved:14, replies:[{n:"Tomás Reyes", t:"The silence was part of the poem."}]},
  {id:"o3", name:"Ada Okonkwo", at:"4:05 a.m.", first:"Read it between rounds. “Dearest freshness” is the first coffee.", moved:9, replies:[]}],
 handel:[{id:"d1", name:"Samuel Achterberg", at:"7:02 a.m.", first:"Twenty-four days. I’ve been on one sonnet for three weeks. Encouraging, and not.", moved:15, replies:[{n:"Lena Vogt", t:"The sonnet will be yours, though."},{n:"Jonah Weil", t:"Jennens grumbled. Someone always grumbles."}]},
  {id:"d2", name:"Tomás Reyes", at:"7:30 a.m.", first:"It started as a gift to prisoners. That’s the part I’ll keep.", moved:13, replies:[{n:"Marta Ilić", t:"A gift for a gift."}]}]
};
const STICKERS={
 dickinson:{series:"Dickinson", ed:1, name:"A Certain Slant", svg:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="#2e3b4a"/><path d="M8 2 L20 2 L40 42 L28 42 Z" fill="#e9dfc0" opacity=".78"/><path d="M14 44c3-10 4-18 4-26" fill="none" stroke="#1d2731" stroke-width="1.6"/><path d="M18 26c3-3 6-4 9-4M18 32c-3-2-6-3-9-3" fill="none" stroke="#1d2731" stroke-width="1.2"/></svg>'},
 thoreau:{series:"Thoreau", ed:1, name:"Expectation of the Dawn", svg:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="#1f3140"/><path d="M1 28a23 23 0 0 0 46 0z" fill="#2c4a58"/><circle cx="24" cy="28" r="9" fill="#f0c274"/><path d="M6 33h36M10 38h28" stroke="#f0c274" stroke-width="1.2" opacity=".65"/><path d="M24 6v6M11 11l4 4M37 11l-4 4" stroke="#f0c274" stroke-width="1.4" stroke-linecap="round" opacity=".8"/></svg>'},
 vermeer:{series:"Vermeer", ed:1, name:"The Pour", svg:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="#d8cfb8"/><path d="M0 0 L22 0 L6 30 L0 26 Z" fill="#fdf8e8" opacity=".8"/><path d="M17 14c-4 2-5 6-3 9l3 5h9l3-6c1-4-1-7-5-8z" fill="#c8a13a"/><path d="M26 25c1 5 1 9 0 13" fill="none" stroke="#fffdf6" stroke-width="2.2" stroke-linecap="round"/><path d="M20 40h12l-1 6H21z" fill="#2b5c90"/></svg>'},
 keats:{series:"Keats", ed:3, name:"Watcher of the Skies", svg:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="#1f3566"/><circle cx="24" cy="25" r="8" fill="#e9c46a"/><ellipse cx="24" cy="25" rx="15" ry="4" fill="none" stroke="#f3e2b0" stroke-width="1.6" transform="rotate(-18 24 25)"/><circle cx="11" cy="12" r="1.3" fill="#fff"/><circle cx="36" cy="10" r="1" fill="#fff"/><circle cx="38" cy="36" r="1.2" fill="#fff"/></svg>'},
 matthew:{series:"Caravaggio", ed:1, name:"The Shaft of Light", svg:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="#15100b"/><path d="M26 1 L40 6 L22 47 L10 42 Z" fill="#e3c687" opacity=".85"/><circle cx="17" cy="32" r="5" fill="#8a2f22"/></svg>'},
 james:{series:"Henry James", ed:2, name:"Donnée", svg:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="#f3ead6" stroke="#b8a27c"/><path d="M34 9c-9 3-15 12-18 25l2 1c3-6 8-10 14-12-4 0-7 1-9 2 3-5 7-10 11-16z" fill="#3a2f26"/><path d="M13 38h22" stroke="#3a2f26" stroke-width="1.4"/></svg>'},
 starry:{series:"Van Gogh", ed:4, name:"Morning Star", svg:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="#23407a"/><path d="M6 30c8-6 16 4 24-2s10-6 14-4" fill="none" stroke="#8eaad2" stroke-width="2"/><circle cx="32" cy="15" r="5" fill="#f6e58a"/><circle cx="32" cy="15" r="8" fill="none" stroke="#f6e58a" stroke-width="1" opacity=".6"/><path d="M12 47c2-10 4-18 6-26 2 8 3 16 4 26z" fill="#13241a"/></svg>'},
 rublev:{series:"Rublev", ed:1, name:"Three at the Table", svg:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="#caa75c"/><circle cx="14" cy="26" r="6" fill="#7b5a3a"/><circle cx="24" cy="20" r="6" fill="#3d5d86"/><circle cx="34" cy="26" r="6" fill="#6d8354"/><rect x="12" y="34" width="24" height="3" rx="1" fill="#f1e3bb"/></svg>'},
 hopkins:{series:"Hopkins", ed:1, name:"Shook Foil", svg:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="#2c3b2e"/><path d="M24 8l4 10 10 1-8 7 3 11-9-6-9 6 3-11-8-7 10-1z" fill="#d9dde0" stroke="#fff" stroke-width=".6"/><path d="M24 8l4 10 10 1" fill="none" stroke="#f3d77a" stroke-width="1.2"/></svg>'},
 handel:{series:"Handel", ed:2, name:"Twenty-Four Days", svg:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="#f1e6cc" stroke="#b99a64"/><g stroke="#3a2f26" stroke-width="1"><path d="M9 17h30M9 21h30M9 25h30M9 29h30M9 33h30"/></g><circle cx="18" cy="29" r="2.6" fill="#3a2f26"/><path d="M20.4 29V15" stroke="#3a2f26" stroke-width="1.3"/><circle cx="29" cy="23" r="2.6" fill="#3a2f26"/><path d="M31.4 23V11" stroke="#3a2f26" stroke-width="1.3"/><text x="24" y="44" font-size="6" text-anchor="middle" fill="#8a2f22" font-family="serif">24</text></svg>'}
};
/* ---------- Maker sets: six stickers a maker, each tied to a real work or fact ---------- */
Object.assign(STICKERS,{
 "bb-bush":{series:"Barrett Browning", ed:1, name:"Every Common Bush", source:"Aurora Leigh, Book Seventh, 1856", svg:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="#2f4030"/><path d="M24 34c-9-5-13-13-9-19 3-4 8-3 9 2 1-5 6-6 9-2 4 6 0 14-9 19z" fill="#c9562f"/><path d="M24 34c-6-4-9-9-7-13 2-3 5-2 6 1 1-3 5-4 6-1 2 4-1 9-5 13z" fill="#f0c274"/><path d="M14 38h20" stroke="#9db08a" stroke-width="2" stroke-linecap="round"/></svg>'},
 "bb-verses":{series:"Barrett Browning", ed:1, name:"I Love Your Verses", source:"Robert Browning’s first letter to her, 10 January 1845", svg:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="#efe6d2"/><rect x="10" y="14" width="28" height="20" fill="#fffaf0" stroke="#8a7458" stroke-width="1.4"/><path d="M10 14l14 11 14-11" fill="none" stroke="#8a7458" stroke-width="1.4"/><path d="M33 33c3-6 5-11 4-16" stroke="#6b4a7d" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>'},
 "bb-portuguese":{series:"Barrett Browning", ed:1, name:"From the Portuguese", source:"Sonnets from the Portuguese, 1850", svg:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="#6b4a7d"/><rect x="12" y="11" width="24" height="26" rx="2" fill="#f3ead6"/><path d="M24 11v26" stroke="#c9b9a0" stroke-width="1.2"/><path d="M28 11v20l4-3 4 3V11z" fill="#c9562f"/><path d="M16 18h5M16 22h5M16 26h4" stroke="#8a7458" stroke-width="1.2" stroke-linecap="round"/></svg>'},
 "bb-secret":{series:"Barrett Browning", ed:1, name:"Married in Secret", source:"She married Robert Browning secretly, 12 September 1846", svg:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="#2b2233"/><circle cx="19" cy="24" r="8" fill="none" stroke="#c9a152" stroke-width="2.4"/><circle cx="29" cy="24" r="8" fill="none" stroke="#c9a152" stroke-width="2.4"/><path d="M8 38c5-3 27-3 32 0" stroke="#6b4a7d" stroke-width="2" fill="none"/></svg>'},
 "bb-casaguidi":{series:"Barrett Browning", ed:1, name:"Casa Guidi", source:"Their house in Florence; Casa Guidi Windows, 1851", svg:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="#c98f5a"/><rect x="13" y="10" width="22" height="28" fill="#f2e3cb" stroke="#8a4b2e" stroke-width="1.4"/><rect x="18" y="16" width="12" height="14" fill="#3a2a1c"/><path d="M18 23h12M24 16v14" stroke="#f2e3cb" stroke-width="1.4"/><path d="M13 10l11-5 11 5" fill="none" stroke="#8a4b2e" stroke-width="1.6"/></svg>'},
 "bb-flush":{series:"Barrett Browning", ed:1, name:"Flush", source:"Flush, her cocker spaniel", svg:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="#e3d5bb"/><path d="M16 20c0-5 4-8 9-8s9 3 9 8v6c0 4-3 7-9 7s-9-3-9-7z" fill="#8a5a35"/><path d="M14 18c-3 2-3 9 0 12 2 2 3-1 3-4z" fill="#6b4425"/><path d="M34 18c3 2 3 9 0 12-2 2-3-1-3-4z" fill="#6b4425"/><circle cx="21" cy="24" r="1.6" fill="#2a2018"/><circle cx="28" cy="24" r="1.6" fill="#2a2018"/><path d="M24 28l-2 2h4z" fill="#2a2018"/></svg>'},
 "gk-again":{series:"Chesterton", ed:1, name:"Do It Again", source:"Orthodoxy, ch. IV, 1908", svg:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="#1f3140"/><circle cx="24" cy="25" r="8.5" fill="#f0c274"/><path d="M24 8a17 17 0 1 1-12 29" fill="none" stroke="#f0c274" stroke-width="2.2" stroke-linecap="round"/><path d="M18 33l-6 4 1-7z" fill="#f0c274"/></svg>'},
 "gk-elfland":{series:"Chesterton", ed:1, name:"The Ethics of Elfland", source:"Orthodoxy, ch. IV, 1908", svg:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="#24402f"/><path d="M16 38V22a8 8 0 0 1 16 0v16z" fill="#e8dcbf"/><path d="M24 22a4 4 0 0 0-4 4v12h8V26a4 4 0 0 0-4-4z" fill="#3a2a1c"/><circle cx="27" cy="32" r="1.2" fill="#e8dcbf"/><path d="M12 22l12-11 12 11" fill="none" stroke="#c9a152" stroke-width="2" stroke-linejoin="round"/></svg>'},
 "gk-heretics":{series:"Chesterton", ed:1, name:"Heretics", source:"Heretics, 1905", svg:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="#f1e6cc"/><rect x="10" y="26" width="28" height="5" fill="#8a2f22"/><rect x="12" y="20" width="24" height="5" fill="#2f5d50"/><rect x="14" y="14" width="20" height="5" fill="#3d5d86"/><path d="M10 33h28" stroke="#8a7458" stroke-width="1.6"/></svg>'},
 "gk-thursday":{series:"Chesterton", ed:1, name:"The Man Who Was Thursday", source:"The Man Who Was Thursday, 1908", svg:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="#221c17"/><ellipse cx="24" cy="30" rx="15" ry="3.4" fill="#111"/><path d="M15 30V18a9 9 0 0 1 18 0v12z" fill="#2c2620"/><path d="M13 22h22" stroke="#8a2f22" stroke-width="2.4"/><circle cx="19" cy="37" r="2" fill="#e8dcbf"/><circle cx="29" cy="37" r="2" fill="#e8dcbf"/></svg>'},
 "gk-brown":{series:"Chesterton", ed:1, name:"Father Brown", source:"The Innocence of Father Brown, 1911", svg:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="#3b3a36"/><path d="M24 9c9 0 15 8 15 16H9c0-8 6-16 15-16z" fill="#1b1a17"/><path d="M24 25v16" stroke="#d8d2c2" stroke-width="2.2"/><path d="M20 41c2 2 6 2 8 0" stroke="#d8d2c2" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M14 17h20" stroke="#d8d2c2" stroke-width="1.4"/></svg>'},
 "gk-lepanto":{series:"Chesterton", ed:1, name:"Lepanto", source:"“Lepanto,” 1911", svg:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="#2f5f8a"/><path d="M8 31h32l-5 7H13z" fill="#6b4425"/><path d="M24 8v23" stroke="#e8dcbf" stroke-width="1.8"/><path d="M24 10l11 7-11 5z" fill="#f1e6cc"/><path d="M24 12L14 18l10 4z" fill="#d8cbb0"/><path d="M6 36c5 2 10-2 14 0s9 2 14 0 5 0 8 1" fill="none" stroke="#9fc0d8" stroke-width="1.4"/></svg>'},
 "vh-floor":{series:"Hammershøi", ed:1, name:"Sunlight on the Floor", source:"Interior in Strandgade, Sunlight on the Floor, 1901 · SMK", svg:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="#cfcabc"/><rect x="6" y="6" width="36" height="22" fill="#ded8c8"/><path d="M6 28h36v16H6z" fill="#b3ab99"/><path d="M14 44l8-16h10l-10 16z" fill="#f6efd8"/><path d="M6 28h36" stroke="#8d8573" stroke-width="1.2"/></svg>'},
 "vh-strandgade":{series:"Hammershøi", ed:1, name:"Strandgade 30", source:"His flat in Christianshavn, 1898–1909; the house was finished in 1635", svg:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="#8d9a8f"/><rect x="11" y="14" width="26" height="26" fill="#e8e0cb"/><path d="M11 14l13-8 13 8" fill="#6b6355"/><rect x="15" y="19" width="6" height="8" fill="#5e6b62"/><rect x="27" y="19" width="6" height="8" fill="#5e6b62"/><rect x="21" y="31" width="6" height="9" fill="#6b5a45"/><text x="24" y="13" font-size="7" text-anchor="middle" fill="#e8e0cb" font-family="serif">30</text></svg>'},
 "vh-ida":{series:"Hammershøi", ed:1, name:"Ida Reading a Letter", source:"Ida Reading a Letter, 1899", svg:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="#b8b3a4"/><path d="M15 42c0-9 4-14 9-14s9 5 9 14z" fill="#2f2c26"/><circle cx="24" cy="21" r="6" fill="#e2d6c3"/><path d="M24 15c4 0 6 3 6 6h-12c0-3 2-6 6-6z" fill="#4a4137"/><rect x="26" y="26" width="9" height="7" fill="#f6efd8" transform="rotate(-8 26 26)"/></svg>'},
 "vh-sunbeams":{series:"Hammershøi", ed:1, name:"Sunbeams", source:"Sunbeams, 1901", svg:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="#ded8c8"/><rect x="13" y="8" width="22" height="20" fill="#f7f2e2" stroke="#8d8573" stroke-width="1.4"/><path d="M24 8v20M13 18h22" stroke="#8d8573" stroke-width="1.2"/><path d="M35 26L20 44M35 20L14 44" stroke="#f6e9c4" stroke-width="5" opacity=".75" stroke-linecap="round"/></svg>'},
 "vh-grey":{series:"Hammershøi", ed:1, name:"The Grey Palette", source:"His near-monochrome greys", svg:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="#6b6355"/><path d="M10 26a14 12 0 1 1 28 0c0 4-4 3-6 5s1 6-4 6c-9 0-18-4-18-11z" fill="#d8d2c2"/><circle cx="17" cy="21" r="2.6" fill="#8d8573"/><circle cx="24" cy="18" r="2.6" fill="#b3ab99"/><circle cx="31" cy="21" r="2.6" fill="#5e5748"/></svg>'},
 "vh-nostudio":{series:"Hammershøi", ed:1, name:"No Studio", source:"He had no studio; he painted in the rooms he lived in", svg:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="#cfcabc"/><path d="M24 10l-9 30M24 10l9 30M17 30h14" stroke="#6b5a45" stroke-width="2" fill="none" stroke-linecap="round"/><rect x="14" y="14" width="20" height="14" fill="#f7f2e2" stroke="#6b6355" stroke-width="1.4"/><path d="M17 26l5-6 4 4 3-3 4 5z" fill="#b3ab99"/></svg>'}
});
const SETS={
 browning:["bb-bush","bb-verses","bb-portuguese","bb-secret","bb-casaguidi","bb-flush"],
 chesterton:["gk-again","gk-elfland","gk-heretics","gk-thursday","gk-brown","gk-lepanto"],
 hammershoi:["vh-floor","vh-strandgade","vh-ida","vh-sunbeams","vh-grey","vh-nostudio"],
 dickinson:["dickinson"], thoreau:["thoreau"], vermeer:["vermeer"], keats:["keats"], matthew:["matthew"],
 james:["james"], starry:["starry"], rublev:["rublev"], hopkins:["hopkins"], handel:["handel"]
};
const MAKERNAME={browning:"Elizabeth Barrett Browning", chesterton:"G. K. Chesterton", hammershoi:"Vilhelm Hammershøi",
 dickinson:"Emily Dickinson", thoreau:"Henry David Thoreau", vermeer:"Johannes Vermeer", keats:"John Keats",
 matthew:"Caravaggio", james:"Henry James", starry:"Vincent van Gogh", rublev:"Andrei Rublev", hopkins:"Gerard Manley Hopkins", handel:"George Frideric Handel"};
if(BANK) MUSES.forEach(bankSticker);   /* the bank's makers, now that the tables exist */
function makerOf(m){ return (MUSE[m]||{}).mk || m; }
/* the sticker a muse has drawn for you, if any */
function drawnFor(mid){ return S.drawn[mid]||null; }
function ownedIds(){ return Object.keys(S.owned); }
function metMakers(){ const s=new Set(); Object.keys(S.owned).forEach(id=>{ const mk=Object.keys(SETS).find(k=>SETS[k].includes(id)); if(mk) s.add(mk); }); return [...s]; }
/* draw one sticker from this maker’s set that you don’t own; never a repeat */
function drawSticker(mid){
 const mk=makerOf(mid), set=SETS[mk]||[mid];
 const left=set.filter(id=>!S.owned[id]);
 const id=left.length?left[Math.floor(Math.random()*left.length)]:null;
 if(!id) return null;
 S.owned[id]={date:today(), from:mid}; S.drawn[mid]=id;
 return id;
}
function todaysDraws(){ return MUSES.map(m=>S.drawn[m.id]).filter(Boolean); }
function checkedToday(){ return S.pick.date===today()?S.pick.id:null; }
function setCheck(id){ S.pick={date:today(), id}; save(); }
const RINGS={none:{name:"No ring", css:"none"}, laurel:{name:"Laurel", css:"0 0 0 2px var(--surface), 0 0 0 4px #5f7f45, 0 0 0 5px #a9c08a"}, gold:{name:"Gold leaf", css:"0 0 0 2px var(--surface), 0 0 0 4px #c9a152"}, ink:{name:"Ink", css:"0 0 0 2px var(--surface), 0 0 0 4px #2a2420"}, terracotta:{name:"Terracotta", css:"0 0 0 2px var(--surface), 0 0 0 4px #c0714a"}, fresco:{name:"Fresco blue", css:"0 0 0 2px var(--surface), 0 0 0 4px #2f5f8a"}};
const BADGES=[
 {id:"Apprentice", how:"Everyone starts here", ok:()=>true},
 {id:"Reader", how:"Open five letters", ok:()=>true},
 {id:"Scribe", how:"Leave three first impressions", ok:()=>Object.keys(S.sealed).length>=3},
 {id:"Early riser", how:"Leave a first impression before 7 a.m.", ok:()=>Object.values(S.sealed).some(s=>new Date(s.at).getHours()<7)},
 {id:"Gilded", how:"Gild a sticker you own", ok:()=>Object.values(S.owned||{}).some(s=>s.gilt)},
 {id:"Curator", how:"By invitation", ok:()=>false},
 {id:"Moderator", how:"By invitation", ok:()=>false}];
const GLOSS={"ken":"Range of sight or knowledge.","surmise":"A guess made without much evidence.","Darien":"The Isthmus of Panama, then called Darién.","stout":"Brave and determined.","sestet":"The last six lines of a sonnet.",
 "Chapman":"George Chapman (c. 1559–1634), English poet and translator of Homer.","donnée":"French, “the given”: the idea or situation a story starts from.","germ":"A seed; the first small form from which something grows.","mon bon":"French, “my good one.”",
 "commission":"A paid order for a work of art.","Contarelli Chapel":"A side chapel in San Luigi dei Francesi, named for the cardinal whose estate paid for its paintings.","asylum":"Here, a hospital for the mentally ill.",
 "Mamre":"The place near Hebron where, in Genesis, Abraham welcomed three visitors.","icon":"A sacred image, usually painted on wood, in the Eastern Christian tradition.","Icon":"A sacred image, usually painted on wood, in the Eastern Christian tradition.",
 "foil":"Metal beaten into a thin, shining sheet.","Jesuit":"A member of the Society of Jesus, a Catholic religious order.","autograph score":"The composer’s own handwritten score.","libretto":"The words of an oratorio or opera."};
Object.assign(GLOSS,{"Heft":"Weight; the feel of something heavy.","fascicle":"A small hand-sewn booklet of folded sheets. Dickinson made about forty of them and told almost no one.","fascicles":"Small hand-sewn booklets of folded sheets. Dickinson made about forty of them and told almost no one.",
 "imperial":"Belonging to an emperor; here, an affliction that arrives with authority and cannot be refused.","Slant":"A line at an angle; here, low winter light coming in sideways.",
 "moral reform":"For Thoreau, the work of waking up rather than the work of behaving well.","macro-XRF":"A scan that maps the chemical elements in paint, layer by layer, so earlier stages of a picture can be read without touching it.",
 "RIS":"Reflectance imaging spectroscopy: light-based scanning that identifies pigments and reveals what lies beneath the surface.","underpainting":"The rough first layer of a picture, blocked in before the details.",
 "pentimento":"A change the painter made, still faintly visible under the finished surface.","Walden":"The pond near Concord, Massachusetts, and the book Thoreau made from two years beside it."});
if(BANK) MUSES.forEach(m=>{ if(m.gloss) Object.assign(GLOSS, m.gloss); });
const SEASONS={
 gathering:{name:"Gathering", line:"Collecting seeds. Nothing has to be good yet.", how:"Everything is open, full width: journal, scrapbook and idea board.", prompt:"Write down three things you saw or overheard this week that you can’t stop thinking about.", lead:"board"},
 tending:{name:"Tending", line:"Going back to old seeds and seeing what still breathes.", how:"A writing page stays open. Beside it, whatever you want to reread.", prompt:"Open something you wrote a month ago. Copy out the one line that is still alive, and write the next one.", lead:"journal"},
 weaving:{name:"Weaving", line:"Bringing things that have never met into the same room.", how:"A writing page stays open beside your board, so two ideas can meet on the page.", prompt:"Pick two things you kept that have nothing to do with each other. Write the paragraph that introduces them.", lead:"board"},
 giving:{name:"Giving", line:"Letting something finished go out into the world.", how:"A writing page stays open for finishing. Beside it, your journal of drafts.", prompt:"Finish one small thing today, even a paragraph, and give it to one person.", lead:"journal"}};
const SPACES={journal:"Journal", scrap:"Scrapbook", board:"Idea board"};
const LOOKS=[{id:"study",name:"Study",sw:["#e4d9c6","#b88a5c","#fdf9ef","#2f5d50"]},{id:"night",name:"Night desk",sw:["#1a1613","#3b2a1e","#efe2c4","#e2a64e"]},{id:"monastery",name:"Monastery",sw:["#ece2cb","#5e1a17","#f8f0dc","#b8913a"]},{id:"roman",name:"Roman terracotta",sw:["#e7c79c","#c0714a","#f7eddc","#2f5f8a"]},{id:"garden",name:"Garden",sw:["#dbe2cf","#6f7f55","#fbfaf2","#7d3f71"]},{id:"cafe",name:"Café",sw:["#eeebe6","#d6cfc3","#ffffff","#5b3a26"]},{id:"library",name:"Library",sw:["#1f2d24","#5a3d27","#f1e9d4","#c9a152"]}];
const FONTS=[{id:"book",name:"Book (as it is)",f:"'IM Fell English', Georgia, serif"},{id:"garamond",name:"Garamond",f:"'EB Garamond', Garamond, serif"},{id:"typewriter",name:"Typewriter",f:"'Courier Prime', monospace"},{id:"modern",name:"Modern",f:"'Work Sans', Arial, sans-serif"},{id:"hand",name:"By hand",f:"'Kalam', cursive"}];

const DEF_BOARDS=[{id:"light",name:"Light"},{id:"hosp",name:"Essay on hospitality"},{id:"morn",name:"Mornings"}];
const DEF_PINS=[
 {id:"b1", board:"morn", type:"quote", text:"Try to be one of the people on whom nothing is lost!", cite:"Henry James, “The Art of Fiction,” 1884", x:4, y:5, r:-3},
 {id:"b2", board:"morn", type:"quote", pin:true, text:"If Poetry comes not as naturally as the Leaves to a tree it had better not come at all.", cite:"John Keats, letter to John Taylor, 1818", x:29, y:3, r:2},
 {id:"b3", board:"morn", type:"sticky", text:"Read one poem before you touch the phone. Just one.", x:57, y:7, r:-2},
 {id:"b4", board:"hosp", type:"photo", plate:"p-rublev", cap:"the open place at the table", x:70, y:26, r:3},
 {id:"b5", board:"hosp", type:"hand", text:"A second chair at the desk. (Tomás)", x:5, y:46, r:1.5},
 {id:"b6", board:"light", type:"quote", text:"There lives the dearest freshness deep down things.", cite:"Gerard Manley Hopkins, “God’s Grandeur,” 1877", x:34, y:42, r:-1.5},
 {id:"b7", board:"light", type:"photo", plate:"p-matthew", cap:"light from the real window", x:55, y:60, r:-2},
 {id:"b8", board:"morn", type:"quote", pin:true, text:"The Morning Question: What good shall I do this day?", cite:"Benjamin Franklin, Autobiography", x:18, y:72, r:2},
 {id:"b9", board:"hosp", type:"sticky", text:"Weil: attention is the rarest and purest form of generosity.", x:40, y:12, r:1}];
const DEF_SCRAP=[
 {id:"s1", type:"ticket", title:"Contarelli Chapel", text:"San Luigi dei Francesi · Rome · a coin for the light"},
 {id:"s2", type:"photo", plate:"p-matthew", cap:"the hand from the Sistine ceiling"},
 {id:"s3", type:"quote", text:"If Poetry comes not as naturally as the Leaves to a tree it had better not come at all.", cite:"John Keats, 1818"},
 {id:"s4", type:"hand", text:"Walked home the long way after the Keats. Wrote nothing. Felt like something."},
 {id:"s5", type:"photo", plate:"p-starry", cap:"5:40 a.m."},
 {id:"s6", type:"quote", text:"There lives the dearest freshness deep down things.", cite:"Gerard Manley Hopkins, 1877"}];
const DEF_LINES=[
 {id:"l1", text:"Try to be one of the people on whom nothing is lost!", who:"Henry James", where:"“The Art of Fiction,” 1884", from:"before", date:"2026-09-18", x:6, y:8, r:-3},
 {id:"l2", text:"There lives the dearest freshness deep down things.", who:"Gerard Manley Hopkins", where:"“God’s Grandeur,” 1877", from:"before", date:"2026-09-17", x:36, y:6, r:2},
 {id:"l3", text:"Attention is the rarest and purest form of generosity.", who:"Simone Weil", where:"letter to Joë Bousquet, 1942", from:"before", date:"2026-09-16", x:64, y:12, r:-1.5},
 {id:"l4", text:"A second chair at the desk. Nobody has sat in it yet.", who:"Tomás", where:"beside Rublev", from:"muse", date:"2026-09-13", x:10, y:48, r:1.5},
 {id:"l5", text:"Read one poem before you touch the phone. Just one.", who:"", where:"", from:"you", date:"2026-09-12", x:44, y:52, r:-2},
 {id:"l6", text:"“We’ll finish it when it’s finished.”", who:"overheard", where:"a tram, week two", from:"phone", date:"2026-09-20", x:70, y:62, r:2.5}];
const DEF_QUESTIONS=[
 {id:"q1", text:"What is hospitality a kind of attention to?", date:"2026-09-18"},
 {id:"q2", text:"What would I make if nobody could see it?", date:"2026-09-10"}];
const DEF_PAGES=[
 {id:"j2", date:"2026-09-18", title:"Two chairs", muse:"rublev", q:"q1", lines:["l4","l3"],
  body:"Tomás’s post about the second chair. What if the essay is about hospitality as a kind of attention? Weil on attention + Rublev’s open place + Yiayia’s kitchen table on Sundays.\n\nThree things that have never met. Start with the table."},
 {id:"j3", date:"2026-09-12", title:"Overheard, week two", muse:null, q:null, lines:["l6"],
  body:"— “He only writes when he’s angry, so he’s very productive.”\n— a boy on the tram explaining Caravaggio to his grandmother\n— “We’ll finish it when it’s finished.”"}];
const DEF_JOURNAL_OLD=[
 {id:"j2", date:"2026-09-18", title:"Two chairs", season:"weaving", muse:"rublev", photo:"plate:p-rublev", photoCap:"the table",
  body:"Tomás’s post about the second chair. What if the essay is about hospitality as a kind of attention? Weil on attention + Rublev’s open place + Yiayia’s kitchen table on Sundays.\n\nThree things that have never met. Start with the table."},
 {id:"j3", date:"2026-09-12", title:"Overheard, week two", season:"gathering", muse:null,
  body:"— “He only writes when he’s angry, so he’s very productive.”\n— a boy on the tram explaining Caravaggio to his grandmother\n— “We’ll finish it when it’s finished.”"}];

/* ---------- State ---------- */
/* ---------- Who is at this keyboard ----------
   The prototype has no accounts. ?user=<name> gives each person their own
   saved state in the same browser, so two tabs side by side are two people.
   Leave it off and everything behaves exactly as before. */
function whoParam(){
 try{ const u=(new URLSearchParams(location.search).get("user")||"").trim().slice(0,24);
  return /^[\w-]+$/.test(u)?u.toLowerCase():""; }catch(e){ return ""; }
}
const WHO=whoParam();
const WHONAME=WHO?WHO.charAt(0).toUpperCase()+WHO.slice(1).replace(/[-_]+/g," "):"Niko";
const KEY="poiesis.v7"+(WHO?"."+WHO:""); const clone=o=>JSON.parse(JSON.stringify(o));
/* ---------- The table ----------
   One shared row store for everyone using this browser, kept apart from each
   person's own state. It is the same shape data.js syncs to the account, so
   the day two machines are involved this is swapped for that and nothing else
   changes. Rows are written when you leave a first impression or publish a
   link, and read back as other people's impressions on every other ?user=. */
const TABLE_KEY="poiesis.table.v1";
const Table={
 all(){ try{ return JSON.parse(localStorage.getItem(TABLE_KEY)||"{}")||{}; }catch(e){ return {}; } },
 rows(on){ return (this.all()[on]||[]).filter(r=>r.day===today()); },
 others(on){ return this.rows(on).filter(r=>(r.by||"")!==WHO); },
 put(row){ if(!WHO) return;                       /* nobody is signed in as anyone */
  const t=this.all(), list=t[row.on]=t[row.on]||[];
  const i=list.findIndex(r=>r.id===row.id); if(i<0) list.push(row); else list[i]=row;
  try{ localStorage.setItem(TABLE_KEY, JSON.stringify(t)); }catch(e){} },
 clear(){ try{ localStorage.removeItem(TABLE_KEY); }catch(e){} }
};
/* another tab wrote something: show it without a reload */
try{ window.addEventListener("storage", e=>{ if(e.key===TABLE_KEY && typeof render==="function") render(); }); }catch(e){}
/* other people's impressions on this work, sample ones and real ones together */
function postsFor(mid){
 const mine=Table.others(mid).map(r=>({id:r.id, name:r.name, at:when(r.at), first:r.text,
  moved:(r.moved||0), replies:[], linkOf:r.via||null, live:true}));
 return [...(SAMPLES?(POSTS[mid]||[]):[]), ...mine];
}
function fresh(){ return {look:null, font:"book", tab:"muse", mi:0, past:null, drafts:{}, likes:{},
 replies:{me_handel:[{n:"You", t:"Twenty-four days of writing, forty years of listening.", w:"9:10 p.m."}]},
 syn:{}, synDrafts:{}, openSyn:null, showWho:false,
 sealed:{hopkins:{text:"I keep thinking about the seven years he didn’t write. Maybe silence is a kind of drafting.", at:new Date("2026-09-17T07:20:00").getTime()},
         handel:{text:"Speed isn’t the enemy of depth when the thing has been ripening for years.", at:new Date("2026-09-19T06:48:00").getTime()}},
 pick:{date:null,id:null}, owned:{hopkins:{date:"2026-09-17",from:"hopkins"}, handel:{date:"2026-09-19",from:"handel",gilt:true}},
 drawn:{hopkins:"hopkins", handel:"handel"}, reading:false,
 journal:clone(DEF_PAGES), lines:clone(DEF_LINES), questions:clone(DEF_QUESTIONS), trash:[],
 nb:{way:"page", sel:"j2", pick:[], sort:"date", search:"", adding:false, closer:false, voice:"muse", answer:"", pocket:"", thread:null},
 season:"gathering", recent:[], visits:{}, log:[], page:{title:"",body:""}, pen:"",
 profile:{name:WHONAME, line:"", makes:"", photo:null, ring:"laurel", badge:"Apprentice", top:"handel", formed:["Homer","Henry James"]}}; }
let S; try{ S=Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY)||"null")||{}); }catch(e){ S=fresh(); }
function save(quiet){ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){ toast(T("toast.storage","This browser is out of room for pictures. Your words are still here.")); }
 if(!quiet && window.PoiesisData) window.PoiesisData.changed(); /* data.js: sync to the account */ }
if(S.pick.date && S.pick.date<today()) S.pick={date:null,id:null};
S.visits[today()]=1; save();
let tt; function toast(m){ const t=$("#toast"); t.textContent=m; t.hidden=false; clearTimeout(tt); tt=setTimeout(()=>t.hidden=true,2800); }
const uid=p=>p+Date.now().toString(36)+Math.random().toString(36).slice(2,5);
function remember(space,id,label){ S.recent=[{space,id,label}, ...S.recent.filter(r=>r.id!==id)].slice(0,8); S.log.push({d:today(), type:"kept"}); }
function fmt(d){ try{ return new Date(d+"T12:00:00").toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"}); }catch(e){ return d; } }
function shrink(file, cb){ const r=new FileReader(); r.onload=()=>{ const im=new Image(); im.onload=()=>{ const s=Math.min(1,520/Math.max(im.width,im.height)); const c=document.createElement("canvas"); c.width=Math.round(im.width*s); c.height=Math.round(im.height*s); c.getContext("2d").drawImage(im,0,0,c.width,c.height); cb(c.toDataURL("image/jpeg",.78)); }; im.src=r.result; }; r.readAsDataURL(file); }
const initials=n=>n.split(" ").map(w=>w[0]).join("").slice(0,2);

/* ---------- Settings: one set for wide screens, one for phones ---------- */
const HOUSE={
 desk:{room:"monastery",font:"modern",density:"airy",theme:"start",three:"tabs",tplace:"top",backing:"none",tsize:"m",labels:"off",sides:"faint",arch:"under",guide:"pulse",cue:"note",cueplace:"hang",shade:"writer",shadeStyle:"pencil",reveal:"ink",turner:"strip",nb:"spread",nbpaper:"lined",prompt:"focus",fill:"drawing",paper:"fascicle",nums:"hand",numSide:"left",stanza:"space",gloss:"dots",psize:"m",storyMode:"info",infoStyle:"pop",story:"tag",gate:"folded",pplace:"row",wtab:"off",wlook:"notecard"},
 phone:{room:"monastery",font:"modern",density:"snug",theme:"start",three:"stickers",tplace:"top",pplace:"row",backing:"none",tsize:"s",labels:"off",sides:"faint",arch:"arch",guide:"none",cue:"note",cueplace:"hang",shade:"writer",shadeStyle:"pencil",reveal:"ink",turner:"strip",wtab:"off",wlook:"notecard",prompt:"focus",fill:"drawing",paper:"card",nums:"off",numSide:"left",stanza:"space",gloss:"sup",psize:"m",storyMode:"info",infoStyle:"pop",story:"label",gate:"blur",nb:"card",nbpaper:"lined"}
};
const SETTINGS=[
 {name:"Page", ctrls:[
  {k:"room", label:"Room (same on every screen)", opts:LOOKS.map(l=>[l.id,l.name])},
  {k:"font", label:"Type (same on every screen)", opts:FONTS.map(f=>[f.id,f.name])},
  {k:"density", label:"Breathing room", opts:[["snug","Snug"],["airy","Airy"]]},
  ]},
 {name:"The three", ctrls:[
  {k:"three", label:"Each work shows as", opts:[["stickers","Its sticker"],["thumbs","A tiny thumbnail"],["tabs","An index tab"]]},
  {k:"tplace", dev:"desk", label:"Where", opts:[["top","Centred above the page"],["title","Beside the title, over the notebook"]]},
  {k:"pplace", dev:"phone", label:"Where", opts:[["row","Row under the date"],["stack","Stacked beside the title"]]},
  {k:"backing", label:"Sits on", opts:[["none","The page"],["strip","A paper strip"]]},
  {k:"tsize", label:"Size", opts:[["s","Small"],["m","Medium"],["l","Large"]]},
  {k:"labels", label:"Names under them", opts:[["off","None"],["on","Poem · Passage · Painting"]]}]},
 {name:"Links between works", ctrls:[
  {k:"sides", label:"Threads before they open", opts:[["faint","Faint dots"],["hidden","Invisible"],["drawn","Drawn"]]},
  {k:"arch", label:"Poem & painting link", opts:[["under","A loop under the row"],["arch","An arch over the row"]]},
  {k:"guide", label:"Nudge toward the next step", opts:[["pulse","Breathes"],["none","None"]]}]},
 {name:"Others were here", ctrls:[
  {k:"cueplace", label:"Where it sits", opts:[["hang","Hanging on the right, slanted"],["inside","Inside the row"],["small","Smaller, underneath"]]},
  {k:"cue", label:"What it shows", opts:[["note","Faces + pencilled note"],["bubble","Faces + speech bubble"],["faces","Faces + badge"],["off","Nothing"]]}]},
 {name:"Sticker shade", ctrls:[
  {k:"shade", label:"Also show it", opts:[["writer","By the send button too"],["corner","Only on the three"]]},
  {k:"shadeStyle", label:"Shade", opts:[["pencil","Pencil sketch"],["black","Ink print"],["silhouette","Faint silhouette"],["frost","Frosted"],["deboss","Pressed in"]]},
  {k:"reveal", label:"While you write", opts:[["ink","Inks in as you type"],["still","Stays shaded"]]}]},
 {name:"Next work, at the end", ctrls:[
  {k:"turner", label:"Turner", opts:[["strip","The three again, with arrows"],["curl","Page curl"],["ribbons","Ribbon tail"],["none","None"]]}]},
 {name:"Notebook beside the work", dev:"desk", ctrls:[
  {k:"nb", label:"How work and notebook meet", opts:[["spread","Open book"],["tucked","Tucked page"],["card","Separate card"],["matched","One sheet, torn along"]]},
  {k:"nbpaper", label:"Notebook paper", opts:[["lined","Lined"],["dots","Dot grid"],["blank","Plain + margin"]]},
  {k:"prompt", label:"The prompt", opts:[["focus","Fades once you start"],["full","Always shown"]]}]},
 {name:"Writing box", dev:"phone", ctrls:[
  {k:"wtab", label:"A tab on the work’s edge", opts:[["off","Off"],["edge","Paper tab"],["solid","Solid tab"]]},
  {k:"wlook", label:"It looks like", opts:[["notecard","Lined notecard"],["postcard","Postcard"],["line","A single line"]]},
  {k:"prompt", label:"The prompt", opts:[["focus","Fades once you start"],["full","Always shown"]]}]},
 {name:"The empty side of the poem", ctrls:[
  {k:"fill", label:"Fill it with", opts:[["drawing","A drawing of the work"],["bubbles","Half-bubble wallpaper"],["wash","Watercolour wash"],["scallop","Scalloped edge"],["gloss","Glosses in the margin"],["stamp","Place stamp"],["none","Nothing"]]}]},
 {name:"The work", ctrls:[
  {k:"paper", label:"Paper", when:(u,d)=>!(d==="desk"&&u.nb==="spread"), opts:[["fascicle","Fascicle sheet"],["card","Notecard"],["ruled","Ruled"]]},
  {k:"nums", label:"Line numbers", opts:[["hand","Pencilled"],["five","Every 5th"],["all","Every line"],["stanza","Stanza starts"],["off","Off"]]},
  {k:"numSide", label:"Numbers sit", when:u=>u.nums!=="off", opts:[["left","Left"],["right","Right"]]},
  {k:"stanza", label:"Between stanzas", opts:[["space","Space"],["fleuron","Fleuron"]]},
  {k:"gloss", label:"Hard words", opts:[["dots","Dotted underline"],["sup","Small mark"],["none","Plain"]]},
  {k:"psize", label:"Reading size", opts:[["m","Regular"],["l","Large"]]}]},
 {name:"About the work", ctrls:[
  {k:"storyMode", label:"The story lives", opts:[["info","Behind an ⓘ by the title"],["under","Under the work"]]},
  {k:"infoStyle", label:"The ⓘ opens", when:u=>u.storyMode==="info", opts:[["pop","Pop-up notecard"],["flip","Flips the work over"],["drawer","Slide-out drawer"]]},
  {k:"story", label:"Written as", opts:[["tag","Label on a tag"],["label","Museum label"],["cards","Index cards, stacked"],["row","Index cards, in a row"]]}]},
 {name:"Others’ impressions", ctrls:[
  {k:"gate", label:"Before you’ve written", opts:[["folded","Folded notes"],["blur","Blurred"]]}]}
];
if(!S.ui) S.ui={};
["desk","phone"].forEach(d=>{ S.ui[d]=Object.assign(clone(HOUSE[d]), S.ui[d]||{}); });
const SHARED=["room","font"];
function setPref(k,v,d){ if(SHARED.includes(k)) ["desk","phone"].forEach(x=>S.ui[x][k]=v); else S.ui[d||DEV()][k]=v; }
if(!S.sharedLook){ SHARED.forEach(k=>S.ui.phone[k]=S.ui.desk[k]); S.sharedLook=1; }
const phoneMQ=matchMedia("(max-width: 700px)");
const DEV=()=>phoneMQ.matches?"phone":"desk";
const U=()=>S.ui[DEV()];

/* ---------- Avatars, stickers ---------- */
function stickerHTML(id, size, tip, gilt){ const s=STICKERS[id]; if(!s) return ""; return `<span class="stk${gilt?" gilt":""}" style="width:${size}px;height:${size}px" tabindex="0" data-tip="${esc(tip||`${s.series} · ${s.name}`)}">${s.svg}</span>`; }
function avatarHTML(o){ const ring=RINGS[o.ring]||RINGS.none; return `<span class="av" style="background:${o.photo?`url('${o.photo}') center/cover`:o.c};box-shadow:${ring.css}">${o.photo?"":esc(o.initials)}</span>`; }
function me(){ const p=S.profile; return {c:"var(--accent)", initials:initials(p.name||"You"), photo:p.photo, ring:p.ring}; }
const COLOURS=["#3d5d86","#6b4a7d","#8a5a3b","#2f5d50","#8a2f22","#5f7f45","#2c4a58"];
function personAv(n){ const P=PEOPLE[n]; if(P) return avatarHTML({c:P.c, initials:initials(n), ring:P.ring});
 if(!n||n==="You") return avatarHTML(me());
 let h=0; for(let i=0;i<n.length;i++) h=(h*31+n.charCodeAt(i))>>>0;
 return avatarHTML({c:COLOURS[h%COLOURS.length], initials:initials(n), ring:"none"}); }
function myTop(){ return S.profile.top && S.owned[S.profile.top] ? S.profile.top : null; }

/* ---------- Rooms & type ---------- */
function applyPrefs(){
 const R=document.documentElement;
 const u=U(); R.setAttribute("data-look",u.room);
 u.font&&u.font!=="book"?R.setAttribute("data-font",u.font):R.removeAttribute("data-font");
 R.setAttribute("data-dev",DEV()); R.setAttribute("data-density",u.density); R.setAttribute("data-gloss",u.gloss); R.setAttribute("data-psize",u.psize);
 const eff=u.room;
 $("#lookList").innerHTML=LOOKS.map(l=>`<button class="pbtn" data-look="${l.id}" aria-pressed="${l.id===eff}"><span class="sw">${l.sw.map(c=>`<span style="background:${c}"></span>`).join("")}</span>${esc(l.name)}</button>`).join("");
 $("#fontList").innerHTML=FONTS.map(f=>`<button class="pbtn" data-font="${f.id}" aria-pressed="${f.id===(u.font||"book")}"><span class="spec" style="font-family:${f.f}">Muse</span>${esc(f.name)}</button>`).join("");
 $("#profBtn").innerHTML=avatarHTML(me());
}
function pop(btn,p){ const other=p.id==="lookPop"?$("#fontPop"):$("#lookPop"); other.hidden=true; p.hidden=!p.hidden; btn.setAttribute("aria-expanded",String(!p.hidden)); }
$("#lookBtn").onclick=e=>{e.stopPropagation(); pop(e.currentTarget,$("#lookPop"));};
$("#fontBtn").onclick=e=>{e.stopPropagation(); pop(e.currentTarget,$("#fontPop"));};
$("#lookList").onclick=e=>{const b=e.target.closest("[data-look]"); if(b){setPref("room",b.dataset.look); save(); applyPrefs(); if(S.tab==="profile") render();}};
$("#fontList").onclick=e=>{const b=e.target.closest("[data-font]"); if(b){setPref("font",b.dataset.font); save(); applyPrefs(); render();}};
document.addEventListener("click",e=>{ for(const p of [$("#lookPop"),$("#fontPop")]) if(!p.hidden&&!p.contains(e.target)) p.hidden=true;
 if(!e.target.closest(".bm")) document.querySelectorAll(".bmenu:not([hidden])").forEach(m=>m.hidden=true); });

/* ---------- Navigation ---------- */
$("#switch").onclick=e=>{const b=e.target.closest("[data-tab]"); if(b){ if(b.dataset.tab==="muse"){ S.past=null; S.phome=true; } go(b.dataset.tab);} };
$("#home").onclick=e=>{e.preventDefault(); S.past=null; go("muse");};
$("#profBtn").onclick=()=>go("profile");
$("#whyLink").onclick=e=>{e.preventDefault(); go("why");};
function go(tab){ S.tab=tab; save(); render(); scrollTo({top:0, behavior:reduce?"auto":"smooth"}); }
function render(){
 hideSel(); hideTip();
 document.querySelectorAll("#switch [data-tab]").forEach(b=>b.setAttribute("aria-selected",String(b.dataset.tab===S.tab)));
 $("#profBtn").setAttribute("aria-current",String(S.tab==="profile"));
 ({muse:renderMuse, notebook:renderNotebook, why:renderWhy, profile:renderProfile})[S.tab]($("#view"));
 pruneBlankControls($("#view"));
}
const HERO=`<section class="hero"><div><p class="eyebrow">${T("hero.eyebrow","Poiesis, a place to make things")}</p><h1>${T("hero.headline","Every made thing began as a thing ")}<em>${T("hero.headline.stressed","received")}</em>.</h1></div>
 <aside class="lexicon" aria-label="Definition of poiesis"><div><span class="hw">${T("lexicon.word","poiesis")}</span><span class="gr">${T("lexicon.greek","ποίησις")}</span></div><div class="pos">${T("lexicon.part","noun · from Greek ")}<i>${T("lexicon.root","poiein")}</i>, ${T("lexicon.rootgloss","“to make”")}</div>
 <ol><li>${T("lexicon.one","The act of bringing something into being that was not there before.")}</li><li>${T("lexicon.two","Making understood as something between labor and gift: the maker works, and something arrives.")}</li></ol></aside></section>`;

/* ---------- Who has been here today ---------- */
const TODAY=[
 {n:"Ada Okonkwo", parts:["dickinson","thoreau","vermeer","whole"], at:"5:41 a.m."},
 {n:"Jonah Weil", parts:["dickinson","thoreau","vermeer"], at:"6:31 a.m."},
 {n:"Marta Ilić", parts:["thoreau","vermeer","pv"], at:"6:58 a.m."},
 {n:"Samuel Achterberg", parts:["dickinson","vermeer","vp"], at:"7:12 a.m."},
 {n:"Tomás Reyes", parts:["thoreau","whole"], at:"7:19 a.m."},
 {n:"Lena Vogt", parts:["dickinson","thoreau","pp"], at:"8:02 a.m."}
].filter(()=>SAMPLES);
function mineParts(){ const p=MUSES.filter(m=>S.sealed[m.id]).map(m=>m.id); LINKS.forEach(l=>{ if(S.syn[l.id]) p.push(l.id); }); if(S.syn.whole) p.push("whole"); return p; }
function myReplyCount(){ return Object.values(S.replies).reduce((n,a)=>n+a.length,0); }
function dayCount(){
 const others=(TODAY.reduce((n,p)=>n+p.parts.length,0)
  + MUSES.reduce((n,m)=>n+postsFor(m.id).reduce((k,p)=>k+(p.replies||[]).length,0),0)
  + (SAMPLES?SYNS.reduce((n,y)=>n+(y.replies||[]).length,0):0))
  + MUSES.reduce((n,m)=>n+Table.others(m.id).length,0);
 return others + mineParts().length + myReplyCount();
}

/* ---------- Today's stickers ---------- */
function untilMidnight(){ const n=new Date(), m=new Date(n); m.setHours(24,0,0,0); const d=m-n, h=Math.floor(d/36e5), mi=Math.floor(d%36e5/6e4); return `${h}h ${mi}m`; }

function synOpen(id){ return true; }
function synSubjects(id){ return id==="whole"?MUSES.map(m=>m.id):[LINK[id].a, LINK[id].b]; }
function andList(a){ return a.length<3?a.join(" and "):a.slice(0,-1).join(", ")+" and "+a[a.length-1]; }
function synName(id){ return id==="whole"?"all three":`${MUSE[LINK[id].a].kind.toLowerCase()} & ${MUSE[LINK[id].b].kind.toLowerCase()}`; }
function synTextHTML(m){
 if(m.plate) return `<div class="plate ${m.plate}" role="img" aria-label="Color study after ${esc(m.title)}"><span class="note">Color study</span></div>${m.quote?`<p class="sy-q museText">${esc(m.quote)}</p>`:""}`;
 if(m.poem) return `<div class="sy-poem museText">${m.poem.split("\n\n").map(st=>`<p>${st.split("\n").map(esc).join("<br>")}</p>`).join("")}</div>`;
 return `<div class="sy-prose museText">${(m.quote||"").split(/(?<=…)\s+/).map(x=>`<p>${esc(x)}</p>`).join("")}${m.cite?`<small>${esc(m.cite)}</small>`:""}</div>`;
}
function synBoxHTML(id){
 const ids=synSubjects(id), mine=S.syn[id], d=S.synDrafts[id]||"";
 const missing=ids.filter(x=>!S.sealed[x]);
 return `<div class="synbox" id="synbox">
  <div class="synhead"><h3>${id==="whole"?"All three":`${esc(MUSE[ids[0]].kind)} <span class="j">and</span> ${esc(MUSE[ids[1]].kind)}`}</h3><button class="btn small ghost" data-act="closesyn">${T("link.close","Close")}</button></div>
  <div class="sy-body"><div class="synworks">${ids.map(x=>{ const m=MUSE[x], s=S.sealed[x];
    return `<div class="synw"><span class="type kind">${esc(m.kind)}</span><b>${esc(m.title)}</b><small class="muted">${esc(m.maker)}</small><div class="sy-text">${synTextHTML(m)}</div>
     ${s?`<p class="yours">“${esc(s.text)}”<small>${s.via?T("link.via.small","your link, as your first impression"):T("link.first.small","your first impression")}</small></p>`:`<p class="yours locked2">${T("link.counts","Not written yet. This link will count as your first impression here.")}</p>`}</div>`; }).join("")}</div>
  ${synThreadHTML(id)}</div>
  <div class="sy-pin">
  ${mine?`<div class="writer seal" ><span class="wax" aria-hidden="true">P</span><small>${id==="whole"?T("link.yours.whole","Your thought on all three"):`Your ${esc(synName(id))} link`} · ${when(mine.at)}</small><div class="first">${esc(mine.text)}</div>
     <p class="type" style="color:#8a7b68;margin:10px 0 0;font-size:.62rem">${T("link.published.under","Published under ")}${ids.map(x=>esc(MUSE[x].kind.toLowerCase())).join(", ")}${T("link.published.journal"," · also in your journal")}</p></div>`:
   `<div class="writer" ><h4>${id==="whole"?T("link.whole.heading","One thought that holds all three"):T("link.pair.heading","What do these two say to each other?")}</h4>
    <div class="sub">${id==="whole"?T("link.whole.line","Where do they meet, where do they argue — and what does the day leave you with?"):T("link.pair.line","Agreement is not required. Disagreement is often better.")}</div>
    <textarea class="grow" id="synDraft" rows="1" aria-label="Your link" placeholder="${T("link.placeholder","Two or three sentences is plenty.")}">${esc(d)}</textarea>
    <div class="wrow"><span class="type" style="color:#8a7b68">${T("link.appears","Appears under the ")}${esc(andList(ids.map(x=>MUSE[x].kind.toLowerCase())))}</span>
     <button class="btn primary" data-act="pubsyn" ${d.trim()?"":"disabled"}>${T("link.publish","Publish this link")}</button></div></div>`}
  </div>
 </div>`;
}
function synThreadHTML(id){
 const others=SYNS.filter(y=>y.on===id), mine=S.syn[id];
 if(!others.length) return "";
 if(!mine) return `<div class="locked" style="margin-top:14px"><div class="ghost" aria-hidden="true">${others.slice(0,2).map(y=>synPostHTML(y,id)).join("")}</div>
  <div class="veil"><div><b style="font-family:var(--f-display);font-weight:400;font-size:1.15rem">${others.length} ${others.length>1?"people have":"person has"} connected these.</b>
   <p class="muted" style="margin:6px 0 0;font-size:.9rem">${T("link.gate.line","Write your own link first — yours, before theirs.")}</p></div></div></div>`;
 return `<div class="synthread"><p class="type muted" style="margin:14px 0 4px">${T("link.others.heading","How others connected them")}</p>${others.map(y=>synPostHTML(y,id)).join("")}</div>`;
}
function synPostHTML(y,id){
 const P=PEOPLE[y.name], reps=[...(y.replies||[]), ...(S.replies[y.id]||[])];
 return `<article class="post" data-p="${y.id}" data-m="${id}" data-syn="1">
  <div class="who">${personAv(y.name)}<div><b>${esc(y.name)}</b> ${P?stickerHTML(P.top,20):""} ${P?`<span class="badge">${esc(P.badge)}</span>`:""} <span class="sample">sample</span><small>${esc(P?P.role:"")}</small></div></div>
  <div class="thought link"><small class="type" style="color:#8a7b68;font-size:.64rem">A link · ${esc(y.at)}</small><div class="first">${esc(y.text)}</div></div>
  <div class="pact"><button class="btn" data-pa="like" aria-pressed="${!!S.likes[y.id]}">${S.likes[y.id]?T("post.moved.on","♥ Moved me"):T("post.moved.off","♡ Moved me")}</button><button class="btn" data-pa="reply">${T("post.writeback","Write back")}${reps.length?` · ${reps.length}`:""}</button>${bmMenu()}</div>
  ${reps.length?`<div class="comments">${reps.map(c=>`<div class="cm">${personAv(c.n)}<div><b>${esc(c.n==="You"?(S.profile.name||"You"):c.n)}</b> ${PEOPLE[c.n]?stickerHTML(PEOPLE[c.n].top,16):""} ${esc(c.t)}</div></div>`).join("")}</div>`:""}
  <div class="slot2"></div></article>`;
}
function synListHTML(){
 const mine=[...LINKS.map(l=>l.id),"whole"].filter(id=>S.syn[id]);
 if(!mine.length) return "";
 return `<div class="synlist"><p class="type muted" style="margin:0 0 6px">${T("link.mine.heading","Your links today")}</p>
  ${mine.map(id=>`<button class="synchip" data-side="${id}"><b>${esc(synName(id))}</b><span>${esc(S.syn[id].text.slice(0,70))}${S.syn[id].text.length>70?"…":""}</span></button>`).join("")}</div>`;
}
function publishSyn(id){
 const t=(S.synDrafts[id]||"").trim(); if(!t) return;
 const ids=synSubjects(id), jid=uid("j"), now=Date.now();
 S.syn[id]={text:t, at:now, jid};
 const fresh=ids.filter(x=>!S.sealed[x]&&!MUSE[x].closed); let drew=null;
 fresh.forEach(x=>{ S.sealed[x]={text:t, at:now, jid, via:id}; const d=drawSticker(x); if(d){ drew=d; S.keepAsk=x; } });
 if(drew) setCheck(drew);
 S.journal.unshift({id:jid, date:today(), title:`Link: ${synName(id)}`, lines:[], q:null, muse:ids[0], body:`${t}\n\n— on ${ids.map(x=>`${MUSE[x].maker}, ${MUSE[x].title}`).join(" · ")}`});
 remember("journal",jid,`Link: ${synName(id)}`);
 ids.forEach(x=>Table.put({id:"t_"+WHO+"_"+id+"_"+x, on:x, by:WHO, name:S.profile.name||WHONAME, at:now, day:today(), text:t, via:id}));
 S.synDrafts[id]=""; save(); render();
 toast(fresh.length?`${T("toast.link.counts","Your link is your first impression on the ")}${andList(fresh.map(x=>MUSE[x].kind.toLowerCase()))}.`:`${T("toast.link.published","Published under the ")}${andList(ids.map(x=>MUSE[x].kind.toLowerCase()))}.`);
 setTimeout(()=>$("#synbox")?.scrollIntoView({behavior:reduce?"auto":"smooth", block:"center"}),60);
}

/* ---------- Muse ---------- */
function curMuse(){ return S.past?MUSE[S.past]:MUSES[Math.max(0,Math.min(MUSES.length-1,S.mi))]; }
function when(ts){ return new Date(ts).toLocaleTimeString(undefined,{hour:"numeric", minute:"2-digit"}); }
function visualHTML(m){
 if(m.plate) return `<div class="plate ${m.plate}" role="img" aria-label="Color study after ${esc(m.title)}"><span class="note">Color study · museum image in the app</span></div><div class="plate-cap"><span>${esc(m.where)}</span><span class="pal">${m.palette.map(c=>`<span style="background:${c}"></span>`).join("")}</span></div>`;
 if(m.poem) return `<div class="poemblock museText">${esc(m.poem)}</div><p class="type muted" style="margin:0 0 16px">${esc(m.poemNote)}</p>`;
 if(m.notebook) return `<div class="notebook-plate museText">${m.notebook.map(esc).join("<br>")}<small>${esc(m.notebookNote)}</small></div>`;
 return "";
}
function myLayers(mid){ return (S.replies["me_"+mid]||[]); }
function writerHTML(m){
 const s=S.sealed[m.id];
 if(s) return `<div class="writer seal"><span class="wax" aria-hidden="true">P</span><small>Your first impression · ${when(s.at)}</small><div class="first">${esc(s.text)}</div>
   ${myLayers(m.id).map(l=>`<div class="layer"><small>${esc(l.w||"later")}</small>${esc(l.t)}</div>`).join("")}
   ${m.closed?"":`<form class="addlayer" id="laterF"><input id="layerIn" aria-label="${T("post.reply.mine.placeholder","Add another thought")}" placeholder="Add another thought…"><button class="btn small">Add</button></form>
   <p class="type" style="color:#8a7b68;margin:8px 0 0;font-size:.62rem">Your first impression stays as written. Thoughts after it: as many as you like.</p>`}
   <p class="type" style="color:#8a7b68;margin:6px 0 0;font-size:.62rem">Also kept in your journal</p></div>`;
 if(m.closed) return `<div class="writer"><h4>This muse has passed</h4><p class="sub">Its conversation closed before you left an impression. You can still write about it in your notebook.</p></div>`;
 const d=S.drafts[m.id]||"";
 return `<div class="writer"><h4>Your first impression</h4><div class="sub">${esc(PROMPT)}</div>
  <textarea class="grow" id="draft" rows="1" aria-label="Your first impression" placeholder="One sentence is enough.">${esc(d)}</textarea>
  <div class="wrow"><span class="type" style="color:#8a7b68">Stays as you first wrote it</span><button class="btn primary" data-act="seal" ${d.trim()?"":"disabled"}>Leave my first impression</button></div></div>`;
}
function bmMenu(){ return `<span class="bm"><button class="btn icon" data-pa="bm" aria-label="Keep this" aria-expanded="false" title="Keep this">${BOOKMARK}</button>
 <span class="bmenu" hidden><button data-pa="save" data-to="line">${T("keep.menu.line","Keep the line")}</button><button data-pa="save" data-to="page">${T("keep.menu.page","Write a page under it")}</button></span></span>`; }
/* others.gate.line ends in "… from " so the maker's name can follow it.
   Rewrite it to end anywhere else and the name is simply not appended. */
function gateLine(m){
 if(m.kind==="Scripture") return T("others.gate.scripture","What you write first stays yours, before anyone else’s voice gets in. It also draws you the day’s seal.");
 const line=T("others.gate.line","What you write first stays yours, before anyone else’s voice gets in. It also draws you one sticker from ");
 return /\s$/.test(line)?line+esc(MAKERNAME[makerOf(m.id)]||m.maker)+".":line;
}
function postHTML(p, m, mine, closed){
 const P=mine?null:(PEOPLE[p.name]||null);
 const top=mine?myTop():(P?P.top:null);
 const topTip=top?(mine?`${STICKERS[top].series} · ${STICKERS[top].name}`:`${STICKERS[top].name} · ${p.name.split(" ")[0]} collected this ${GOT[p.name]||"earlier"}`):"";
 const badge=mine?S.profile.badge:(P?P.badge:"");
 const role=mine?"Your circle sees this":(P?P.role:T("post.alsohere","Also writing in this browser"));
 const reps=[...(p.replies||[]), ...(S.replies[p.id]||[])];
 const shown=closed?reps.slice(0,3):reps;
 return `<article class="post" data-p="${p.id}" data-m="${m.id}"${p.linkOf?` data-syn="1" data-link="${p.linkOf}"`:""}>
  <div class="who">${mine?avatarHTML(me()):personAv(p.name)}<div><b>${mine?esc(S.profile.name||"You"):esc(p.name)}</b> ${top?stickerHTML(top,20,topTip):""} ${badge?`<span class="badge">${esc(badge)}</span>`:""} ${P?'<span class="sample">sample</span>':""}<small>${esc(role)}</small></div></div>
  <div class="thought${p.linkOf?" link":""}"><span class="wax" aria-hidden="true"></span><small class="type" style="color:#8a7b68;font-size:.64rem">${p.linkOf?`A link · ${esc(linkTag(p.linkOf))}`:"First impression"} · ${esc(p.at)}</small>
   <div class="first">${esc(p.first)}</div>
   ${p.later?`<div class="layer"><small>${esc(p.later.when)}</small>${p.later.poem?`<div class="poem">${esc(p.later.poem)}</div>`:""}${p.later.sketch?`<div class="sk s-garage" role="img" aria-label="Sketch"></div>`:""}${p.later.text?esc(p.later.text):""}</div>`:""}
  </div>
  <div class="pact">${mine||closed?"":`<button class="btn" data-pa="like" aria-pressed="${!!S.likes[p.id]}">${S.likes[p.id]?T("post.moved.on","♥ Moved me"):T("post.moved.off","♡ Moved me")}</button>`}${closed?`<span class="muted" style="font-size:.84rem">Moved ${p.moved} people</span>`:`<button class="btn" data-pa="reply">${mine?T("post.addtothis","Add to this"):T("post.writeback","Write back")}${reps.length?` · ${reps.length}`:""}</button>`}${mine?"":bmMenu()}</div>
  ${shown.length?`<div class="comments">${shown.map(c=>`<div class="cm">${personAv(c.n)}<div><b>${esc(c.n==="You"?(S.profile.name||"You"):c.n)}</b> ${PEOPLE[c.n]?stickerHTML(PEOPLE[c.n].top,16):""} ${esc(c.t)}</div></div>`).join("")}</div>`:""}
  <div class="slot2"></div></article>`;
}
function linkTag(id){ return id==="whole"?"all three":synSubjects(id).map(x=>MUSE[x].kind.toLowerCase()).join(" & "); }
function responsesHTML(m){
 const posts=postsFor(m.id), s=S.sealed[m.id];
 const linksHere=[...LINKS.map(l=>l.id),"whole"].filter(id=>synSubjects(id).includes(m.id));
 const otherLinks=SAMPLES?SYNS.filter(y=>linksHere.includes(y.on)):[];
 const myLinks=linksHere.filter(id=>S.syn[id]).map(id=>({id:"me_syn_"+id, at:when(S.syn[id].at), first:S.syn[id].text, linkOf:id}));
 const reps=posts.reduce((n,p)=>n+(p.replies||[]).length+(S.replies[p.id]||[]).length,0);
 if(m.closed){ const top=[...posts].sort((a,b)=>b.moved-a.moved).slice(0,10);
  return `<section class="responses" id="responses"><h3>${T("others.heading","How it sang in others")}</h3><p class="closed">${T("others.closed.line","This conversation has closed. Here are its top impressions and their first replies.")}</p>
   <div>${s?postHTML({id:"me_"+m.id, at:when(s.at), first:s.text},m,true,true):""}${top.map(p=>postHTML(p,m,false,true)).join("")}</div></section>`; }
 if(!posts.length&&!m.closed){
  const cl0=new Date(); cl0.setDate(cl0.getDate()+3);
  if(!s) return `<section class="responses" id="responses"><h3>${T("others.heading","How it sang in others")}</h3>
   <div class="firsthere"><b>${T("others.gate.heading","Leave your first impression to read theirs.")}</b>
    <p class="muted" style="margin:6px 0 12px;font-size:.9rem">${gateLine(m)}</p>
    <button class="btn primary" data-act="towrite">${T("others.gate.button","Write my first impression")}</button></div></section>`;
  return `<section class="responses" id="responses"><h3>${T("others.heading","How it sang in others")}</h3>
   <p class="muted" style="margin:0 0 8px;font-size:.9rem">${T("others.first","Nobody else has written here yet. The conversation closes ")}${cl0.toLocaleDateString(undefined,{weekday:"long"})}.</p>
   <div>${postHTML({id:"me_"+m.id, at:when(s.at), first:s.text},m,true)}</div>
   <div class="linkfeed"><p class="type muted" style="margin:18px 0 6px">${T("others.linkfeed.heading","Links that pass through this work")}</p>${[...myLinks.map(p=>postHTML(p,m,true))].join("")||`<p class="muted" style="margin:0;font-size:.9rem">${T("others.linkfeed.empty","None yet. Tap a thread between two works to connect them.")}</p>`}</div></section>`;
 }
 const names=posts.map(p=>p.name.split(" ")[0]);
 const who=names.length>2?`${names.slice(0,2).join(", ")} and ${names.length-2} other${names.length-2>1?"s":""}`:names.join(" and ");
 const closes=new Date(); closes.setDate(closes.getDate()+3); const cl=closes.toLocaleDateString(undefined,{weekday:"long"});
 if(!s&&U().gate==="folded") return `<section class="responses" id="responses"><h3>${T("others.heading","How it sang in others")}</h3>
   <div class="m-folds">${posts.map(p=>`<div class="m-fold">${personAv(p.name)}<span class="line"></span></div>`).join("")}</div>
   <div class="rowbtns"><button class="btn primary" data-act="towrite">${T("others.folded.button","Write yours first, then unfold theirs")}</button></div></section>`;
 if(!s) return `<section class="responses" id="responses"><h3>${T("others.heading","How it sang in others")}</h3>
   <div class="peek">${posts.map(p=>personAv(p.name)).join("")}<span><b>${esc(who)}</b> left first impressions here. <span class="muted">${posts.length} impressions · ${otherLinks.length} links from other works · closes ${cl}</span></span></div>
   <div class="locked"><div class="ghost" aria-hidden="true">${posts.map(p=>postHTML(p,m)).join("")}</div>
   <div class="veil"><div><b style="font-family:var(--f-display);font-weight:400;font-size:1.25rem">${T("others.gate.heading","Leave your first impression to read theirs.")}</b>
    <p class="muted" style="margin:6px 0 12px;font-size:.9rem">${gateLine(m)}</p>
    <button class="btn primary" data-act="towrite">${T("others.gate.button","Write my first impression")}</button></div></div></div></section>`;
 const linkPosts=[...myLinks.map(p=>postHTML(p,m,true)), ...otherLinks.map(y=>postHTML({id:y.id, name:y.name, at:y.at, first:y.text, linkOf:y.on, replies:y.replies, moved:y.moved}, m))];
 return `<section class="responses" id="responses"><h3>${T("others.heading","How it sang in others")}</h3><p class="muted" style="margin:0 0 8px;font-size:.9rem">${posts.length+1} impressions · ${linkPosts.length} links that touch this work · the conversation closes ${cl}</p>
  <div>${postHTML({id:"me_"+m.id, at:when(s.at), first:s.text},m,true)}${posts.map(p=>postHTML(p,m)).join("")}</div>
  <div class="linkfeed"><p class="type muted" style="margin:18px 0 6px">${T("others.linkfeed.heading","Links that pass through this work")}</p>${linkPosts.join("")||`<p class="muted" style="margin:0;font-size:.9rem">${T("others.linkfeed.empty","None yet. Tap a thread between two works to connect them.")}</p>`}</div></section>`;
}

/* ---------- The Muse page (Round 7: the three, not the triangle) ---------- */
const LABELS={
 dickinson:{life:"1830–1886", medium:"Ink on folded sheets, stitched into Fascicle 13", ref:"Franklin 320 · Johnson 258", blurb:"Never printed in her lifetime. The editors of 1890 titled it “Winter” and swapped her dashes for commas; the dashes you see were restored in 1955."},
 thoreau:{life:"1817–1862", medium:"Prose · from “Where I Lived, and What I Lived For”", ref:"Walden; or, Life in the Woods, 1854", blurb:"Two years at the pond; seven stages of revision after it. This passage comes from a chapter he kept rewriting."},
 vermeer:{life:"1632–1675", medium:"Oil on canvas · 45.5 × 41 cm", ref:"Rijksmuseum, Amsterdam", blurb:"Scans in 2022 found a quick underdrawing, a rack of jugs and a fire basket, all painted out. What remains is a woman, a stream of milk and the light."}
};
const PLACES={dickinson:["AMHERST","1861"], thoreau:["WALDEN POND","1845"], vermeer:["DELFT","c.1658"]};
const FIRSTLINE={dickinson:"There’s a certain Slant of light, Winter Afternoons –", thoreau:"Morning is when I am awake and there is a dawn in me."};
const GLY={
 dickinson:'<path d="M-8 -6h16M-8 -1h11M-8 4h16M-8 9h8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/>',
 thoreau:'<path d="M0 -5c-4-3-8-3-11-2v14c3-1 7-1 11 2 4-3 8-3 11-2V-7c-3-1-7-1-11 2zM0 -5v14" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/>',
 vermeer:'<rect x="-10" y="-8" width="20" height="16" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M-6 5l4-5 3 3 3-4 3 6" stroke="currentColor" stroke-width="1.3" fill="none" stroke-linejoin="round"/>'
};
let CLIPN=0;
function clipSvg(svg){ const k="kc"+(CLIPN++); return svg.replace(/(<svg[^>]*>)/,`$1<clipPath id="${k}"><circle cx="24" cy="24" r="23.5"/></clipPath><g clip-path="url(#${k})">`).replace(/<\/svg>$/,"</g></svg>"); }
function keptToday(){ return S.pick.date===today()?S.pick.id:null; }
function revealAmt(id){ if(S.sealed[id]) return 1; if(U().reveal!=="ink") return 0; return Math.min(1,(S.drafts[id]||"").trim().length/70)*.85; }
function placeholderSvg(id){ const mk=makerOf(id), nm=MAKERNAME[mk]||"?";
 const ini=(MUSE[id]||{}).kind==="Scripture"?"✝":nm.split(" ").slice(-1)[0][0];
 return `<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="#e8e0cb" stroke="#b3a892" stroke-width="1.2"/><text x="24" y="31" text-anchor="middle" font-family="Georgia,serif" font-size="19" fill="#8a7b68">${esc(ini)}</text></svg>`; }
function shadeHTML(id,size){
 const sid=S.drawn[id]||null, s=sid?STICKERS[sid]:null;
 const a=revealAmt(id), st=U().shadeStyle;
 const checked=!!sid&&checkedToday()===sid, gilt=!!sid&&!!(S.owned[sid]||{}).gilt;
 const artwork=s?s.svg:placeholderSvg(id);
 const tipT=s?`${s.series} · ${s.name}${checked?" · today’s sticker":""}`:`${T("sticker.locked.tip","A first impression draws one sticker from ")}${MAKERNAME[makerOf(id)]||"this maker"}`;
 return `<span class="m-stk ${a<1?"sh-"+st:""} ${gilt?"gilt":""} ${checked?"kept":""}" data-sid="${id}" data-tip="${esc(tipT)}" style="width:${size}px;height:${size}px">${a<1?`<span class="sh sh-${st}">${clipSvg(artwork)}</span>`:""}<span class="full" style="opacity:${a}">${clipSvg(artwork)}</span></span>`;
}
function stepNext(){
 const cur=curMuse();
 if(!S.sealed[cur.id]) return {t:"v",id:cur.id};
 const nv=MUSES.find(m=>!S.sealed[m.id]); if(nv) return {t:"v",id:nv.id};
 const ns=Object.keys(LINKS3).find(k=>!S.syn[k]); if(ns) return {t:"s",id:ns};
 if(!S.syn.whole) return {t:"c"};
 return null;
}
function linkState(id){ const open=synOpen(id), w=!!S.syn[id]; return w?"written":open?"open":U().sides; }
function threeSize(){ const d=DEV()==="desk"; return ({s:d?40:34, m:d?52:40, l:d?64:48})[U().tsize]; }
function itemHTML(m,size,labels,vert){
 const u=U(), cur=curMuse().id===m.id, t=`${m.kind}: ${m.title}`;
 if(u.three==="thumbs"){
  const w=Math.round(size*1.25), h=Math.round(size*1.5);
  const inner=m.plate?"":`<span class="tx">${esc(FIRSTLINE[m.id]||m.title)}</span>`;
  return `<button type="button" class="m-it th" data-mgo="${m.id}" aria-current="${cur}" aria-label="${esc(t)}" style="width:${Math.max(w,labels&&!vert?64:0)}px"><span class="m-thumb ${m.plate?`plateish ${m.plate}`:""}" style="width:${w}px;height:${h}px">${inner}<span class="bdg">${shadeHTML(m.id,Math.round(size*.5))}</span></span>${labels&&!vert?`<small>${esc(m.kind)}</small>`:""}</button>`;
 }
 if(u.three==="tabs") return `<button type="button" class="m-it tb" data-mgo="${m.id}" aria-current="${cur}" aria-label="${esc(t)}"><span class="m-tabp">${shadeHTML(m.id,Math.round(size*.62))}${vert?"":`<small>${esc(m.kind)}</small>`}</span></button>`;
 return `<button type="button" class="m-it st" data-mgo="${m.id}" aria-current="${cur}" aria-label="${esc(t)}" style="width:${labels&&!vert?Math.max(size+8,66):size+8}px">${shadeHTML(m.id,size)}${labels&&!vert?`<small>${esc(m.kind)}</small>`:""}</button>`;
}
function itemBox(size,vert){ const u=U();
 if(u.three==="thumbs") return {w:Math.max(Math.round(size*1.25), u.labels==="on"&&!vert?64:0), h:Math.round(size*1.5)};
 if(u.three==="tabs") return {w:vert?Math.round(size*.62)+22:Math.round(size*.62)+86, h:Math.round(size*.62)+16};
 return {w:u.labels==="on"&&!vert?Math.max(size+8,66):size+8, h:size};
}
function cueHTML(){
 const u=U(); if(u.cue==="off") return "";
 const n=dayCount();
 if(!TODAY.length) return mineParts().length?`<span class="m-cue"><span class="m-pnote">${T("cue.onlyyou.some","Only you here so far today")}</span></span>`
  :`<span class="m-cue"><span class="m-pnote">${T("cue.onlyyou","Nobody here yet today")}</span></span>`;
 const faces=`<span class="m-faces">${TODAY.slice(0,5).map(p=>`<i style="background:${PEOPLE[p.n].c}"></i>`).join("")}</span>`;
 if(u.cue==="bubble") return `<span class="m-cue" data-tip="${T("cue.tip","Contributions today")}">${faces}<span class="m-bubble">${n}</span></span>`;
 if(u.cue==="faces") return `<span class="m-cue" data-tip="${T("cue.tip","Contributions today")}">${faces}<span class="m-badge">${n}</span></span>`;
 return `<span class="m-cue">${faces}<span class="m-pnote">${TODAY.length}${T("cue.note"," others<br>wrote today")}</span></span>`;
}
function threeHTML(size,vert,nocue){
 const u=U(), ns=stepNext(), box=itemBox(size,vert), labels=u.labels==="on", T=30, K=30;
 const pl=on=>(u.guide==="pulse"&&on)?" m-pulse":"";
 const why=id=>S.syn[id]?" (written)":"";
 const thr=k=>{ const st=linkState(k), nx=ns&&ns.t==="s"&&ns.id===k; return `<button type="button" class="m-thr s-${st}${pl(nx)}" data-mside="${k}" style="${vert?`height:${T}px;width:${box.w}px`:`width:${T}px;height:${box.h}px`}" aria-label="Link: ${esc(LINKS3[k].map(x=>MUSE[x].kind).join(" and "))}${why(k)}" data-tip="${esc(LINKS3[k].map(x=>MUSE[x].kind).join(" & "))}${why(k)}"><i></i></button>`; };
 const kst=linkState("whole"), knx=ns&&ns.t==="c";
 const knot=`<button type="button" class="m-knot s-${kst}${pl(knx)}" data-mside="whole" style="${vert?`height:${K}px;width:${box.w}px`:`width:${K}px;height:${box.h}px`}" aria-label="All three${why("whole")}" data-tip="All three${why("whole")}"><i></i></button>`;
 const ast=linkState("vp"), anx=ns&&ns.t==="s"&&ns.id==="vp";
 const span=vert?(box.h*2+T*2):(box.w*2+T*2), pad=DEV()==="desk"?14:10, under=u.arch==="under";
 const stroke=(ast==="written"||ast==="open")?"var(--accent)":"var(--muted)", sw=ast==="written"?4:ast==="open"?1.8:1.5;
 const dash=ast==="faint"?'stroke-dasharray="1 6" stroke-linecap="round"':"", op=ast==="hidden"?0:(ast==="drawn"?.35:ast==="faint"?.6:1);
 const alab=`aria-label="Link: Poem and Painting${why("vp")}" data-tip="Poem & Painting${why("vp")}"`;
 let arch;
 if(!vert){ const left=pad+box.w/2, h=18;
  arch=`<button type="button" class="m-arch${pl(anx)}" data-mside="vp" ${alab} style="left:${left}px;width:${span}px;height:${h+6}px;${under?"bottom:2px":"top:2px"}"><svg viewBox="0 0 ${span} ${h+6}" width="${span}" height="${h+6}" style="${under?"transform:scaleY(-1)":""}"><path d="M2,${h+4} C2,2 ${span-2},2 ${span-2},${h+4}" fill="none" stroke="${stroke}" stroke-width="${sw}" ${dash} opacity="${op}"/>${ast==="open"?`<circle cx="${span/2}" cy="${h*.28+4}" r="5" fill="var(--surface)" stroke="var(--accent)" stroke-width="1.6"/>`:""}</svg></button>`;
 } else { const top=pad+box.h/2, w=18;
  arch=`<button type="button" class="m-arch${pl(anx)}" data-mside="vp" ${alab} style="top:${top}px;height:${span}px;width:${w+6}px;right:0"><svg viewBox="0 0 ${w+6} ${span}" width="${w+6}" height="${span}"><path d="M2,2 C${w+4},2 ${w+4},${span-2} 2,${span-2}" fill="none" stroke="${stroke}" stroke-width="${sw}" ${dash} opacity="${op}"/>${ast==="open"?`<circle cx="${w*.72}" cy="${span/2}" r="5" fill="var(--surface)" stroke="var(--accent)" stroke-width="1.6"/>`:""}</svg></button>`; }
 const cp=vert?"small":u.cueplace, cue=nocue?"":cueHTML();
 const inside=cp==="inside"&&cue?`<span class="m-incue">${cue}</span>`:"";
 const [a,b,c]=MUSES;
 const row=`${itemHTML(a,size,labels,vert)}${thr("pp")}${itemHTML(b,size,labels,vert)}${thr("pv")}${itemHTML(c,size,labels,vert)}${knot}${arch}${inside}`;
 const outside=cp==="inside"||!cue?"":cp==="hang"?`<span class="m-hang">${cue}</span>`:cue;
 return `<div class="m-three b-${u.backing} st-${u.three} cp-${cp} ${vert?"vert":""}" role="navigation" aria-label="Today’s three"><div class="m-trow ${under&&!vert?"under":""}">${row}</div>${outside}</div>`;
}

/* the work */
function glossLine(line){ const k=Object.keys(GLOSS).sort((a,b)=>b.length-a.length).find(w=>new RegExp("\\b"+w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"\\b").test(line)); if(!k) return ""; const d=GLOSS[k].split(/[;.]/)[0]; return `<b>${esc(k)}</b> · ${esc(d.length>34?d.slice(0,32)+"…":d)}`; }
function poemHTML(m){
 const u=U(), stanzas=m.poem.split("\n\n").map(s=>s.split("\n")); let n=0, h="";
 stanzas.forEach((st,si)=>{
  if(si>0) h+=u.stanza==="fleuron"?`<div class="m-gap fl" aria-hidden="true">❧</div>`:`<div class="m-gap"></div>`;
  st.forEach((ln,li)=>{ n++;
   const show=u.nums==="all"||((u.nums==="five"||u.nums==="hand")&&n%5===0)||(u.nums==="stanza"&&li===0);
   h+=`<div class="m-pl"><span class="n">${show?n:""}</span><span class="tx">${esc(ln)}</span><span class="mg">${u.fill==="gloss"?glossLine(ln):""}</span></div>`; });
 });
 return `<div class="m-poem museText ${u.nums==="off"?"nonum":""} ${u.numSide==="right"?"nr":""} ${u.nums==="hand"?"hand":""} ${u.fill==="gloss"?"gl":""}">${h}</div>`;
}
function fillHTML(m){
 const f=U().fill; if(f==="none"||f==="gloss") return "";
 if(f==="bubbles"||f==="scallop") return `<div class="m-fill ${f}" aria-hidden="true"></div>`;
 if(f==="stamp"){ const [pl,yr]=PLACES[m.id]||[m.maker.split(" ").slice(-1)[0].toUpperCase(), (m.date.match(/\d{4}/)||[""])[0]]; const sz=DEV()==="desk"?112:80;
  return `<div class="m-fill stamp" aria-hidden="true"><svg viewBox="0 0 120 120" width="${sz}" height="${sz}"><defs><path id="sp-${m.id}" d="M60,60 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0"/></defs><circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="60" cy="60" r="30" fill="none" stroke="currentColor" stroke-width="1.5"/><text font-family="Courier Prime, monospace" font-size="11.5" letter-spacing="3" fill="currentColor"><textPath href="#sp-${m.id}">${esc(pl)} · ${esc(yr)} · ${esc(pl)} ·</textPath></text>${GLY[m.id]?`<g transform="translate(60 60) scale(1.3)" color="currentColor">${GLY[m.id]}</g>`:""}</svg></div>`; }
 const art={
  dickinson:`<polygon points="130,-10 210,-10 120,410 30,410" fill="var(--gold)" opacity=".16"/>${[0,1,2,3,4,5,6].map(i=>`<line x1="${140+i*10}" y1="-10" x2="${50+i*10}" y2="410" stroke="currentColor" stroke-width=".8" opacity=".18"/>`).join("")}<rect x="150" y="18" width="42" height="58" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".35"/><line x1="171" y1="18" x2="171" y2="76" stroke="currentColor" stroke-width="1" opacity=".35"/><line x1="150" y1="47" x2="192" y2="47" stroke="currentColor" stroke-width="1" opacity=".35"/>${[[120,160],[96,230],[140,120],[70,300],[108,275]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.6" fill="currentColor" opacity=".3"/>`).join("")}`,
  thoreau:`<path d="M60,300 a70,70 0 0 1 140,0" fill="var(--gold)" opacity=".18"/><path d="M60,300 a70,70 0 0 1 140,0" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".35"/>${[-60,-35,-10,15,40,65].map(a=>{ const rad=(a-90)*Math.PI/180; return `<line x1="${130+Math.cos(rad)*84}" y1="${300+Math.sin(rad)*84}" x2="${130+Math.cos(rad)*130}" y2="${300+Math.sin(rad)*130}" stroke="currentColor" stroke-width="1" opacity=".3"/>`; }).join("")}${[312,324,338,354].map((y,i)=>`<line x1="${70+i*8}" y1="${y}" x2="200" y2="${y}" stroke="currentColor" stroke-width=".9" opacity="${.3-i*.05}"/>`).join("")}`
 };
 const drawing=ART7[m.id]||art[m.id];
 if(f==="drawing"&&drawing) return `<div class="m-fill" aria-hidden="true" style="color:var(--card-ink)"><svg viewBox="0 0 300 400" preserveAspectRatio="xMaxYMid slice">${drawing}</svg></div>`;
 return `<div class="m-fill" aria-hidden="true"><svg viewBox="0 0 200 400" preserveAspectRatio="xMaxYMid slice"><g filter="url(#m-wash)"><ellipse cx="170" cy="120" rx="90" ry="120" fill="var(--accent)" opacity=".13"/><ellipse cx="190" cy="300" rx="70" ry="90" fill="var(--gold)" opacity=".14"/></g></svg></div>`;
}
function workHTML(m, inBook){
 const u=U();
 if(u.storyMode==="info"&&u.infoStyle==="flip"&&S.info) return `<div class="m-work back">${labelHTML(m,false)}<div class="m-foot" style="justify-content:flex-end"><button class="btn small" data-info>Turn it back</button></div></div>`;
 if(m.plate) return `<div class="plate ${m.plate}" role="img" aria-label="Color study after ${esc(m.title)}"><span class="note">Color study · museum image in the app</span></div>${m.quote?`<blockquote class="pull museText">${esc(m.quote)}<cite>${esc(m.cite)}</cite></blockquote>`:""}`;
 if(m.kind==="Scripture") return `<div class="m-work scripture">${scriptureHTML(m)}</div>`;
 let inner;
 if(m.poem) inner=poemHTML(m);
 else { const paras=(m.quote||"").split(/(?<=…)\s+/); inner=`<div class="m-prose museText">${paras.map(p=>`<p>${esc(p)}</p>`).join("")}${m.cite?`<div class="cite">${esc(m.cite)}</div>`:""}</div>${m.notebook?`<div class="notebook-plate museText" style="margin:14px 0 0;position:relative;z-index:1">${m.notebook.map(esc).join("<br>")}<small>${esc(m.notebookNote)}</small></div>`:""}`; }
 return `<div class="m-work ${inBook?"inbook":u.paper}">${m.plate?"":fillHTML(m)}${inner}</div>`;
}
/* The third work is the day's Scripture. The painting stands beside it as a
   colour study, labelled, until the museum images are licensed and hosted. */
function studyHTML(p){
 if(!p) return "";
 const pal=p.palette||["#cfcabc","#9a9384","#6b6355"];
 const [c1,c2,c3]=[pal[0], pal[1]||pal[0], pal[2]||pal[1]||pal[0]];
 const bg=`radial-gradient(ellipse 70% 55% at 22% 24%, ${c1} 0 40%, transparent 78%),`
  +`radial-gradient(ellipse 80% 60% at 78% 72%, ${c3} 0 38%, transparent 76%),`
  +`radial-gradient(ellipse 90% 70% at 50% 50%, ${c2} 0 45%, transparent 85%), ${c2}`;
 return `<figure class="m-study"><div class="plate study" role="img" aria-label="Color study after ${esc(p.title)} by ${esc(p.artist)}" style="background:${bg}"><span class="note">Color study · museum image in the app</span></div>
  <figcaption><b>${esc(p.title)}</b><span>${esc(p.artist)}${p.era?` · ${esc(p.era)}`:""}</span></figcaption></figure>`;
}
function scriptureHTML(m){
 const lines=(m.quote||"").split("\n").filter(x=>x.trim());
 return `<blockquote class="m-verse museText">${lines.map(l=>`<span>${esc(l)}</span>`).join("")}</blockquote>
  ${studyHTML(m.painting)}`;
}
/* The ✝ beside the day's word: what else is read today, never the third work again */
function readingPanelHTML(){
 if(BANK) return `<div class="m-reading"><div class="r">${T("muse.reading.also","Also read today")}</div>
  <div class="v2">${esc(DAY.reading)}</div><p>${esc(DAY.readingNote)}</p></div>`;
 return `<div class="m-reading"><div class="v">“${esc(DAY.verse)}”</div><div class="r">${esc(DAY.verseRef)} · ${T("muse.reading.connector","today’s reading, ")}${esc(DAY.reading)}</div><p>${esc(DAY.readingNote)}</p></div>`;
}
function noteHTML(m){
 const txt=m.poemNote||(m.plate?m.where:m.cite?"":m.date)||"";
 const sw=m.palette?`<span class="pal">${m.palette.map(c=>`<span style="background:${c}"></span>`).join("")}</span>`:"";
 return txt||sw?`<div class="m-notewrap"><span class="m-worknote">${esc(txt)}</span>${sw}</div>`:"";
}

/* writing */
function writerInnerM(m, nb){
 const s=S.sealed[m.id], u=U();
 if(!s&&m.closed) return `<p class="m-nbhead">${T("muse.past.heading","This muse has passed")}</p><p style="margin:0;font-size:.92rem;color:#6b5d4d">${T("muse.past.line","Its conversation closed before you left an impression. You can still write about it in your notebook.")}</p>`;
 if(s) return `<div class="m-mine"><small>${s.via?`${T("muse.first.via","Your first impression, written as a link with the ")}${esc(synSubjects(s.via).filter(x=>x!==m.id).map(x=>MUSE[x].kind.toLowerCase()).join(" and "))}`:T("muse.first.label","Your first impression")} · ${when(s.at)}</small>${esc(s.text)}</div>
  ${m.deeper?`<div class="m-deeper"><span>${T("muse.deeper.label","Go deeper")}</span>${esc(m.deeper)}</div>`:""}
  ${myLayers(m.id).map(l=>`<div class="m-layer"><small>${esc(l.w||"later")}</small>${esc(l.t)}</div>`).join("")}
  ${m.closed?"":`<form class="m-later" id="laterF"><textarea id="layerIn" class="${nb?"":"m-wbox"}" aria-label="${T("post.reply.mine.placeholder","Add another thought")}" placeholder="${T("muse.later.placeholder","Add another thought, or reply to yourself.")}"></textarea><div class="m-foot"><span class="m-note">${T("muse.first.stays","Your first impression stays as written")}</span><button class="btn small">${T("muse.later.button","Add")}</button></div></form>`}`;
 const d=S.drafts[m.id]||"", dim=u.prompt==="focus"&&d.length>0;
 return `<p class="m-nbhead ${dim?"dim":""}">${esc(PROMPT)}</p><textarea id="draft" class="${nb?"m-grow":"m-wbox"}" aria-label="${esc(PROMPT)}" placeholder="${T("muse.prompt.placeholder","One sentence is enough.")}">${esc(d)}</textarea>
  <div class="m-foot"><span>${u.shade==="writer"?shadeHTML(m.id,34):""}</span><button class="btn primary" data-act="seal" ${d.trim()?"":"disabled"}>${T("muse.first.button","Leave my first impression")}</button></div>`;
}
function curlHTML(m){
 if(U().turner!=="curl"||m.closed) return "";
 const i=MUSES.indexOf(m), nx=MUSES[(i+1)%MUSES.length];
 return `<button type="button" class="m-curl" data-mgo="${nx.id}" aria-label="Turn to the ${esc(nx.kind.toLowerCase())}" data-tip="Next: ${esc(nx.kind)}">${shadeHTML(nx.id,26)}</button>`;
}
const RIB={dickinson:"#3b4d63", thoreau:"#2c4a58", vermeer:"#a7822f"};
Object.assign(LABELS, LABELS_NEW); Object.assign(PLACES, PLACES_NEW); Object.assign(FIRSTLINE, FIRSTLINE_NEW); Object.assign(GLY, GLY_NEW); Object.assign(RIB, RIB_NEW); Object.assign(POSTS, POSTS_NEW);
function bottomTurnerM(m){
 const u=U(); if(m.closed||u.turner==="none"||u.turner==="curl") return "";
 const i=MUSES.indexOf(m), nx=MUSES[(i+1)%MUSES.length], pv=MUSES[(i+MUSES.length-1)%MUSES.length];
 if(u.turner==="ribbons") return `<div class="m-tailrow"><button type="button" class="m-tail" data-mgo="${nx.id}" style="--rc:${RIB[nx.id]}">${shadeHTML(nx.id,28)} ${esc(nx.kind)}</button></div>`;
 const sz=DEV()==="desk"?46:40;
 return `<nav class="m-strip" aria-label="Turn to another work"><button class="arrow" type="button" data-mgo="${pv.id}" aria-label="Previous work">‹</button>${MUSES.map((x,k)=>`${k?'<span class="m-rope"></span>':""}<button type="button" class="m-it" data-mgo="${x.id}" aria-current="${x.id===m.id}">${shadeHTML(x.id,sz)}<small>${esc(x.kind)}</small></button>`).join("")}<button class="arrow" type="button" data-mgo="${nx.id}" aria-label="Next work">›</button></nav>`;
}

/* the story */
function labelHTML(m, withDetails){
 const L=LABELS[m.id]||{life:"", medium:m.where||"", ref:m.poemNote||m.cite||"", blurb:""};
 const rest=m.story.map(p=>`<p>${p}</p>`).join("");
 return `<div class="m-label ${U().story==="tag"?"tag":""}"><div class="lm">${esc(m.maker)} ${L.life?`<span class="ld">(${esc(L.life)})</span>`:""}</div><div class="lt">${esc(m.title)}</div><div class="ld">${esc(m.date)}${L.medium?` · ${esc(L.medium)}`:""}</div>
  <div class="lx museText">${L.blurb?`<p>${esc(L.blurb)}</p>`:""}${withDetails&&L.blurb?`<details><summary class="lr">Read more</summary><div style="margin-top:8px">${rest}</div></details>`:rest}</div>${L.ref?`<div class="lr">${esc(L.ref)}</div>`:""}</div>`;
}
function storyBody(m, inOverlay){
 const s=U().story;
 if(s==="label"||s==="tag") return labelHTML(m, !inOverlay);
 if(s==="cards"){ const i=(S.card||0)%m.story.length; return `<div class="m-cards"><div class="m-icard"><p class="museText">${m.story[i]}</p><div class="cn"><span>${i+1} of ${m.story.length}</span><button type="button" data-card>${i+1<m.story.length?"Next card":"Back to the first"}</button></div></div></div>`; }
 return `<div class="m-cardrow">${m.story.map((p,i)=>`<div class="m-icard"><p class="museText">${p}</p><div class="cn"><span>${i+1} of ${m.story.length}</span></div></div>`).join("")}</div>`;
}
function infoLayer(m){
 const u=U(); if(u.storyMode!=="info"||!S.info) return "";
 if(u.infoStyle==="pop") return `<div class="m-overlay" data-infobg><div>${storyBody(m,true)}<button class="m-closex" type="button" data-info aria-label="Close">×</button></div></div>`;
 if(u.infoStyle==="drawer") return `<aside class="m-drawer" aria-label="About this work"><div class="inner"><div class="dh"><span>About this ${esc(m.kind.toLowerCase())}</span><button class="m-closex" style="position:static" type="button" data-info aria-label="Close">×</button></div>${storyBody(m,true)}</div></aside>`;
 return "";
}
function keepAskHTML(){
 const mid=S.keepAsk, sid=mid?S.drawn[mid]:null; if(!sid) return "";
 const s=STICKERS[sid], checked=checkedToday()===sid;
 return `<div class="m-keep" role="dialog" aria-label="A sticker from this maker">${shadeHTML(mid,56)}<div><span class="dr">${T("sticker.drawnfrom","Drawn from ")}${esc(MAKERNAME[makerOf(mid)]||"")}</span><b>${esc(s.name)}</b>
  <p>${esc(s.source||"")}${checked?" · it carries today’s check until you move it":""}</p>
  <div class="m-keepb">${checked?"":`<button class="btn primary" data-keep="${sid}">${T("sticker.givecheck","Give it today’s check")}</button>`}<button class="btn ghost" data-act="nokeep">${T("sticker.card.close","Close")}</button></div></div></div>`;
}
function keepSticker(id){ setCheck(id); S.keepAsk=null; render(); toast(`${STICKERS[id].name}${T("toast.sticker.check"," carries today’s check. It settles at midnight.")}`); }
function synOverlay(){ if(!S.openSyn) return ""; return `<div class="m-overlay sy-ov" data-synbg><div>${synBoxHTML(S.openSyn)}</div></div>`; }

/* ---------- Phone home (from the Phone Studio): theme first, the works as a list, tap to open ---------- */
const PICON={
 pencil:'<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 25l1.6-5.4L21 7.2a2.6 2.6 0 0 1 3.8 3.7L12.4 23.4z"/><path d="M19.2 9l3.8 3.8"/><path d="M8.6 19.6l3.8 3.8"/><path d="M7 25l3-.8"/></svg>',
 book:'<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M16 9.5C13 7.3 9 6.8 5.5 7.4v16.2c3.5-.6 7.5-.1 10.5 2.1 3-2.2 7-2.7 10.5-2.1V7.4C23 6.8 19 7.3 16 9.5z"/><path d="M16 9.5v16.2"/><path d="M8.5 11.5c1.8-.2 3.6.1 5 .8M8.5 15c1.8-.2 3.6.1 5 .8M18.5 12.3c1.4-.7 3.2-1 5-.8"/></svg>',
 cross:'<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M13.2 5.5h5.6v7.7h7.7v5.6h-7.7v7.7h-5.6v-7.7H5.5v-5.6h7.7z"/></svg>',
 frame:'<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="5.5" y="7" width="21" height="18" rx="1"/><rect x="9" y="10.5" width="14" height="11"/><path d="M10 20l4-5 3 3 2.5-2.5 3.5 4.5"/></svg>'
};
const iconFor=m=>({Poem:"pencil",Passage:"book",Scripture:"cross",Painting:"frame"})[m.kind]||"book";
function constitutionHTML(){
 return `<section class="m-whyb" id="constitution"><p class="type muted" style="margin:0">${T("whybottom.from","From the Constitution of Poiesis")}</p><h2>${T("whybottom.heading","Discourse on Creation and the Muse")}</h2>
  ${["p1","p2","p3"].map(k=>`<p>${T("whybottom."+k,"")}</p>`).join("")}</section>`;
}
function keepMaxim(){ if(S.maximKept===today()) return; const c=DAY.maximCite.split(" · ")[0].split(", "); addLine({text:DAY.maxim, who:c[0], where:c.slice(1).join(", "), from:"muse"}); S.maximKept=today(); save(); render(); toast(T("toast.maxim.kept","Kept in your notebook.")); }
function maximHTML(){
 if(!DAY.maxim) return "";
 const kept=S.maximKept===today();
 return `<div class="m-maxim"><svg class="mx-col" viewBox="0 0 28 48" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4.5h22M4.5 4.5c0 2 1.5 3 3 3h13c1.5 0 3-1 3-3"/><path d="M6 9h16M7 9v31M21 9v31M11.7 10.5v28M16.3 10.5v28"/><path d="M5.5 40.5h17M3.5 44h21"/></svg><div class="mx-t"><span class="mx-q">“${esc(DAY.maxim)}”</span><span class="mx-c">${esc(DAY.maximCite)}</span><button type="button" class="mx-keep" data-act="keepmaxim" ${kept?"disabled":""}>${kept?T("maxim.kept","kept"):T("maxim.keep","keep it")}</button></div></div>`;
}
function phoneHomeHTML(){
 const dateStr=new Date().toLocaleDateString(undefined,{weekday:"long", month:"long", day:"numeric"});
 const done=id=>!!S.sealed[id], all=MUSES.every(x=>done(x.id)), first=MUSES.find(x=>!done(x.id)), none=!MUSES.some(x=>done(x.id));
 const seg=(a,b,id)=>{ if(!id) return ""; const lbl=`${MUSE[a].kind.toLowerCase()} and ${MUSE[b].kind.toLowerCase()}`; return `<button type="button" class="ph-seg" data-side="${id}">${S.syn[id]?"✓ "+T("phone.link.done","linked: ")+lbl:"↳ "+T("phone.link.write","write a link: ")+lbl}</button>`; };
 const rows=MUSES.map((w,i)=>{ const st=done(w.id)?`<span class="ph-st">✓ ${T("phone.written","written")}</span>`:`<span class="ph-st"><span class="ph-dash">${w.kind==="Scripture"?"✝":esc(w.maker.split(" ").slice(-1)[0][0])}</span></span>`;
   const nextSeg=i<MUSES.length-1?seg(w.id,MUSES[i+1].id,LINKS.find(l=>(l.a===w.id&&l.b===MUSES[i+1].id)||(l.b===w.id&&l.a===MUSES[i+1].id))?.id):"";
   return `<button type="button" class="ph-row" data-popen="${w.id}"><span class="ph-ic" aria-hidden="true">${PICON[iconFor(w)]}</span><span class="ph-rt"><span class="k">${esc(w.kind.toLowerCase())}</span><b>${esc(w.title)}</b><span class="mk">${esc(w.maker)}</span></span>${st}${none&&first===w?`<span class="ph-begin">${T("phone.begin","begin here")}</span>`:""}</button>${nextSeg||""}`; }).join("");
 const knot=true?`<button type="button" class="ph-knot" data-side="whole"><span>◇</span>${S.syn.whole?T("phone.all.done","You tied all three together"):T("phone.all.write","Tie all three together")}</button>`:"";
 const reading=S.reading?readingPanelHTML():"";
 const cols=TODAY.slice(0,4).map(p=>`<span style="background:${PEOPLE[p.n].c}">${esc(initials(p.n))}</span>`).join("");
 return `<div class="ph-home"><p class="ph-date">${esc(dateStr)}</p>
  <div class="ph-theme"><h1 class="ph-tw">${esc(DAY.theme)}</h1><button class="m-cross" type="button" data-act="reading" aria-expanded="${!!S.reading}" aria-label="The day’s reading">✝</button></div>
  ${maximHTML()}${reading}
  <div class="ph-three">${rows}${knot}</div>
  ${TODAY.length?`<div class="ph-others"><span class="ph-avs">${cols}</span>${TODAY.length}${T("phone.others.suffix"," others wrote today")}</div>`
   :`<div class="ph-others">${mineParts().length?T("cue.onlyyou.some","Only you here so far today"):T("cue.onlyyou","Nobody here yet today")}</div>`}</div>`;
}
function renderMuse(v){
 if(DEV()==="phone"&&!S.past&&S.phome!==false){
  v.innerHTML=`${phoneHomeHTML()}${synOverlay()}${keepAskHTML()}`;
  wireBoard(v);
  v.onclick=e=>{
   const o=e.target.closest("[data-popen]"); if(o){ S.phome=false; goMuse(o.dataset.popen); return; }
   const sd=e.target.closest("[data-side]"); if(sd){ openSyn(sd.dataset.side); return; }
   if(e.target.matches("[data-synbg]")){ S.openSyn=null; save(); render(); return; }
   const kp=e.target.closest("[data-keep]"); if(kp){ keepSticker(kp.dataset.keep); return; }
   const vt=e.target.closest("[data-vertgo]"); if(vt){ S.phome=false; goMuse(vt.dataset.vertgo); return; }
   const a=e.target.closest("[data-act]")?.dataset.act; if(!a) return;
   if(a==="reading"){ S.reading=!S.reading; save(); render(); }
   if(a==="keepmaxim"){ keepMaxim(); }
   if(a==="why"){ e.preventDefault(); go("why"); }
   if(a==="closesyn"){ S.openSyn=null; save(); render(); }
   if(a==="pubsyn") publishSyn(S.openSyn);
   if(a==="nokeep"){ S.keepAsk=null; save(); render(); }
  };
  return;
 }
 const m=curMuse(), u=U(), dev=DEV(), past=!!m.closed;
 const dateStr=new Date().toLocaleDateString(undefined,{weekday:"long", month:"long", day:"numeric"});
 const themeW=`<h1 class="m-themebig">${esc(DAY.theme)}</h1><button class="m-cross" type="button" data-act="reading" aria-expanded="${!!S.reading}" aria-label="The day’s reading" data-tip="The day’s reading · ${esc(DAY.reading)}">✝</button>`;
 const reading=(S.reading&&!past)?readingPanelHTML():"";
 const day=past?`<div class="pastbar" style="margin-top:18px"><span><b>${esc(m.day)}</b> · this muse has passed</span><button class="btn small" data-act="today">${T("muse.past.back","Back to today’s muses")}</button></div>`:`<div class="m-dayrow"><div class="m-dayl"><span class="type muted">${esc(dateStr)}</span><div class="m-themewrap">${themeW}</div>${maximHTML()}</div>${u.tplace==="title"&&dev==="desk"?"":`<div class="m-dayr">${threeHTML(threeSize(),false,true)}</div>`}</div>${reading}`;
 const info=u.storyMode==="info"?`<button class="m-infob" type="button" data-info aria-expanded="${!!S.info}" aria-label="About this work" data-tip="${T("muse.info.label","About this work")}">i</button>`:"";
 const cueside=(!past&&U().cue!=="off")?`<span class="m-cueside">${cueHTML()}</span>`:"";
 const head=`<div class="m-head"><div class="m-htop"><div class="m-hl"><span class="type kind">${esc(m.kind)}</span><div class="m-tl"><h2 class="mtitle">${esc(m.title)}</h2>${info}</div><div class="byline">${esc(m.maker)} · ${esc(m.date)}</div></div>${cueside}</div></div>`;
 const story=u.storyMode==="under"?`<div class="m-story">${storyBody(m,false)}</div>`:"";
 let body;
 if(dev==="desk"){
  const beside=!past&&u.tplace==="title", design=u.nb, spread=design==="spread";
  const nb=`<div class="m-nb d-${design} paper-${u.nbpaper}" id="writerBox">${writerInnerM(m,true)}${spread?"":curlHTML(m)}</div>`;
  const colL=`<div class="m-colL">${head}<div class="m-wwrap">${workHTML(m,spread)}</div>${noteHTML(m)}</div>`;
  const colR=`<div class="m-colR">${beside?threeHTML(threeSize(),false):""}${nb}</div>`;
  let duo=`<div class="m-duo">${colL}${colR}</div>`;
  /* the folio is the page mark, not a second printing of the note above it */
  if(spread) duo=`<div class="m-book">${duo}<span class="m-folio">${esc(m.kind)} · ${MUSES.indexOf(m)+1} of ${MUSES.length}</span>${curlHTML(m)}</div>`;
  body=`${day}${duo}${bottomTurnerM(m)}${story}`;
 } else {
  const titleRow=head;
  const tab=(!S.sealed[m.id]&&!past&&u.wtab!=="off")?`<div class="m-tabrail"><button type="button" class="m-wtab ${u.wtab==="edge"?"edge":""}" data-act="towrite" aria-label="Write your first impression">${PENCIL}</button></div>`:"";
  const look=u.wlook==="line"&&S.sealed[m.id]?"notecard":u.wlook;
  body=`${day}<div class="m-stack">${titleRow}<div class="m-wscope">${tab}<div class="m-wwrap">${workHTML(m,false)}${curlHTML(m)}</div>${noteHTML(m)}<div style="height:var(--gap)"></div><div class="m-writer ${look}" id="writerBox">${writerInnerM(m,false)}</div></div></div>${story}${bottomTurnerM(m)}`;
 }
 if(dev==="phone"&&!past){ const i=MUSES.indexOf(m), nx=MUSES[(i+1)%MUSES.length];
  body=`<div class="ph-bar"><button type="button" class="ph-back" data-act="phome">${T("phone.back","‹ Today")}</button><span class="ph-mini">${esc(DAY.theme)}</span></div>${body.replace(day,"")}<p class="ph-nextw"><button type="button" class="ph-back" data-mgo="${nx.id}">${T("phone.next","Next work ›")}</button></p>`; }
 v.innerHTML=`${body}${responsesHTML(m)}${infoLayer(m)}${synOverlay()}${keepAskHTML()}`;
 wireBoard(v); wireWriterM(m); if(u.gloss!=="none") applyGloss(v);
 v.onclick=e=>{
  const g=e.target.closest("[data-mgo]"); if(g){ goMuse(g.dataset.mgo); return; }
  const vt=e.target.closest("[data-vertgo]"); if(vt){ goMuse(vt.dataset.vertgo); setTimeout(()=>$("#draft")?.focus({preventScroll:true}),200); return; }
  const sd=e.target.closest("[data-mside],[data-side]"); if(sd){ openSyn(sd.dataset.mside||sd.dataset.side); return; }
  if(e.target.closest("[data-info]")||e.target.matches("[data-infobg]")){ S.info=!S.info; save(); render(); return; }
  if(e.target.matches("[data-synbg]")){ S.openSyn=null; save(); render(); return; }
  if(e.target.closest("[data-card]")){ S.card=(S.card||0)+1; save(); render(); return; }
  const kp=e.target.closest("[data-keep]"); if(kp){ keepSticker(kp.dataset.keep); return; }
  const pa=e.target.closest("[data-pa]"); if(pa){ postAction(pa); return; }
  const a=e.target.closest("[data-act]")?.dataset.act; if(!a) return;
  if(a==="today"){ S.past=null; S.phome=true; save(); render(); }
  if(a==="phome"){ S.phome=true; S.info=false; save(); render(); scrollTo({top:0}); }
  if(a==="why"){ e.preventDefault(); go("why"); }
  if(a==="reading"){ S.reading=!S.reading; save(); render(); }
   if(a==="keepmaxim"){ keepMaxim(); }
  if(a==="nokeep"){ S.keepAsk=null; save(); render(); toast("You can keep one from any muse you’ve answered, until midnight."); }
  if(a==="closesyn"){ S.openSyn=null; save(); render(); }
  if(a==="pubsyn") publishSyn(S.openSyn);
  if(a==="towrite"){ const t=$("#draft"); $("#writerBox")?.scrollIntoView({block:"center", behavior:reduce?"auto":"smooth"}); setTimeout(()=>t?.focus({preventScroll:true}),350); }
  if(a==="seal") seal(m);
 };
}
function wireWriterM(m){
 const d=$("#draft");
 if(d){ const fill=d.classList.contains("m-grow"); if(!fill) autogrow(d);
  d.oninput=()=>{ S.drafts[m.id]=d.value; save(); if(!fill) autogrow(d);
   const b=document.querySelector('[data-act="seal"]'); if(b) b.disabled=!d.value.trim();
   const q=d.parentElement.querySelector(".m-nbhead"); if(q&&U().prompt==="focus") q.classList.toggle("dim", d.value.length>0);
   if(U().reveal==="ink"){ const a=revealAmt(m.id); document.querySelectorAll(`.m-stk[data-sid="${m.id}"] .full`).forEach(el=>el.style.opacity=a); } }; }
 const f=$("#laterF"); if(f) f.onsubmit=e=>{ e.preventDefault(); const t=$("#layerIn").value.trim(); if(!t) return; const s=S.sealed[m.id];
  (S.replies["me_"+m.id]=S.replies["me_"+m.id]||[]).push({n:"You", t, w:when(Date.now())});
  const j=S.journal.find(x=>x.id===s.jid); if(j) j.body+=`\n\nLater: ${t}`; save(); render(); toast(T("toast.later.added","Added under your impression.")); };
}

/* settings view in the profile */
function settingsHTML(){
 const d=S.setDev||DEV(), u=S.ui[d];
 return `<div class="panel"><div class="m-sethead"><div><h3>${T("profile.settings.heading","Settings")}</h3><p class="muted">${T("profile.settings.line","How the Muse page looks for you. Wide screens and phones keep their own settings; you’re on ")}${DEV()==="desk"?"a wide screen":"a phone"} now.</p></div>
  <div class="viewt" role="group" aria-label="Which screen"><button data-setdev="desk" aria-pressed="${d==="desk"}">Wide screens</button><button data-setdev="phone" aria-pressed="${d==="phone"}">Phones</button></div></div>
  ${SETTINGS.filter(g=>!g.dev||g.dev===d).map(g=>`<fieldset class="m-grp"><legend>${esc(g.name)}</legend>${g.ctrls.filter(c=>!c.dev||c.dev===d).map(c=>{ const on=!c.when||c.when(u,d);
   return `<div class="m-ctrl ${on?"":"off"}"><span class="m-cl">${esc(c.label)}</span><div class="m-seg" role="group" aria-label="${esc(c.label)}">${c.opts.map(([val,l])=>`<button type="button" data-set="${c.k}" data-val="${val}" aria-pressed="${u[c.k]===val}" ${on?"":"disabled"}>${esc(l)}</button>`).join("")}</div></div>`; }).join("")}</fieldset>`).join("")}
  <div class="rowbtns" style="margin-top:16px"><button class="btn" data-sethouse>Put back the house style for ${d==="desk"?"wide screens":"phones"}</button></div></div>`;
}
function renderSettings(v){
 v.innerHTML=`<div class="viewt m-ptabs" role="tablist"><button data-ptab="you" aria-pressed="false">${T("profile.tab.you","Your profile")}</button><button data-ptab="settings" aria-pressed="true">${T("profile.tab.settings","Settings")}</button></div>${settingsHTML()}`;
 v.onclick=e=>{
  const pt=e.target.closest("[data-ptab]"); if(pt){ S.ptab=pt.dataset.ptab; save(); render(); return; }
  const sd=e.target.closest("[data-setdev]"); if(sd){ S.setDev=sd.dataset.setdev; save(); renderSettings(v); return; }
  const b=e.target.closest("[data-set]"); if(b){ const d=S.setDev||DEV(); setPref(b.dataset.set,b.dataset.val,d); save(); applyPrefs(); renderSettings(v); return; }
  if(e.target.closest("[data-sethouse]")){ const d=S.setDev||DEV(); const keep={room:S.ui[d].room,font:S.ui[d].font}; S.ui[d]=Object.assign(clone(HOUSE[d]),keep); save(); applyPrefs(); renderSettings(v); toast(`Back to the house style for ${d==="desk"?"wide screens":"phones"}.`); }
 };
}

function goMuse(id){ const k=MUSES.findIndex(x=>x.id===id); if(k<0){ S.past=id; } else { S.past=null; S.mi=k; } S.openSyn=null; S.info=false; S.card=0; save(); render(); const top=$("#view").getBoundingClientRect().top; if(top<0) scrollTo({top:scrollY+top-70, behavior:reduce?"auto":"smooth"}); }
function openSyn(id){
 S.info=false;
 S.openSyn=S.openSyn===id?null:id; save(); render();
 if(S.openSyn){ setTimeout(()=>{ $("#synbox")?.scrollIntoView({behavior:reduce?"auto":"smooth", block:"center"}); $("#synDraft")?.focus(); },80); }
}
function wireBoard(v){
 const sd=v.querySelector("#synDraft");
 if(sd){ autogrow(sd); sd.oninput=()=>{ S.synDrafts[S.openSyn]=sd.value; save(); autogrow(sd); const b=v.querySelector('[data-act="pubsyn"]'); if(b) b.disabled=!sd.value.trim(); }; }
}
function autogrow(t){ t.style.height="auto"; t.style.height=Math.max(44,t.scrollHeight)+"px"; }
function wireWriter(m){
 const d=$("#draft");
 if(d){ autogrow(d); d.oninput=()=>{ S.drafts[m.id]=d.value; save(); autogrow(d); const b=document.querySelector('[data-act="seal"]'); if(b) b.disabled=!d.value.trim(); }; }
 const f=$("#laterF"); if(f) f.onsubmit=e=>{ e.preventDefault(); const t=$("#layerIn").value.trim(); if(!t) return; const s=S.sealed[m.id];
  (S.replies["me_"+m.id]=S.replies["me_"+m.id]||[]).push({n:"You", t, w:when(Date.now())});
  const j=S.journal.find(x=>x.id===s.jid); if(j) j.body+=`\n\nLater: ${t}`; save(); render(); toast(T("toast.later.added","Added under your impression.")); };
}
function seal(m){
 const t=(S.drafts[m.id]||"").trim(); if(!t) return;
 const jid=uid("j"); S.sealed[m.id]={text:t, at:Date.now(), jid};
 S.journal.unshift({id:jid, date:today(), title:`First impression: ${m.maker}`, lines:[], q:null, muse:m.id, body:t}); remember("journal",jid,`First impression: ${m.maker}`);
 S.drafts[m.id]=""; const all=MUSES.every(x=>S.sealed[x.id]);
 Table.put({id:"t_"+WHO+"_"+m.id, on:m.id, by:WHO, name:S.profile.name||WHONAME, at:Date.now(), day:today(), text:t});
 const drew=drawSticker(m.id); if(drew) setCheck(drew); S.keepAsk=drew?m.id:null; save(); render();
 toast(all?"All three. The knot after the painting is open, and the day’s word is uncovered.":drew?`You drew ${STICKERS[drew].name}.`:"Kept. Here’s how it sang in others.");
 setTimeout(()=>$("#responses")?.scrollIntoView({behavior:reduce?"auto":"smooth", block:"start"}),60);
}
function findPost(pid, mid){
 if(pid.startsWith("me_")) return {mine:true, name:"You", first:pid.startsWith("me_syn_")?S.syn[pid.slice(7)]?.text:S.sealed[mid]?.text};
 return postsFor(mid).find(x=>x.id===pid) || SYNS.find(x=>x.id===pid);
}
function postAction(b){
 const art=b.closest("[data-p]"), pid=art.dataset.p, mid=art.dataset.m, p=findPost(pid, mid); if(!p) return;
 const k=b.dataset.pa;
 if(k==="like"){ S.likes[pid]=!S.likes[pid]; save(); b.setAttribute("aria-pressed",String(!!S.likes[pid])); b.textContent=S.likes[pid]?T("post.moved.on","♥ Moved me"):T("post.moved.off","♡ Moved me"); if(S.likes[pid]) toast(`${p.name.split(" ")[0]}${T("toast.moved"," will see that it moved you. Nobody else will.")}`); }
 if(k==="bm"){ const menu=art.querySelector(".bmenu"), was=menu.hidden; document.querySelectorAll(".bmenu").forEach(x=>x.hidden=true); menu.hidden=!was; b.setAttribute("aria-expanded",String(was)); }
 if(k==="reply"){ const slot=art.querySelector(".slot2"); slot.innerHTML=`<form class="cform"><input class="field" id="cIn" aria-label="Write back" placeholder="${p.mine?T("post.reply.mine.placeholder","Add another thought"):T("post.reply.placeholder","Say what it stirred in you")}"><button class="btn primary">${T("post.reply.send","Send")}</button></form>`; $("#cIn").focus();
  slot.querySelector("form").onsubmit=e=>{ e.preventDefault(); const t=$("#cIn").value.trim(); if(!t) return; (S.replies[pid]=S.replies[pid]||[]).push({n:"You", t, w:when(Date.now())}); save(); render(); }; }
 if(k==="save"){ const to=b.dataset.to, txt=p.later?.poem||p.later?.text||p.first;
  const lid=addLine({text:txt, who:p.name, where:MUSE[mid]?`beside ${MUSE[mid].maker}`:"", from:"muse", muse:MUSE[mid]?mid:null});
  if(to==="page"){ newPage([lid]); toast(T("toast.page.under","A page is open under it in your notebook.")); }
  save(); art.querySelector(".bmenu").hidden=true; }
}

/* highlight to quote */
const sp=$("#selpop"); let selText="";
function hideSel(){ sp.hidden=true; }
function selCheck(e){ setTimeout(()=>{
 if(S.tab!=="muse" || (e&&sp.contains(e.target))) return;
 const sel=getSelection(); const t=sel?.toString().trim();
 if(!t || t.length<3){ hideSel(); return; }
 const n=sel.anchorNode&&(sel.anchorNode.nodeType===1?sel.anchorNode:sel.anchorNode.parentElement);
 if(!n||!n.closest(".museText")){ hideSel(); return; }
 selText=t.replace(/\s+/g," "); const r=sel.getRangeAt(0).getBoundingClientRect(); const m=curMuse();
 const canQuote=!S.sealed[m.id]&&!m.closed;
 sp.innerHTML=`${canQuote?`<button data-q="thought">${T("keep.quote","Quote in my impression")}</button>`:""}<button data-q="board">${T("keep.menu.line","Keep the line")}</button><button data-q="journal">${T("keep.menu.page","Write a page under it")}</button>`;
 sp.hidden=false; sp.style.left=Math.max(8,Math.min(innerWidth-sp.offsetWidth-8, r.left+scrollX+r.width/2-sp.offsetWidth/2))+"px"; sp.style.top=(r.top+scrollY-sp.offsetHeight-8)+"px";
},10); }
document.addEventListener("mouseup", selCheck); document.addEventListener("touchend", selCheck);
sp.addEventListener("click", e=>{
 const q=e.target.closest("[data-q]")?.dataset.q; if(!q) return; const m=curMuse();
 if(q==="thought"){ S.drafts[m.id]=((S.drafts[m.id]||"").trim()?S.drafts[m.id].trimEnd()+" ":"")+`“${selText}” `; save(); getSelection().removeAllRanges(); hideSel(); render(); setTimeout(()=>{ const d=$("#draft"); if(d){ d.focus(); d.setSelectionRange(d.value.length,d.value.length); } },30); toast(T("toast.quoted","Quoted. Write beside it.")); }
 if(q==="board"){ addPin({text:selText, cite:m.maker, where:m.title, muse:m.id}); getSelection().removeAllRanges(); hideSel(); }
 if(q==="journal"){ const lid=addLine({text:selText, who:m.maker, where:m.title, from:"muse", muse:m.id}); newPage([lid]); toast(T("toast.page.under","A page is open under it in your notebook.")); getSelection().removeAllRanges(); hideSel(); if(S.tab==="notebook") render(); }
});

/* definitions & tips */
const tip=document.createElement("div"); tip.className="tip"; tip.hidden=true; tip.setAttribute("role","tooltip"); document.body.appendChild(tip);
function showTip(el){ const t=el.dataset.tip||el.dataset.def; if(!t) return; tip.innerHTML=el.dataset.def?`<b>${esc(el.textContent)}</b> ${esc(t)}`:esc(t); tip.hidden=false;
 const r=el.getBoundingClientRect(); const w=tip.offsetWidth; tip.style.left=Math.max(8,Math.min(innerWidth-w-8, r.left+scrollX+r.width/2-w/2))+"px"; tip.style.top=(r.top+scrollY-tip.offsetHeight-8)+"px"; }
function hideTip(){ tip.hidden=true; }
document.addEventListener("mouseover", e=>{ const el=e.target.closest("[data-def],[data-tip]"); if(el) showTip(el); else hideTip(); });
document.addEventListener("focusin", e=>{ const el=e.target.closest("[data-def],[data-tip]"); if(el) showTip(el); else hideTip(); });
document.addEventListener("click", e=>{ const el=e.target.closest("[data-def]"); if(el) showTip(el); });
function applyGloss(root){
 const keys=Object.keys(GLOSS).sort((a,b)=>b.length-a.length);
 const re=new RegExp("\\b("+keys.map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("|")+")\\b","g");
 const used=new Set();
 root.querySelectorAll(".museText").forEach(box=>{
  const w=document.createTreeWalker(box, NodeFilter.SHOW_TEXT); const nodes=[]; while(w.nextNode()) nodes.push(w.currentNode);
  nodes.forEach(n=>{ if(n.parentElement.closest("cite,.def,small")) return; const txt=n.nodeValue; re.lastIndex=0; if(!re.test(txt)) return; re.lastIndex=0;
   const frag=document.createDocumentFragment(); let last=0, mm;
   while((mm=re.exec(txt))){ const wd=mm[1]; if(used.has(wd.toLowerCase())) continue; used.add(wd.toLowerCase());
    frag.appendChild(document.createTextNode(txt.slice(last,mm.index))); const s=document.createElement("span"); s.className="def"; s.tabIndex=0; s.dataset.def=GLOSS[wd]; s.textContent=wd; frag.appendChild(s); last=mm.index+wd.length; }
   if(last===0) return; frag.appendChild(document.createTextNode(txt.slice(last))); n.replaceWith(frag); });
 });
}
document.addEventListener("keydown", e=>{ if(S.tab!=="muse"||S.past||/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
 if(e.key==="ArrowRight"&&S.mi<MUSES.length-1){ S.mi++; save(); render(); } if(e.key==="ArrowLeft"&&S.mi>0){ S.mi--; save(); render(); } });

/* ---------- Notebook (Round 8): one notebook, four ways in ---------- */
const WAYS=[["page",T("nb.way.page","Page")],["board",T("nb.way.board","Board")],["questions",T("nb.way.questions","Questions")],["today",T("nb.way.today","Today")],["index",T("nb.way.index","Index")]];
function lineById(id){ return S.lines.find(l=>l.id===id); }
function addLine(o){ const id=uid("l"); S.lines.unshift(Object.assign({id, date:today(), from:"you", x:8+Math.random()*60, y:8+Math.random()*58, r:(Math.random()*6-3).toFixed(1)}, o)); save(); return id; }
function newPage(lineIds, q){ const id=uid("j"); S.journal.unshift({id, date:today(), title:"", body:"", lines:lineIds||[], q:q||null, muse:null}); S.nb.sel=id; S.nb.way="page"; S.nb.pick=[]; save(); return id; }
function pageLines(p){ return (p.lines||[]).map(lineById).filter(Boolean); }
function qById(id){ return S.questions.find(q=>q.id===id); }
function lastOn(qid){ const p=S.journal.find(p=>p.q===qid); return p?(pageLines(p)[0]?.text || p.body.split("\n")[0] || "—"):"—"; }
function pagesOn(qid){ return S.journal.filter(p=>p.q===qid); }
function daysSince(d){ return Math.round((Date.now()-new Date(d+"T12:00").getTime())/864e5); }

function trayHTML(){
 const groups=[["phone",T("nb.tray.phone","From your phone")],["you",T("nb.tray.yours","Your own")],["muse",T("nb.tray.today","Kept today")],["carried",T("nb.tray.carried","Carried")],["before",T("nb.tray.before","Before")]];
 const bucket=l=>l.from==="phone"?"phone":l.from==="you"?"you":l.date===today()?"muse":l.carried?"carried":"before";
 const shown=S.lines.filter(l=>!l.rest);
 return `<div class="nb-tray"><div class="nb-trayhead"><p class="type" style="margin:0">${T("nb.tray.heading","Lines you kept")}</p><button class="btn small" data-nbact="addline">${T("nb.tray.add","+ Add a line")}</button></div>
  ${S.nb.adding?`<form class="nb-addline" id="addLineF"><input class="field" id="alText" placeholder="${T("nb.line.placeholder","The line")}" aria-label="The line"><div class="nb-addrow"><input class="field" id="alWho" placeholder="${T("nb.who.placeholder","Who said it")}" aria-label="Who"><input class="field" id="alWhere" placeholder="${T("nb.where.placeholder","Where from")}" aria-label="Where from"><button class="btn primary small">${T("nb.keepit","Keep it")}</button></div></form>`:""}
  ${groups.map(([k,label])=>{ const ls=shown.filter(l=>bucket(l)===k); if(!ls.length) return "";
   return `<div class="nb-group"><span class="nb-glabel">${label}</span>${ls.slice(0,6).map(l=>`<button class="nb-line ${S.nb.pick.includes(l.id)?"picked":""}" data-nbline="${l.id}" title="Tap to use this line">${esc(l.text)}${l.who?`<i>— ${esc(l.who)}</i>`:""}</button>`).join("")}</div>`; }).join("")}
  ${S.nb.pick.length?`<div class="nb-picked"><span>${S.nb.pick.length} line${S.nb.pick.length>1?"s":""} chosen</span><button class="btn small primary" data-nbact="writeunder">${T("nb.writeunder","Write under ")}${S.nb.pick.length>1?"these":"this"}</button><button class="btn small ghost" data-nbact="clearpick">${T("nb.clear","Clear")}</button></div>`:""}</div>`;
}
function artHTML(p){
 const m=p.muse&&MUSE[p.muse]; if(!m||!m.plate) return "";
 return `<div class="nb-art ${S.nb.closer?"open":""}"><div class="plate ${m.plate}" role="img" aria-label="Color study after ${esc(m.title)}"></div>
  <div><b>${esc(m.title)}</b><small>${esc(m.maker)}</small><button class="btn small" data-nbact="closer">${S.nb.closer?T("nb.art.smaller","Smaller again"):T("nb.art.closer","Look closer")}</button></div></div>`;
}
function pagePromptFor(p){
 const n=pageLines(p).length;
 if(p.q) return `${T("page.prompt.question","Hanging on: ")}${qById(p.q)?.text||"a question"}`;
 if(n===0) return T("page.prompt.none","An empty page. Put a line at the top, or just start writing.");
 if(n===1) return T("page.prompt.one","One line at the top. What does it ask of you?");
 if(n===2) return T("page.prompt.two","Two lines that have never met. Write the paragraph that introduces them.");
 return T("page.prompt.three","Three lines. What do they know together that none of them knows alone?");
}
function pageHTML(){
 let p=S.journal.find(x=>x.id===S.nb.sel)||S.journal[0];
 if(!p){ newPage([]); p=S.journal[0]; }
 const ls=pageLines(p);
 return `<div class="nb-split ${S.nb.closer?"closer":""}">
  <div class="nb-side">${trayHTML()}</div>
  <div class="nb-main">
   <div class="nb-page" data-id="${p.id}">
    ${artHTML(p)}
    <div class="nb-epi">${ls.length?ls.map((l,i)=>`<div class="nb-epiline ${i===0?"first":""}"><span>${esc(l.text)}</span><small>${esc([l.who,l.where].filter(Boolean).join(", "))}</small><button class="x2" data-nbdrop="${l.id}" aria-label="Take this line off the page">×</button></div>`).join(""):`<p class="nb-empty">${T("page.empty","No line yet — choose one from the left, or write straight onto the page.")}</p>`}</div>
    <input class="nb-title" id="nbTitle" value="${esc(p.title||"")}" placeholder="${T("page.title.placeholder","Title (if it wants one)")}" aria-label="Title">
    <p class="nb-prompt">${esc(pagePromptFor(p))}</p>
    <textarea class="nb-body" id="nbBody" aria-label="Write" placeholder="${T("page.body.placeholder","Write under it…")}">${esc(p.body||"")}</textarea>
    <div class="nb-foot">
     <label class="nb-hang">${T("page.hangs","Hangs on")}
      <select id="nbQ" aria-label="Hang this page on a question"><option value="">${T("page.hangs.none","— nothing yet —")}</option>${S.questions.map(q=>`<option value="${q.id}" ${p.q===q.id?"selected":""}>${esc(q.text)}</option>`).join("")}<option value="__new">${T("page.hangs.new","+ a new question…")}</option></select></label>
     <span class="nb-saved">${T("page.saved","Saved as you write")}</span>
     <button class="btn small" data-nbact="newpage">${T("page.new","New page")}</button>
     <button class="btn ghost small" data-nbact="tearout">${T("page.tearout","Tear out")}</button></div>
   </div>
  </div></div>`;
}
function boardHTMLnb(){
 return `<div class="nb-boardwrap">
  <div class="nb-bhead"><p class="muted" style="margin:0;font-size:.9rem">${T("board.line","Everything you have kept. Choose up to three, then write under them.")}</p>
   <div class="rowbtns"><button class="btn small" data-nbact="addline">${T("board.add","+ Pin a line of your own")}</button>${S.nb.pick.length?`<button class="btn small primary" data-nbact="writeunder">${T("nb.writeunder","Write under ")}${S.nb.pick.length>1?"these "+S.nb.pick.length:"this"}</button>`:""}</div></div>
  ${S.nb.adding?`<form class="nb-addline" id="addLineF"><input class="field" id="alText" placeholder="${T("nb.line.placeholder","The line")}" aria-label="The line"><div class="nb-addrow"><input class="field" id="alWho" placeholder="${T("nb.who.placeholder","Who said it")}" aria-label="Who"><input class="field" id="alWhere" placeholder="${T("nb.where.placeholder","Where from")}" aria-label="Where from"><button class="btn primary small">${T("nb.pinit","Pin it")}</button></div></form>`:""}
  <div class="board" id="cork">${S.lines.filter(l=>!l.rest).map(l=>`<div class="bcard quote ${S.nb.pick.includes(l.id)?"picked":""}" data-nbline="${l.id}" data-id="${l.id}" tabindex="0" style="left:${l.x}%;top:${l.y}%;transform:rotate(${l.r}deg)">${esc(l.text)}${l.who?`<cite>${esc([l.who,l.where].filter(Boolean).join(", "))}</cite>`:""}<button class="x" data-nbrest="${l.id}" aria-label="Let this line rest">×</button></div>`).join("")}</div>
  <p class="muted" style="margin:8px 0 0;font-size:.84rem">${T("board.foot","Drag them about. A line you take down goes to rest; the Index still has it.")}</p></div>`;
}
function questionsHTML(){
 const open=S.questions.filter(q=>!q.done), done=S.questions.filter(q=>q.done);
 return `<div class="nb-qs">
  <form class="nb-addq" id="addQF"><input class="field" id="qIn" placeholder="${T("q.placeholder","A question you keep coming back to")}" aria-label="New question"><button class="btn primary small">${T("q.add","Put it on the shelf")}</button></form>
  ${open.map(q=>{ const ps=pagesOn(q.id), last=ps[0], quiet=last?daysSince(last.date):null;
   return `<div class="nb-q"><div class="nb-qtop"><b>${esc(q.text)}</b>${quiet!==null&&quiet>=14?`<span class="nb-nudge">${T("q.nudge","Still breathing?")}</span>`:""}</div>
    <p class="nb-qlast">${esc(lastOn(q.id))}</p>
    <div class="rowbtns"><button class="btn small" data-nbq="${q.id}">${T("q.next","Write the next page on this")}</button><button class="btn ghost small" data-nbthread="${q.id}">${ps.length} page${ps.length===1?"":"s"}</button><button class="btn ghost small" data-nbdone="${q.id}">${T("q.became","This has become something")}</button></div>
    ${S.nb.thread===q.id?`<div class="nb-thread">${ps.length?ps.map(p=>`<button class="nb-tp" data-nbopen="${p.id}"><span class="d">${fmt(p.date)}</span>${esc(p.title||(pageLines(p)[0]?.text)||p.body.slice(0,60)||"Untitled")}</button>`).join(""):`<p class="muted" style="margin:0;font-size:.88rem">${T("q.thread.empty","Nothing written on it yet.")}</p>`}</div>`:""}</div>`; }).join("")||`<p class="muted">${T("q.empty","No questions yet. They are the threads that hold pages together.")}</p>`}
  ${done.length?`<details class="nb-became"><summary>${T("q.became.heading","Became something")} (${done.length})</summary>${done.map(q=>`<div class="nb-q done"><b>${esc(q.text)}</b><button class="btn ghost small" data-nbreopen="${q.id}">${T("q.reopen","Open it again")}</button></div>`).join("")}</details>`:""}</div>`;
}
function todayHTML(){
 const m=MUSES[0], voices=[["muse",T("today.voice.muse","The muse"),T("today.voice.muse.line","What did today’s three put in front of you?")],["table",T("today.voice.table","The table"),T("today.voice.table.line","Someone else’s impression that stayed with you.")],["you",T("today.voice.you","You, before"),T("today.voice.you.line","A page of your own you have not finished with.")]];
 const v=S.nb.voice||"muse";
 const src=v==="muse"?(S.sealed[curMuse().id]?.text||FIRSTLINE_NEW[curMuse().id]||curMuse().title)
  :v==="table"?(postsFor(curMuse().id)[0]?.first||"—")
  :(S.journal[0]?.body?.split("\n")[0]||S.journal[0]?.title||"—");
 return `<div class="nb-today">
  <div class="nb-facing left"><p class="type muted" style="margin:0 0 8px">${T("today.who","Who speaks first")}</p>
   <div class="nb-voices">${voices.map(([k,n,d])=>`<button class="nb-voice ${v===k?"on":""}" data-nbvoice="${k}"><b>${n}</b><small>${d}</small></button>`).join("")}</div>
   <blockquote class="nb-said">${esc(src)}</blockquote>
   <div class="rowbtns"><button class="btn small" data-nbact="carry">${T("today.carry","Carry this line forward")}</button></div></div>
  <div class="nb-facing right"><p class="type muted" style="margin:0 0 8px">${T("today.answer","Your answer")}</p>
   <textarea class="nb-body" id="nbAnswer" placeholder="${T("today.answer.placeholder","Answer it here. When you are done it becomes a page.")}">${esc(S.nb.answer||"")}</textarea>
   <div class="nb-foot"><span class="nb-saved">${T("today.kept","Kept as you type")}</span><button class="btn primary small" data-nbact="makepage">${T("today.makepage","Make it a page")}</button></div></div>
  ${S.lines.filter(l=>l.rest).length?`<details class="nb-resting"><summary>${T("today.resting","Lines you let rest")} (${S.lines.filter(l=>l.rest).length})</summary>${S.lines.filter(l=>l.rest).map(l=>`<button class="nb-line" data-nbwake="${l.id}">${esc(l.text)}</button>`).join("")}</details>`:""}</div>`;
}
function indexHTML(){
 const q=(S.nb.search||"").toLowerCase();
 let rows=S.journal.map(p=>({p, src:(pageLines(p)[0]?.text)||"—", qq:p.q?(qById(p.q)?.text||""):""}));
 if(q) rows=rows.filter(r=>((r.p.title||"")+" "+(r.p.body||"")+" "+r.src+" "+r.qq).toLowerCase().includes(q));
 const s=S.nb.sort||"date";
 rows.sort((a,b)=> s==="date"?b.p.date.localeCompare(a.p.date) : s==="source"?a.src.localeCompare(b.src) : (a.qq||"zz").localeCompare(b.qq||"zz"));
 return `<div class="nb-index">
  <div class="nb-ihead"><div class="viewt" role="group" aria-label="Sort by">${[["date",T("index.bydate","By date")],["source",T("index.bysource","By source")],["question",T("index.byquestion","By question")]].map(([k,l])=>`<button data-nbsort="${k}" aria-pressed="${s===k}">${l}</button>`).join("")}</div>
   <input class="field" id="nbSearch" value="${esc(S.nb.search||"")}" placeholder="${T("index.search","Search your pages")}" aria-label="Search"></div>
  <table class="nb-itable"><tr><th>${T("index.col.page","Page")}</th><th>${T("index.col.firstline","First line")}</th><th>${T("index.col.hangs","Hangs on")}</th><th>${T("index.col.date","Date")}</th></tr>
  ${rows.map(r=>`<tr data-nbopen="${r.p.id}"><td><b>${esc(r.p.title||T("index.untitled","Untitled"))}</b></td><td>${esc(r.src.slice(0,52))}</td><td>${esc(r.qq||"—")}</td><td class="d">${fmt(r.p.date)}</td></tr>`).join("")||`<tr><td colspan="4" class="muted">${T("index.empty","Nothing found.")}</td></tr>`}</table></div>`;
}
function pocketHTML(){
 return `<div class="nb-pocket">
  <h3>${T("pocket.heading","Pocket")}</h3><p class="muted" style="margin:2px 0 12px;font-size:.92rem">${T("pocket.line","One job on the phone: catch the line before it goes. It will be waiting on the desk.")}</p>
  <textarea class="nb-body" id="pkText" placeholder="${T("pocket.placeholder","A line, a phrase, an overheard thing…")}">${esc(S.nb.pocket||"")}</textarea>
  <div class="nb-addrow"><input class="field" id="pkWho" placeholder="${T("pocket.who.placeholder","Who or where from (optional)")}" aria-label="Who or where from"><button class="btn primary" data-nbact="pocket">${T("pocket.keep","Keep it")}</button></div>
  ${S.lines.filter(l=>l.from==="phone").length?`<p class="type muted" style="margin:16px 0 6px">${T("pocket.caught","Caught lately")}</p>${S.lines.filter(l=>l.from==="phone").slice(0,8).map(l=>`<div class="nb-line still">${esc(l.text)}${l.who?`<i>— ${esc(l.who)}</i>`:""}</div>`).join("")}`:""}
  <details class="nb-resting" style="margin-top:18px"><summary>${T("pocket.desk.summary","The rest of the notebook lives on the desk")}</summary><p class="muted" style="font-size:.88rem;margin:8px 0 0">${T("pocket.desk.line","Pages, the board, your questions and the index are all there. This is on purpose: the phone catches, the desk works.")}</p></details></div>`;
}
function renderNotebook(v){
 if(DEV()==="phone"){ v.innerHTML=pocketHTML(); wireNotebook(v); return; }
 const way=S.nb.way||"page";
 v.innerHTML=`<div class="nb-bar"><div class="spaces" role="tablist">${WAYS.map(([k,l])=>`<button role="tab" data-nbway="${k}" aria-selected="${way===k}">${l}</button>`).join("")}</div></div>
  <div class="panel nb-panel" id="nbspace"></div>`;
 const box=$("#nbspace");
 if(way==="page") box.innerHTML=pageHTML();
 else if(way==="board") box.innerHTML=boardHTMLnb();
 else if(way==="questions") box.innerHTML=questionsHTML();
 else if(way==="today") box.innerHTML=todayHTML();
 else if(way==="index") box.innerHTML=indexHTML();
 wireNotebook(v);
 if(way==="board") wireCork();
 pruneBlankControls(v);
}
function wireNotebook(v){
 const t=$("#nbTitle"), b=$("#nbBody");
 let tm; const put=()=>{ clearTimeout(tm); tm=setTimeout(save,300); };
 const p=S.journal.find(x=>x.id===S.nb.sel);
 if(t&&p) t.oninput=e=>{ p.title=e.target.value; put(); };
 if(b&&p) b.oninput=e=>{ p.body=e.target.value; put(); };
 const qs=$("#nbQ"); if(qs&&p) qs.onchange=e=>{ const val=e.target.value;
  if(val==="__new"){ const txt=prompt("What is the question?"); if(txt&&txt.trim()){ const id=uid("q"); S.questions.unshift({id, text:txt.trim(), date:today()}); p.q=id; } save(); renderNotebook($("#view")); return; }
  p.q=val||null; save(); };
 const ans=$("#nbAnswer"); if(ans) ans.oninput=e=>{ S.nb.answer=e.target.value; put(); };
 const pk=$("#pkText"); if(pk) pk.oninput=e=>{ S.nb.pocket=e.target.value; put(); };
 const sr=$("#nbSearch"); if(sr) sr.oninput=e=>{ S.nb.search=e.target.value; save(); const box=$("#nbspace"); box.innerHTML=indexHTML(); wireNotebook(v); sr.value&&$("#nbSearch").focus(); };
 const af=$("#addLineF"); if(af) af.onsubmit=e=>{ e.preventDefault(); const tx=$("#alText").value.trim(); if(!tx) return;
  addLine({text:tx, who:$("#alWho").value.trim(), where:$("#alWhere").value.trim(), from:"you"}); S.nb.adding=false; save(); renderNotebook($("#view")); toast(T("toast.nb.kept","Kept. It is on the board too.")); };
 const aq=$("#addQF"); if(aq) aq.onsubmit=e=>{ e.preventDefault(); const tx=$("#qIn").value.trim(); if(!tx) return;
  S.questions.unshift({id:uid("q"), text:tx, date:today()}); save(); renderNotebook($("#view")); };
 v.onclick=e=>{
  const w=e.target.closest("[data-nbway]"); if(w){ S.nb.way=w.dataset.nbway; save(); renderNotebook(v); return; }
  const ln=e.target.closest("[data-nbline]"); if(ln&&!e.target.closest("[data-nbrest]")){ const id=ln.dataset.nbline;
   S.nb.pick=S.nb.pick.includes(id)?S.nb.pick.filter(x=>x!==id):(S.nb.pick.length<3?[...S.nb.pick,id]:S.nb.pick);
   if(S.nb.pick.length===3&&!S.nb.pick.includes(id)) toast(T("toast.nb.three","Three lines is the most a page can carry."));
   save(); renderNotebook(v); return; }
  const rest=e.target.closest("[data-nbrest]"); if(rest){ const l=lineById(rest.dataset.nbrest); if(l){ l.rest=true; save(); renderNotebook(v); toast(T("toast.nb.resting","Resting. It is still in the index.")); } return; }
  const wake=e.target.closest("[data-nbwake]"); if(wake){ const l=lineById(wake.dataset.nbwake); if(l){ l.rest=false; save(); renderNotebook(v); } return; }
  const drop=e.target.closest("[data-nbdrop]"); if(drop){ const pg=S.journal.find(x=>x.id===S.nb.sel); if(pg){ pg.lines=(pg.lines||[]).filter(x=>x!==drop.dataset.nbdrop); save(); renderNotebook(v); } return; }
  const op=e.target.closest("[data-nbopen]"); if(op){ S.nb.sel=op.dataset.nbopen; S.nb.way="page"; save(); renderNotebook(v); return; }
  const nq=e.target.closest("[data-nbq]"); if(nq){ newPage([], nq.dataset.nbq); renderNotebook(v); return; }
  const th=e.target.closest("[data-nbthread]"); if(th){ S.nb.thread=S.nb.thread===th.dataset.nbthread?null:th.dataset.nbthread; save(); renderNotebook(v); return; }
  const dn=e.target.closest("[data-nbdone]"); if(dn){ const q=qById(dn.dataset.nbdone); if(q){ q.done=true; save(); renderNotebook(v); toast(T("toast.nb.became","Moved to “became something”.")); } return; }
  const ro=e.target.closest("[data-nbreopen]"); if(ro){ const q=qById(ro.dataset.nbreopen); if(q){ q.done=false; save(); renderNotebook(v); } return; }
  const so=e.target.closest("[data-nbsort]"); if(so){ S.nb.sort=so.dataset.nbsort; save(); renderNotebook(v); return; }
  const vc=e.target.closest("[data-nbvoice]"); if(vc){ S.nb.voice=vc.dataset.nbvoice; save(); renderNotebook(v); return; }
  const a=e.target.closest("[data-nbact]")?.dataset.nbact; if(!a) return;
  if(a==="addline"){ S.nb.adding=!S.nb.adding; save(); renderNotebook(v); setTimeout(()=>$("#alText")?.focus(),40); }
  if(a==="closer"){ S.nb.closer=!S.nb.closer; save(); renderNotebook(v); }
  if(a==="writeunder"){ newPage([...S.nb.pick]); renderNotebook(v); setTimeout(()=>$("#nbBody")?.focus(),60); }
  if(a==="clearpick"){ S.nb.pick=[]; save(); renderNotebook(v); }
  if(a==="newpage"){ newPage([]); renderNotebook(v); setTimeout(()=>$("#nbBody")?.focus(),60); }
  if(a==="tearout"){ const pg=S.journal.find(x=>x.id===S.nb.sel); if(!pg) return;
   S.journal=S.journal.filter(x=>x!==pg); if((pg.body||"").trim()) S.trash.unshift(Object.assign({},pg,{torn:today()}));
   S.nb.sel=S.journal[0]?.id; save(); renderNotebook(v); toast((pg.body||"").trim()?T("toast.nb.torn","Torn out. It is in the trash."):T("toast.nb.empty","Empty page thrown away.")); }
  if(a==="carry"){ const txt=$(".nb-said")?.textContent||""; if(txt.trim()){ addLine({text:txt.trim().slice(0,160), who:curMuse().maker, where:curMuse().title, from:"muse", carried:true}); renderNotebook(v); toast(T("toast.nb.carried","Carried. It is waiting on the board.")); } }
  if(a==="makepage"){ const t=(S.nb.answer||"").trim(); if(!t){ $("#nbAnswer")?.focus(); return; }
   const id=newPage([]); const pg=S.journal.find(x=>x.id===id); pg.body=t; pg.muse=curMuse().id; S.nb.answer=""; save(); renderNotebook(v); toast(T("toast.nb.page","It is a page now.")); }
  if(a==="pocket"){ const t=(S.nb.pocket||"").trim(); if(!t){ $("#pkText")?.focus(); return; }
   addLine({text:t, who:$("#pkWho")?.value.trim()||"", from:"phone"}); S.nb.pocket=""; save(); renderNotebook(v); toast(T("toast.pocket.caught","Caught. It will be on the desk.")); }
 };
}
function wireCork(){
 const cork=$("#cork"); if(!cork) return; let drag=null, moved=false;
 cork.onpointerdown=e=>{ const el=e.target.closest(".bcard"); if(!el||e.target.closest("[data-nbrest]")) return;
  const br=cork.getBoundingClientRect(), er=el.getBoundingClientRect(); drag={el,id:el.dataset.id,dx:e.clientX-er.left,dy:e.clientY-er.top,br}; moved=false;
  el.setPointerCapture(e.pointerId); el.classList.add("drag"); el.style.zIndex=99; };
 cork.onpointermove=e=>{ if(!drag) return; moved=true; const {el,br,dx,dy}=drag;
  const x=Math.max(0,Math.min(br.width-40,e.clientX-br.left-dx)), y=Math.max(0,Math.min(br.height-40,e.clientY-br.top-dy));
  el.style.left=(x/br.width*100)+"%"; el.style.top=(y/br.height*100)+"%"; };
 const end=()=>{ if(!drag) return; if(moved){ const l=lineById(drag.id); if(l){ l.x=parseFloat(drag.el.style.left); l.y=parseFloat(drag.el.style.top); save(); } }
  drag.el.classList.remove("drag"); drag=null; };
 cork.onpointerup=end; cork.onpointercancel=end;
}
/* kept for the muse page: a line saved from a post or a highlight */
function addPin(o){ const id=addLine({text:o.text, who:o.cite||"", where:o.where||"", from:"muse", muse:o.muse||null});
 toast(T("toast.line.kept","Kept. It is on your board.")); return id; }

/* ---------- Profile ---------- */
function collection(){ return Object.entries(S.owned).map(([id,o])=>({id, date:o.date, gilt:o.gilt})); }
function shelfHTML(){
 const met=metMakers(); if(!met.length) return `<p class="mk-closed">${T("profile.shelf.empty","Nothing on the shelf yet. A first impression draws your first sticker.")}</p>`;
 const all=Object.keys(SETS);
 return met.map(mk=>{ const set=SETS[mk], got=set.filter(id=>S.owned[id]);
  return `<div class="mk-shelf"><div class="mk-head"><b>${esc(MAKERNAME[mk]||mk)}</b><span class="type muted">${set.length>1?T("profile.shelf.six","a set of six"):T("profile.shelf.single","single")}</span></div>
   <div class="mk-row">${set.map(id=>{ const own=S.owned[id], s=STICKERS[id];
     return own?`<button class="mk-slot has" data-stk="${id}" aria-label="${esc(s.name)}">${stickerHTML(id,52,`${s.series} · ${s.name}`,own.gilt)}<small>${esc(s.name)}</small></button>`
      :`<span class="mk-slot" aria-hidden="true"><span class="mk-empty"></span><small>—</small></span>`; }).join("")}</div>
   ${S.stkSel&&set.includes(S.stkSel)?stickerCardHTML(S.stkSel):""}</div>`; }).join("")
  + (all.length>met.length?`<p class="mk-closed">${T("profile.shelf.closed","Other makers are on a closed shelf. You meet them by answering their muses.")}</p>`:"");
}
function stickerCardHTML(id){ const s=STICKERS[id], o=S.owned[id]||{};
 return `<div class="mk-card">${stickerHTML(id,64,`${s.series} · ${s.name}`,o.gilt)}<div><b>${esc(s.name)}</b><small>${esc(s.source||s.series)}${o.date?` · yours since ${fmt(o.date)}`:""}</small>
  <div class="rowbtns"><button class="btn small" data-gild="${id}">${o.gilt?T("profile.ungild","Take the gilding off"):T("profile.gild","Gild it")}</button><button class="btn small ${S.profile.top===id?"primary":""}" data-top="${id}">${S.profile.top===id?T("profile.worn","★ Worn beside your name"):T("profile.wear","Wear it")}</button></div></div></div>`; }
function renderProfile(v){
 if(S.ptab==="settings") return renderSettings(v);
 const p=S.profile, col=collection();
 const draws=todaysDraws(), checked=checkedToday();
 const todayPanel=draws.length?`<div class="panel" style="margin-bottom:16px"><h3>${T("profile.today.heading","Today’s sticker")}</h3><p class="muted" style="margin:2px 0 12px;font-size:.9rem">${checked?`<b>${esc(STICKERS[checked].name)}</b> carries today’s check. Tap another to move it; it settles at midnight.`:T("profile.today.none","Tap one of today’s to give it the check.")}</p>
   <div class="rowbtns">${draws.map(id=>`<button class="btn ${checked===id?"primary":""}" data-keep="${id}" ${checked===id?'aria-pressed="true"':""}>${stickerHTML(id,26)} ${esc(STICKERS[id].name)}${checked===id?" · today’s":""}</button>`).join("")}</div></div>`:"";
 v.innerHTML=`<div class="viewt m-ptabs" role="tablist"><button data-ptab="you" aria-pressed="true">${T("profile.tab.you","Your profile")}</button><button data-ptab="settings" aria-pressed="false">${T("profile.tab.settings","Settings")}</button></div><div class="profile"><div class="panel pcard">
   <div class="pa">${avatarHTML(me()).replace('class="av"','class="av big"')}<div><button class="btn small" id="pPic">${p.photo?"Change photo":"Add a photo"}</button><input type="file" id="pFile" accept="image/*" hidden></div></div>
   <label class="lbl" for="pName">${T("profile.name","Name")}</label><input class="field" id="pName" value="${esc(p.name)}">
   <label class="lbl" for="pLine">${T("profile.line","A line about you")}</label><input class="field" id="pLine" value="${esc(p.line)}" placeholder="${T("profile.line.placeholder","Reads Homer on trams")}">
   <label class="lbl" for="pMake">${T("profile.makes","What you make")}</label><input class="field" id="pMake" value="${esc(p.makes)}" placeholder="${T("profile.makes.placeholder","Essays, a few poems, bread")}">
   <p class="lbl">${T("profile.ring","Ring")}</p><div class="rings">${Object.entries(RINGS).map(([k,r])=>`<button class="ringbtn" data-ring="${k}" aria-pressed="${p.ring===k}"><span class="av" style="background:var(--accent);box-shadow:${r.css}"></span><small>${r.name}</small></button>`).join("")}</div>
   <p class="lbl">${T("profile.badge","Badge")}</p><div class="badges">${BADGES.map(b=>{const ok=b.ok(); return `<button class="badge pick" data-badge="${b.id}" aria-pressed="${p.badge===b.id}" ${ok?"":"disabled"} data-tip="${esc(ok?b.how:"Locked · "+b.how)}">${esc(b.id)}</button>`;}).join("")}</div></div>
  <div>${todayPanel}<div class="panel"><h3>${T("profile.makers.heading","Your makers")}</h3><p class="muted" style="margin:2px 0 4px;font-size:.9rem">${T("profile.makers.line","Each maker has a set of six, each one tied to something they really made or did. A first impression draws one you don’t have yet — never a repeat. Only makers you have met are shown.")}</p>
    <p class="muted" style="margin:0 0 6px;font-size:.84rem">${T("profile.gilding.line","Gilding is a finish, not a prize: gild anything you own, and take it off again.")}</p>
    ${shelfHTML()}</div>
   <div class="panel" style="margin-top:16px"><h3>${T("profile.formed.heading","Who formed you")}</h3><p class="muted" style="margin:2px 0 10px;font-size:.9rem">${T("profile.formed.line","The writers, artists and teachers you apprentice to. Your circle sees these.")}</p>
    <div class="formed">${p.formed.map((f,i)=>`<span class="fchip">${esc(f)}<button data-unform="${i}" aria-label="Remove ${esc(f)}">×</button></span>`).join("")}</div>
    <form class="cform" id="formF"><input class="field" id="formIn" placeholder="${T("profile.formed.placeholder","Add a name")}" aria-label="Add someone who formed you"><button class="btn">${T("profile.formed.add","Add")}</button></form></div>
   <div class="panel" style="margin-top:16px"><h3>${T("profile.circle.heading","How your circle sees you")}</h3>
    <div class="who" style="margin-top:10px">${avatarHTML(me())}<div><b>${esc(p.name||"You")}</b> ${myTop()?stickerHTML(myTop(),20):""} ${p.badge?`<span class="badge">${esc(p.badge)}</span>`:""}<small>${esc([p.line,p.makes].filter(Boolean).join(" · ")||T("profile.circle.empty","Add a line about yourself"))}</small></div></div>
    ${p.formed.length?`<p class="muted" style="font-size:.86rem;margin:6px 0 0">${T("profile.formed.by","Formed by ")}${esc(p.formed.join(", "))}</p>`:""}</div></div></div>`;
 const put=k=>e=>{ S.profile[k]=e.target.value; save(); };
 $("#pName").oninput=put("name"); $("#pLine").oninput=put("line"); $("#pMake").oninput=put("makes");
 ["pName","pLine","pMake"].forEach(id=>$("#"+id).onchange=()=>{ applyPrefs(); renderProfile(v); });
 $("#pPic").onclick=()=>$("#pFile").click();
 $("#pFile").onchange=e=>{ const f=e.target.files[0]; if(f) shrink(f,img=>{ S.profile.photo=img; save(); applyPrefs(); renderProfile(v); }); };
 $("#formF").onsubmit=e=>{ e.preventDefault(); const t=$("#formIn").value.trim(); if(!t) return; S.profile.formed.push(t); save(); renderProfile(v); };
 v.onclick=e=>{ const pt=e.target.closest("[data-ptab]"); if(pt){ S.ptab=pt.dataset.ptab; save(); render(); return; }
  const kp=e.target.closest("[data-keep]"); if(kp){ if(checkedToday()!==kp.dataset.keep) keepSticker(kp.dataset.keep); return; }
  const st=e.target.closest("[data-stk]"); if(st){ S.stkSel=S.stkSel===st.dataset.stk?null:st.dataset.stk; save(); renderProfile(v); return; }
  const gd=e.target.closest("[data-gild]"); if(gd){ const o=S.owned[gd.dataset.gild]; if(o){ o.gilt=!o.gilt; save(); renderProfile(v); toast(o.gilt?T("toast.gilded","Gilded."):T("toast.ungilded","Gilding taken off.")); } return; }
  const b=e.target.closest("[data-ring],[data-badge],[data-top],[data-goto],[data-unform]"); if(!b) return;
  if(b.dataset.ring) S.profile.ring=b.dataset.ring;
  if(b.dataset.badge) S.profile.badge=b.dataset.badge;
  if(b.dataset.top){ S.profile.top=b.dataset.top; toast(`${T("toast.wearing","You’re wearing ")}${STICKERS[b.dataset.top].name}.`); }
  if(b.dataset.unform) S.profile.formed.splice(+b.dataset.unform,1);
  if(b.dataset.goto){ const id=b.dataset.goto; if(MUSE[id].closed) S.past=id; else { S.past=null; S.mi=MUSES.findIndex(m=>m.id===id); } go("muse"); return; }
  save(); applyPrefs(); renderProfile(v); };
}

/* ---------- Why ---------- */
const CONTACT="nikolosk676@gmail.com";
function renderWhy(v){
 v.innerHTML=`${HERO}<p style="margin:0 0 10px"><button class="btn small" id="backMuse">${T("why.back","‹ Back to today’s muses")}</button></p>
  <section class="why"><div><p class="type" style="color:var(--muted-ground)">${T("why.one.eyebrow","Why we built it")}</p><h2>${T("why.one.heading","Imitate the model, not the rival.")}</h2>
   <div class="quotes" style="margin-top:22px"><blockquote>${T("why.quote.plato","“All creation or passage of non-being into being is poetry or making, and the processes of all art are creative; and the masters of arts are all poets or makers.”")}<cite>${T("why.quote.plato.cite","Plato, Symposium 205b · trans. Benjamin Jowett")}</cite></blockquote>
    <blockquote>${T("why.quote.hesiod","“They breathed into me a divine voice to celebrate things that shall be and things that were aforetime.”")}<cite>${T("why.quote.hesiod.cite","Hesiod, Theogony, on the Muses · trans. H. G. Evelyn-White")}</cite></blockquote></div></div>
  <div class="body"><p>${T("why.p1","We learn what to want by watching what others want. René Girard called this ")}<i>${T("why.p1.mimesis","mimesis")}</i>${T("why.p1b",", and it can run in two directions. Aimed at a rival, it turns into envy, and almost every feed that counts your followers runs on that. Aimed at a model (a master, a saint, a book that changed your life), it turns into apprenticeship. The desire lifts you instead of setting you against the person next to you.")}</p>
   <p>${T("why.p2","Poiesis is built for the second kind. Each morning a letter brings three muses: a poem, a passage and a painting. You leave your own first impression before you hear anyone else’s, so what you make starts as yours. Then you see how the same muse sang in others, and you can answer with something of your own.")}</p>
   <p class="icon-note">${T("why.iconnote","An icon painter copies the image handed down to him and rarely signs it. He is not trying to be the best painter in the workshop. He is trying to paint the face they are all looking at.")}</p>
   <p>${T("why.p3","Muses are fleeting on purpose. A conversation stays open for three days and then closes, keeping only its best. Nobody is keeping score: there are no follower counts, and when something moves you, only its maker is told.")}</p></div></section>
  <section class="why" style="border-top:1px solid var(--line);padding-top:30px;margin-top:10px"><div><p class="type" style="color:var(--muted-ground)">${T("why.two.eyebrow","Why curate")}</p><h2>${T("why.two.heading","A shared page makes a shared conversation.")}</h2></div>
   <div class="body"><p>${T("why.two.p1","A feed gives everyone something different, chosen to keep each of us scrolling alone. You can’t talk about it with anyone, because no one else saw what you saw.")}</p>
    <p>${T("why.two.p2","A curated page works the other way. When a whole circle reads the same sonnet on the same morning, they have something in common to talk about. That is how seminars, reading groups and the old commonplace books worked: a chosen text, set before people who then argue about it, quote it back to each other, and make something of it.")}</p>
    <p>${T("why.two.p3","So every muse in Poiesis is picked by a person, and comes with the story of how it was made. The curation is the invitation. The discourse is what the circle does with it.")}</p></div></section>
  <section class="trio"><div><h3>${T("why.trio.one.heading","Receive")}</h3><p>${T("why.trio.one.line","A daily letter and three muses — a poem, a passage, a painting — each with the story of how it came to be.")}</p></div><div><h3>${T("why.trio.two.heading","Keep")}</h3><p>${T("why.trio.two.line","One notebook: every page starts from a line you kept, and can hang on a question you keep returning to.")}</p></div><div><h3>${T("why.trio.three.heading","Make, and give it on")}</h3><p>${T("why.trio.three.line","Leave a first impression, keep adding to it, and draw the lines between the three.")}</p></div></section>
  ${constitutionHTML()}
  <section class="join panel"><div><p class="type muted" style="margin:0">${T("why.join.eyebrow","Join the work")}</p><h2 style="font-size:1.8rem">${T("why.join.heading","Help choose what the circle reads.")}</h2><p class="muted" style="margin:6px 0 0">${T("why.join.line","We’re looking for a few people to help build Poiesis from the start.")}</p></div>
   <div class="roles">${[[T("why.role.curator","Curator"),T("why.role.curator.line","Choose the muses and find the true story of how each one was made.")],[T("why.role.writer","Writer"),T("why.role.writer.line","Write the morning letter: short, warm, and worth opening before the phone.")],[T("why.role.moderator","Moderator"),T("why.role.moderator.line","Keep the circles kind, so collaboration never turns into competition.")]].map(([r,d])=>`<div><h3>${r}</h3><p>${d}</p><a class="btn" href="mailto:${CONTACT}?subject=${encodeURIComponent(r+" — Poiesis")}" target="_blank" rel="noopener">${T("why.role.button","Write to us")}</a></div>`).join("")}</div>
   <p class="muted" style="font-size:.85rem;margin:12px 0 0">${T("why.contact.line","Or write directly to ")}<span style="user-select:all">${CONTACT}</span></p></section>`;
 $("#backMuse").onclick=()=>{ S.past=null; go("muse"); };
}

/* ---------- Pen ---------- */
function penInit(){
 const btn=document.createElement("button"); btn.className="pen"; btn.setAttribute("aria-label",T("pen.label","Write something down")); btn.title=T("pen.label","Write something down"); btn.innerHTML=PENCIL;
 const box=document.createElement("div"); box.className="penbox"; box.hidden=true;
 box.innerHTML=`<p class="type" style="color:#8a7b68;margin:0 0 4px">${T("pen.before","Before it goes")}</p><textarea class="lined" id="penTxt" aria-label="Quick note" placeholder="${T("pen.placeholder","Write it down…")}" style="min-height:160px"></textarea>
  <div class="wrow"><button class="btn ghost" id="penX">${T("pen.close","Close")}</button><button class="btn primary" id="penKeep">${T("pen.keep","Keep in my journal")}</button></div>`;
 document.body.append(box, btn);
 const t=box.querySelector("#penTxt"); t.value=S.pen||"";
 btn.onclick=()=>{ box.hidden=!box.hidden; if(!box.hidden) t.focus(); };
 t.oninput=()=>{ S.pen=t.value; save(); };
 box.querySelector("#penX").onclick=()=>box.hidden=true;
 box.querySelector("#penKeep").onclick=()=>{ const s=t.value.trim(); if(!s){ t.focus(); return; } const id=uid("j"), m=S.tab==="muse"?curMuse():null;
  S.journal.unshift({id, date:today(), title:s.split("\n")[0].slice(0,40), lines:[], q:null, muse:m?m.id:null, body:s}); remember("journal",id,s.slice(0,40)); S.nb.sel=id; S.pen=""; t.value=""; save(); box.hidden=true; toast(T("toast.pen.kept","Kept as a page in your notebook.")); if(S.tab==="notebook") render(); };
}

/* ---------- Hooks for data.js (accounts and sync) ---------- */
let renderLater=false;
const typing=()=>{ const a=document.activeElement; return !!a && /^(TEXTAREA|INPUT|SELECT)$/.test(a.tagName); };
document.addEventListener("focusout", ()=>{ if(renderLater) setTimeout(()=>{ if(renderLater && !typing()){ renderLater=false; render(); } }, 250); });
/* A button whose only label was blanked has nothing left to read or press. */
function pruneBlankControls(root){
 (root||document).querySelectorAll(".view button, .view a.btn").forEach(el=>{
  if(el.querySelector("svg,img")||el.getAttribute("aria-label")||el.textContent.trim()) return;
  el.hidden=true; });
}
window.PoiesisApp={ T, toast, today, state:()=>S,
 // New data arrived from the account: keep it, and redraw unless someone is mid-sentence.
 commit(){ save(true); applyPrefs(); if(typing()){ renderLater=true; return; } render(); },
 // Start this device's copy afresh (signing out, or another person signing in). Display settings stay.
 reset(){ const ui=S.ui, sl=S.sharedLook; S=fresh(); S.ui=ui; S.sharedLook=sl; S.visits[today()]=1; save(true); applyPrefs(); render(); },
  who:WHO, table:Table };

applyStaticCopy(); applyPrefs(); penInit(); render();
setInterval(()=>{ const c=document.querySelector(".clock"); if(c) c.textContent=`· leave at midnight, ${untilMidnight()}`; }, 30000);
matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", applyPrefs);
phoneMQ.addEventListener?.("change", ()=>{ applyPrefs(); render(); });
})();
