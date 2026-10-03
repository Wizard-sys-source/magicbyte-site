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
