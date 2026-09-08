/* ============================================================
   MagicByte — cart.js
   The bag: parts ordering on inventory.html. Injects its own nav
   button and drawer, so every page can include this file safely.

   It carries the two rules the shop page states:
     · in-stock parts need no deposit; special-order parts do
     · self-install is part cost + 5% handling, install is + labor
   Both change what the order email says, so both live in here.

   Contents
     0  Config          — your Formspree parts ID goes here
     1  Storage
     2  Nav button + badge
     3  The drawer
     4  Rendering the bag
     5  Open / close
     6  Sending the order
     7  Toast
     8  Wiring
   ============================================================ */

(function () {
  "use strict";

  /* ---------- 0  Config ------------------------------------
     Replace this with your Formspree form ID for parts orders.
     The consultation form is configured separately, in wizard.js.
     --------------------------------------------------------- */
  var FORMSPREE_ENDPOINT = "https://formspree.io/f/REPLACE_WITH_YOUR_PARTS_FORM_ID";

  var STORAGE_KEY = "magicbyte_satchel_v1";
  var PHONE = "316-559-4816";
  var SELF_INSTALL_MARKUP = 0.05;   // the "cost + 5%" on the shop page

  var lastFocus = null;
  var justAdded = null;             // id of the row to flash on next render

  // wizard.js publishes these; degrade quietly if it hasn't loaded
  var FX = window.MagicByteFX || {};
  function burst()   { if (FX.burst)    FX.burst.apply(null, arguments); }
  function castRing() { if (FX.castRing) FX.castRing.apply(null, arguments); }

  /* ---------- 1  Storage ---------- */
  function readCart() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var items = raw ? JSON.parse(raw) : [];
      return Array.isArray(items) ? items.filter(function (i) { return i && i.id; }) : [];
    } catch (e) {
      return [];   // private mode, or storage disabled
    }
  }

  function writeCart(items) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      /* the bag still works for this visit, it just won't persist */
    }
    renderBadge();
    renderBag();
  }

  function count(items) {
    return items.reduce(function (n, i) { return n + i.qty; }, 0);
  }

  function subtotal(items) {
    return items.reduce(function (n, i) { return n + (i.price || 0) * i.qty; }, 0);
  }

  // Some parts are quoted after review, so a total is often partial.
  function hasUnpriced(items) {
    return items.some(function (i) { return !i.price; });
  }

  function hasSpecialOrder(items) {
    return items.some(function (i) { return i.stock === "order"; });
  }

  function addToCart(part) {
    var items = readCart();
    var existing = items.find(function (i) { return i.id === part.id; });
    if (existing) {
      existing.qty += 1;
      existing.price = part.price;      // refresh, in case the page was updated
      existing.stock = part.stock;
    } else {
      items.push({ id: part.id, name: part.name, price: part.price, stock: part.stock, qty: 1 });
    }
    justAdded = part.id;
    writeCart(items);
    bumpGlyph();
    openDrawer();
    toast(part.name + " added to your bag");
  }

  function setQty(id, qty) {
    var items = readCart();
    if (qty <= 0) return removeItem(id);
    var it = items.find(function (i) { return i.id === id; });
    if (it) it.qty = Math.min(qty, 20);
    writeCart(items);
  }

  function removeItem(id) {
    var items = readCart();
    var it = items.find(function (i) { return i.id === id; });
    writeCart(items.filter(function (i) { return i.id !== id; }));
    if (it) toast(it.name + " removed");
  }

  function clearCart(quiet) {
    writeCart([]);
    if (!quiet) toast("Bag emptied");
  }

  /* ---------- 2  Nav button + badge ----------
     Goes inside nav.links so it wraps with the other links on a
     phone instead of forcing a third row into the header. */
  function injectNavButton() {
    if (document.querySelector(".cart-nav-btn")) return;
    var links = document.querySelector("nav.links") || document.querySelector(".nav-row");
    if (!links) return;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cart-nav-btn";
    btn.setAttribute("aria-expanded", "false");
    btn.innerHTML =
      '<span class="cart-glyph" aria-hidden="true">\u{1F701}</span>' +
      '<span class="cart-nav-label">Bag</span>' +
      '<span class="cart-badge" id="cart-badge" hidden>0</span>';
    btn.addEventListener("click", openDrawer);
    links.appendChild(btn);
  }

  function renderBadge() {
    var badge = document.getElementById("cart-badge");
    var btn = document.querySelector(".cart-nav-btn");
    if (!badge || !btn) return;
    var n = count(readCart());
    badge.textContent = n;
    badge.hidden = n === 0;
    btn.setAttribute("aria-label",
      n === 0 ? "Open your bag, empty" : "Open your bag, " + n + " item" + (n === 1 ? "" : "s"));
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
      var id = row.getAttribute("data-id");
      var action = btn.getAttribute("data-action");

      if (action === "remove") return removeItem(id);
      var it = readCart().find(function (i) { return i.id === id; });
      if (it) setQty(id, it.qty + (action === "inc" ? 1 : -1));
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

    var items = readCart();

    if (items.length === 0) {
      body.innerHTML =
        '<p class="field-hint">Your bag is empty. Browse the ' +
        '<a href="inventory.html">parts</a> and add what you need.</p>';
    } else {
      body.innerHTML = items.map(function (i) {
        var price = i.price ? money(i.price) : "Quoted after review";
        var stock = i.stock === "order"
          ? '<span class="satchel-stock order">Special order \u00b7 3\u20135 days</span>'
          : '<span class="satchel-stock in">In stock</span>';
        return '<div class="satchel-item' + (i.id === justAdded ? " just-added" : "") + '" data-id="' + esc(i.id) + '">' +
                 '<div class="satchel-item-info">' +
                   '<span class="satchel-item-name">' + esc(i.name) + '</span>' +
                   '<span class="satchel-item-price">' + price + '</span>' +
                   stock +
                 '</div>' +
                 '<div class="satchel-controls">' +
                   '<div class="satchel-qty">' +
                     '<button type="button" class="qty-btn" data-action="dec" aria-label="One fewer ' + esc(i.name) + '">\u2212</button>' +
                     '<span aria-label="Quantity">' + i.qty + '</span>' +
                     '<button type="button" class="qty-btn" data-action="inc" aria-label="One more ' + esc(i.name) + '">+</button>' +
                   '</div>' +
                   '<button type="button" class="satchel-remove" data-action="remove" aria-label="Remove ' + esc(i.name) + '">Remove</button>' +
                 '</div>' +
               '</div>';
      }).join("") +
      '<button type="button" class="satchel-clear" id="satchel-clear">Empty the bag</button>';

      var clear = document.getElementById("satchel-clear");
      if (clear) clear.addEventListener("click", function () { clearCart(); });
    }

    justAdded = null;
    totalEl.textContent = money(subtotal(items)) + (hasUnpriced(items) ? " + quotes" : "");
    if (submit) submit.disabled = items.length === 0;
    renderTerms();
  }

  /* The terms change with what's actually in the bag, so nobody is told
     about a deposit they don't owe. */
  function renderTerms() {
    var el = document.getElementById("satchel-terms");
    if (!el) return;
    var items = readCart();
    var installSel = document.getElementById("s-install");
    var install = installSel ? installSel.value : "";

    if (items.length === 0) {
      el.textContent = "Sending this is a request, not a payment. Nothing is charged here.";
      return;
    }

    var parts = ["Sending this is a request \u2014 no payment happens here."];

    if (hasSpecialOrder(items)) {
      parts.push("Your bag has special-order parts, so those need a deposit for the exact part cost, invoiced once I confirm the price.");
    } else {
      parts.push("Everything in your bag is in stock, so there\u2019s nothing to pay up front \u2014 you settle when the repair is done.");
    }

    if (install === "Self install") {
      var est = subtotal(items) * (1 + SELF_INSTALL_MARKUP);
      parts.push("Parts only, at cost plus 5% handling" +
        (subtotal(items) ? " \u2014 about " + money(est) + " on the priced items so far" : "") +
        ". I\u2019m not liable for damage from self-installation.");
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

    var btn = document.querySelector(".cart-nav-btn");
    if (btn) btn.setAttribute("aria-expanded", "true");
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

    var btn = document.querySelector(".cart-nav-btn");
    if (btn) btn.setAttribute("aria-expanded", "false");
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

    var items = readCart();
    var status = document.getElementById("satchel-status");
    var submit = document.getElementById("satchel-submit");

    if (items.length === 0) {
      status.className = "field-hint err";
      status.textContent = "Your bag is empty \u2014 add a part first.";
      return;
    }

    var install = document.getElementById("s-install").value;
    var lines = items.map(function (i) {
      return i.qty + "x " + i.name +
             " \u2014 " + (i.price ? money(i.price) + " each" : "price to be quoted") +
             " \u2014 " + (i.stock === "order" ? "special order" : "in stock");
    });

    lines.push("");
    lines.push("Parts subtotal: " + money(subtotal(items)) +
               (hasUnpriced(items) ? " plus items still to be quoted" : ""));
    lines.push("Installation: " + install);
    if (install === "Self install") {
      lines.push("Self-install pricing: part cost + 5% handling = " +
                 money(subtotal(items) * (1 + SELF_INSTALL_MARKUP)) + " on priced items");
    }
    lines.push("Deposit needed: " + (hasSpecialOrder(items) ? "yes, special-order parts in bag" : "no, all in stock"));

    document.getElementById("s-summary").value = lines.join("\n");

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
        var priceAttr = card.getAttribute("data-part-price");
        var r = btn.getBoundingClientRect();
        burst(r.left + r.width / 2, r.top + r.height / 2, "gold", 10);
        addToCart({
          id: card.getAttribute("data-part-id"),
          name: card.getAttribute("data-part-name"),
          price: priceAttr ? parseFloat(priceAttr) : 0,
          stock: card.getAttribute("data-part-stock") || "in"
        });
      });
    });
  }

  function init() {
    FX = window.MagicByteFX || FX;
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
    add: addToCart,
    remove: removeItem,
    clear: clearCart,
    open: openDrawer,
    close: closeDrawer,
    items: readCart
  };
})();
