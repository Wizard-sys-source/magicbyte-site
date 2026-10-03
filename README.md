# MagicByte Mobile Repair

A static, mobile-first site for a one-person mobile phone repair business in
Wichita, KS. No build step — plain HTML, one shared stylesheet, one shared
script. Drop the files on GitHub Pages and it runs.

## Files

| File | What it is |
|---|---|
| `index.html` | Home — repair menu, van stock, hours, promises |
| `services.html` | Repair menu + labor rates |
| `book.html` | Ask the Wizard — voice orb + written form (both send by text) |
| `inventory.html` | Shop parts |
| `trust.html` | Trust & FAQ |
| `faq.html` / `consult.html` | Redirects only, for old links |
| `assets/mb.css` | All styling |
| `assets/mb.js` | Shared: header, bottom dock, bag, availability, checkout |
| `assets/` images | Mascot, icons, share card — do not replace |

## Editing prices, stock and hours

**Everything lives in the top section of `assets/mb.js`** (the `EDIT ME`
block). Nothing else needs touching:

- `CONFIG.visitWindows` — visit hours per weekday (`null` = closed)
- `CONFIG.today` — the "where's the wizard today" area (general area only,
  never a street address)
- `CONFIG.tripFeeWichita` — the $10 Wichita trip fee
- `PARTS` — `price` is your part cost (or `null` for "quoted"),
  `stock` is how many are in the van (`0` = order it in 3–5 days)

Commit and push; the live site follows in a minute or two.

## How orders work

Every order on every page goes out as a **text message** composed on the
customer's own phone — no form services to configure, nothing charged on
the site. The bag is shared across pages under one saved key, so items
added on the homepage show up in the Shop Parts bag too.

## Business docs (not part of the site)

- `voicemail-script.txt` — the voicemail greeting to record
- `google-business-checklist.md` — what to film for Google verification
