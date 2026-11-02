/* Counts visits and taps on this site for the owner's monthly numbers (Paper to Home).
   Totals only: no cookies, nothing about who you are. A visit counts on the first
   tap, key or scroll, so search-engine bots don't. */
(function () {
  var URL = "https://app.papertohome.com/api/site/tap", SITE = "ucr", seen = false;
  function tap(ev) {
    try {
      var body = JSON.stringify({ s: SITE, ev: ev, ref: document.referrer });
      if (navigator.sendBeacon) navigator.sendBeacon(URL, new Blob([body], { type: "text/plain" }));
      else fetch(URL, { method: "POST", body: body, keepalive: true, mode: "cors" });
    } catch (e) {}
  }
  function visit() {
    if (seen) return; seen = true; tap("visit");
    ["pointerdown", "keydown", "scroll"].forEach(function (e) { removeEventListener(e, visit, true); });
  }
  ["pointerdown", "keydown", "scroll"].forEach(function (e) { addEventListener(e, visit, { capture: true, passive: true }); });
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]"); if (!a) return;
    var h = a.getAttribute("href") || "";
    if (/^tel:/i.test(h)) tap("call"); else if (/^mailto:/i.test(h)) tap("email"); else if (/wa\.me|whatsapp/i.test(h)) tap("whatsapp");
  }, true);
  window.siteTap = tap;
})();
