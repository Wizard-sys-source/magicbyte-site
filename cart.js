/* ============================================================
   MagicByte — cart.js
   The bag on the Shop Parts page (inventory.html). It shares
   one bag with the homepage through window.MagicByteBag
   (defined in site-data.js), so items carry over between pages.

   Lines look like:
     { key:"part|iphone-12-screen|", type:"part",
       ref:"iphone-12-screen", model:"", qty:1 }
     { key:"repair|screen|iPhone 13", type:"repair",
       ref:"screen", model:"iPhone 13", qty:1 }

   Part details (name, price, in-stock) resolve from the shared
   window.MagicByteParts registry. Repair lines are priced as
   "quoted" here — labor ranges live on services.html.

   Rules, same as the shop page states:
     · in-stock parts need no deposit; special-order parts do
     · self-install is part cost + 5% handling, install is + labor
   ============================================================ */

(function () {
  "use strict";

  /* ---------- 0  Config ------------------------------------
     Replace this with your Formspree form ID for parts orders.
     The consultation form is configured separately, in wizard.js.
     --------------------------------------------------------- */
  var FORMSPREE_ENDPOINT = "https://formspree.io/f/REPLACE_WITH_YOUR_PARTS_FORM_ID";

  var OLD_STORAGE_KEY = "magicbyte_satchel_v1";  // retired; migrated once
  var PHONE = "316-559-4816";
  var SELF_INSTALL_MARKUP = 0.05;   // the "cost + 5%" on the shop page

  // Labor ranges mirror services.html, for repair lines added on
  // the homepage. If you change labor there, change it here too.
  var SERVICES = {
    screen:  { name: "Screen replacement",   labor: [35, 45] },
    battery: { name: "Battery replacement",  labor: [35, 40] },
    port:    { name: "Charging port repair",  labor: [40, 60] },
    camera:  { name: "Camera repair",         labor: [40, 50] },
    back:    { name: "Back glass",            labor: [40, 50] },
    polish:  { name: "Glass polishing",       labor: null },
    diag:    { name: "Diagnostics only",      labor: [15, 20] }
  };

  var lastFocus = null;
  var justAdded = null;             // key of the row to flash on next render

  // wizard.js publishes these; degrade quietly if it hasn't loaded
  var FX = window.MagicByteFX || {};
  function burst()   { if (FX.burst)    FX.burst.apply(null, arguments); }
  function castRing() { if (FX.castRing) FX.castRing.apply(null, arguments); }

  function bagStore() {
    return window.MagicByteBag || {
      KEY: "magicbyte_bag",
      keyOf: function (t, r, m) { return t + "|" + r + "|" + (m || ""); },
      read: function () { return { bag: [] }; },
      write: function () {}
    };
  }

  /* ---------- 1  Storage ---------- */
  function readEnv() {
    var env = bagStore().read();
    if (!env || !Array.isArray(env.bag)) env = { bag: [] };
    return env;
  }

  function writeEnv(env) {
    bagStore().write(env);
    renderBadge();
    renderBag();
  }

  // One-time move from the old shop-only bag format.
  function migrateOld() {
    var raw = null;
    try { raw = localStorage.getItem(OLD_STORAGE_KEY); } catch (e) {}
    if (!raw) return;
    try {
      var items = JSON.parse(raw);
      if (!Array.isArray(items) || !items.length) return;
      var env = readEnv();
      if (env.bag.length) return;   // never clobber the shared bag
      var keyOf = bagStore().keyOf;
      items.forEach(function (i) {
        if (!i || !i.id) return;
        env.bag.push({
          key: keyOf("part", i.id, ""),
          type: "part", ref: i.id, model: "",
          qty: Math.min(Math.max(i.qty || 1, 1), 20)
        });
      });
      writeEnv(env);
    } catch (e) { /* corrupted old bag — leave it behind */ }
    try { localStorage.removeItem(OLD_STORAGE_KEY); } catch (e) {}
  }

  function findPart(ref) {
    var parts = window.MagicByteParts || [];
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].id === ref) return parts[i];
    }
    return null;
  }

  // Turn a raw line into everything the drawer and the order
  // email need. Unknown refs degrade to "quoted" instead of
  // vanishing — a line the customer added should never disappear.
  function resolveLine(l) {
    if (l.type === "repair") {
      var s = SERVICES[l.ref];
      var name = (s ? s.name : l.ref) + (l.model ? " \u2014 " + l.model : "");
      var labor = s && s.labor ? "$" + s.labor[0] + "\u2013$" + s.labor[1] + " labor" : "labor quoted";
      return { name: name, sub: "Installed by me", priceText: labor,
               priceValue: null, stock: "na" };
    }
    var p = findPart(l.ref);
    var pname = p ? p.name : l.ref;
    var inStock = p ? p.inStock : false;
    return {
      name: pname + " (part only)",
      sub: p ? (inStock ? "In stock" : "Special order \u00b7 3\u20135 days") : "Part",
      priceText: (p && p.price != null) ? "$" + p.price.toFixed(2) : "Quoted after review",
      priceValue: (p && p.price != null) ? p.price : null,
      stock: p ? (inStock ? "in" : "order") : "order"
    };
  }

  function lines() { return readEnv().bag; }

  function count(ls) {
    return ls.reduce(function (n, l) { return n + (l.qty || 0); }, 0);
  }

  function subtotal(ls) {
    return ls.reduce(function (n, l) {
      var r = resolveLine(l);
      return n + (r.priceValue || 0) * (l.qty || 0);
    }, 0);
  }

  function hasUnpriced(ls) {
    return ls.some(function (l) { return !resolveLine(l).priceValue; });
  }

  function hasSpecialOrder(ls) {
    return ls.some(function (l) { return resolveLine(l).stock === "order"; });
  }

  function hasRepair(ls) {
    return ls.some(function (l) { return l.type === "repair"; });
  }

  function addPart(ref) {
    var keyOf = bagStore().keyOf;
    var key = keyOf("part", ref, "");
    var env = readEnv();
    var existing = null;
    env.bag.forEach(function (l) { if (l.key === key) existing = l; });
    if (existing) {
      existing.qty = Math.min(existing.qty + 1, 20);
    } else {
      env.bag.push({ key: key, type: "part", ref: ref, model: "", qty: 1 });
    }
    justAdded = key;
    writeEnv(env);
    bumpGlyph();
    openDrawer();
    var p = findPart(ref);
    toast((p ? p.name : ref) + " added to your bag");
  }

  function setQty(key, qty) {
    var env = readEnv();
    if (qty <= 0) return removeItem(key);
    env.bag.forEach(function (l) {
      if (l.key === key) l.qty = Math.min(qty, 20);
    });
    writeEnv(env);
  }

  function removeItem(key) {
    var env = readEnv();
    var gone = null;
    env.bag.forEach(function (l) { if (l.key === key) gone = l; });
    env.bag = env.bag.filter(function (l) { return l.key !== key; });
    writeEnv(env);
    if (gone) toast(resolveLine(gone).name + " removed");
  }

  function clearCart(quiet) {
    var env = readEnv();
    env.bag = [];
    writeEnv(env);
    if (!quiet) toast("Bag emptied");
  }

  /* ---------- 2  Nav button + badge ----------
     Goes inside nav.links so it wraps with the other links on a
     phone instead of forcing a third row into the header.
     A second Bag button goes in the sticky bottom action bar,
     which is the one people actually see on mobile. */
  function injectNavButton() {
    if (document.querySelector(".cart-nav-btn")) return;
    var links = document.querySelector("nav.links") || document.querySelector(".nav-row");
    if (!links) return;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cart-nav-btn";
    btn.setAttribute("data-bag-open", "");
    btn.setAttribute("aria-expanded", "false");
    btn.innerHTML =
      '<span class="cart-glyph" aria-hidden="true">\u{1F701}</span>' +
      '<span class="cart-nav-label">Bag</span>' +
      '<span class="cart-badge" hidden>0</span>';
    btn.addEventListener("click", openDrawer);
    links.appendChild(btn);

    var bar = document.querySelector(".action-bar");
    if (bar && !bar.querySelector("[data-bag-open]")) {
      var ab = document.createElement("button");
      ab.type = "button";
      ab.className = "action-btn";
      ab.setAttribute("data-bag-open", "");
      ab.setAttribute("aria-expanded", "false");
      ab.innerHTML =
        '<span aria-hidden="true">\u{1F6CD}</span><span>Bag</span>' +
        '<span class="cart-badge" hidden>0</span>';
      ab.addEventListener("click", openDrawer);
      // keep "Get a price" last
      var primary = bar.querySelector(".action-btn.primary");
      if (primary) bar.insertBefore(ab, primary);
      else bar.appendChild(ab);
    }
  }

  function renderBadge() {
    var n = count(lines());
    document.querySelectorAll(".cart-badge").forEach(function (badge) {
      badge.textContent = n;
      badge.hidden = n === 0;
    });
    document.querySelectorAll("[data-bag-open]").forEach(function (btn) {
      btn.setAttribute("aria-label",
        n === 0 ? "Open your bag, empty" : "Open your bag, " + n + " item" + (n === 1 ? "" : "s"));
    });
  }

  function bumpGlyph() {
    var btn = document.querySelector(".cart-nav-btn");
    if (!btn) return;
    btn.classList.remove("bump");
    void btn.offsetWidth;          // restart the animation
    btn.classList.add("bump");
  }

  /* ---------- 3  The drawer ---------- */
  function buildDrawer() {
    if (document.getElementById("satchel-drawer")) return;

    var overlay = document.createElement("div");
    overlay.className = "satchel-overlay";
    overlay.id = "satchel-overlay";

    var drawer = document.createElement("aside");
    drawer.className = "satchel-drawer";
    drawer.id = "satchel-drawer";
    drawer.setAttribute("role", "dialog");
    drawer.setAttribute("aria-modal", "true");
    drawer.setAttribute("aria-label", "Your bag");
    drawer.innerHTML =
      '<div class="satchel-head">' +
        '<h3>Your bag</h3>' +
        '<button type="button" class="satchel-close" aria-label="Close bag">&times;</button>' +
      '</div>' +

      '<div class="satchel-body" id="satchel-body"></div>' +

      '<div class="satchel-foot">' +
        '<div class="satchel-total"><span>Parts subtotal</span><strong id="satchel-total">$0.00</strong></div>' +
        '<p class="field-hint" id="satchel-terms"></p>' +

        '<form id="satchel-form">' +
          '<div class="field">' +
            '<label for="s-install">Who\u2019s installing these?</label>' +
            '<select id="s-install" name="installation">' +
              '<option value="Install for me">Install them for me \u2014 parts + labor</option>' +
              '<option value="Self install">Just the parts \u2014 I\u2019ll fit them myself (cost + 5%)</option>' +
              '<option value="Undecided">Not sure yet</option>' +
            '</select>' +
          '</div>' +
          '<div class="field">' +
            '<label for="s-name">Name</label>' +
            '<input type="text" id="s-name" name="name" required autocomplete="name">' +
          '</div>' +
          '<div class="field">' +
            '<label for="s-contact">Where should I reply?</label>' +
            '<input type="text" id="s-contact" name="contact" required placeholder="Phone number or email">' +
          '</div>' +
          '<div class="field">' +
            '<label for="s-notes">Notes</label>' +
            '<textarea id="s-notes" name="notes" placeholder="Device model, timing that works for you\u2026"></textarea></div>' +
          '<input type="hidden" name="order_summary" id="s-summary">' +
          '<input type="hidden" name="_subject" value="New parts order \u2014 MagicByte">' +
          '<button type="submit" class="btn btn-primary" id="satchel-submit">Send order</button>' +
          '<p class="field-hint" id="satchel-status" role="status"></p>' +
        '</form>' +
      '</div>';

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    overlay.addEventListener("click", closeDrawer);
    drawer.querySelector(".satchel-close").addEventListener("click", closeDrawer);
    document.getElementById("satchel-form").addEventListener("submit", sendOrder);
    document.getElementById("s-install").addEventListener("change", renderTerms);

    // one delegated handler covers every row, including rows drawn later
    document.getElementById("satchel-body").addEventListener("click", function (e) {
      var btn = e.target.closest("[data-action]");
      if (!btn) return;
      var row = btn.closest(".satchel-item");
      if (!row) return;
      var key = row.getAttribute("data-key");
      var action = btn.getAttribute("data-action");

      if (action === "remove") return removeItem(key);
      var found = null;
      lines().forEach(function (l) { if (l.key === key) found = l; });
      if (found) setQty(key, found.qty + (action === "inc" ? 1 : -1));
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.classList.contains("open")) closeDrawer();
    });
  }

  /* ---------- 4  Rendering the bag ---------- */
  function money(n) { return "$" + n.toFixed(2); }

  function renderBag() {
    var body = document.getElementById("satchel-body");
    var totalEl = document.getElementById("satchel-total");
    var submit = document.getElementById("satchel-submit");
    if (!body || !totalEl) return;

    var ls = lines();

    if (ls.length === 0) {
      body.innerHTML =
        '<p class="field-hint">Your bag is empty. Browse the ' +
        '<a href="inventory.html">parts</a> and add what you need.</p>';
    } else {
      body.innerHTML = ls.map(function (l) {
        var r = resolveLine(l);
        var stock = r.stock === "order"
          ? '<span class="satchel-stock order">Special order \u00b7 3\u20135 days</span>'
          : r.stock === "in"
            ? '<span class="satchel-stock in">In stock</span>'
            : "";
        return '<div class="satchel-item' + (l.key === justAdded ? " just-added" : "") + '" data-key="' + esc(l.key) + '">' +
                 '<div class="satchel-item-info">' +
                   '<span class="satchel-item-name">' + esc(r.name) + '</span>' +
                   '<span class="satchel-item-price">' + esc(r.priceText) + '</span>' +
                   (r.sub ? '<span class="satchel-item-sub">' + esc(r.sub) + '</span>' : "") +
                   stock +
                 '</div>' +
                 '<div class="satchel-controls">' +
                   '<div class="satchel-qty">' +
                     '<button type="button" class="qty-btn" data-action="dec" aria-label="One fewer ' + esc(r.name) + '">\u2212</button>' +
                     '<span aria-label="Quantity">' + l.qty + '</span>' +
                     '<button type="button" class="qty-btn" data-action="inc" aria-label="One more ' + esc(r.name) + '">+</button>' +
                   '</div>' +
                   '<button type="button" class="satchel-remove" data-action="remove" aria-label="Remove ' + esc(r.name) + '">Remove</button>' +
                 '</div>' +
               '</div>';
      }).join("") +
      '<button type="button" class="satchel-clear" id="satchel-clear">Empty the bag</button>';

      var clear = document.getElementById("satchel-clear");
      if (clear) clear.addEventListener("click", function () { clearCart(); });
    }

    justAdded = null;
    totalEl.textContent = money(subtotal(ls)) + (hasUnpriced(ls) ? " + quotes" : "");
    if (submit) submit.disabled = ls.length === 0;
    renderTerms();
  }

  /* The terms change with what's actually in the bag, so nobody is told
     about a deposit they don't owe. */
  function renderTerms() {
    var el = document.getElementById("satchel-terms");
    if (!el) return;
    var ls = lines();
    var installSel = document.getElementById("s-install");
    var install = installSel ? installSel.value : "";

    if (ls.length === 0) {
      el.textContent = "Sending this is a request, not a payment. Nothing is charged here.";
      return;
    }

    var parts = ["Sending this is a request \u2014 no payment happens here."];

    if (hasSpecialOrder(ls)) {
      parts.push("Your bag has special-order parts, so those need a deposit for the exact part cost, invoiced once I confirm the price.");
    } else {
      parts.push("Everything in your bag is in stock or quoted with no deposit, so there\u2019s nothing to pay up front \u2014 you settle when the repair is done.");
    }

    if (install === "Self install") {
      var est = subtotal(ls) * (1 + SELF_INSTALL_MARKUP);
      parts.push("Parts only, at cost plus 5% handling" +
        (subtotal(ls) ? " \u2014 about " + money(est) + " on the priced parts so far" : "") +
        ". I\u2019m not liable for damage from self-installation." +
        (hasRepair(ls) ? " Repairs in your bag are installed by me." : ""));
    } else if (install === "Install for me") {
      parts.push("Labor is quoted on top of parts \u2014 see the rates on the services page.");
    }

    el.textContent = parts.join(" ");
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- 5  Open / close ---------- */
  function openDrawer() {
    var overlay = document.getElementById("satchel-overlay");
    var drawer = document.getElementById("satchel-drawer");
    if (!overlay || !drawer) return;

    lastFocus = document.activeElement;
    renderBag();
    overlay.classList.add("open");
    drawer.classList.add("open");

    document.querySelectorAll("[data-bag-open]").forEach(function (btn) {
      btn.setAttribute("aria-expanded", "true");
    });
    drawer.querySelector(".satchel-close").focus();
    document.addEventListener("keydown", trapTab);
  }

  function closeDrawer() {
    var overlay = document.getElementById("satchel-overlay");
    var drawer = document.getElementById("satchel-drawer");
    if (!overlay || !drawer) return;

    overlay.classList.remove("open");
    drawer.classList.remove("open");
    document.removeEventListener("keydown", trapTab);

    document.querySelectorAll("[data-bag-open]").forEach(function (btn) {
      btn.setAttribute("aria-expanded", "false");
    });
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    lastFocus = null;
  }

  // Keep keyboard focus inside the drawer while it's open.
  function trapTab(e) {
    if (e.key !== "Tab") return;
    var drawer = document.getElementById("satchel-drawer");
    if (!drawer || !drawer.classList.contains("open")) return;

    var f = drawer.querySelectorAll("button, input, select, textarea, a[href]");
    f = Array.prototype.filter.call(f, function (el) { return !el.disabled && el.offsetParent !== null; });
    if (!f.length) return;

    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------- 6  Sending the order ---------- */
  function sendOrder(e) {
    e.preventDefault();

    var ls = lines();
    var status = document.getElementById("satchel-status");
    var submit = document.getElementById("satchel-submit");

    if (ls.length === 0) {
      status.className = "field-hint err";
      status.textContent = "Your bag is empty \u2014 add a part first.";
      return;
    }

    var install = document.getElementById("s-install").value;
    var orderLines = ls.map(function (l) {
      var r = resolveLine(l);
      var qty = (l.qty || 0) + "x ";
      if (l.type === "repair") {
        return qty + r.name + " \u2014 " + r.priceText;
      }
      return qty + r.name +
             " \u2014 " + (r.priceValue != null ? money(r.priceValue) + " each" : "price to be quoted") +
             " \u2014 " + (r.stock === "order" ? "special order" : "in stock");
    });

    orderLines.push("");
    orderLines.push("Parts subtotal: " + money(subtotal(ls)) +
               (hasUnpriced(ls) ? " plus items still to be quoted" : ""));
    orderLines.push("Installation: " + install);
    if (install === "Self install") {
      orderLines.push("Self-install pricing: part cost + 5% handling = " +
                 money(subtotal(ls) * (1 + SELF_INSTALL_MARKUP)) + " on priced parts");
    }
    orderLines.push("Deposit needed: " + (hasSpecialOrder(ls) ? "yes, special-order parts in bag" : "no"));

    document.getElementById("s-summary").value = orderLines.join("\n");

    var form = e.target;
    var data = new FormData(form);

    submit.disabled = true;
    submit.textContent = "Sending\u2026";
    status.className = "field-hint";
    status.textContent = "Sending your order\u2026";

    fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" }
    })
      .then(function (res) {
        if (!res.ok) throw new Error("rejected");
        status.className = "field-hint ok";
        status.textContent = "Sent. You'll get a quote back by text or email, usually same day.";
        castRing(document.querySelector(".satchel-head"), "gold");
        clearCart(true);
        form.reset();
        submit.textContent = "Send order";
        setTimeout(closeDrawer, 2200);
      })
      .catch(function () {
        status.className = "field-hint err";
        status.textContent = "That didn't go through, and your bag is still saved. Text " + PHONE + " and I'll pick it up there.";
        submit.disabled = false;
        submit.textContent = "Send order";
      });
  }

  /* ---------- 7  Toast ---------- */
  var toastEl = null, toastTimer = null;
  function toast(message) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "wizard-toast";
      toastEl.setAttribute("role", "status");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
    requestAnimationFrame(function () { toastEl.classList.add("show"); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 2200);
  }

  /* ---------- 8  Wiring ---------- */
  function wireAddButtons() {
    document.querySelectorAll("[data-add-to-cart]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var card = btn.closest("[data-part-id]");
        if (!card) return;
        var ref = card.getAttribute("data-part-id");
        var r = btn.getBoundingClientRect();
        burst(r.left + r.width / 2, r.top + r.height / 2, "gold", 10);
        addPart(ref);
      });
    });
  }

  function init() {
    FX = window.MagicByteFX || FX;
    migrateOld();
    injectNavButton();
    buildDrawer();
    renderBadge();
    renderBag();
    wireAddButtons();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();   // the script tag sits at the end of <body>, so this is the usual path
  }

  window.MagicByteCart = {
    add: addPart,
    open: openDrawer,
    close: closeDrawer,
    lines: lines
  };
})();
