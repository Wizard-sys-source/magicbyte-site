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
| `faq.html` / `consult.html` | REMOVED Oct 2026 — `404.html` now catches their old links |
| `404.html` | Catches dead links; forwards old consult/faq URLs |
| `assets/mb.css` | All styling |
| `assets/mb.js` | Shared: header, bottom dock, bag, availability, checkout |
| `assets/` images | Mascot, icons, share card — do not replace |
| `CHANGELOG.md` | What changed in each pass |

## Editing prices, stock and hours

**Two ways, your choice.** Everything still lives in the top section of
`assets/mb.js` (the `EDIT ME` block) as the fallback — and the site now can
also pull from a Google Sheet you edit on your phone:

1. **Google Sheet (easiest):** create a sheet with three tabs named exactly
   `parts`, `labor`, `settings`, with these columns:
   - `parts`: `id, name, price, stock, grade`
   - `labor`: `id, name, labor_low, labor_high, time`
   - `settings`: `key, value` (keys: `tripFeeWichita`, `todayArea`,
     `todayNote`, `announceOn`, `announceText`)
   
   Then File → Share → Publish to web, and paste the sheet ID (the long
   string between `/d/` and `/edit` in the sheet's URL) into `sheetId` in
   EDIT ME. The site fetches the sheet on every page load and overrides the
   baked-in values. Rows are matched by `id`; unknown ids and bad numbers
   are ignored. If the sheet can't be reached, the baked-in values are used
   and the page never breaks.
2. **EDIT ME directly:** as before — `CONFIG`, `PARTS`, `SERVICES` at the top
   of `assets/mb.js`.

Either way, commit and push only matters for code changes; price edits in the
sheet go live on their own in a minute or two.

- `CONFIG.visitWindows` — visit hours per weekday (`null` = closed)
- `CONFIG.today` — the "where's the wizard today" area (general area only,
  never a street address). If it ever looks like an address, ZIP code, map
  link or GPS coordinates, the site ignores it and shows its default.
- `CONFIG.tripFeeWichita` — the $10 Wichita trip fee
- `PARTS` — `price` is your part cost (or `null` for "quoted"),
  `stock` is how many are in the van (`0` = order it)

Commit and push; the live site follows in a minute or two. Keep the commas
between lines in `CONFIG` — a missing comma stops the whole script.

**Heads-up:** some facts are also typed straight into the HTML and do *not*
follow `CONFIG`: the hours, trip fee and town list on Home, the trip fee on
Services and in the FAQ, the 30-day warranty (Home, Services, Ask the Wizard,
Trust ×2), and the phone number in the footers. Change those by hand.

## Switches you haven't decided on yet

Also in `EDIT ME`. Every one starts off or empty and shows **nothing** until
it has words in it. Typos, wrong types and deleted lines all count as off.

| Switch | Values | Where it shows |
|---|---|---|
| `heroesPromo` | `placement`: `"everywhere"`, `"services-only"`, `"off"`; plus `title`, `text` | Banner under the top of the page |
| `screenTier` | `"refurbished"`, `"xo7"`, `""` | Label above *Screen prices by model*. Display only — never changes a price |
| `paymentMethods` | a list, e.g. `["Cash", "Venmo"]` | In the bag, and in the FAQ answer *How do I pay* |
| `airportShiftPremium` | `on: true/false`, `title`, `text` | *Where and when* on Home, under the tabs on Services. Display only — never added to totals or the texted order |
| `warrantyText` | plain text; a blank line starts a new paragraph | Top of the warranty section on Trust & FAQ |
| `sheetId` | your Google Sheet's ID, or `""` | When set, the sheet overrides PARTS, SERVICES labor/time, and sheet-driven settings on every load |
| `announceBar` | `on: true/false`, `text` | Slim banner under the header, every page |
| `trustBadges` | list of `{t, d}` | Badge row on Home |
| `testimonials` | list of `{q, n}` | Quotes on Home |
| `reviewUrl` | a URL, or `""` | "Read my Google reviews" under testimonials. NOTE: your Business profile lists your street address |
| `socials` | `{instagram, tiktok, facebook}` URLs | Link row above every footer; empty ones hidden |
| `buyPhones` | `title`, `text` | "We buy phones" block on Shop parts |
| `firstOrder` | `on: true/false`, `code`, `text` | Nudge in the bag. Display only — the text must tell customers to type the code in their notes |
| `faceCaption` | plain text | Caption under your photo on Trust |
| `callLine` | plain text | "Rather just talk?" line above the repair menu on Home |
| `priceNote` | plain text | One line near pricing reframing labor |

Each place it can show is an empty, hidden element in the HTML, like
`<div data-slot="promo" hidden></div>`. Move or delete that element to change
or remove where a switch appears.

## Tabs

Some sections are grouped into tabs (`<div data-tabs>` holding children marked
`data-tab`). Each tab's label is that section's own heading, and the first one
in the HTML opens first. Without JavaScript the sections simply show one after
another, as before. To change the order, move the sections.

## How orders work

Every order on every page goes out as a **text message** composed on the
customer's own phone — no form services to configure, nothing charged on
the site. The bag is shared across pages under one saved key, so items
added on the homepage show up in the Shop Parts bag too.

## Business docs (not part of the site)

- `voicemail-script.txt` — the voicemail greeting to record
- `google-business-checklist.md` — what to film for Google verification
