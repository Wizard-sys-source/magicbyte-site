/* ============================================================
   MagicByte — stock.js
   Renders today's location banner and the live stock list from
   site-data.js. Runs BEFORE wizard.js and cart.js so the shop
   filters and the bag pick up the generated cards.
   Load order on every page: site-data.js, stock.js, wizard.js,
   cart.js. Each block no-ops if its elements aren't on the page.
   ============================================================ */

(function () {
  "use strict";

  var DATA = window.MAGICBYTE_DATA;
  if (!DATA) return;

  function escapeHtml(t) {
    return String(t == null ? "" : t)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* ---- "Where's the wizard today" banner (index.html) ---- */
  (function todayBanner() {
    var banner = document.getElementById("wizard-today");
    if (!banner || !DATA.today) return;
    var area = DATA.today.area || "On the road around Wichita";
    var note = DATA.today.note || "";
    banner.innerHTML =
      '<p class="today-kicker">Where\u2019s the wizard today</p>' +
      '<p class="today-area">' + escapeHtml(area) + "</p>" +
      (note ? '<p class="today-note">' + escapeHtml(note) + "</p>" : "");
  })();

  /* ---- "Screens in the van" strip (index.html) ---- */
  (function vanStock() {
    var strip = document.getElementById("van-stock");
    if (!strip) return;
    var items = (DATA.stock || []).filter(function (s) { return s.qty > 0; });
    if (!items.length) {
      strip.innerHTML = '<p class="field-hint">Stock update coming — text me and I\u2019ll confirm what\u2019s in the van.</p>';
      return;
    }
    strip.innerHTML = items.map(function (s) {
      var price = (s.price != null)
        ? " · $" + Number(s.price).toFixed(2) + " part cost"
        : "";
      return '<div class="van-item"><strong>' + escapeHtml(s.name) + "</strong>" +
        "<span>" + s.qty + " in the van" + price + "</span></div>";
    }).join("");
  })();

  /* ---- Shop parts grid (inventory.html) ---- */
  (function shopGrid() {
    var grid = document.getElementById("shop-cards");
    if (!grid) return;
    var html = "";
    (DATA.stock || []).forEach(function (s) { html += partCard(s, true); });
    (DATA.orderable || []).forEach(function (s) { html += partCard(s, false); });
    grid.insertAdjacentHTML("beforeend", html);
  })();

  function partCard(s, inStock) {
    var price = (s.price != null)
      ? '<span class="part-price">$' + Number(s.price).toFixed(2) + "</span>"
      : '<span class="part-price quote">Quoted after review</span>';
    var tag = inStock
      ? '<span class="stock-tag stock-in">In stock \u00b7 ' + s.qty + " left</span>"
      : '<span class="stock-tag stock-order">Order \u00b7 3\u20135 days</span>';
    return '<div class="part-card"' +
      ' data-category="' + escapeHtml(s.category) + '"' +
      ' data-part-id="' + escapeHtml(s.id) + '"' +
      ' data-part-stock="' + (inStock ? "in" : "order") + '"' +
      ' data-part-name="' + escapeHtml(s.name) + '"' +
      ' data-part-price="' + (s.price != null ? Number(s.price).toFixed(2) : "") + '">' +
      '<div class="part-card-top"><div><h3>' + escapeHtml(s.name) + "</h3>" +
      '<p class="part-device">' + escapeHtml(s.device) + "</p></div>" + tag + "</div>" +
      '<div class="part-card-foot">' + price +
      '<button type="button" class="btn-add" data-add-to-cart>Add to bag</button></div></div>';
  }
})();
