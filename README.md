# MagicByte website

A static site, still no build step: `index.html` (home),
`inventory.html` (the parts shop — DoorDash-style cards with an
"Add to Satchel" button), `services.html` (labor pricing),
`book.html` (repair booking form + payment link), `consult.html`
(the voice-message orb), `faq.html`, plus two shared files: `cart.js`
(the satchel cart, loaded on every page) and `styles.css`.

Nothing here is automated beyond the forms and the cart. No calls —
the footer's phone number is voicemail-only; text, email, the orb,
or a form are the ways people reach you.

## 1. Publish it on GitHub Pages

1. Create a repo (or reuse your existing `Wizard-sys.github.io` repo).
2. Upload all files in this folder to the **root** of that repo
   (`index.html`, `styles.css`, `services.html`, etc. — not inside a
   subfolder, unless you update the `href`/`src` paths to match).
3. In the repo: **Settings → Pages → Build and deployment → Source →
   Deploy from a branch**. Pick `main` (or `master`) and `/ (root)`.
   Save.
4. GitHub gives you a URL like `https://yourname.github.io/reponame/`.
   It can take 1–2 minutes to go live after each push.
5. Optional: **Settings → Pages → Custom domain** if you buy a domain
   like `magicbyte.repair` later — point its DNS at GitHub per their
   instructions, then enter it here.

## 2. Connect the booking form (takes ~2 minutes)

The form on `book.html` currently points at a placeholder Formspree
URL. Formspree is a free service that turns a plain HTML form into
an email to you — no backend needed.

1. Go to formspree.io and make a free account.
2. Create a new form, get your form ID (looks like `xayzabcd`).
3. In `book.html`, find this line near the top of the `<form>` tag:
   ```html
   <form class="spellform" action="https://formspree.io/f/REPLACE_WITH_YOUR_FORM_ID" method="POST">
   ```
   Replace `REPLACE_WITH_YOUR_FORM_ID` with your real ID.
4. Submit a test booking — you should get an email within a minute.

## 2b. Connect the parts order form (Satchel checkout)

The cart drawer (`cart.js`) submits orders to its own Formspree form
so they land separately from repair bookings.

1. In your Formspree account, create a second form (e.g. "MagicByte
   parts orders"), get its form ID.
2. In `cart.js`, find near the top:
   ```js
   var FORMSPREE_ENDPOINT = "https://formspree.io/f/REPLACE_WITH_YOUR_PARTS_FORM_ID";
   ```
   Replace with your real ID.
3. Add a test part to the satchel on `inventory.html` and submit —
   you should get an itemized email within a minute.

The satchel never collects payment — it just sends you an itemized
request (part names, quantities, estimated total, name, contact,
notes), same as the booking form. You quote and invoice manually
per your existing deposit policy.

## 2c. Connect the orb (Consult the Wizard)

`consult.html` records a voice message in the browser (no app, no
account) and sends it to you as an audio file attachment, or accepts
a typed message if someone would rather not record.

1. Create a third Formspree form (e.g. "MagicByte consult"), get its
   ID. Formspree's free tier supports file attachments.
2. In `consult.html`, find near the top of the `<script>` block:
   ```js
   var FORMSPREE_ENDPOINT = "https://formspree.io/f/REPLACE_WITH_YOUR_CONSULT_FORM_ID";
   ```
   Replace with your real ID.
3. Recording requires the browser's microphone permission, which
   only works over HTTPS — GitHub Pages serves everything over HTTPS
   by default, so this works with no extra setup once it's live.
4. Test it yourself: record a few seconds, send it, confirm the
   audio file arrives as an attachment on the Formspree email. If a
   visitor's browser blocks the mic, the typed-message form below
   the orb sends to the same place.
5. You reply the normal way — text or email, whichever contact info
   they left. The orb doesn't build a two-way chat; it's a one-way
   "leave a message," same spirit as a voicemail box.

## 3. Connect a payment link

1. Create a free Stripe or Square account, make a **Payment Link**
   (works for one-off invoices — no code needed).
2. In `book.html`, find:
   ```html
   <a class="btn btn-ghost" href="#" onclick="alert('Replace this link...')...">Pay Deposit / Invoice</a>
   ```
   Replace `href="#"` with your real payment link URL, and delete the
   `onclick="alert(...)"` part entirely.
3. For one-off jobs, you can also just generate a fresh Stripe/Square
   payment link per customer and text/email it directly — the button
   on the site is for people who land there first.

## 4. Update the parts shop (`inventory.html`)

Each part is one `.part-card` block:

```html
<div class="part-card" data-category="iphone" data-part-id="iphone-12-screen"
     data-part-name="iPhone 12 Screen" data-part-price="56.81">
  <div class="part-card-top">
    <div><h3>iPhone 12 Screen</h3><p class="part-device">iPhone 12 / 12 Pro</p></div>
    <span class="stock-tag stock-in">In stock</span>
  </div>
  <div class="part-card-foot">
    <span class="part-price">$56.81</span>
    <button class="btn-add" data-add-to-cart>Add to Satchel</button>
  </div>
</div>
```

- `data-part-id` must be unique — it's how the cart tracks quantity.
- `data-part-price` is a plain number, no `$`. Leave it empty
  (`data-part-price=""`) for parts you want to quote instead of
  price upfront — the card will show "Quoted after review" and the
  order will list it as "quote needed."
- `data-category` controls the filter buttons at the top
  (`iphone`, `android`, or `other`) — add a new filter button in the
  `.shop-filters` block if you add a new category.
- Stock status is the same `stock-in` / `stock-order` pattern as
  before.
- To **add a new part**: copy an entire `.part-card` block and edit
  the values. To **remove one**: delete its block.

## 5. Update pricing (`services.html`)

The price table is the same pattern — copy/edit/delete `<tr>` rows in
the `<table class="data">` block. Update the promo banner text near
the top of `index.html`, `services.html`, and `book.html` when the
"First 100 Heroes" promo ends or changes — it's the same block in
each file:

```html
<div class="promo">
  <strong>First 100 Heroes Special</strong>
  <span class="note">...</span>
</div>
```

## 6. Add or edit FAQ entries (`faq.html`)

Each question is one block:

```html
<details class="faq-item">
  <summary>Your question here</summary>
  <p>Your answer here.</p>
</details>
```

Copy/paste this block to add a new question, or edit the text in
place.

## 7. Site-wide changes

- **Phone number**: appears in the footer of every page and in
  `book.html`, labeled "voicemail only" — it's a text/voicemail line,
  not something to answer live. Search-and-replace `316-559-4816`
  across all files if it changes. The street address is intentionally
  left off the site since this is a mobile-only operation — footer
  just says "Wichita, KS & surrounding area."
- **Logo**: your wizard-phone mascot is now baked in as local files —
  `assets/mascot.png` (full artwork, used in the homepage hero) and
  `assets/mascot-icon.png` (square crop of just the hat + mustache,
  used in the nav bar on every page). Background was removed and both
  are transparent PNGs. To swap in a different piece of art later,
  replace those two files (keep the same filenames) or update the
  `src` in the `<img>` tags if you rename them.
- **Colors/fonts**: all defined once at the top of `styles.css` under
  `:root { ... }` — change a value there and it updates the whole
  site.
- **Adding a new page**: copy any existing page (e.g. `faq.html`),
  rename it, replace the main content between `<main>` and `</main>`,
  and add a link to it in the `<nav class="links">` block — that nav
  block is repeated at the top of every page, so add the link to all
  of them to keep navigation consistent.

## Known placeholders you should replace

- Formspree form ID in `book.html` (repair bookings)
- Formspree form ID in `cart.js` (parts orders — the satchel)
- Formspree form ID in `consult.html` (orb voice/text messages)
- Payment link `href` in `book.html`
- Email address `hello@magicbyte.repair` in `book.html`
- Logo image (currently the same Imgur link you were already using)
