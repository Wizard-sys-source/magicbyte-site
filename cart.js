/* ============================================================
   MagicByte — The Knight's Satchel (Cart)
   ============================================================ */

(function () {
  var STORAGE_KEY = "magicbyte_satchel_v2";
  var FORMSPREE_ENDPOINT = "https://formspree.io/f/REPLACE_WITH_YOUR_PARTS_FORM_ID";

  function readCart() {
    try { var raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : []; } 
    catch (e) { return []; }
  }
  
  function writeCart(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    renderBadge();
    renderDrawerItems();
  }
  
  function cartCount(items) { return items.reduce(function (sum, i) { return sum + i.qty; }, 0); }
  function cartTotal(items) { return items.reduce(function (sum, i) { return sum + (i.price || 0) * i.qty; }, 0); }

  function addToCart(id, name, price) {
    var items = readCart();
    var existing = items.find(function (i) { return i.id === id; });
    if (existing) { existing.qty += 1; }
    else { items.push({ id: id, name: name, price: price, qty: 1 }); }
    writeCart(items);
    openDrawer();
    toast(name + " added to your satchel");
  }

  function setQty(id, qty) {
    var items = readCart();
    if (qty <= 0) items = items.filter(function (i) { return i.id !== id; });
    else { var it = items.find(function (i) { return i.id === id; }); if (it) it.qty = qty; }
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
    btn.style.cssText = "background: transparent; border: 1px solid var(--steel); color: var(--parchment); padding: 5px 15px; border-radius: 4px; cursor: pointer; font-family: var(--font-mono); text-transform: uppercase;";
    btn.innerHTML = 'Satchel <span class="cart-badge" id="cart-badge" style="background: var(--teal); color: #000; padding: 2px 6px; border-radius: 50%; margin-left: 5px;" hidden>0</span>';
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
    overlay.style.cssText = "position: fixed; inset: 0; background: rgba(0,0,0,0.7); opacity: 0; pointer-events: none; transition: opacity .25s ease; z-index: 40;";

    var drawer = document.createElement("aside");
    drawer.className = "satchel-drawer";
    drawer.id = "satchel-drawer";
    drawer.style.cssText = "position: fixed; top: 0; right: 0; height: 100%; width: min(400px, 92vw); background: var(--bg-panel); border-left: 2px solid var(--steel-dark); transform: translateX(100%); transition: transform .3s ease; z-index: 41; display: flex; flex-direction: column;";
    
    drawer.innerHTML =
      '<div style="padding: 20px; border-bottom: 2px solid var(--steel-dark); display: flex; justify-content: space-between;">' +
        '<h3 style="margin: 0; color: var(--gold); font-family: var(--font-display);">Your Satchel</h3>' +
        '<button type="button" class="satchel-close" style="background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer;">&times;</button>' +
      '</div>' +
      '<div class="satchel-body" id="satchel-body" style="flex: 1; overflow-y: auto; padding: 20px;"></div>' +
      '<div style="padding: 20px; border-top: 2px solid var(--steel-dark);">' +
        '<div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-family: var(--font-mono);"><span>Total Amount</span><strong id="satchel-total" style="color: var(--teal-bright);">$0.00</strong></div>' +
        '<p style="font-size: 0.8rem; color: #aaa; margin-bottom: 15px;">Submitting this request sends a raven to the Wizard. No gold is charged until the quote is approved.</p>' +
        '<form id="satchel-form" style="display: flex; flex-direction: column; gap: 10px;">' +
          '<input type="text" name="name" placeholder="Your Name" required style="padding: 10px; background: #111; border: 1px solid var(--steel); color: #fff;">' +
          '<input type="text" name="contact" placeholder="Text or Email" required style="padding: 10px; background: #111; border: 1px solid var(--steel); color: #fff;">' +
          '<textarea name="notes" placeholder="Device Lore (Model, Notes)" style="padding: 10px; background: #111; border: 1px solid var(--steel); color: #fff;"></textarea>' +
          '<input type="hidden" name="order_summary" id="s-summary">' +
          '<button type="submit" class="btn btn-knight" id="satchel-submit" style="margin-top: 10px;">Send Order to the Wizard</button>' +
          '<p id="satchel-status" style="color: var(--teal-bright); font-size: 0.85rem; text-align: center; margin-top: 5px;"></p>' +
        '</form>' +
      '</div>';

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    overlay.addEventListener("click", closeDrawer);
    drawer.querySelector(".satchel-close").addEventListener("click", closeDrawer);
    document.getElementById("satchel-form").addEventListener("submit", handleCheckout);
  }

  function renderDrawerItems() {
    var body = document.getElementById("satchel-body");
    var totalEl = document.getElementById("satchel-total");
    if (!body || !totalEl) return;
    var items = readCart();

    if (items.length === 0) {
      body.innerHTML = '<p style="color: #aaa; font-size: 0.9rem;">Your satchel is empty. Browse the Armory to add components.</p>';
    } else {
      body.innerHTML = items.map(function (i) {
        var priceLabel = i.price ? ("$" + i.price.toFixed(2)) : "Quoted";
        return (
          '<div class="satchel-item" data-id="' + i.id + '" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--line);">' +
            '<div>' +
              '<div style="color: var(--parchment); font-size: 0.95rem;">' + i.name + '</div>' +
              '<div style="color: var(--teal); font-family: var(--font-mono); font-size: 0.85rem;">' + priceLabel + '</div>' +
            '</div>' +
            '<div style="display: flex; gap: 10px; align-items: center;">' +
              '<button type="button" class="qty-btn" data-action="dec" style="background: var(--steel-dark); border: none; color: #fff; border-radius: 4px; padding: 2px 8px; cursor: pointer;">-</button>' +
              '<span style="font-family: var(--font-mono);">' + i.qty + '</span>' +
              '<button type="button" class="qty-btn" data-action="inc" style="background: var(--steel-dark); border: none; color: #fff; border-radius: 4px; padding: 2px 8px; cursor: pointer;">+</button>' +
            '</div>' +
          '</div>'
        );
      }).join("");

      body.querySelectorAll(".qty-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var row = btn.closest(".satchel-item");
          var id = row.getAttribute("data-id");
          var it = readCart().find(function (i) { return i.id === id; });
          if (!it) return;
          var delta = btn.getAttribute("data-action") === "inc" ? 1 : -1;
          setQty(id, it.qty + delta);
        });
      });
    }
    totalEl.textContent = "$" + cartTotal(items).toFixed(2);
  }

  function openDrawer() {
    document.getElementById("satchel-overlay").style.opacity = "1";
    document.getElementById("satchel-overlay").style.pointerEvents = "auto";
    document.getElementById("satchel-drawer").style.transform = "translateX(0)";
    renderDrawerItems();
  }
  function closeDrawer() {
    document.getElementById("satchel-overlay").style.opacity = "0";
    document.getElementById("satchel-overlay").style.pointerEvents = "none";
    document.getElementById("satchel-drawer").style.transform = "translateX(100%)";
  }

  function handleCheckout(e) {
    e.preventDefault();
    var items = readCart();
    var statusEl = document.getElementById("satchel-status");
    var submitBtn = document.getElementById("satchel-submit");

    if (items.length === 0) {
      statusEl.textContent = "Your satchel is empty!";
      return;
    }

    var summary = items.map(function (i) {
      return i.qty + "x " + i.name + " (" + (i.price ? "$" + i.price.toFixed(2) : "quote needed") + " each)";
    }).join("\n") + "\n\nEstimated total: $" + cartTotal(items).toFixed(2);
    document.getElementById("s-summary").value = summary;

    var data = new FormData(e.target);
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending Raven...";
    statusEl.textContent = "";

    fetch(FORMSPREE_ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } })
      .then(function (resp) {
        if (resp.ok) {
          statusEl.textContent = "Raven sent! The Wizard will text or email you shortly.";
          clearCart();
          e.target.reset();
          setTimeout(closeDrawer, 2000);
        } else throw new Error("Formspree error");
      }).catch(function () {
        statusEl.textContent = "Raven failed! Please text the wizard directly instead.";
      }).finally(function() {
        submitBtn.textContent = "Send Order to the Wizard";
        submitBtn.disabled = false;
      });
  }

  function toast(message) {
    var el = document.createElement("div");
    el.textContent = message;
    el.style.cssText = "position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: var(--steel-dark); border: 1px solid var(--gold); color: #fff; padding: 10px 20px; border-radius: 4px; font-family: var(--font-mono); z-index: 50; box-shadow: 0 4px 10px rgba(0,0,0,0.5);";
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, 2500);
  }

  function wireAddButtons() {
    document.querySelectorAll("[data-add-to-cart]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var card = btn.closest("[data-part-id]");
        if (!card) return;
        addToCart(card.getAttribute("data-part-id"), card.getAttribute("data-part-name"), parseFloat(card.getAttribute("data-part-price") || 0));
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    injectNavButton(); buildDrawer(); renderBadge(); wireAddButtons();
  });
})();
                              
