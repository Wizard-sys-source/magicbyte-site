/* ============================================================
   MagicByte — Wizard's Bag (cart)
   ============================================================ */

(function () {
  var STORAGE_KEY = "magicbyte_satchel_v1";
  var FORMSPREE_ENDPOINT = "https://formspree.io/f/REPLACE_WITH_YOUR_PARTS_FORM_ID";

  function readCart() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }
  function writeCart(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    renderBadge();
    renderDrawerItems();
  }
  function cartCount(items) {
    return items.reduce(function (sum, i) { return sum + i.qty; }, 0);
  }
  function cartTotal(items) {
    return items.reduce(function (sum, i) { return sum + (i.price || 0) * i.qty; }, 0);
  }

  function addToCart(id, name, price) {
    var items = readCart();
    var existing = items.find(function (i) { return i.id === id; });
    if (existing) { existing.qty += 1; }
    else { items.push({ id: id, name: name, price: price, qty: 1 }); }
    writeCart(items);
    openDrawer();
    toast(name + " added to your bag");
  }
  function setQty(id, qty) {
    var items = readCart();
    if (qty <= 0) {
      items = items.filter(function (i) { return i.id !== id; });
    } else {
      var it = items.find(function (i) { return i.id === id; });
      if (it) it.qty = qty;
    }
    writeCart(items);
  }
  function clearCart() { writeCart([]); }

  /* ---------- UI injection ---------- */

  function injectNavButton() {
    var nav = document.querySelector(".nav-row");
    if (!nav) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cart-nav-btn";
    btn.setAttribute("aria-label", "Open bag");
    btn.innerHTML = '<span class="cart-glyph">🜛</span><span class="cart-nav-label">Bag</span><span class="cart-badge" id="cart-badge" hidden>0</span>';
    btn.addEventListener("click", openDrawer);
    nav.appendChild(btn);
  }

  function renderBadge() {
    var badge = document.getElementById("cart-badge");
    if (!badge) return;
    var n = cartCount(readCart());
    badge.textContent = n;
    badge.hidden = n === 0;
  }

  function buildDrawer() {
    var overlay = document.createElement("div");
    overlay.className = "satchel-overlay";
    overlay.id = "satchel-overlay";

    var drawer = document.createElement("aside");
    drawer.className = "satchel-drawer";
    drawer.id = "satchel-drawer";
    drawer.innerHTML =
      '<div class="satchel-head">' +
        '<h3>Your Bag</h3>' +
        '<button type="button" class="satchel-close" aria-label="Close bag">&times;</button>' +
      '</div>' +
      '<div class="satchel-body" id="satchel-body"></div>' +
      '<div class="satchel-foot">' +
        '<div class="satchel-total"><span>Total</span><strong id="satchel-total">$0.00</strong></div>' +
        '<p class="field-hint">Parts already in stock ship no upfront cost — you pay on completion. Special-order parts need a deposit equal to the part\u2019s exact cost, invoiced after I confirm. Submitting this just sends the request — no payment happens here.</p>' +
        '<form id="satchel-form">' +
          '<div class="field"><label for="s-name">Name</label><input type="text" id="s-name" name="name" required></div>' +
          '<div class="field"><label for="s-contact">Best way to reach you (text or email)</label><input type="text" id="s-contact" name="contact" required></div>' +
          '<div class="field"><label for="s-notes">Notes (device model, timing, etc.)</label><textarea id="s-notes" name="notes"></textarea></div>' +
          '<input type="hidden" name="order_summary" id="s-summary">' +
          '<input type="hidden" name="_subject" value="New parts order — MagicByte Bag">' +
          '<button type="submit" class="btn btn-primary" id="satchel-submit">Send Order to the Wizard</button>' +
          '<p class="field-hint" id="satchel-status" role="status"></p>' +
        '</form>' +
      '</div>';

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    overlay.addEventListener("click", closeDrawer);
    drawer.querySelector(".satchel-close").addEventListener("click", closeDrawer);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeDrawer();
    });

    document.getElementById("satchel-form").addEventListener("submit", handleCheckout);
  }

  function renderDrawerItems() {
    var body = document.getElementById("satchel-body");
    var totalEl = document.getElementById("satchel-total");
    if (!body || !totalEl) return;
    var items = readCart();

    if (items.length === 0) {
      body.innerHTML = '<p class="field-hint">Your bag is empty. Browse <a href="inventory.html">parts</a> and add what you need.</p>';
    } else {
      body.innerHTML = items.map(function (i) {
        var priceLabel = i.price ? ("$" + i.price.toFixed(2)) : "Quoted after review";
        return (
          '<div class="satchel-item" data-id="' + i.id + '">' +
            '<div class="satchel-item-info">' +
              '<span class="satchel-item-name">' + i.name + '</span>' +
              '<span class="satchel-item-price">' + priceLabel + '</span>' +
            '</div>' +
            '<div class="satchel-qty">' +
              '<button type="button" class="qty-btn" data-action="dec">\u2212</button>' +
              '<span>' + i.qty + '</span>' +
              '<button type="button" class="qty-btn" data-action="inc">+</button>' +
            '</div>' +
          '</div>'
        );
      }).join("");

      body.querySelectorAll(".qty-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var row = btn.closest(".satchel-item");
          var id = row.getAttribute("data-id");
          var items2 = readCart();
          var it = items2.find(function (i) { return i.id === id; });
          if (!it) return;
          var delta = btn.getAttribute("data-action") === "inc" ? 1 : -1;
          setQty(id, it.qty + delta);
        });
      });
    }

    totalEl.textContent = "$" + cartTotal(items).toFixed(2);
  }

  function openDrawer() {
    var overlay = document.getElementById("satchel-overlay");
    var drawer = document.getElementById("satchel-drawer");
    if (!overlay || !drawer) return;
    renderDrawerItems();
    overlay.classList.add("open");
    drawer.classList.add("open");
  }
  function closeDrawer() {
    var overlay = document.getElementById("satchel-overlay");
    var drawer = document.getElementById("satchel-drawer");
    if (!overlay || !drawer) return;
    overlay.classList.remove("open");
    drawer.classList.remove("open");
  }

  function handleCheckout(e) {
    e.preventDefault();
    var items = readCart();
    var statusEl = document.getElementById("satchel-status");
    var submitBtn = document.getElementById("satchel-submit");

    if (items.length === 0) {
      statusEl.textContent = "Your bag is empty — add a part first.";
      return;
    }

    var summary = items.map(function (i) {
      var priceLabel = i.price ? ("$" + i.price.toFixed(2)) : "quote needed";
      return i.qty + "x " + i.name + " (" + priceLabel + " each)";
    }).join("\n") + "\n\nEstimated total: $" + cartTotal(items).toFixed(2);

    document.getElementById("s-summary").value = summary;

    var form = e.target;
    var data = new FormData(form);

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    statusEl.textContent = "";

    fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" }
    }).then(function (resp) {
      if (resp.ok) {
        statusEl.textContent = "Sent! I\u2019ll text or email you a quote shortly.";
        clearCart();
        form.reset();
        submitBtn.textContent = "Send Order to the Wizard";
        submitBtn.disabled = false;
        setTimeout(closeDrawer, 1800);
      } else {
        throw new Error("Formspree error");
      }
    }).catch(function () {
      statusEl.textContent = "Couldn\u2019t send automatically — text 316-559-4816 or use the booking form instead.";
      submitBtn.textContent = "Send Order to the Wizard";
      submitBtn.disabled = false;
    });
  }

  function toast(message) {
    var el = document.createElement("div");
    el.className = "wizard-toast";
    el.textContent = message;
    document.body.appendChild(el);
    requestAnimationFrame(function () { el.classList.add("show"); });
    setTimeout(function () {
      el.classList.remove("show");
      setTimeout(function () { el.remove(); }, 300);
    }, 2200);
  }

  /* ---------- wire up "Add to Bag" buttons on the shop page ---------- */

  function wireAddButtons() {
    document.querySelectorAll("[data-add-to-cart]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var card = btn.closest("[data-part-id]");
        if (!card) return;
        var id = card.getAttribute("data-part-id");
        var name = card.getAttribute("data-part-name");
        var priceAttr = card.getAttribute("data-part-price");
        var price = priceAttr ? parseFloat(priceAttr) : 0;
        addToCart(id, name, price);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    injectNavButton();
    buildDrawer();
    renderBadge();
    wireAddButtons();
  });

  window.MagicByteCart = { addToCart: addToCart, openDrawer: openDrawer };
})();
