# MagicByte Mobile Repair

A static, mobile-first site for a one-person mobile phone repair business in
Wichita, KS. No build step — plain HTML, one shared stylesheet, one shared
script. Drop the files on GitHub Pages and it runs.

## Files

| File | What it is |
|---|---|
| `index.html` | Home — opening animation, repair menu, van stock, hours, promises |
| `services.html` | Repair menu + screen prices by model |
| `book.html` | Ask the Wizard — voice orb + written form (both send by text) |
| `inventory.html` | Shop parts |
| `trust.html` | Trust & FAQ |
| `404.html` | Shown for any address that doesn't exist. Forwards old `faq.html` and `consult.html` links to Trust & FAQ |
| `assets/mb.css` | All styling |
| `assets/mb.js` | Shared: header, dock, bag, prices, switches, Google Sheet |
| `assets/` images | Mascot, icons, share card — do not replace. Your photo goes here as `jonathan.jpg` |
| `CHANGELOG.md` | What changed in each pass, and the decisions waiting on you |

**After uploading this pass, delete `faq.html` and `consult.html` from the repo.**
`404.html` now catches those addresses. (If the old files stay, they keep
working the old way.)

## Editing prices, stock and hours

**Everything lives in the top section of `assets/mb.js`** (the `EDIT ME`
block), or in your Google Sheet once it's connected (see below):

- `CONFIG.visitWindows` — visit hours per weekday (`null` = closed)
- `CONFIG.today` — the "where's the wizard today" area (general area only,
  never a street address). If it ever looks like an address, ZIP code, map
  link or GPS coordinates, the site ignores it and shows its default.
- `CONFIG.tripFeeWichita` — the Wichita trip fee
- `PARTS` — `price` is your part cost (or `null` for "quoted"),
  `stock` is how many are in the van (`0` = order it)

Commit and push; the live site follows in a minute or two. Keep the commas
between lines in `CONFIG` — a missing comma stops the whole script.

**Heads-up:** a few facts are still typed straight into the HTML and do *not*
follow `CONFIG`: the hours and town list on Home, the 30-day warranty
mentions, and the phone number in the structured data at the top of
`index.html` and the voicemail link on Ask the Wizard. The trip fee on Home and
the phone number in footers, the Home talk line, the Services steps and the
FAQ now follow `CONFIG`.

## Prices

Every price outside the bag leads with **one installed number: part + labor +
trip fee**. It's worked out by the bag's own math, so it always matches what the
bag would show for that repair. "See the math" under a price opens the
breakdown, with the part rounded to whole dollars. Shop parts lead with
part + 5% handling, the same number the bag shows. All of these words live in
`priceWords` in EDIT ME.

## Switches you haven't decided on yet

Also in `EDIT ME`. Every one starts off or empty and shows **nothing** until
it has words in it. Typos, wrong types and deleted lines all count as off.
Everything typed into a switch shows as plain text, never as HTML.

| Switch | Values | Where it shows |
|---|---|---|
| `heroesPromo` | `placement`: `"everywhere"`, `"services-only"`, `"off"`; plus `title`, `text` | Banner under the top of the page |
| `screenTier` | `"refurbished"`, `"xo7"`, `""` | Label above *Screen prices by model*. Display only |
| `paymentMethods` | a list, e.g. `["Cash", "Venmo"]` | In the bag, and in the FAQ answer *How do I pay* |
| `airportShiftPremium` | `on`, `title`, `text` | *Where and when* on Home, under the tabs on Services. Display only |
| `warrantyText` | plain text | One paragraph at the top of the warranty section on Trust & FAQ |
| `announceBar` | `on`, `text` | Slim banner under the header, every page. Visitors can close it for their visit |
| `trustBadges` | four `{icon, title, text}` | A row of badges on Home |
| `photo` | `src`, `captions.hero / trust / bag` | Your photo in three spots (see below) |
| `callLine` | text | Beside your number on the bar at the bottom of every page |
| `testimonials` | `[{quote, name}]` | Quotes on Home |
| `reviewUrl`, `reviewText` | an `https://` link, its label | Google reviews button on Home and Trust & FAQ |
| `socials` | `instagram`, `tiktok`, `facebook`: a link or a handle | Every footer |
| `weBuy` | `title`, `text`, `linkText`, `smsStart` | "We buy phones" block on Shop parts |
| `firstOrder` | `on`, `code`, `text` | Top of the bag |
| `priceWords` | the words around prices | Menus, Shop, screen table |

Each place a switch can show is an empty, hidden element in the HTML, like
`<div data-slot="promo" hidden></div>`. Move or delete that element to change
or remove where a switch appears. (The banner, dock number and bag extras are
added by `mb.js` itself.)

## Your photo

Save a square photo (about 600×600, under 150 KB) as `assets/jonathan.jpg`.
Until it's there, every spot shows the mascot — never a broken image — and
captions stay hidden. Spots: the Home hero (the opening animation turns to it),
beside the heading on Trust & FAQ, and next to "Your bag".

## Google Sheet as the price source

1. In the sheet, make three tabs named `parts`, `labor` and `settings`, with
   these first rows:
   - `parts`: `id, name, price, stock, grade`
   - `labor`: `id, name, labor_low, labor_high, time`
   - `settings`: `key, value`
2. File → Share → **Publish to web** → *Entire document* → *Comma-separated
   values (.csv)* → Publish. Paste the link into `sheetUrl`.
3. Click each tab and copy the number after `gid=` in the address bar into
   `sheetTabs` (`parts`, `labor`, `settings`).

Rows match by `id` (the same ids as `PARTS` and `SERVICES`). The sheet can
change a part's name, price, stock and grade, and a service's name, labor and
time. It can't add new parts or services; those still start in EDIT ME.

**Anything that goes wrong keeps the EDIT ME value:** no link, no connection,
a tab whose first row doesn't match, a broken row, a blank cell, a word where
a number goes (prices 0–1000, labor 0–500, stock a whole number 0–99), an id
the site doesn't know. Every page reads the sheet fresh; Google's own publish
delay is about five minutes.

Settings the sheet can change (keys ignore capitals and spaces):

| key | value |
|---|---|
| `todayArea`, `todayNote` | "Where's the wizard today" — the same address guard applies |
| `tripFeeWichita` | a number |
| `announceOn`, `announceText` | yes / no, and the words |
| `firstOrderOn`, `firstOrderCode`, `firstOrderText` | yes / no, the code, the words |
| `reviewUrl` | an `https://` link |

The 5% handling and the visit hours stay in EDIT ME on purpose: the bag says
"cost + 5%" and the Hours box is typed text, so changing either from the sheet
would make the site disagree with itself.

**To check the sheet:** add `?sheetcheck` to any page address
(`…/index.html?sheetcheck`). A panel lists each tab, how many rows it used,
and every row or setting it skipped and why.

## Tabs

Some sections are grouped into tabs (`<div data-tabs>` holding children marked
`data-tab`). Each tab's label is that section's own heading, and the first one
in the HTML opens first. Without JavaScript the sections simply show one after
another. To change the order, move the sections.

## How orders work

Every order on every page goes out as a **text message** composed on the
customer's own phone — no form services to configure, nothing charged on
the site. The bag is shared across pages under one saved key, so items
added on the homepage show up in the Shop Parts bag too.

## Business docs (not part of the site)

- `voicemail-script.txt` — the voicemail greeting to record
- `google-business-checklist.md` — what to film for Google verification
