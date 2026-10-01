/* The week ahead: a folded line at the bottom of the Why page listing the
 * next seven days' theme words, read from days.js. A curator's check that the
 * muse bank's revisions reached the site. Kept out of app.js on purpose. */
(function () {
  function iso(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function add(view) {
    if (!view.querySelector("section.why") || view.querySelector("#weekAhead")) return;
    var days = window.POIESIS_DAYS || {}, today = new Date(), rows = [];
    for (var i = 1; i <= 7; i++) {
      var d = new Date(today); d.setDate(today.getDate() + i);
      var k = iso(d), day = days[k];
      rows.push("<li><span>" + d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" }) +
        "</span><b>" + (day && day.theme ? day.theme : "—") + "</b></li>");
    }
    var el = document.createElement("details");
    el.id = "weekAhead";
    el.style.cssText = "margin:40px 0 10px;border-top:1px solid var(--line);padding-top:12px;font-size:.9rem;color:var(--muted-ground)";
    el.innerHTML = "<summary style='cursor:pointer'>The week ahead</summary>" +
      "<ul style='list-style:none;padding:0;margin:10px 0 0;display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:6px 18px'>" +
      rows.join("").replace(/<li>/g, "<li style='display:flex;justify-content:space-between;gap:8px'>").replace(/<b>/g, "<b style='font-style:italic;font-weight:normal;color:var(--ink,inherit)'>") +
      "</ul>";
    view.appendChild(el);
  }
  function start() {
    var view = document.getElementById("view");
    if (!view) return;
    add(view);
    new MutationObserver(function () { add(view); }).observe(view, { childList: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
