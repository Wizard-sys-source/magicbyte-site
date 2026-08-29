# MagicByte website

A 5-page static site: `index.html` (home), `services.html` (pricing),
`inventory.html` (stock status), `book.html` (booking form + payment
link), `faq.html`. No build step — plain HTML/CSS, so you can edit
any file directly in GitHub and see changes live.

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

## 4. Update stock status (`inventory.html`)

Each row in the table is one part:

```html
<tr>
  <td>iPhone 12 Screen</td>
  <td class="price">$56.81</td>
  <td><span class="stock-tag stock-in">In stock</span></td>
</tr>
```

- To mark something **in stock**: use class `stock-in` and text
  `In stock`.
- To mark something as **needing an order**: use class `stock-order`
  and text like `Order (3–5 days)`.
- To **add a new part**: copy an entire `<tr>...</tr>` block and edit
  the three values (name, price, status).
- To **remove a part**: delete its `<tr>...</tr>` block.

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
  `book.html`. Search-and-replace `316-559-4816` across all files if
  it changes. The street address is intentionally left off the site
  since this is a mobile-only operation — footer just says "Wichita,
  KS & surrounding area."
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

- Formspree form ID in `book.html`
- Payment link `href` in `book.html`
- Email address `hello@magicbyte.repair` in `book.html`
- Logo image (currently the same Imgur link you were already using)
