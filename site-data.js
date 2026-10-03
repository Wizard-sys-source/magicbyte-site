/* ============================================================
   MagicByte — site-data.js
   *** THE FILE YOU EDIT FROM YOUR PHONE ***
   Everything the site shows about today's location and what's
   in stock comes from this one file. Update it, commit, and the
   site follows within a minute or two. Nothing else to touch.

   today.area  — GENERAL AREA ONLY. Never a street address or
                 exact lot. ("Derby — Rock Rd area" is fine;
                 "1234 N Rock Rd" is not.)
   stock       — parts physically in the van. qty = how many
                 you have on hand. price = part cost, or null
                 to show "Quoted after review".
   orderable   — parts you can get in 3–5 days (not in the van).
   ============================================================ */

window.MAGICBYTE_DATA = {

  today: {
    area: "On the road around Wichita",
    note: "Text me and I'll tell you exactly where I am",
    updated: "2026-10-03"
  },

  stock: [
    { id: "iphone-12-screen", category: "iphone", name: "iPhone 12 screen", device: "iPhone 12 / 12 Pro", qty: 2, price: 56.81 },
    { id: "iphone-13-screen", category: "iphone", name: "iPhone 13 screen", device: "iPhone 13", qty: 2, price: null },
    { id: "iphone-14-screen", category: "iphone", name: "iPhone 14 screen", device: "iPhone 14", qty: 2, price: null }
  ],

  orderable: [
    { id: "iphone-12-battery", category: "iphone", name: "iPhone 12 battery", device: "iPhone 12 / 12 Pro" },
    { id: "iphone-11-screen", category: "iphone", name: "iPhone 11 screen", device: "iPhone 11" }
  ]

};

/* ============================================================
   Shared parts registry + bag helpers.
   Both the homepage and the Shop Parts page read these, so a
   part added on one page shows up correctly on the other.
   You don't need to edit below this line.
   ============================================================ */
(function () {
  "use strict";
  var DATA = window.MAGICBYTE_DATA || { stock: [], orderable: [] };

  function kindOf(p) {
    var m = /screen|battery|port|camera|back/i.exec((p.id || "") + " " + (p.name || ""));
    return m ? m[0].toLowerCase() : "part";
  }
  function modelsOf(p) {
    var segs = String(p.device || "").split("/").map(function (x) { return x.trim(); }).filter(Boolean);
    if (!segs.length) return [];
    var brand = segs[0].split(/\s+/)[0];
    return segs.map(function (s, i) {
      if (i === 0 || s.indexOf(brand) === 0) return s;
      return brand + " " + s;   // "12 Pro" -> "iPhone 12 Pro"
    });
  }
  function toPart(s, inStock) {
    return {
      id: s.id,
      kind: kindOf(s),
      models: modelsOf(s),
      name: s.name,
      price: (s.price == null ? null : Number(s.price)),
      inStock: !!inStock && (s.qty || 0) > 0
    };
  }

  // Every part Jonathan stocks or can order, in one list.
  window.MagicByteParts = (DATA.stock || []).map(function (s) { return toPart(s, true); })
    .concat((DATA.orderable || []).map(function (o) { return toPart(o, false); }));

  // One bag shared by every page. Lines look like:
  //   { key:"part|iphone-12-screen|", type:"part", ref:"iphone-12-screen", model:"", qty:1 }
  //   { key:"repair|screen|iPhone 13", type:"repair", ref:"screen", model:"iPhone 13", qty:1 }
  var BAG_KEY = "magicbyte_bag";
  window.MagicByteBag = {
    KEY: BAG_KEY,
    keyOf: function (type, ref, model) { return type + "|" + ref + "|" + (model || ""); },
    read: function () {
      try {
        var raw = localStorage.getItem(BAG_KEY);
        if (raw) {
          var e = JSON.parse(raw);
          if (e && Array.isArray(e.bag)) return e;
        }
      } catch (err) { /* storage unavailable — bag just won't persist */ }
      return { bag: [], brand: null, model: null, area: null };
    },
    write: function (env) {
      try { localStorage.setItem(BAG_KEY, JSON.stringify(env)); }
      catch (err) { /* bag still works for this visit */ }
    }
  };
})();
