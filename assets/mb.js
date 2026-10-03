/* MagicByte shared script — header, bottom dock, bag, prices.
   Every page loads this. Edit prices and stock ONLY here. */

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
  today: { area: "On the road around Wichita", note: "and I'll tell you exactly where I am" },
  bagKey: "magicbyte_bag"
};

const MODELS = {
  iPhone: ["iPhone X","iPhone XS","iPhone XS Max","iPhone XR","iPhone 11","iPhone 11 Pro","iPhone 11 Pro Max",
           "iPhone 12 mini","iPhone 12","iPhone 12 Pro","iPhone 12 Pro Max","iPhone 13 mini","iPhone 13","iPhone 13 Pro","iPhone 13 Pro Max",
           "iPhone 14","iPhone 14 Plus","iPhone 14 Pro","iPhone 14 Pro Max","iPhone 15","iPhone 15 Pro","iPhone 16","iPhone 16 Pro","Other iPhone"],
  Galaxy: ["Galaxy S21","Galaxy S22","Galaxy S23","Galaxy S24","Galaxy S25","Galaxy A-series","Other Galaxy"],
  Pixel:  ["Pixel 6","Pixel 7","Pixel 8","Pixel 9","Other Pixel"],
  Other:  ["Other phone or tablet"]
};

/* labor: [low, high] or null for "quoted" */
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
   they move, so re-check before quoting. */
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
MB.openPicker = () => { const p = $("#picker"); p.hidden = false; $("#pickSearch").value = ""; renderPicker();
  requestAnimationFrame(()=>{ p.classList.add("open"); $("#scrim").classList.add("open"); $("#pickSearch").focus({preventScroll:true}); }); document.body.style.overflow="hidden"; };
MB.closePicker = () => { const p = $("#picker"); p.classList.remove("open"); if ($("#sheet").hidden) { $("#scrim").classList.remove("open"); document.body.style.overflow=""; } setTimeout(()=>{ p.hidden = true; }, 300); };

/* ---------- reusable repair menu (home) ---------- */
MB.mountMenu = (root) => {
  let cat = "All";
  const CATS = ["All","Screens","Batteries","Charging","Cameras","Back glass","Not sure"];
  root.innerHTML = `<div class="pickslot"></div><div class="chips" role="group" aria-label="Filter repairs"></div><ul class="menu"></ul>`;
  const slot = root.querySelector(".pickslot"), chips = root.querySelector(".chips"), menu = root.querySelector(".menu");
  function draw(){
    const s = MB.state;
    slot.innerHTML = MB.modelButton();
    chips.innerHTML = CATS.map(c => `<button type="button" aria-pressed="${c===cat}" data-cat="${c}">${c}</button>`).join("");
    menu.innerHTML = SERVICES.filter(x => cat==="All" || x.cat===cat).map(x => {
      const p = MB.priceLine({type:"repair", ref:x.id, model:s.model, qty:1});
      const part = x.part ? MB.partFor(x.part, s.model) : null;
      const badge = part ? (part.stock>0 ? `<span class="badge">In the van</span>` : `<span>Part ships in 3–5 days</span>`) : "";
      const priceTxt = p.quoted ? "Quoted after a look" : (p.partPending ? `Labor ${range(...x.labor)} + part` : (part && part.stock===0 ? "About " : "") + p.label);
      return `<li class="item" id="svc-${x.id}"><div><h3>${x.name}</h3><p class="desc">${x.desc}</p><div class="meta"><span class="price">${priceTxt}</span><span>${x.time}</span>${badge}</div></div><div class="side">${MB.control("repair", x.id, s.model, x.name)}</div></li>`;
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
    <a class="dbtn" href="sms:${CONFIG.phone}">💬 Text</a>
    <a class="dbtn" href="tel:${CONFIG.phone}">📼 Voicemail</a>
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
    <p class="note">${t.quoted ? "Some parts get priced after I check stock, so the final total may be higher. " : ""}Nothing is charged here. You pay when the repair is done; parts I need to order may need a deposit, and I'll tell you first.${s.bag.some(l=>l.type==="part") ? " I'm not liable for damage from self-installation." : ""}</p>
    <label class="lab" for="fName">Name</label><input class="field" id="fName" autocomplete="name">
    <label class="lab" for="fReply">Where should I reply?</label><input class="field" id="fReply" placeholder="Phone number or email" autocomplete="tel">
    <label class="lab" for="fNotes">Notes</label><textarea class="field" id="fNotes" placeholder="What happened, timing that works for you…"></textarea>
    <p class="err" id="formErr" hidden></p>
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

document.addEventListener("DOMContentLoaded", () => {
  buildChrome(); MB.renderDock();
  const where = document.querySelector(".where");
  if (where && CONFIG.today){
    where.innerHTML = `<strong>\u{1F4CD} ${esc(CONFIG.today.area)}</strong>` +
      `<span><a href="sms:${CONFIG.phone}">Text me</a> ${esc(CONFIG.today.note)}</span>`;
  }
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
  if (window.pageInit) window.pageInit();
});
