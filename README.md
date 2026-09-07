# MagicByte Mobile Repair

A static, mobile-first site for a one-person mobile phone repair business in
Wichita, KS. No build step, no framework — plain HTML, one stylesheet, two
scripts. Drop the files on GitHub Pages and it runs.

## Files

| File | What it is |
|---|---|
| `index.html` | Home — hero, the three oaths, about |
| `inventory.html` | Shop parts, with device filters and the bag |
| `services.html` | Labor rates, what you don't take on, how a job works |
| `book.html` | Ask the Wizard — the voice orb and the written form |
| `faq.html` | Common questions |
| `consult.html` | Redirect only. Forwards old links to `book.html` |
| `styles.css` | All styling. Numbered sections, tokens at the top |
| `wizard.js` | Shared behaviour: the orb, shop filters, written form, effects |
| `cart.js` | The bag / parts ordering |
| `assets/` | Artwork — see below |

### assets/

| File | Used for | Size |
|---|---|---|
| `mascot.png` | The hero sigil on the home page | 476 × 669, transparent |
| `mascot-icon.png` | The circular icon beside the wordmark, and the PNG favicon | 512 × 512, transparent |
| `favicon.ico` | Browser tabs on older browsers | 16 / 32 / 48 |
| `apple-touch-icon.png` | Home-screen icon when someone saves the site on a phone | 180 × 180, opaque |
| `og-image.png` | The preview card when the link is texted or posted | 1200 × 630 |

The mascot was cut out from your artwork and matted against transparency, so it
sits on the dark background with no white box around it. `mascot-icon.png` is a
tighter crop of the hat and moustache, centred so nothing important is lost when
the nav clips it to a circle. All of them are palette-optimised — the whole
folder is about 300 KB.

The share card uses Lora for the wordmark, because Cinzel wasn't available when
it was generated. If you want it to match the site exactly, regenerate that one
image with Cinzel; nothing else depends on it.

Every page loads the same `<header>` and `<footer>` markup. If you change a nav
link, change it in all five pages — that mismatch is what made some tabs read
"Consult & Book" while others read "Ask the Wizard".

---

## 1. Publish to GitHub Pages

1. Upload every file to the **root** of the repository.
2. Go to **Settings → Pages → Build and deployment → Source**.
3. Choose **Deploy from a branch**, pick `main` and `/ (root)`, and save.
4. The site is live at `https://yourname.github.io/reponame/` in a few minutes.

---

## 2. Wire up the forms

Nothing reaches you until this is done. Customer messages route through
Formspree, which turns an HTML form into an email.

1. Make a free account at [formspree.io](https://formspree.io).
2. Create **two** forms so your inbox stays sorted:
   - **Consultations** — the voice orb and the written message on `book.html`
   - **Parts orders** — the bag on `inventory.html`
3. Copy each form ID. It looks like `xayzabcd`.

Then paste them in **two** places:

**`wizard.js`** — near the top, in the `FORMS` block:

```js
var FORMS = {
  consult: "https://formspree.io/f/YOUR_CONSULT_ID"
};
```

**`cart.js`** — find `var FORMSPREE_ENDPOINT = "…";` and replace it.

`book.html` also carries the endpoint in the written form's `action` attribute
as a fallback for visitors with JavaScript off. Update that one too:

```html
<form class="spellform" id="write-form" method="POST"
      action="https://formspree.io/f/YOUR_CONSULT_ID">
```

---

## 3. The voice orb

The orb records audio in the browser and attaches it to the Formspree
submission. Two things to know:

- The microphone only works over HTTPS. GitHub Pages is HTTPS, so it works
  live even though it may not work opening the file locally.
- Formspree's free tier accepts file attachments, so the recording arrives as
  an email attachment. Recordings are capped at 90 seconds.

If a browser blocks the mic or doesn't support recording, the orb says so and
points the visitor at the written form instead.

---

## 4. Deposits

For special-order parts, generate a "Pay deposit" link from a free Stripe or
Square account and text it to the customer once you've quoted them. There's no
payment form on the site by design — nothing to secure, nothing to maintain.

---

## 5. Google Business Profile

To pick up local Wichita searches:

1. Claim your Google Business Profile.
2. Use your home address to receive the verification postcard.
3. Once verified, set the business as a **Service Area Business**. This hides
   your street address from the public map and shows only that you cover
   Wichita and the surrounding area.

---

## Editing notes

- **Colours and fonts** are CSS variables in section 01 of `styles.css`.
  Change `--gold` or `--teal` there and the whole site follows.
- **Adding a part** to `inventory.html`: copy an existing `.part-card` block.
  The `data-category`, `data-part-id`, `data-part-name` and `data-part-price`
  attributes are what `cart.js` reads. A card with `data-always` stays visible
  under every filter — that's how the "Not sure what's broken?" card works.
- **Motion** is off automatically for visitors who have reduced motion enabled
  in their OS settings. If you add an effect, add it to that block at the
  bottom of `styles.css` too.
