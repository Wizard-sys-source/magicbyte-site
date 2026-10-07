/* MagicByte shared script — header, bottom dock, bag, prices.
   Every page loads this. Edit prices, stock and switches ONLY here (or in your Google Sheet, see (o)). */

/* ===================== EDIT ME ===================== */
const CONFIG = {
  phone: "+13165594816",
  phoneDisplay: "316-559-4816",
  tripFeeWichita: 10,
  partsHandling: 0.05,                       // DIY parts: cost + 5%
  dayJob: { days: [2,3,4,5,6], end: 15.5 },  // Tue–Sat until 3:30pm
  // Visit windows by weekday (Sun=0 .. Sat=6). null = no visits that day.
  visitWindows: { 0:[10,22], 1:null, 2:[16,20], 3:[16,20], 4:[16,20], 5:[16,20], 6:[16,20] },
  // "Where's the wizard today" — GENERAL AREA ONLY, never a street address.
  // (If this ever looks like an address, ZIP, map link or GPS, the site ignores it and shows its default.)
  today: { area: "On the road around Wichita", note: "and I'll tell you exactly where I am" },
  bagKey: "magicbyte_bag",

  /* ---- NOT DECIDED YET. Every switch starts OFF or EMPTY and shows nothing until you fill it in. ---- */

  // (a) $20 Heroes promo banner, under the top section of the page.
  //     placement: "everywhere" | "services-only" | "off"   (anything else counts as "off")
  //     Stays hidden until title or text has words in it, even when placement is on. Plain text only.
  heroesPromo: { placement: "off", title: "", text: "" },

  // (b) Screen tier label above "Screen prices by model" on Services & pricing.
  //     "refurbished" | "xo7" | ""   ("" = no label, same as today)
  //     DISPLAY ONLY: it never changes a price. Prices still come from PARTS, so make the
  //     PARTS grades match whichever tier you pick before you turn this on.
  screenTier: "",
  screenTierLabels: { refurbished: "Refurbished screens", xo7: "XO7 Soft OLED screens" },

  // (c) Payment methods you take, e.g. ["Cash", "Venmo"].  [] = nothing shown.
  //     Shows in the bag and in the "How do I pay" answer on Trust & FAQ.
  paymentMethods: [],

  // (d) Airport-shift premium. Shows only when on is true AND title or text has words in it.
  //     DISPLAY ONLY: never added to bag totals or to the texted order.
  //     Shows under "Where and when" on Home and under the menu on Services & pricing.
  airportShiftPremium: { on: false, title: "", text: "" },

  // (e) Warranty terms in plain words, shown as ONE paragraph at the top of the warranty
  //     section on Trust & FAQ.  "" = nothing shown. Line breaks are joined into one paragraph.
  //     A starting point, built only from what the site already says:
  //     "Every repair is covered for 30 days from the day I finish it, on both the part and my work.
  //      If the part fails or I fitted something badly, I fix it at no charge, and if the same part
  //      fails twice I refund the labor. New drops, cracks and liquid after the repair aren't covered.
  //      To claim, just text me."
  warrantyText: "",

  // (f) Announcement banner: a slim line under the header on every page.
  //     Shows only when on is true AND text has words. Plain text. A visitor can close it for
  //     the rest of their visit; if you change the text, it shows again.
  announceBar: { on: false, text: "" },

  // (g) Trust badges: a row of four on Home. A badge shows when its title or text has words;
  //     the whole row stays hidden while all four are empty. Honest starting points, yours to change:
  //       1  "Free estimate by text"  "Tell me what happened and I'll reply with the likely fix and price. No obligation."
  //       2  "Parts at my cost"       "No markup on parts I install. Tap “See the math” under a price to check."
  //       3  "I come to you"          "Home, office or a coffee shop around Wichita."
  //       4  "30-day warranty"        "Parts and workmanship, written out in plain English on Trust & FAQ."
  trustBadges: [
    { icon: "🔍", title: "", text: "" },
    { icon: "🏷️", title: "", text: "" },
    { icon: "🚐", title: "", text: "" },
    { icon: "🛡️", title: "", text: "" }
  ],

  // (h) Your photo. Put a square photo at assets/jonathan.jpg. Until that file is there, every
  //     spot shows the mascot instead (never a broken image). Spots: Home (after the opening
  //     animation), Trust & FAQ, and the top of the bag.
  //     Captions are optional plain text and only show with the photo. "" = no caption.
  //     Suggestion for trust: "One tech. You always get me."
  photo: { src: "assets/jonathan.jpg", captions: { hero: "", trust: "", bag: "" } },

  // (i) The line beside your number in the bar at the bottom of every page. "" = number only.
  callLine: "Calls go to my wizard voicemail — texts get the fastest reply.",

  // (j) Testimonials on Home. [] = nothing shown. Real words from real customers, with their OK:
  //       testimonials: [ { quote: "Their words, exactly as they said them.", name: "First name" } ],
  testimonials: [],
  //     Link to your Google reviews, on Home and Trust & FAQ. "" = nothing shown.
  reviewUrl: "",
  reviewText: "Read my Google reviews",

  // (k) Social links in every footer: the full link or just the handle. "" = not shown.
  socials: { instagram: "", tiktok: "", facebook: "" },

  // (l) "We buy phones" block on Shop parts. Hidden until title or text has words.
  //     The button only shows when linkText has words; smsStart pre-fills the text message.
  //     Suggestion: title "I buy phones", text "Cracked, dead or just old: send me the model and
  //     what's wrong, and I'll reply with an offer.", linkText "Text me what you have",
  //     smsStart "Phone to sell: "
  weBuy: { title: "", text: "", linkText: "", smsStart: "" },

  // (m) First-order nudge at the top of the bag. Shows only when on is true AND text has words.
  //     The code is optional (letters, numbers, - or _); customers can put it in their notes.
  firstOrder: { on: false, code: "", text: "" },

  // (n) Price words. Every price leads with ONE installed total: part + labor + trip, worked out
  //     by the bag's own math. The breakdown hides behind a tap, with the part rounded to whole dollars.
  //     seeMath, laborCovers and tripNote: "" hides them. Any other word left "" uses the default shown.
  priceWords: {
    seeMath: "See the math",                 // the tap that opens a breakdown
    part: "Part",
    labor: "Labor",
    trip: "Trip fee",
    handling: "Handling",                    // Shop parts you install yourself
    roundedPart: "about",                    // before a part price rounded to whole dollars
    orderedTotal: "About",                   // before a total whose part still has to be ordered
    plusPart: "+ part",                      // after a total when the part price isn't known yet
    plusTrip: "+ trip fee",                  // after a total for an area outside Wichita
    quoted: "Quoted",                        // a breakdown line with no price yet
    quotedLead: "Quoted after a look",       // a repair with no labor price at all
    laborCovers: "Labor covers the repair, full testing, the 30-day warranty, and me driving to you.",
    tripNote: "Includes the {trip} Wichita trip fee."   // under Screen prices by model; {trip} = the fee
  },

  // (o) Google Sheet as the price source.  "" = off: everything in this block is used as is.
  //     In the sheet: File → Share → Publish to web → Entire document → Comma-separated values
  //     → Publish. Paste that link below, then give each tab's gid (open the tab; it's the number
  //     after "gid=" in the address bar). Tabs and columns:
  //       parts:    id, name, price, stock, grade
  //       labor:    id, name, labor_low, labor_high, time
  //       settings: key, value      (the keys it understands are listed in README.md)
  //     Every page reads the sheet fresh. A blank cell, a broken row, a word where a number goes,
  //     an id this file doesn't have, or no connection: the value in this block is used instead.
  sheetUrl: "",
  sheetTabs: { parts: "", labor: "", settings: "" }
};

const MODELS = {
  iPhone: ["iPhone X","iPhone XS","iPhone XS Max","iPhone XR","iPhone 11","iPhone 11 Pro","iPhone 11 Pro Max",
           "iPhone 12 mini","iPhone 12","iPhone 12 Pro","iPhone 12 Pro Max","iPhone 13 mini","iPhone 13","iPhone 13 Pro","iPhone 13 Pro Max",
           "iPhone 14","iPhone 14 Plus","iPhone 14 Pro","iPhone 14 Pro Max","iPhone 15","iPhone 15 Pro","iPhone 16","iPhone 16 Pro","Other iPhone"],
  Galaxy: ["Galaxy S21","Galaxy S22","Galaxy S23","Galaxy S24","Galaxy S25","Galaxy A-series","Other Galaxy"],
  Pixel:  ["Pixel 6","Pixel 7","Pixel 8","Pixel 9","Other Pixel"],
  Other:  ["Other phone or tablet"]
};

/* labor: [low, high] or null for "quoted".  The sheet's labor tab can override name, labor and time by id. */
const SERVICES = [
  {id:"screen",  cat:"Screens",    name:"Screen replacement",   desc:"Cracked glass, dead touch, lines or a black display.", labor:[60,75], time:"About 1½ hrs", part:"screen"},
  {id:"battery", cat:"Batteries",  name:"Battery replacement",  desc:"Dies by lunch, shuts off early, or the battery is swelling.", labor:[60,70], time:"About 1½ hrs", part:"battery"},
  {id:"port",    cat:"Charging",   name:"Charging port repair", desc:"Loose cable, slow charging or no charging at all.", labor:[65,85], time:"About 1½ hrs", part:"port"},
  {id:"camera",  cat:"Cameras",    name:"Camera repair",        desc:"Blurry, black, or a cracked lens.", labor:[65,80], time:"About 1½ hrs", part:"camera"},
  {id:"back",    cat:"Back glass", name:"Back glass",           desc:"Same day on Android and iPhone 15 and up. iPhone X–14 takes at least two days.", labor:[70,90], time:"Same day or 2+ days", part:"back"},
  {id:"clean",   cat:"Charging",   name:"Charging port cleaning", desc:"Lint and pocket grime dug out of the port. Fixes most charging scares that are really just dirt.", labor:[30,30], time:"About 15 min"},
  {id:"diag",    cat:"Not sure",   name:"Diagnostics only",     desc:"I find the fault and tell you the fix. No repair booked.", labor:[15,20], time:"About 30 min"}
];

/* stock: number on hand (0 = order it). price: your cost, or null for "quoted".
   Ordered screens are XO7 Soft OLED list prices from MobileSentrix, checked Oct 2026 —
   they move, so re-check before quoting.  The sheet's parts tab can override name, price,
   stock and grade by id. */
const PARTS = [
  {id:"ip12-screen-van", kind:"screen", brand:"iPhone", models:["iPhone 12","iPhone 12 Pro"], name:"iPhone 12 / 12 Pro screen", grade:"Refurbished", price:56.81, stock:2},
  {id:"ip13-screen",     kind:"screen", brand:"iPhone", models:["iPhone 13"],         name:"iPhone 13 screen",         grade:"Refurbished", price:72.09, stock:2},
  {id:"ip14-screen",     kind:"screen", brand:"iPhone", models:["iPhone 14"],         name:"iPhone 14 screen",         grade:"Refurbished", price:66.29, stock:2},
  {id:"ipx-screen",      kind:"screen", brand:"iPhone", models:["iPhone X"],          name:"iPhone X screen",          grade:"XO7 Soft OLED", price:35.18, stock:0},
  {id:"ipxs-screen",     kind:"screen", brand:"iPhone", models:["iPhone XS"],         name:"iPhone XS screen",         grade:"XO7 Soft OLED", price:35.77, stock:0},
  {id:"ip12pm-screen",   kind:"screen", brand:"iPhone", models:["iPhone 12 Pro Max"], name:"iPhone 12 Pro Max screen", grade:"XO7 Soft OLED", price:48.21, stock:0},

  {id:"ip13p-screen",    kind:"screen", brand:"iPhone", models:["iPhone 13 Pro"],     name:"iPhone 13 Pro screen",     grade:"XO7 Soft OLED, 120Hz", price:52.34, stock:0},
  {id:"ip13pm-screen",   kind:"screen", brand:"iPhone", models:["iPhone 13 Pro Max"], name:"iPhone 13 Pro Max screen", grade:"XO7 Soft OLED", price:44.34, stock:0},
  {id:"ip14plus-screen", kind:"screen", brand:"iPhone", models:["iPhone 14 Plus"],    name:"iPhone 14 Plus screen",    grade:"XO7 Soft OLED", price:44.34, stock:0},
  {id:"ip14pm-screen",   kind:"screen", brand:"iPhone", models:["iPhone 14 Pro Max"], name:"iPhone 14 Pro Max screen", grade:"XO7 Soft OLED", price:50.43, stock:0},
  {id:"ip12-batt",       kind:"battery",brand:"iPhone", models:["iPhone 12","iPhone 12 Pro"], name:"iPhone 12 / 12 Pro battery", grade:"AmpSentrix Basic", price:10.40, stock:0},
  {id:"ip11-screen",     kind:"screen", brand:"iPhone", models:["iPhone 11"],         name:"iPhone 11 screen",         grade:"LCD", price:null, stock:0}
];
const AREAS = ["Wichita","Derby","Andover","Haysville","Maize","Goddard","Park City","Bel Aire","Rose Hill","Mulvane","Somewhere else"];
const NAV = [["index","index.html","Home"],["services","services.html","Services & pricing"],["book","book.html","Ask the Wizard"],["trust","trust.html","Trust & FAQ"],["inventory","inventory.html","Shop parts"]];
/* =================================================== */

const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const money = n => "$" + (Math.round(n*100)%100 ? n.toFixed(2) : Math.round(n));
const range = (a,b) => a===b ? money(a) : money(a) + "–" + money(b).slice(1);

const MB = { state:{ brand:"iPhone", model:"iPhone 12", bag:[], area:"Wichita", sent:false }, onChange:[] };
try {
  const s = JSON.parse(localStorage.getItem(CONFIG.bagKey) || "null");
  if (s && Array.isArray(s.bag)) Object.assign(MB.state, {bag:s.bag.filter(l => l.type==="part" ? PARTS.some(p=>p.id===l.ref) : SERVICES.some(x=>x.id===l.ref)), brand:s.brand||"iPhone", model:s.model||"iPhone 12", area:s.area||"Wichita"});
} catch(e){}
MB.save = () => { try { const s = MB.state; localStorage.setItem(CONFIG.bagKey, JSON.stringify({bag:s.bag, brand:s.brand, model:s.model, area:s.area})); } catch(e){} };

/* ---------- pricing ---------- */
MB.partFor = (kind, model) => PARTS.find(p => p.kind===kind && p.models.includes(model));
MB.priceLine = line => {
  if (line.type === "part"){
    const p = PARTS.find(x => x.id===line.ref);
    if (!p || p.price==null) return {lo:0, hi:0, quoted:true, label:"Quoted"};
    const v = p.price * (1+CONFIG.partsHandling) * line.qty;
    return {lo:v, hi:v, quoted:false, label:money(v)};
  }
  const s = SERVICES.find(x => x.id===line.ref);
  if (!s || !s.labor) return {lo:0, hi:0, quoted:true, label:"Quoted"};
  const p = s.part ? MB.partFor(s.part, line.model) : null;
  const known = p && p.price!=null;
  const add = known ? p.price : 0;
  const lo = (s.labor[0]+add)*line.qty, hi = (s.labor[1]+add)*line.qty;
  const partPending = !!(s.part && !known);
  return {lo, hi, quoted:false, partPending, label: range(lo,hi) + (partPending ? " + part" : "")};
};
MB.totals = () => {
  let lo=0, hi=0, quoted=0, repairs=0, count=0;
  MB.state.bag.forEach(l => { const p = MB.priceLine(l); lo+=p.lo; hi+=p.hi; if (p.quoted||p.partPending) quoted++; if (l.type==="repair") repairs++; count+=l.qty; });
  let trip = null;
  if (repairs){ trip = MB.state.area==="Wichita" ? CONFIG.tripFeeWichita : "quoted"; if (typeof trip==="number"){ lo+=trip; hi+=trip; } }
  return {lo, hi, quoted, repairs, trip, count};
};

/* ---------- availability ---------- */
MB.availability = () => {
  const d = new Date(), day = d.getDay(), h = d.getHours() + d.getMinutes()/60;
  const w = CONFIG.visitWindows[day];
  const fmt = x => { const ap = x >= 12 ? "pm" : "am"; const hh = x % 12 === 0 ? 12 : x % 12; return hh + ap; };
  if (w && h >= w[0] && h < w[1]) return [true, "Booking visits now"];
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  for (let i = 0; i < 8; i++){
    const dd = (day + i) % 7, ww = CONFIG.visitWindows[dd];
    if (!ww) continue;
    if (i === 0 && h >= ww[1]) continue;   // today's window already closed
    if (i === 0) return [false, "Visits open today at " + fmt(ww[0])];
    return [false, "Visits open " + (i === 1 ? "tomorrow" : days[dd]) + " at " + fmt(ww[0])];
  }
  return [false, "Text me to book a visit"];
};

/* ---------- bag ops ---------- */
const keyOf = (type, ref, model) => type + "|" + ref + "|" + (model||"");
MB.qtyOf = (type, ref, model) => { const l = MB.state.bag.find(x => x.key===keyOf(type,ref,model)); return l ? l.qty : 0; };
MB.setQty = (type, ref, model, qty, name) => {
  const key = keyOf(type, ref, model), bag = MB.state.bag;
  const i = bag.findIndex(x => x.key===key);
  if (type==="part"){ const p = PARTS.find(x=>x.id===ref); if (p && p.stock>0) qty = Math.min(qty, p.stock); }
  if (qty <= 0){ if (i>-1) bag.splice(i,1); }
  else if (i>-1) bag[i].qty = Math.min(qty, 5);
  else { bag.push({key, type, ref, model, qty:1}); MB.toast("Added " + name + (model ? " for " + model : "")); }
  MB.state.sent = false; MB.save(); MB.refresh(); MB.bump();
};
MB.lineName = l => l.type==="part" ? (PARTS.find(p=>p.id===l.ref)||{}).name + " (part only)" : (SERVICES.find(s=>s.id===l.ref)||{}).name;
MB.control = (type, ref, model, name) => {
  const q = MB.qtyOf(type, ref, model);
  const a = `data-type="${type}" data-ref="${ref}" data-model="${esc(model||"")}" data-name="${esc(name)}"`;
  return q ? `<div class="stepper"><button type="button" ${a} data-d="-1" aria-label="One fewer ${esc(name)}">−</button><output>${q}</output><button type="button" ${a} data-d="1" aria-label="One more ${esc(name)}">+</button></div>`
           : `<button class="add" type="button" ${a} data-d="1" aria-label="Add ${esc(name)} to bag">+</button>`;
};

/* ---------- model picker (big button + bottom sheet) ---------- */
MB.modelButton = () => `<button class="modelbtn" type="button" data-pick="1" aria-haspopup="dialog">
  <span class="mb-ico" aria-hidden="true">📱</span><span><small>Fixing</small><b>${esc(MB.state.model)}</b></span><span class="mb-chg">Change</span></button>`;
function renderPicker(q=""){
  const s = MB.state, body = $("#pickBody");
  const list = MODELS[s.brand].filter(m => m.toLowerCase().includes(q.toLowerCase()));
  body.querySelector(".seg").innerHTML = Object.keys(MODELS).map(b => `<button type="button" aria-pressed="${b===s.brand}" data-pbrand="${b}">${b}</button>`).join("");
  body.querySelector(".mgrid").innerHTML = list.map(m => `<button type="button" class="mchip" aria-pressed="${m===s.model}" data-pmodel="${esc(m)}">${esc(m)}</button>`).join("")
    || `<p class="note">No match. Pick “Other” and tell me the model in your notes.</p>`;
}
let pickFocus = null;
MB.openPicker = () => { pickFocus = document.activeElement; const p = $("#picker"); p.hidden = false; $("#pickSearch").value = ""; renderPicker();
  requestAnimationFrame(()=>{ p.classList.add("open"); $("#scrim").classList.add("open"); $("#pickSearch").focus({preventScroll:true}); }); document.body.style.overflow="hidden"; };
MB.closePicker = () => { const p = $("#picker"); p.classList.remove("open"); if ($("#sheet").hidden) { $("#scrim").classList.remove("open"); document.body.style.overflow=""; } setTimeout(()=>{ p.hidden = true; }, 300);
  const back = pickFocus && pickFocus.isConnected ? pickFocus : document.querySelector("[data-pick]"); if (back) back.focus({preventScroll:true}); };

/* ---------- reusable repair menu (Home and Services & pricing) ----------
   Each row: what's wrong → how long → one installed price. The breakdown sits behind a tap. */
MB.mountMenu = (root) => {
  let cat = "All";
  const CATS = ["All","Screens","Batteries","Charging","Cameras","Back glass","Not sure"];
  root.innerHTML = `<div class="pickslot"></div><div class="chips" role="group" aria-label="Filter repairs"></div><ul class="menu"></ul>`;
  const slot = root.querySelector(".pickslot"), chips = root.querySelector(".chips"), menu = root.querySelector(".menu");
  const open = MB.mathMemory(root);
  function draw(){
    const s = MB.state;
    slot.innerHTML = MB.modelButton();
    chips.innerHTML = CATS.map(c => `<button type="button" aria-pressed="${c===cat}" data-cat="${c}">${c}</button>`).join("");
    menu.innerHTML = SERVICES.filter(x => cat==="All" || x.cat===cat).map(x => {
      const q = MB.quote(x.id, s.model), k = "svc-" + x.id;
      const part = x.part ? MB.partFor(x.part, s.model) : null;
      const badge = part ? (part.stock>0 ? `<span class="badge">In the van</span>` : `<span>Part ships in 3–5 days</span>`) : "";
      return `<li class="item" id="${k}"><div><h3>${esc(x.name)}</h3><p class="desc">${esc(x.desc)}</p><div class="meta"><span class="price">${esc(q.lead)}</span><span>${esc(x.time)}</span>${badge}</div>${MB.mathHTML(q.rows, k, open.has(k))}</div><div class="side">${MB.control("repair", x.id, s.model, x.name)}</div></li>`;
    }).join("") || `<li class="empty-menu">Nothing here for that filter. Try “All”.</li>`;
  }
  root.addEventListener("click", e => { const b = e.target.closest("button[data-cat]"); if (b){ cat = b.dataset.cat; draw(); } });
  MB.onChange.push(draw); draw();
};

/* ---------- chrome: header, dock, toast, sheet ---------- */
function buildChrome(){
  const page = document.body.dataset.page;
  document.body.insertAdjacentHTML("afterbegin", `<a class="skip" href="#main">Skip to content</a>
  <header class="top"><div class="wrap">
    <div class="brandrow"><a class="brand" href="index.html"><img src="assets/mascot-icon.png" alt="">MagicByte</a>
      <div class="status"><span class="dot" id="availDot"></span><span id="availText"></span></div></div>
    <nav class="links" aria-label="Site">${NAV.map(([id,href,label]) => `<a href="${href}"${id===page?' aria-current="page"':""}>${label.replace("&","&amp;")}</a>`).join("")}</nav>
  </div></header>`);
  document.body.insertAdjacentHTML("beforeend", `
  <nav class="dock" aria-label="Quick actions"><div class="row">
    <a class="dbtn" href="sms:${CONFIG.phone}"><span aria-hidden="true">💬</span> Text</a>
    <a class="dbtn" href="tel:${CONFIG.phone}"><span aria-hidden="true">📼</span> Voicemail</a>
    <button class="dbtn main" id="dockMain" type="button"></button>
  </div></nav>
  <div class="toast" id="toast" role="status" aria-live="polite"><span id="toastMsg"></span><button type="button" id="toastView">View bag</button></div>
  <div class="scrim" id="scrim"></div>
  <div class="sheet" id="sheet" role="dialog" aria-modal="true" aria-labelledby="sheetTitle" hidden>
    <div class="grab"></div>
    <div class="shead"><h2 id="sheetTitle">Your bag</h2><button class="x" id="closeSheet" type="button" aria-label="Close bag">×</button></div>
    <div class="sbody" id="sheetBody"></div>
  </div>
  <div class="sheet" id="picker" role="dialog" aria-modal="true" aria-labelledby="pickTitle" hidden>
    <div class="grab"></div>
    <div class="shead"><h2 id="pickTitle">Your phone</h2><button class="x" id="closePicker" type="button" aria-label="Close">×</button></div>
    <div class="sbody" id="pickBody">
      <div class="seg" role="group" aria-label="Brand"></div>
      <label class="sr" for="pickSearch">Search models</label>
      <input class="field" id="pickSearch" placeholder="Search, e.g. 13 Pro" style="margin-top:12px" autocomplete="off">
      <div class="mgrid"></div>
    </div>
  </div>`);
  /* keep the current page's tab visible in the nav instead of snapping back to Home */
  const nav = document.querySelector("nav.links"), cur = nav.querySelector("[aria-current]");
  if (cur) nav.scrollLeft = Math.max(0, cur.offsetLeft - nav.offsetLeft - 18);
  const paint = () => { const [on, t] = MB.availability(); $("#availDot").classList.toggle("on", on); $("#availText").textContent = t; };
  paint(); setInterval(paint, 60000);
}

MB.renderDock = () => {
  const t = MB.totals(), b = $("#dockMain");
  if (!t.count){ b.className = "dbtn main"; b.textContent = "Get a price"; b.dataset.mode = "price"; b.removeAttribute("aria-label"); return; }
  b.className = "dbtn main has";
  b.innerHTML = `<span class="count">${t.count}</span><span>View bag</span><span>${t.hi ? range(t.lo,t.hi) : "Quote"}</span>`;
  b.dataset.mode = "bag"; b.setAttribute("aria-label", `View bag, ${t.count} item${t.count>1?"s":""}`);
};
MB.bump = () => { const b = $("#dockMain"); b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); };
let tt; MB.toast = (msg, showView=true) => { $("#toastMsg").textContent = msg; $("#toastView").hidden = !showView; $("#toast").classList.add("show"); clearTimeout(tt); tt = setTimeout(()=>$("#toast").classList.remove("show"), 2800); };

MB.orderText = f => {
  const t = MB.totals();
  const lines = MB.state.bag.map(l => `• ${l.qty>1?l.qty+"× ":""}${MB.lineName(l)}${l.model?" — "+l.model:""} (${MB.priceLine(l).label})`).join("\n");
  return `MagicByte order\n${lines}\nArea: ${MB.state.area}\nEstimate: ${t.hi?range(t.lo,t.hi):"to be quoted"}${t.quoted?" + quoted items":""}\nName: ${f.name}\nReply to: ${f.reply}${f.notes?"\nNotes: "+f.notes:""}`;
};
MB.sms = body => { window.location.href = `sms:${CONFIG.phone}?&body=${encodeURIComponent(body)}`; };

function renderSheet(){
  const body = $("#sheetBody"), keep = {};
  ["fName","fReply","fNotes"].forEach(id => { const el = document.getElementById(id); if (el) keep[id] = el.value; });
  const s = MB.state;
  if (s.sent){
    body.innerHTML = `<ol class="track">
      <li class="done"><div><strong>Order sent</strong><span>Your text app opened with the order filled in. Hit send there if you haven't.</span></div></li>
      <li class="now"><div><strong>I confirm the price</strong><span>I'll reply by text or email with the exact total.</span></div></li>
      <li><div><strong>We pick a time and place</strong><span>Late afternoons, evenings or Sundays.</span></div></li>
      <li><div><strong>Fixed</strong><span>You pay when the repair is done.</span></div></li></ol>
      <div class="sbtns"><button class="btn solid" type="button" id="doneClear">Done, clear my bag</button><button class="btn" type="button" id="backBag">Back to my bag</button></div>`;
    return;
  }
  if (!s.bag.length){
    body.innerHTML = `<div class="emptybag"><img src="assets/mascot-icon.png" alt=""><h3>Your bag is empty</h3><p class="note">Pick your phone and add a repair or part to see a price.</p><div class="sbtns"><a class="btn solid" href="index.html#order">Browse repairs</a><a class="btn" href="inventory.html">Shop parts</a></div></div>`;
    return;
  }
  const t = MB.totals();
  const items = s.bag.map(l => {
    const p = MB.priceLine(l), name = MB.lineName(l);
    const part = l.type==="part" ? PARTS.find(x=>x.id===l.ref) : null;
    const svc = part ? SERVICES.find(x=>x.part===part.kind) : null;
    const swap = part && svc ? `<button class="link" type="button" data-swap="${esc(l.key)}">Have me install it instead</button>` : "";
    return `<div class="line"><div><h3>${esc(name)}</h3><div class="for">${l.model ? "for "+esc(l.model) : "you install, cost + 5%"}</div></div><div class="lp">${p.label}</div>
      <div class="acts">${MB.control(l.type, l.ref, l.model, name)}<button class="link danger" type="button" data-remove="${esc(l.key)}">Remove</button>${swap}</div></div>`;
  }).join("");
  const trip = t.trip==null ? "" : `<div><span>Trip fee</span><span>${typeof t.trip==="number" ? money(t.trip) : "Quoted"}</span></div>`;
  body.innerHTML = `${items}
    <button class="link danger" type="button" id="clearBag" style="margin-top:8px">Clear bag</button>
    <label class="lab" for="area">Where should I meet you?</label>
    <div class="selectwrap" style="margin:0"><select class="field" id="area">${AREAS.map(a=>`<option ${a===s.area?"selected":""}>${a}</option>`).join("")}</select></div>
    <div class="sum"><div><span>Items</span><span>${t.count}</span></div>${trip}
      <div class="tot"><span>Estimate</span><span>${t.hi ? range(t.lo,t.hi) : "Quoted"}</span></div></div>
    <p class="note">${t.quoted ? "Some parts get priced after I check stock, so the final total may be higher. " : ""}Nothing is charged here. You pay when the repair is done; parts I need to order may need a deposit, and I'll tell you first.${s.bag.some(l=>l.type==="part") ? " I'm not liable for damage from self-installation." : ""}</p>${safe(MB.paymentsHTML) || ""}
    <label class="lab" for="fName">Name</label><input class="field" id="fName" autocomplete="name" aria-required="true">
    <label class="lab" for="fReply">Where should I reply?</label><input class="field" id="fReply" placeholder="Phone number or email" autocomplete="tel" aria-required="true">
    <label class="lab" for="fNotes">Notes</label><textarea class="field" id="fNotes" placeholder="What happened, timing that works for you…"></textarea>
    <p class="err" id="formErr" role="alert" hidden></p>
    <div class="sbtns"><button class="btn solid" type="button" id="sendOrder">Send order by text</button><button class="btn" type="button" id="copyOrder">Copy order</button></div>`;
  Object.keys(keep).forEach(id => { const el = document.getElementById(id); if (el) el.value = keep[id]; });
}
function readForm(){
  const name = $("#fName").value.trim(), reply = $("#fReply").value.trim(), notes = $("#fNotes").value.trim();
  $("#fName").setAttribute("aria-invalid", !name); $("#fReply").setAttribute("aria-invalid", !reply);
  const err = $("#formErr");
  if (!name || !reply){ err.hidden = false; err.textContent = "Add your name and a phone number or email so I can reply."; return null; }
  err.hidden = true; return {name, reply, notes};
}
let lastFocus = null;
MB.openSheet = () => { lastFocus = document.activeElement; const s = $("#sheet"); s.hidden = false; renderSheet(); requestAnimationFrame(()=>{ s.classList.add("open"); $("#scrim").classList.add("open"); $("#closeSheet").focus(); }); document.body.style.overflow = "hidden"; };
MB.closeSheet = () => { const s = $("#sheet"); s.classList.remove("open"); $("#scrim").classList.remove("open"); document.body.style.overflow = ""; setTimeout(()=>{ s.hidden = true; }, 300); if (lastFocus) lastFocus.focus(); };
MB.refresh = () => { MB.renderDock(); MB.onChange.forEach(f => f()); if (!$("#sheet").hidden) renderSheet(); };

/* =====================================================================
   Additions below this line: switches, slots, prices, photo, motion, sheet.
   Every one is wrapped so a mistake here can never break the bag or
   the texted order above.
   ===================================================================== */
const txt = v => typeof v === "string" ? v.trim() : "";
const calm = () => !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
const safe = (f, ...a) => { try { return f(...a); } catch(e){ if (window.console) console.warn("MagicByte:", e); } };

/* "Where's the wizard today" stays a general area. Anything that looks like a street
   address, ZIP code, map link or GPS coordinates is refused, and the page keeps its
   built-in default instead. (The last two patterns catch "930 n litchfield" and "930 Litchfield".) */
MB.looksLikeAddress = s => /\b\d{5}(?:-\d{4})?\b/.test(s)
  || /-?\d{1,3}\.\d{3,}\s*[,\s]\s*-?\d{1,3}\.\d{3,}/.test(s)
  || /https?:|www\.|maps\.|goo\.gl/i.test(s)
  || /(?:^|[\s,#])\d{1,6}\s+(?:[NSEW]\.?\s+)?[\w.'-]+(?:\s+[\w.'-]+)?\s+(?:st|street|ave|avenue|rd|road|dr|drive|ln|lane|ct|court|blvd|boulevard|way|pl|place|cir|circle|pkwy|parkway|ter|terrace|hwy|highway)\b/i.test(s)
  || /(?:^|[\s,#])\d{2,6}\s+[NSEW]\.?\s+[A-Za-z]/.test(s)
  || /(?:^|[\s,#(])\d{2,6}\s+(?:north|south|east|west|[nsew])\.?\s+[a-z]/i.test(s)
  || /(?:^|[\s,#(])\d{3,6}\s+[A-Z][a-z]{2,}/.test(s);

const isObj = v => !!v && typeof v === "object" && !Array.isArray(v);
const httpsUrl = v => { const s = txt(v); if (!/^https:\/\/\S+$/i.test(s)) return ""; try { return new URL(s).href; } catch(e){ return ""; } };

/* ---------- prices: one installed number up front, the math behind a tap (EDIT ME n) ---------- */
const WORDS = { seeMath:"See the math", part:"Part", labor:"Labor", trip:"Trip fee", handling:"Handling", roundedPart:"about",
  orderedTotal:"About", plusPart:"+ part", plusTrip:"+ trip fee", quoted:"Quoted", quotedLead:"Quoted after a look", laborCovers:"", tripNote:"" };
const OPTIONAL_WORDS = ["seeMath", "laborCovers", "tripNote"];          /* "" or missing = hidden; every other word falls back to its default */
MB.words = () => {
  const w = isObj(CONFIG.priceWords) ? CONFIG.priceWords : {}, out = {};
  Object.keys(WORDS).forEach(k => { const v = txt(w[k]); out[k] = OPTIONAL_WORDS.includes(k) ? v : (v || WORDS[k]); });
  return out;
};
/* What the bag itself would say for this one repair: the bag's own totals, run on a one-line bag. */
MB.quoteFor = (line, area) => {
  const s = MB.state, bag = s.bag, was = s.area;
  try { s.bag = [Object.assign({ key: "quote", qty: 1 }, line)]; if (area) s.area = area; return MB.totals(); }
  finally { s.bag = bag; s.area = was; }
};
MB.roundPart = n => { const r = Math.round(n); return (Math.abs(r - n) >= 0.005 ? MB.words().roundedPart + " " : "") + "$" + r; };
MB.quote = (id, model, area) => {
  const W = MB.words(), s = SERVICES.find(x => x.id === id);
  if (!s) return { lead: "", rows: [] };
  const line = { type: "repair", ref: id, model }, pl = MB.priceLine(Object.assign({ qty: 1 }, line));
  if (pl.quoted || !Array.isArray(s.labor)) return { lead: W.quotedLead, rows: [] };
  const t = MB.quoteFor(line, area), part = s.part ? MB.partFor(s.part, model) : null;
  const known = !!(part && part.price != null), tripKnown = typeof t.trip === "number";
  let lead = range(t.lo, t.hi);
  if (known && part.stock === 0) lead = W.orderedTotal + " " + lead;
  if (pl.partPending) lead += " " + W.plusPart;
  if (!tripKnown) lead += " " + W.plusTrip;
  const rows = [];
  if (s.part) rows.push([W.part, known ? MB.roundPart(part.price) : W.quoted]);
  rows.push([W.labor, range(s.labor[0], s.labor[1])]);
  rows.push([W.trip, tripKnown ? money(t.trip) : W.quoted]);
  return { lead, rows };
};
/* Shop parts (you install it): the number the bag will show, part + handling */
MB.partQuote = id => {
  const W = MB.words(), p = PARTS.find(x => x.id === id), pl = MB.priceLine({ type: "part", ref: id, qty: 1 });
  if (!p || pl.quoted) return null;
  const h = CONFIG.partsHandling, rows = [[W.part, MB.roundPart(p.price)]];
  if (typeof h === "number" && isFinite(h)) rows.push([W.handling, Math.round(h * 1000) / 10 + "%"]);
  return { lead: pl.label, rows };
};
MB.mathHTML = (rows, k, isOpen) => {
  const W = MB.words(); if (!W.seeMath || !rows || !rows.length) return "";
  return `<details class="math" data-k="${esc(k)}"${isOpen ? " open" : ""}><summary>${esc(W.seeMath)}</summary><dl>` +
    rows.map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join("") + `</dl></details>`;
};
/* an opened breakdown stays open when the list redraws (every add to the bag redraws it) */
MB.mathMemory = root => {
  const open = new Set();
  root.addEventListener("toggle", e => { const d = e.target; if (d && d.classList && d.classList.contains("math")) d.open ? open.add(d.dataset.k) : open.delete(d.dataset.k); }, true);
  return open;
};

/* ---------- "where's the wizard today" box (EDIT ME today, or the sheet's todayArea / todayNote) ---------- */
let whereBase = null;
MB.renderToday = () => {
  const where = document.querySelector(".where"); if (!where) return;
  if (whereBase === null) whereBase = where.innerHTML;           /* the page's own default, used when today is empty or refused */
  const today = isObj(CONFIG.today) ? CONFIG.today : {}, area = txt(today.area), note = txt(today.note);
  where.innerHTML = (area && !MB.looksLikeAddress(area + " " + note))
    ? `<strong><span aria-hidden="true">\u{1F4CD}</span> ${esc(area)}</strong>` +
      `<span><a href="sms:${CONFIG.phone}">Text me</a>${note ? " " + esc(note) : ""}</span>`
    : whereBase;
};

/* ---------- numbers typed into the pages follow EDIT ME (and the sheet's tripFeeWichita) ---------- */
MB.bind = () => {
  const fee = CONFIG.tripFeeWichita, d = txt(CONFIG.phoneDisplay), p = txt(CONFIG.phone);
  document.querySelectorAll('[data-bind="trip"]').forEach(el => { if (typeof fee === "number" && isFinite(fee) && fee >= 0) el.textContent = money(fee); });
  document.querySelectorAll('[data-bind="phone"]').forEach(el => { if (d) el.textContent = d; if (el.tagName === "A" && /^\+?\d{10,15}$/.test(p)) el.href = "tel:" + p; });
};

/* ---------- switches (EDIT ME a–n) → page slots ----------
   A slot is an empty, hidden element in the HTML, like <div data-slot="promo" hidden>.
   It fills in and unhides only when its switch is on AND has words. Otherwise it's emptied
   and hidden again, so a switch the sheet turns off disappears too. Everything is plain text. */
MB.paymentsHTML = () => {
  const list = Array.isArray(CONFIG.paymentMethods) ? CONFIG.paymentMethods.map(txt).filter(Boolean) : [];
  return list.length ? `<div class="pay"><span class="pay-h">Ways to pay</span><ul class="pills">${list.map(m => `<li>${esc(m)}</li>`).join("")}</ul></div>` : "";
};
const block = (t, b) => (t ? `<strong>${esc(t)}</strong>` : "") + (b ? `<span>${esc(b)}</span>` : "");
const SOCIAL = {
  instagram: ["Instagram", /(^|\.)instagram\.com$/i,     h => "https://www.instagram.com/" + h + "/"],
  tiktok:    ["TikTok",    /(^|\.)tiktok\.com$/i,        h => "https://www.tiktok.com/@" + h],
  facebook:  ["Facebook",  /(^|\.)(facebook|fb)\.com$/i, h => "https://www.facebook.com/" + h]
};
MB.socialUrl = (k, v) => {
  const d = SOCIAL[k]; let s = txt(v); if (!d || !s) return "";
  if (/^(www\.)?[a-z]+\.com\//i.test(s)) s = "https://" + s;
  if (/^https?:\/\//i.test(s)){ try { const u = new URL(s.replace(/^http:/i, "https:")); return d[1].test(u.hostname) ? u.href : ""; } catch(e){ return ""; } }
  s = s.replace(/^@/, "");
  return /^[A-Za-z0-9._-]{1,60}$/.test(s) ? d[2](s) : "";
};
const announceClosed = () => { try { return sessionStorage.getItem("mb_announce_closed") || ""; } catch(e){ return ""; } };
const WORDS_REVIEW = "Read my Google reviews";
const SLOTS = {
  promo: page => {                                                   /* (a) Heroes promo */
    const p = isObj(CONFIG.heroesPromo) ? CONFIG.heroesPromo : {}, where = txt(p.placement).toLowerCase(), t = txt(p.title), b = txt(p.text);
    return (where === "everywhere" || (where === "services-only" && page === "services")) && (t || b)
      ? `<span class="ico" aria-hidden="true">✦</span><div>${block(t, b)}</div>` : "";
  },
  tier: () => {                                                      /* (b) screen tier label, display only */
    const tier = txt(CONFIG.screenTier).toLowerCase(), labels = isObj(CONFIG.screenTierLabels) ? CONFIG.screenTierLabels : {};
    const label = (tier === "refurbished" || tier === "xo7") ? txt(labels[tier]) : "";
    return label ? `<span class="tier">${esc(label)}</span>` : "";
  },
  payments: () => MB.paymentsHTML(),                                 /* (c) payment methods */
  airport: () => {                                                   /* (d) airport-shift premium, display only */
    const a = isObj(CONFIG.airportShiftPremium) ? CONFIG.airportShiftPremium : {}, t = txt(a.title), b = txt(a.text);
    return a.on === true && (t || b) ? `<span class="ico" aria-hidden="true">✈️</span><div>${block(t, b)}</div>` : "";
  },
  warranty: () => {                                                  /* (e) warranty terms, one plain paragraph */
    const w = txt(CONFIG.warrantyText).replace(/\s+/g, " ");
    return w ? `<p>${esc(w)}</p>` : "";
  },
  announce: () => {                                                  /* (f) announcement banner */
    const a = isObj(CONFIG.announceBar) ? CONFIG.announceBar : {}, t = txt(a.text);
    if (a.on !== true || !t || announceClosed() === t) return "";
    return `<div class="wrap"><span class="ico" aria-hidden="true">✦</span><p>${esc(t)}</p>` +
      `<button class="x" type="button" data-close-announce aria-label="Close announcement">×</button></div>`;
  },
  badges: () => {                                                    /* (g) trust badges */
    const list = Array.isArray(CONFIG.trustBadges) ? CONFIG.trustBadges.slice(0, 4) : [];
    const items = list.filter(isObj).map(b => ({ i: txt(b.icon), t: txt(b.title), x: txt(b.text) })).filter(b => b.t || b.x);
    return items.length ? `<ul class="badges">` + items.map(b =>
      `<li>${b.i ? `<span class="ico" aria-hidden="true">${esc(b.i)}</span>` : ""}<div>${block(b.t, b.x)}</div></li>`).join("") + `</ul>` : "";
  },
  voices: () => {                                                    /* (j) testimonials */
    const list = Array.isArray(CONFIG.testimonials) ? CONFIG.testimonials : [];
    const q = list.map(v => typeof v === "string" ? { quote: v } : (isObj(v) ? v : {}))
      .map(v => ({ q: txt(v.quote).slice(0, 500), n: txt(v.name).slice(0, 60) })).filter(v => v.q).slice(0, 8);
    return q.length ? `<div class="voices">` + q.map(v =>
      `<figure class="voice"><blockquote><p>${esc(v.q)}</p></blockquote>${v.n ? `<figcaption>${esc(v.n)}</figcaption>` : ""}</figure>`).join("") + `</div>` : "";
  },
  review: () => {                                                    /* (j) Google review link */
    const u = httpsUrl(CONFIG.reviewUrl), t = txt(CONFIG.reviewText) || WORDS_REVIEW;
    return u ? `<a class="btn small" href="${esc(u)}" target="_blank" rel="noopener">${esc(t)}</a>` : "";
  },
  socials: () => {                                                   /* (k) social links */
    const s = isObj(CONFIG.socials) ? CONFIG.socials : {};
    return Object.keys(SOCIAL).map(k => [MB.socialUrl(k, s[k]), SOCIAL[k][0]]).filter(([u]) => u)
      .map(([u, label]) => `<a href="${esc(u)}" target="_blank" rel="noopener me">${label}</a>`).join("");
  },
  webuy: () => {                                                     /* (l) we buy phones */
    const w = isObj(CONFIG.weBuy) ? CONFIG.weBuy : {}, t = txt(w.title), x = txt(w.text), l = txt(w.linkText), b = txt(w.smsStart);
    if (!t && !x) return "";
    const href = "sms:" + CONFIG.phone + (b ? "?&body=" + encodeURIComponent(b) : "");
    return `<div class="card buy">${t ? `<h2>${esc(t)}</h2>` : ""}${x ? `<p>${esc(x)}</p>` : ""}${l ? `<a class="btn small" href="${esc(href)}">${esc(l)}</a>` : ""}</div>`;
  },
  firstorder: () => {                                                /* (m) first-order nudge, in the bag */
    const f = isObj(CONFIG.firstOrder) ? CONFIG.firstOrder : {}, t = txt(f.text), c = txt(f.code);
    if (f.on !== true || !t) return "";
    const code = /^[A-Za-z0-9_-]{1,24}$/.test(c) ? c : "";
    return `<span class="ico" aria-hidden="true">✦</span><p>${esc(t)}${code ? ` <code>${esc(code)}</code>` : ""}</p>`;
  },
  laborline: () => esc(MB.words().laborCovers),                      /* (n) what labor covers */
  tripnote: () => {                                                  /* (n) trip fee note under the screen table */
    const n = MB.words().tripNote, f = CONFIG.tripFeeWichita;
    return n && typeof f === "number" && isFinite(f) && f >= 0 ? esc(n.replace(/\{trip\}/g, money(f))) : "";
  }
};
MB.renderSlots = () => {
  const page = document.body.dataset.page;
  Object.keys(SLOTS).forEach(name => {
    const els = document.querySelectorAll(`[data-slot="${name}"]`); if (!els.length) return;
    let html = ""; try { html = SLOTS[name](page) || ""; } catch(e){ if (window.console) console.warn("MagicByte:", e); }
    els.forEach(el => { el.innerHTML = html; el.hidden = !html; });
  });
};

/* ---------- chrome extras: announcement bar, your number on the dock, photo + nudge in the bag ---------- */
MB.talkDock = () => {
  const dock = document.querySelector(".dock"), row = dock && dock.querySelector(".row"); if (!row) return;
  const call = row.querySelector('a[href^="tel:"]'); if (call) call.innerHTML = `<span aria-hidden="true">📞</span> Call`;
  const num = txt(CONFIG.phoneDisplay), line = txt(CONFIG.callLine);
  if (num && !dock.querySelector(".talk")){
    const strip = document.createElement("div"); strip.className = "talk";
    strip.innerHTML = `<a class="num" href="tel:${esc(CONFIG.phone)}">${esc(num)}</a>${line ? `<span>${esc(line)}</span>` : ""}`;
    dock.insertBefore(strip, row);
  }
  /* the bar got taller: keep the page bottom and the toast clear of it */
  const fit = () => { const cs = getComputedStyle(dock); document.documentElement.style.setProperty("--dock", Math.ceil(dock.offsetHeight - (parseFloat(cs.paddingBottom) || 0) + 10) + "px"); };
  fit(); if ("ResizeObserver" in window) new ResizeObserver(fit).observe(dock); else window.addEventListener("resize", fit);
};
MB.bagExtras = () => {
  const sheet = document.getElementById("sheet"), head = sheet && sheet.querySelector(".shead"), body = document.getElementById("sheetBody");
  if (!head || !body || head.querySelector(".bag-me")) return;
  const h2 = head.querySelector("h2"), t = document.createElement("div"); t.className = "bag-t";
  head.insertBefore(t, h2); t.appendChild(h2);
  t.insertAdjacentHTML("beforeend", `<p class="cap" data-caption="bag" hidden></p>`);
  head.insertAdjacentHTML("afterbegin", `<img class="bag-me" src="assets/mascot-icon.png" alt="" width="40" height="40" data-photo="bag">`);
  const n = document.createElement("div"); n.className = "nudge"; n.dataset.slot = "firstorder"; n.hidden = true;
  sheet.insertBefore(n, body);
  /* once the order is sent the bag shows its progress steps; the nudge steps aside */
  if ("MutationObserver" in window) new MutationObserver(() => n.classList.toggle("after", !!body.querySelector(".track"))).observe(body, { childList: true });
};
MB.chrome = () => {
  const head = document.querySelector("header.top");
  if (head && !document.querySelector('[data-slot="announce"]')) head.insertAdjacentHTML("afterend", `<div class="announce" data-slot="announce" hidden></div>`);
  document.addEventListener("click", e => {
    const b = e.target.closest && e.target.closest("[data-close-announce]"); if (!b) return;
    try { sessionStorage.setItem("mb_announce_closed", txt((CONFIG.announceBar || {}).text)); } catch(err){}
    const bar = b.closest('[data-slot="announce"]'); if (bar){ bar.hidden = true; bar.innerHTML = ""; }
  });
  /* "Get a price" on a page whose menu sits inside a tab: open that tab before the jump */
  document.addEventListener("click", e => {
    if (!(e.target.closest && e.target.closest('#dockMain[data-mode="price"]'))) return;
    const o = document.getElementById("order"), p = o && o.closest("[data-tab]"); if (p && p.hidden) MB.showTab(p);
  }, true);
  safe(MB.talkDock); safe(MB.bagExtras);
};

/* ---------- your photo (EDIT ME h): the mascot stays until the photo has really loaded ---------- */
MB.photoSrc = () => {
  const p = isObj(CONFIG.photo) ? CONFIG.photo : {}, s = txt(p.src);
  return /^[\w-][\w./-]*\.(?:jpe?g|png|webp)$/i.test(s) && !/\.\.|\/\//.test(s) ? s : "";
};
let photoCheck = null;
MB.photoCheck = () => photoCheck || (photoCheck = new Promise(done => {
  const src = MB.photoSrc(); if (!src) return done(false);
  const im = new Image(); im.onload = () => done(im.naturalWidth > 1); im.onerror = () => done(false); im.src = src;
}));
MB.caption = slot => { const p = isObj(CONFIG.photo) ? CONFIG.photo : {}, c = isObj(p.captions) ? p.captions : {}; return txt(c[slot]).slice(0, 120); };
MB.applyPhotos = () => MB.photoCheck().then(ok => {
  if (!ok) return;                                                   /* no photo yet: every spot keeps the mascot, no captions */
  const src = MB.photoSrc();
  document.querySelectorAll("img[data-photo]").forEach(im => {
    const was = im.getAttribute("src"), slot = im.dataset.photo, cap = document.querySelector(`[data-caption="${slot}"]`), t = MB.caption(slot);
    im.onerror = () => { im.onerror = null; im.src = was; im.classList.remove("is-photo"); if (cap) cap.hidden = true; };
    im.src = src; im.classList.add("is-photo");
    if (cap){ cap.textContent = t; cap.hidden = !t; }
  });
}).catch(e => { if (window.console) console.warn("MagicByte:", e); });

/* ---------- tabs ----------
   <div data-tabs> holding children marked data-tab. Each tab's label is that panel's
   own heading, so no new words. Without JavaScript the panels just show, stacked. */
let tabSeq = 0;
MB.tabs = root => {
  const panels = [...root.children].filter(el => el.hasAttribute("data-tab"));
  if (panels.length < 2 || root.classList.contains("is-on")) return;
  const n = ++tabSeq, list = document.createElement("div");
  list.className = "tablist"; list.setAttribute("role", "tablist");
  const tabs = panels.map((p, i) => {
    const h = p.querySelector("h2, h3"), b = document.createElement("button");
    if (!p.id) p.id = `tabp${n}-${i}`;
    b.type = "button"; b.id = `tab${n}-${i}`; b.setAttribute("role", "tab"); b.setAttribute("aria-controls", p.id);
    b.textContent = h ? h.textContent.trim() : String(i + 1);
    if (h) h.classList.add("tab-h");
    p.setAttribute("role", "tabpanel"); p.setAttribute("aria-labelledby", b.id);
    if (!p.querySelector("a[href],button,input,select,textarea,summary")) p.tabIndex = 0;
    list.appendChild(b); return b;
  });
  const select = (i, byUser) => {
    tabs.forEach((b, j) => { const on = i === j; b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1; panels[j].hidden = !on; });
    if (byUser){ panels[i].classList.remove("tab-in"); void panels[i].offsetWidth; panels[i].classList.add("tab-in"); }
  };
  list.addEventListener("click", e => { const b = e.target.closest("[role=tab]"); if (b) select(tabs.indexOf(b), true); });
  list.addEventListener("keydown", e => {
    const i = tabs.indexOf(document.activeElement), k = {ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1}[e.key];
    if (i < 0 || k === undefined) return;
    e.preventDefault(); const j = (k + tabs.length) % tabs.length; select(j, true); tabs[j].focus();
  });
  root.insertBefore(list, panels[0]); root.classList.add("is-on");
  const fromHash = () => { let t = null; try { t = location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch(e){} return t ? panels.findIndex(p => p.contains(t)) : -1; };
  const start = fromHash(); select(start > -1 ? start : 0);
  window.addEventListener("hashchange", () => { const i = fromHash(); if (i > -1) select(i, true); });
  root.mbSelect = select; root.mbPanels = panels;
};
MB.showTab = panel => { const r = panel && panel.parentElement; if (r && r.mbSelect) r.mbSelect(r.mbPanels.indexOf(panel)); };

/* ---------- header tucks away while you read, comes back when you scroll up ---------- */
MB.headerTuck = () => {
  const head = document.querySelector("header.top"); if (!head) return;
  document.documentElement.classList.add("tucks");
  let lastY = window.scrollY, acc = 0, ticking = false, hold = 0;
  const show = () => head.classList.remove("tuck");
  document.addEventListener("click", e => {          /* in-page jumps (#order, "Get a price"): keep it tucked so it can't cover the target */
    const a = e.target.closest && e.target.closest('a[href^="#"], #dockMain[data-mode="price"]');
    if (a && document.getElementById("order") && window.scrollY > 90){ hold = Date.now() + 1000; head.classList.add("tuck"); }
  }, true);
  const update = () => {
    ticking = false;
    if (Date.now() < hold){ lastY = Math.max(0, window.scrollY); acc = 0; return; }
    const y = Math.max(0, window.scrollY), dy = y - lastY; lastY = y;
    if ((dy > 0 && acc < 0) || (dy < 0 && acc > 0)) acc = 0;
    acc += dy;
    if (y < 90 || acc < -24) show();
    else if (acc > 24 && !head.contains(document.activeElement)) head.classList.add("tuck");
  };
  window.addEventListener("scroll", () => { if (!ticking){ ticking = true; requestAnimationFrame(update); } }, {passive:true});
  head.addEventListener("focusin", show);
};

/* ---------- keyboard focus stays inside an open sheet ---------- */
document.addEventListener("keydown", e => {
  if (e.key !== "Tab") return;
  const sheet = ["#picker", "#sheet"].map(s => $(s)).find(el => el && !el.hidden);
  if (!sheet) return;
  const f = [...sheet.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1], at = document.activeElement;
  if (!sheet.contains(at)){ e.preventDefault(); first.focus(); }
  else if (e.shiftKey && at === first){ e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && at === last){ e.preventDefault(); first.focus(); }
});

/* ---------- wizard flair: visuals and motion only, never words ----------
   Everything here is skipped under prefers-reduced-motion, and does nothing in
   browsers without the Web Animations API. */
let bursts = 0;
MB.sparkle = (el, count = 8, spread = 36) => {
  if (!el || calm() || bursts > 2 || !el.animate) return;
  const r = el.getBoundingClientRect(); if (!r.width) return;
  const layer = document.createElement("div");
  layer.className = "mb-burst"; layer.setAttribute("aria-hidden", "true");
  layer.style.left = (r.left + r.width / 2) + "px"; layer.style.top = (r.top + r.height / 2) + "px";
  document.body.appendChild(layer); bursts++;
  let left = count;
  const done = () => { if (--left === 0){ layer.remove(); bursts--; } };
  for (let i = 0; i < count; i++){
    const s = document.createElement("i"); if (i % 3 === 1) s.className = "t";
    layer.appendChild(s);
    const a = (Math.PI * 2 * i) / count + Math.random() * .6, d = spread * (.65 + Math.random() * .6);
    const x = Math.cos(a) * d, y = Math.sin(a) * d;
    const anim = s.animate([
      { transform: "translate(0,0) scale(.2) rotate(0deg)", opacity: 0 },
      { transform: `translate(${(x * .3).toFixed(1)}px,${(y * .3).toFixed(1)}px) scale(.9) rotate(25deg)`, opacity: 1, offset: .25 },
      { transform: `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) scale(.6) rotate(80deg)`, opacity: 0 }
    ], { duration: 620 + Math.random() * 260, easing: "cubic-bezier(.2,.7,.3,1)", fill: "forwards" });
    anim.onfinish = done; anim.oncancel = done;
  }
};
MB.flair = () => {
  /* a soft glow under every floating mascot; animations pause while it's off screen */
  document.querySelectorAll(".orbit").forEach(o => {
    if (!o.querySelector(".shade")){ const s = document.createElement("b"); s.className = "shade"; o.prepend(s); }
    if ("IntersectionObserver" in window) new IntersectionObserver(es => es.forEach(en => o.classList.toggle("zzz", !en.isIntersecting))).observe(o);
  });
  /* a sparkle answers every add to the bag (only when the count really goes up) */
  document.addEventListener("click", e => {
    const b = e.target.closest && e.target.closest('button[data-type][data-d="1"]'); if (!b) return;
    const d = b.dataset, p = d.type === "part" ? PARTS.find(x => x.id === d.ref) : null;
    if (MB.qtyOf(d.type, d.ref, d.model) < (p && p.stock > 0 ? Math.min(p.stock, 5) : 5)) MB.sparkle(b, 8, 34);
  }, true);
  if (document.body.dataset.page !== "index") return;
  /* homepage only: twinkling stars, and a picture you can tap (the mascot hops; with your photo it turns over) */
  const o = document.querySelector(".hero .orbit"); if (!o) return;
  const img = o.querySelector(".logo") || o.querySelector("img");
  [[4, 30, 0], [90, 60, 1.3], [24, 94, 2.4]].forEach(([x, y, d]) => {
    const t = document.createElement("b"); t.className = "twk";
    t.style.left = x + "%"; t.style.top = y + "%"; t.style.animationDelay = d + "s"; o.appendChild(t);
  });
  let hopping = false;
  o.addEventListener("click", () => {
    if (o.classList.contains("intro")) return;
    if (o.classList.contains("has-photo")){ o.classList.toggle("flipped"); return; }
    if (hopping || calm() || !img || !img.animate) return;
    hopping = true;
    const hop = img.animate([{translate: "0 0"}, {translate: "0 -16px", offset: .4}, {translate: "0 0"}], {duration: 520, easing: "cubic-bezier(.3,.7,.4,1)"});
    hop.onfinish = hop.oncancel = () => { hopping = false; };
    MB.sparkle(img, 9, 52);
  });
};

/* ---------- Home hero: a cracked phone mends itself into the mascot, then turns to your photo ----------
   Plays once per visit. Never under reduced motion; paused while it's off screen or the tab is hidden.
   Without the photo it rests on the mascot. Any hiccup jumps straight to the finished picture. */
const PHONE = `<svg class="phone" viewBox="0 0 60 104" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="mbGlow" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7a5cc0"/><stop offset="1" stop-color="#3fbfb0"/></linearGradient>
    <linearGradient id="mbSweep" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3dc8c" stop-opacity="0"/><stop offset=".5" stop-color="#f3dc8c" stop-opacity=".9"/><stop offset="1" stop-color="#f3dc8c" stop-opacity="0"/></linearGradient>
    <clipPath id="mbScreen"><rect x="5" y="7" width="50" height="90" rx="6"/></clipPath>
  </defs>
  <rect x="59.2" y="27" width="1.8" height="13" rx=".9" fill="#d4a72c"/>
  <rect x="1" y="1" width="58" height="102" rx="10" fill="#261e3b" stroke="#d4a72c" stroke-width="1.4"/>
  <rect x="5" y="7" width="50" height="90" rx="6" fill="#07050c"/>
  <g clip-path="url(#mbScreen)">
    <rect class="ph-glow" x="5" y="7" width="50" height="90" fill="url(#mbGlow)" opacity="0"/>
    <rect class="ph-sweep" x="5" y="-14" width="50" height="20" fill="url(#mbSweep)" opacity="0"/>
    <g class="ph-cracks" fill="none" stroke="#eef3ff" stroke-width=".9" stroke-linecap="round" stroke-linejoin="round" stroke-opacity=".92">
      <path d="M37 38 L41 31 L43 26 L48 20 L52 12 L56 7"/>
      <path d="M37 38 L45 40 L50 37 L56 39"/>
      <path d="M37 38 L42 47 L44 55 L50 63 L54 74"/>
      <path d="M37 38 L33 45 L27 49 L21 56 L12 60 L4 66"/>
      <path d="M37 38 L31 34 L25 33 L18 27 L10 25 L4 20"/>
      <path d="M37 38 L36 50 L31 60 L30 72 L25 84 L23 98"/>
      <path d="M37 38 L39 30 L36 22 L37 14 L34 6"/>
      <path d="M27 49 L26 55 L21 61"/>
      <path d="M44 55 L39 61 L40 67"/>
      <path d="M33 35 L36 33 L41 34 L42 39 L39 43 L35 42 Z"/>
    </g>
    <circle class="ph-hit" cx="37" cy="38" r="1.3" fill="#fff"/>
  </g>
  <rect x="25" y="10" width="10" height="3" rx="1.5" fill="#000"/>
</svg>`;
MB.hero = () => {
  const stage = document.querySelector(".hero .stage"); if (!stage) return;
  const flip = stage.querySelector(".flip"), front = stage.querySelector(".face.front"), logo = stage.querySelector(".logo"), me = stage.querySelector(".face.back img");
  const cap = document.querySelector('.hero [data-caption="hero"]');
  if (!flip || !front || !logo) return;
  const showCap = () => { const t = MB.caption("hero"); if (cap && t){ cap.textContent = t; cap.hidden = false; } };
  const usePhoto = () => {
    if (!me) return false;
    me.onerror = () => { me.onerror = null; stage.classList.remove("has-photo", "flipped"); if (cap) cap.hidden = true; };
    me.src = MB.photoSrc(); stage.classList.add("has-photo"); return true;
  };
  const settle = ok => {                                               /* the finished picture, no motion */
    const ph = stage.querySelector(".phone"); if (ph) ph.remove();
    stage.classList.add("instant"); stage.classList.remove("intro");
    if (ok && usePhoto()){ stage.classList.add("flipped"); showCap(); }
    requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.remove("instant")));
  };
  const finished = () => MB.photoCheck().then(settle).catch(() => settle(false));
  let seen = false; try { seen = sessionStorage.getItem("mb_intro") === "1"; } catch(e){}
  if (seen || calm() || !stage.animate || !("IntersectionObserver" in window)) return finished();
  try { sessionStorage.setItem("mb_intro", "1"); } catch(e){}

  front.insertAdjacentHTML("afterbegin", PHONE);
  const phone = front.querySelector(".phone"), cracks = [...phone.querySelectorAll(".ph-cracks path")];
  const glow = phone.querySelector(".ph-glow"), sweep = phone.querySelector(".ph-sweep"), hit = phone.querySelector(".ph-hit");
  cracks.forEach(c => { const L = Math.ceil(c.getTotalLength ? c.getTotalLength() : 80) + 1; c.style.strokeDasharray = L; c.dataset.len = L; });
  stage.classList.add("intro");

  /* every step is a Web Animation, so pausing them pauses the whole story */
  const made = [], running = new Set();
  let inView = true, stopped = document.hidden;
  const sync = () => { stopped = !inView || document.hidden; running.forEach(a => { try { stopped ? a.pause() : a.play(); } catch(e){} }); };
  const go = (el, frames, opts) => {
    const a = el.animate(frames, Object.assign({ fill: "both", easing: "cubic-bezier(.2,.7,.3,1)" }, opts));
    made.push(a); running.add(a); if (stopped) a.pause();
    return a.finished.then(() => { running.delete(a); return a; });
  };
  const io = new IntersectionObserver(es => { inView = es[es.length - 1].isIntersecting; sync(); });
  io.observe(stage); document.addEventListener("visibilitychange", sync);
  const wrapUp = () => { io.disconnect(); document.removeEventListener("visibilitychange", sync); made.forEach(a => { try { a.cancel(); } catch(e){} }); };

  const run = async () => {
    await go(stage, [{ opacity: 0, transform: "translateY(10px) scale(.86)" }, { opacity: 1, transform: "none" }], { duration: 560 });
    await Promise.all([                                                /* the broken screen flickers, the phone shudders */
      go(phone, [{ transform: "rotate(0)" }, { transform: "rotate(-6deg)", offset: .22 }, { transform: "rotate(4deg)", offset: .5 }, { transform: "rotate(-2deg)", offset: .75 }, { transform: "rotate(0)" }], { duration: 420, easing: "ease-out" }),
      go(glow, [{ opacity: 0 }, { opacity: .38, offset: .12 }, { opacity: 0, offset: .3 }, { opacity: .22, offset: .52 }, { opacity: 0 }], { duration: 420, easing: "linear" })
    ]);
    MB.sparkle(hit, 10, 34);
    await Promise.all([                                                /* the cracks draw back into the impact while light passes down the glass */
      ...cracks.map((c, i) => go(c, [{ strokeDashoffset: 0 }, { strokeDashoffset: +c.dataset.len }], { duration: 640, delay: 90 + i * 55, easing: "cubic-bezier(.6,0,.3,1)" })),
      go(hit, [{ opacity: 1 }, { opacity: 0 }], { duration: 500, delay: 500 }),
      go(sweep, [{ opacity: 0, transform: "translateY(0)" }, { opacity: 1, offset: .2 }, { opacity: 1, offset: .8 }, { opacity: 0, transform: "translateY(112px)" }], { duration: 1080, easing: "ease-in-out" })
    ]);
    await Promise.all([                                                /* the screen comes back on */
      go(glow, [{ opacity: 0 }, { opacity: 1 }], { duration: 380, easing: "ease-out" }),
      go(phone, [{ transform: "scale(1)" }, { transform: "scale(1.07)", offset: .5 }, { transform: "scale(1)" }], { duration: 380 })
    ]);
    MB.sparkle(logo, 12, 60);
    const [, grow] = await Promise.all([                               /* the mended phone becomes the mascot */
      go(phone, [{ opacity: 1, transform: "scale(1) rotate(0)" }, { opacity: 0, transform: "scale(.45) rotate(-12deg)" }], { duration: 480, easing: "cubic-bezier(.5,0,.75,0)" }),
      go(logo, [{ opacity: 0, transform: "scale(.55)" }, { opacity: 1, transform: "scale(1)" }], { duration: 640, delay: 200, easing: "cubic-bezier(.2,.9,.3,1.3)" })
    ]);
    phone.remove(); stage.classList.remove("intro"); try { grow.cancel(); } catch(e){}   /* hand the mascot back to its float */
    const cta = document.querySelector(".choices .btn.solid");
    if (cta){ cta.classList.add("glint"); setTimeout(() => cta.classList.remove("glint"), 1600); }
    const ok = await Promise.race([MB.photoCheck(), new Promise(r => setTimeout(() => r(false), 2500))]);
    if (!ok || !usePhoto()) return;
    await go(stage, [{ opacity: 1 }, { opacity: 1 }], { duration: 950 });                 /* a beat on the mascot */
    await go(flip, [{ transform: "rotateY(0deg)" }, { transform: "rotateY(180deg)" }], { duration: 820, easing: "cubic-bezier(.3,.7,.2,1)" });
    stage.classList.add("instant", "flipped"); showCap(); MB.sparkle(me, 8, 46);
    requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.remove("instant")));
  };
  run().then(wrapUp, err => { if (window.console) console.warn("MagicByte:", err); wrapUp(); finished(); });
};

/* ---------- Google Sheet → PARTS, SERVICES and a few settings (EDIT ME o) ----------
   Every page load reads each tab's published CSV fresh and lays it over the values in EDIT ME.
   Whatever fails — no link, no connection, a tab whose columns don't match, a broken row, a word
   where a number goes, an id this file doesn't have — keeps the EDIT ME value. Nothing is blanked.
   A copy under five minutes old (Google's own publish delay) paints the next page of the same
   visit so prices don't jump; it's re-checked against the sheet straight away. */
MB.sheet = { tabs: {}, active: false, done: false };
(() => { try {
  const COLS = { parts: ["id","name","price","stock","grade"], labor: ["id","name","labor_low","labor_high","time"], settings: ["key","value"] };
  const KEYS = {                                                       /* settings the sheet may change, and what each must be */
    todayarea:      { at: ["today", "area"],       type: "text", max: 80 },
    todaynote:      { at: ["today", "note"],       type: "text", max: 120 },
    tripfeewichita: { at: ["tripFeeWichita"],      type: "num",  max: 100 },
    announceon:     { at: ["announceBar", "on"],   type: "bool" },
    announcetext:   { at: ["announceBar", "text"], type: "text", max: 160 },
    firstorderon:   { at: ["firstOrder", "on"],    type: "bool" },
    firstordercode: { at: ["firstOrder", "code"],  type: "code" },
    firstordertext: { at: ["firstOrder", "text"],  type: "text", max: 160 },
    reviewurl:      { at: ["reviewUrl"],           type: "url" }
  };
  const report = MB.sheet.tabs, link = txt(CONFIG.sheetUrl);
  const pub = (/docs\.google\.com\/spreadsheets\/d\/e\/([\w-]{10,})/.exec(link) || [])[1];
  const gids = isObj(CONFIG.sheetTabs) ? CONFIG.sheetTabs : {}, urls = {};
  Object.keys(COLS).forEach(t => {
    const g = String(gids[t] == null ? "" : gids[t]).trim();
    if (pub && /^\d{1,12}$/.test(g)) urls[t] = `https://docs.google.com/spreadsheets/d/e/${pub}/pub?gid=${g}&single=true&output=csv`;
    report[t] = { state: !link ? "off (sheetUrl is empty)" : !pub ? "sheetUrl isn't a Publish to web link" : urls[t] ? "loading" : "no gid in sheetTabs", applied: 0, ignored: [] };
  });
  if (!Object.keys(urls).length) return;
  MB.sheet.active = true;

  /* the EDIT ME values, kept so every pass starts from them */
  const CFG = ["today", "tripFeeWichita", "announceBar", "firstOrder", "reviewUrl"];
  const fb = { parts: PARTS.map(p => ({ name: p.name, price: p.price, stock: p.stock, grade: p.grade })),
               labor: SERVICES.map(s => ({ name: s.name, labor: Array.isArray(s.labor) ? s.labor.slice() : s.labor, time: s.time })),
               cfg: JSON.stringify(CFG.map(k => [k, CONFIG[k] === undefined ? null : CONFIG[k]])) };
  const restore = () => {
    PARTS.forEach((p, i) => Object.assign(p, fb.parts[i]));
    SERVICES.forEach((s, i) => Object.assign(s, fb.labor[i], { labor: Array.isArray(fb.labor[i].labor) ? fb.labor[i].labor.slice() : fb.labor[i].labor }));
    JSON.parse(fb.cfg).forEach(([k, v]) => { if (v === null) delete CONFIG[k]; else CONFIG[k] = v; });
  };
  const set = (at, v) => { if (at.length === 1){ CONFIG[at[0]] = v; return; } if (!isObj(CONFIG[at[0]])) CONFIG[at[0]] = {}; CONFIG[at[0]][at[1]] = v; };

  const csv = text => {                                                /* RFC 4180: quotes, commas and line breaks inside cells */
    const rows = [], s = String(text).replace(/^\uFEFF/, ""); let row = [], cell = "", q = false;
    for (let i = 0; i < s.length; i++){
      const c = s[i];
      if (q){ if (c === '"'){ if (s[i + 1] === '"'){ cell += '"'; i++; } else q = false; } else cell += c; }
      else if (c === '"' && cell === "") q = true;
      else if (c === ","){ row.push(cell); cell = ""; }
      else if (c === "\n" || c === "\r"){ if (c === "\r" && s[i + 1] === "\n") i++; row.push(cell); rows.push(row); row = []; cell = ""; }
      else cell += c;
    }
    if (q) return null;                                                /* an unclosed quote: the whole tab is broken */
    if (cell !== "" || row.length){ row.push(cell); rows.push(row); }
    return rows;
  };
  const clean = (v, max) => String(v == null ? "" : v).replace(/[\u0000-\u001f\u007f<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
  const num = (v, max, whole) => {
    const s = String(v == null ? "" : v).trim().replace(/^\$\s*/, "").replace(/,(?=\d{3}(?:\D|$))/g, "");
    if (!/^\d+(?:\.\d+)?$/.test(s)) return null;
    const n = Number(s); return isFinite(n) && n <= max && (!whole || Number.isInteger(n)) ? n : null;
  };
  const table = (tab, text) => {
    const rows = csv(text); if (!rows || !rows.length) return null;
    const head = rows[0].map(h => h.trim().toLowerCase().replace(/\s+/g, "_")), at = {};
    for (const c of COLS[tab]){ const i = head.indexOf(c); if (i < 0) return null; at[c] = i; }
    const need = Math.max(...Object.values(at)), out = [];
    rows.slice(1).forEach((cells, j) => {
      if (cells.every(c => !c.trim())) return;                         /* blank line */
      if (cells.length <= need){ out.push([j + 2, null]); return; }    /* short row: broken, skipped */
      const o = {}; COLS[tab].forEach(c => { o[c] = cells[at[c]]; }); out.push([j + 2, o]);
    });
    return out;
  };
  const read = (d, v) => {
    const s = clean(v, d.max || 300);
    if (d.type === "text") return s || undefined;
    if (d.type === "num"){ const n = num(v, d.max); return n === null ? undefined : n; }
    if (d.type === "bool") return /^(true|yes|on|1)$/i.test(s) ? true : /^(false|no|off|0)$/i.test(s) ? false : undefined;
    if (d.type === "code") return /^[A-Za-z0-9_-]{1,24}$/.test(s) ? s : undefined;
    if (d.type === "url") return httpsUrl(s) || undefined;
  };
  const apply = {
    parts(rows, r){ const seen = new Set();
      rows.forEach(([n, o]) => {
        if (!o) return r.ignored.push([n, "", "row is missing cells"]);
        const id = clean(o.id, 60), p = PARTS.find(x => x.id === id);
        if (!id) return r.ignored.push([n, "", "no id"]);
        if (!p) return r.ignored.push([n, id, "id isn't in PARTS, ignored"]);
        if (seen.has(id)) return r.ignored.push([n, id, "same id as an earlier row, ignored"]);
        seen.add(id);
        const name = clean(o.name, 80), grade = clean(o.grade, 60), price = num(o.price, 1000), stock = num(o.stock, 99, true);
        if (name) p.name = name;
        if (grade) p.grade = grade;
        if (price !== null) p.price = price; else if (clean(o.price, 20)) r.ignored.push([n, id, "price isn't a number (0–1000), kept EDIT ME"]);
        if (stock !== null) p.stock = stock; else if (clean(o.stock, 20)) r.ignored.push([n, id, "stock isn't a whole number (0–99), kept EDIT ME"]);
        r.applied++;
      });
    },
    labor(rows, r){ const seen = new Set();
      rows.forEach(([n, o]) => {
        if (!o) return r.ignored.push([n, "", "row is missing cells"]);
        const id = clean(o.id, 60), s = SERVICES.find(x => x.id === id);
        if (!id) return r.ignored.push([n, "", "no id"]);
        if (!s) return r.ignored.push([n, id, "id isn't in SERVICES, ignored"]);
        if (seen.has(id)) return r.ignored.push([n, id, "same id as an earlier row, ignored"]);
        seen.add(id);
        const name = clean(o.name, 80), time = clean(o.time, 40), lo = num(o.labor_low, 500), hi = num(o.labor_high, 500);
        if (name) s.name = name;
        if (time) s.time = time;
        if (lo === null && clean(o.labor_low, 20)) r.ignored.push([n, id, "labor_low isn't a number (0–500), kept EDIT ME"]);
        if (hi === null && clean(o.labor_high, 20)) r.ignored.push([n, id, "labor_high isn't a number (0–500), kept EDIT ME"]);
        if (lo !== null || hi !== null){
          const was = Array.isArray(s.labor) ? s.labor : [], L = lo !== null ? lo : was[0], H = hi !== null ? hi : was[1];
          if (typeof L === "number" && typeof H === "number" && L <= H) s.labor = [L, H];
          else r.ignored.push([n, id, "labor_low is above labor_high, kept EDIT ME"]);
        }
        r.applied++;
      });
    },
    settings(rows, r){ const got = {};
      rows.forEach(([n, o]) => {
        if (!o) return r.ignored.push([n, "", "row is missing cells"]);
        const name = clean(o.key, 40), k = name.toLowerCase().replace(/[^a-z]/g, ""), d = KEYS[k];
        if (!name) return;
        if (!d) return r.ignored.push([n, name, "not a setting the site reads"]);
        const v = read(d, o.value);
        if (v === undefined) return r.ignored.push([n, name, "value doesn't fit, kept EDIT ME"]);
        got[k] = v;
      });
      if ("todayarea" in got || "todaynote" in got){                  /* the same address guard as EDIT ME */
        const t = isObj(CONFIG.today) ? CONFIG.today : {};
        const area = "todayarea" in got ? got.todayarea : txt(t.area), note = "todaynote" in got ? got.todaynote : txt(t.note);
        if (MB.looksLikeAddress(area + " " + note)){ delete got.todayarea; delete got.todaynote; r.ignored.push([0, "todayArea / todayNote", "looks like an address, kept EDIT ME"]); }
      }
      Object.keys(got).forEach(k => { set(KEYS[k].at, got[k]); r.applied++; });
    }
  };

  let csvs = {};                                                       /* tab → the CSV laid over EDIT ME right now */
  const layer = () => {
    for (let pass = 0; pass < 4; pass++){
      restore(); let broke = false;
      for (const t of Object.keys(COLS)){
        const r = report[t]; r.applied = 0; r.ignored = [];
        if (!csvs[t]) continue;
        const rows = table(t, csvs[t]);
        if (!rows){ r.state = "the first row isn't " + COLS[t].join(", "); delete csvs[t]; continue; }
        try { apply[t](rows, r); r.state = "loaded"; }
        catch(e){ r.state = "couldn't be read"; delete csvs[t]; broke = true; break; }
      }
      if (!broke) return;
    }
    restore();
  };

  const KEY = "mb_sheet", FRESH = 5 * 60 * 1000, sig = JSON.stringify(urls);
  try {                                                                /* a copy from a few minutes ago paints the first frame */
    const s = JSON.parse(sessionStorage.getItem(KEY) || "null"), age = s ? Date.now() - s.t : -1;
    if (s && s.sig === sig && age >= 0 && age < FRESH && isObj(s.csv)){
      Object.keys(COLS).forEach(t => { if (typeof s.csv[t] === "string") csvs[t] = s.csv[t]; });
      layer();
    }
  } catch(e){ csvs = {}; restore(); }

  if (typeof fetch !== "function"){ Object.keys(urls).forEach(t => { report[t].state = "this browser can't read the sheet"; }); csvs = {}; restore(); MB.sheet.done = true; return; }
  const grab = url => new Promise((resolve, reject) => {
    const ctl = window.AbortController ? new AbortController() : null;
    const stop = setTimeout(() => { if (ctl) ctl.abort(); reject(new Error("timed out")); }, 8000);
    fetch(url, { cache: "no-cache", credentials: "omit", redirect: "follow", signal: ctl ? ctl.signal : undefined })
      .then(res => {
        if (!res.ok) throw new Error("the sheet answered " + res.status);
        const type = res.headers.get("content-type") || "";
        if (type && !/csv|text\/plain/i.test(type)) throw new Error("got " + type.split(";")[0] + " instead of a CSV");
        return res.text();
      })
      .then(t => { if (t.length > 400000) throw new Error("the tab is too big"); if (/^\s*</.test(t)) throw new Error("got a web page instead of a CSV"); resolve(t); })
      .catch(reject)
      .then(() => clearTimeout(stop));
  });
  const snap = () => JSON.stringify([PARTS, SERVICES, CFG.map(k => CONFIG[k])]);
  Promise.all(Object.keys(urls).map(t => grab(urls[t]).then(text => [t, text, null], err => [t, null, err]))).then(results => {
    const before = snap(), next = {};
    results.forEach(([t, text, err]) => {
      if (text !== null) next[t] = text;
      else report[t].state = "couldn't load (" + ((err && err.message) || "blocked") + "), using EDIT ME";
    });
    csvs = next; layer();
    try { if (Object.keys(csvs).length) sessionStorage.setItem(KEY, JSON.stringify({ sig, t: Date.now(), csv: csvs })); else sessionStorage.removeItem(KEY); } catch(e){}
    MB.sheet.done = true;
    if (MB.ready){ if (snap() !== before) MB.redraw(); safe(MB.sheetReport); }
  }).catch(e => { csvs = {}; restore(); MB.sheet.done = true; if (MB.ready){ MB.redraw(); safe(MB.sheetReport); } });
} catch(e){ if (window.console) console.warn("MagicByte sheet:", e); } })();

/* after the sheet lands: redraw everything that shows its values */
MB.redraw = () => { safe(MB.refresh); safe(MB.renderToday); safe(MB.renderSlots); safe(MB.bind); };

/* add ?sheetcheck to any page address to see what the sheet changed and what it skipped */
MB.sheetReport = () => {
  if (!/[?&]sheetcheck\b/i.test(location.search)) return;
  const main = document.getElementById("main"); if (!main) return;
  let box = document.getElementById("sheetcheck");
  if (!box){ box = document.createElement("section"); box.id = "sheetcheck"; box.className = "sheetcheck"; main.prepend(box); }
  const tabs = MB.sheet.tabs;
  box.innerHTML = `<h2>Sheet check</h2><p>Only shows with ?sheetcheck in the address. Anything listed below kept its EDIT ME value.</p>` +
    Object.keys(tabs).map(t => { const r = tabs[t];
      return `<h3>${esc(t)}: ${esc(r.state)}${r.applied ? `, ${r.applied} row${r.applied > 1 ? "s" : ""} used` : ""}</h3>` +
        (r.ignored.length ? `<ul>${r.ignored.map(([n, id, why]) => `<li>${n ? "Row " + n + ": " : ""}${id ? esc(id) + " — " : ""}${esc(why)}</li>`).join("")}</ul>` : "");
    }).join("");
};

document.addEventListener("DOMContentLoaded", () => {
  buildChrome(); MB.renderDock();
  safe(MB.chrome);                       /* announcement bar, your number on the dock, photo + nudge in the bag */
  safe(MB.renderToday);
  document.addEventListener("click", e => {
    const t = e.target.closest("button"); if (!t) return;
    const d = t.dataset;
    if (d.d && d.type){ MB.setQty(d.type, d.ref, d.model, MB.qtyOf(d.type, d.ref, d.model) + Number(d.d), d.name); }
    else if (d.remove){ MB.state.bag = MB.state.bag.filter(l => l.key!==d.remove); MB.save(); MB.refresh(); }
    else if (d.swap){ const l = MB.state.bag.find(x=>x.key===d.swap); const p = PARTS.find(x=>x.id===l.ref); const svc = SERVICES.find(x=>x.part===p.kind); MB.state.bag = MB.state.bag.filter(x=>x!==l); MB.setQty("repair", svc.id, p.models[0], 1, svc.name); }
    else if (t.id==="dockMain"){ if (d.mode==="bag") MB.openSheet(); else { const o = document.getElementById("order"); if (o) o.scrollIntoView(); else location.href = "index.html#order"; } }
    else if (d.pick) MB.openPicker();
    else if (d.pbrand){ MB.state.brand = d.pbrand; $("#pickSearch").value=""; renderPicker(); }
    else if (d.pmodel){ MB.state.model = d.pmodel; MB.save(); MB.refresh(); MB.closePicker(); MB.toast("Showing prices for " + d.pmodel, false); }
    else if (t.id==="closePicker") MB.closePicker();
    else if (t.id==="toastView"){ $("#toast").classList.remove("show"); MB.openSheet(); }
    else if (t.id==="closeSheet") MB.closeSheet();
    else if (t.id==="clearBag"){ if (confirm("Remove everything from your bag?")){ MB.state.bag = []; MB.save(); MB.refresh(); } }
    else if (t.id==="sendOrder"){ const f = readForm(); if (!f) return; MB.sms(MB.orderText(f)); MB.state.sent = true; renderSheet(); }
    else if (t.id==="copyOrder"){ const f = readForm(); if (!f) return; const txt = MB.orderText(f);
      (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(()=>MB.toast("Order copied. Paste it in a text to " + CONFIG.phoneDisplay, false), ()=>MB.toast("Couldn't copy. Use Send order by text instead.", false)); }
    else if (t.id==="doneClear"){ MB.state.bag = []; MB.state.sent = false; MB.save(); MB.refresh(); MB.closeSheet(); }
    else if (t.id==="backBag"){ MB.state.sent = false; renderSheet(); }
  });
  document.addEventListener("change", e => { if (e.target.id==="area"){ MB.state.area = e.target.value; MB.save(); MB.renderDock(); renderSheet(); } });
  document.addEventListener("input", e => { if (e.target.id==="pickSearch") renderPicker(e.target.value); });
  document.addEventListener("keydown", e => { if (e.key!=="Escape") return; if (!$("#picker").hidden) MB.closePicker(); else if (!$("#sheet").hidden) MB.closeSheet(); });
  document.addEventListener("click", e => { if (e.target.id!=="scrim") return; if (!$("#picker").hidden) MB.closePicker(); else MB.closeSheet(); });
  if (location.hash==="#bag") MB.openSheet();
  safe(MB.renderSlots);
  safe(MB.bind);
  safe(MB.applyPhotos);
  document.querySelectorAll("[data-tabs]").forEach(r => safe(MB.tabs, r));
  safe(MB.headerTuck);
  if (window.pageInit) safe(window.pageInit);
  safe(MB.flair);
  safe(MB.hero);
  MB.ready = true;
  safe(MB.sheetReport);
});
