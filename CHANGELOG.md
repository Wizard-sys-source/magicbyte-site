# Changelog

## October 2026, pass 2 — opening animation, photo, talk bar, one-number prices, Google Sheet

### 1. Opening animation (Home)
- A cracked phone shudders, sparkles, its cracks draw back into the impact
  point while light passes down the glass, the screen comes back on, and the
  mascot rises out of it. With `assets/jonathan.jpg` in place it then turns
  over to your photo; without it, it rests on the mascot. No broken image.
- Once per visit. Later pages in the same visit show the finished picture.
  Off under reduced motion. Pauses while off screen or in a background tab.
  Tap the picture: the mascot hops, or with your photo it turns back and forth.
- The "Get my repair price" sweep now plays when the mascot appears.
- I didn't have the EasyCare file, so this is built fresh in the same spirit.

### 2. Your photo in three spots
- Home hero, beside the Trust & FAQ heading, and next to "Your bag". The
  mascot shows until the photo has really loaded, so a missing file never
  flashes a broken image. Optional captions in EDIT ME; they only show with
  the photo.

### 3–8. New switches (all off or empty, see README)
- `announceBar` (closable for the visit; a new text shows again), `trustBadges`,
  `testimonials` + `reviewUrl`, `socials`, `weBuy`, `firstOrder`.
- Boomer: your number in large type on the bar at the bottom of every page,
  with "Calls go to my wizard voicemail — texts get the fastest reply." and
  Text / Call buttons ("Voicemail" is now "Call"). The page bottom adjusts to
  the taller bar.
- Gen X: `warrantyText` now always shows as one paragraph.
- `faq.html` and `consult.html` are gone; `404.html` forwards both to Trust &
  FAQ (`faq` lands on the questions).

### 9. Services fixes
- "What I don't do" no longer mentions glass restoration. Also removed the
  "Glass scratched (glass polishing)" choice on Ask the Wizard and a leftover
  polishing icon in the code.
- "How a job works": I couldn't make steps 1 and 4 go blank in these files
  (checked at Fold widths, with and without JavaScript). They're the only two
  steps with links in them, so if they're blank on the live site, something
  changed them while publishing. All four steps are now plain paragraphs,
  which survive editors that strip that kind of markup.

### 10–11. Wording
- Home: "Rather just talk? Call or text 316-559-4816" under the hero.
- "The forbidden arts" → "What I don't do" (the box's repeat of that title is
  gone). "The 30-day ward" → "The 30-day warranty", in the heading and in
  the FAQ answer that used it.

### 12–13. Prices lead with one number
- Home menu, Services menu, van cards and the screen table lead with part +
  labor + trip fee, worked out by the bag's own math. Outside Wichita it reads
  "+ trip fee"; parts still to be priced read "+ part".
- "See the math" under each menu and Shop price opens the breakdown, part
  rounded to whole dollars. It stays open when the list redraws.
- "Labor covers the repair, full testing, the 30-day warranty, and me driving
  to you." under the menu on Home and Services.
- Services: the repair menu is now the same pick-your-phone menu as Home (a
  total needs a model). The screen table includes the Wichita trip fee, with
  a note saying so. Removed "Labor for each job. The part is added on top, at
  cost.", "Screen at cost plus labor." and "Add the $10 Wichita trip fee."
  because they described the old display.
- Shop: each part leads with the number the bag shows (part + 5%).
- Menu rows stay symptom → time → price. No repair-process details were
  added; the parts honesty stays on Trust & FAQ, behind its tap-to-open rows.

### 14. Google Sheet
- `sheetUrl` + `sheetTabs` in EDIT ME. Every page reads the published CSV of
  each tab and lays it over EDIT ME; anything missing, broken or not a number
  keeps the EDIT ME value. The today address guard applies to the sheet too.
- A copy under five minutes old paints the next page of a visit so prices
  don't jump, then it's checked against the sheet straight away. If the sheet
  can't be reached, the page goes back to EDIT ME values.
- `?sheetcheck` on any page shows what the sheet changed and skipped.
- Names coming from the sheet are cleaned and shown as plain text.

### Also
- The address guard now also refuses "930 Litchfield" and "930 n litchfield".
- New words on the site: "See the math", Part / Labor / Trip fee / Handling,
  "about", "+ part", "+ trip fee", "Includes the $10 Wichita trip fee.",
  "Call", "Close announcement" (screen readers), the 404 page, and the
  platform names on social links. Your two lines are as you wrote them.

### Checkout
Untouched. Pricing, totals, the bag, the order text and the SMS handoff are
byte-for-byte the original code (checked line by line). The same clicks on the
old and new site produce identical texted orders, bag text, totals and Ask the
Wizard messages (multi-item, quantity, model change, part only, swap to
install, outside Wichita).

### Tested
75 checks, all passing: every page with default settings (no errors, only the
expected slots showing), every switch on with HTML typed into it, the
animation with and without the photo, reduced motion, pausing off screen, the
sheet working, failing, timing out, wrong columns, a web page instead of a
CSV, a broken quote, an address in todayArea, old addresses forwarding, and
every new button at least 44 px tall.

## Decisions still waiting on you
1. **"Labor covers… and me driving to you"** sits next to a separate $10 trip
   fee that "See the math" shows. Drop "and me driving to you", or fold the
   fee into labor.
2. **Cents.** The bag shows exact cents, so the menu totals match it to the
   cent ($126.81–141.81). Only the breakdown is rounded. For whole dollars
   everywhere, enter whole-dollar part prices in the sheet. Shop prices add 5%,
   so they can still show cents.
3. **Part cost plus labor is still advertised** in the Services headline and
   its line under it, the Home "Upfront pricing" promise, Services step 2, and
   the search descriptions. All still true (the math is one tap away). Keep or
   reword.
4. **Google reviews link.** Your Google profile shows 930 N Litchfield. If you
   don't want that one tap from the site, set the profile up as a
   service-area business and hide the address.
5. **consult.html** now lands on Trust & FAQ as you asked; it used to land on
   Ask the Wizard. One line in `404.html` changes it.
6. **Delete `faq.html` and `consult.html`** from the repo.
7. **Wizard words still in body copy:** "Deep water resurrections, unless the
   phone still shows a spark of life" (Services; your FAQ already says it
   plainly: "only if the device still shows some sign of life") and "Order
   your part from the wizard." (Shop heading). "Calls go to my wizard
   voicemail" is your new line and stays as written.
8. **Empty until you fill them:** badges, captions, testimonials, review link,
   socials, we-buy block, warranty paragraph. Suggestions are in the comments.
9. **The sheet can't mark a part "Quoted"** (words in the price column are
   ignored). Do that in EDIT ME with `price: null`.
10. **Your photo:** square, about 600×600, under 150 KB, at
    `assets/jonathan.jpg`. Until then each page logs one harmless "not found"
    line for it in the browser console.
11. **Carried over:** Heroes promo wording and placement; screen tier ("van
    screens are refurbished originals" on Shop vs "aftermarket, not original"
    on Trust); ordered-part timing (3–5 days on Home vs same or next day
    elsewhere); the "I'll confirm which payment methods I take" FAQ line once
    you list them; airport premium; Home tab order; canonical URLs if you
    move to a custom domain.

## October 2026 — flair, declutter, switches, SEO, accessibility

Body copy is unchanged word for word on every page (checked by diffing all
body text, before and after). The only new customer-facing words are the SEO
titles and descriptions, the label "Ways to pay" (shows only once you list
payment methods), and the two screen-tier labels (show only if you pick a tier).

### 1. Wizard flair (CSS/JS only)
- Mascot hovers with a slight sway; a soft glow underneath shrinks as it rises.
- First homepage visit per session: the mascot rises in, sparkles once, and
  "Get my repair price" gets a single light sweep. Then everything settles.
- Four-point stars twinkle around the homepage mascot. Tap the mascot: it hops.
- Adding to the bag sparkles from the + button — only when the count really
  goes up (not at the quantity cap).
- "Order sent" step in the bag pops gently.
- Animations pause while the mascot is off screen. The background glow moved
  to a fixed layer (smoother scrolling on Android than `background-attachment: fixed`).
- All of it is off under reduced motion, and skipped in browsers without the
  Web Animations API.

### 2. Declutter
- Header tucks away while you scroll down and returns when you scroll up
  (or tab into it). In-page jumps like "Get a price" keep it tucked so it
  can't cover where you land.
- Filter chips no longer stick under the header (was three stacked bars).
- Stacks of separate boxes became one grouped panel each.
- Tabs: Home (Where and when / How an order works / My promises), Services
  (repair menu / screen prices), Ask the Wizard (voice / written — opens the
  written form automatically if the browser can't record), Trust warranty
  (Covered / Not covered / How to claim). Links like `book.html#write` open
  the right tab.
- Shop parts: the three notes became tap-to-open rows.
- Fold open: the two main buttons sit side by side, form fields pair up,
  privacy promises go two-up. Services rows put the price under the
  description on narrow screens.
- Page length on the Fold's outer screen: Home −15%, Services −21%,
  Ask the Wizard −42%, Shop −12%, Trust −9%.

### 3. Switches (EDIT ME)
- Added `heroesPromo`, `screenTier` (+ `screenTierLabels`), `paymentMethods`,
  `airportShiftPremium`, `warrantyText`. All default off/empty. See README.
- Tested: default config shows nothing anywhere; typos, wrong types, deleted
  lines and "on but empty" all show nothing; HTML typed into a switch is shown
  as plain text; the texted order is identical with every switch on.
- "Where's the wizard today" refuses anything that looks like a street
  address, ZIP code, map link or GPS coordinates.

### 4. SEO
- Every page: title pattern "Topic in Wichita, KS | MagicByte", matching
  meta description, canonical URL, full Open Graph set, Twitter card.
- `og:image` is now a full URL (link previews ignore relative ones).
- `<meta charset>` moved first. Redirect pages are `noindex`.

### 5. Accessibility
- Form borders 1.5:1 → 3.7:1 contrast. All text was already 6:1 or better.
- Every control is at least 44×44 px (nav, filters, brand tabs, steppers,
  close buttons, Remove / Clear bag, toast button).
- Focus ring: 3 px teal, no longer clipped in sideways-scrolling rows.
- Keyboard focus stays inside the open bag / phone picker and returns to
  where you were when it closes.
- Emoji icons hidden from screen readers; error messages announced;
  required fields marked.

### Bugs fixed along the way
- Services showed the word "undefined" as the icon for Charging port cleaning.
- Shop parts: an unclosed box nested the other two inside it; a section
  pointed its label at an id that didn't exist.
- Reduced-motion rule missed pseudo-elements, so the orbit rings kept spinning.
- Focus style turned the round + buttons square.
- The bag's quantity number was never styled.
- The "today" box printed "undefined" if its note was blank.

### Checkout
Untouched. Pricing, totals, the bag, the order text and the SMS handoff are
byte-for-byte the original code; the same clicks on the old and new site
produce identical texted orders (multi-item, quantity changes, swap to
install, remove, out-of-town area, error path, Ask the Wizard form).

## Decisions still waiting on you
1. Heroes promo wording — who qualifies, what the $20 covers — and placement.
2. Screen tier — PARTS mixes refurbished (van) and XO7 (ordered) screens, so
   one label would be wrong for some rows. Trust says "aftermarket, not
   original"; Shop says "van screens are refurbished originals". Settle both.
3. Ordered-part timing — Home says 3–5 days; Shop and the FAQ say same or next day.
4. Payment methods — once listed, the FAQ line "I'll confirm which payment
   methods I take…" will read oddly.
5. Airport premium — amount, when it applies, and whether it should ever be
   added to totals (now display only).
6. Facts typed into HTML instead of EDIT ME (warranty ×5, hours, trip fee,
   towns, phone) — wire them to CONFIG?
7. Wizard words in existing copy vs. the brand rule: "The forbidden arts",
   "deep water resurrections", "30-day ward" (×2), "from the wizard".
8. Home tab order — "Where and when" is first; move the sections to change it.
9. If you move to a custom domain, update the canonical/OG URLs in each page head.

## October 2026 — hero repair animation (from the EasyCare pilot)

Home hero now plays the EasyCare pilot's repair sequence — cracks draw in,
glitch, teal repair sweep, screen lights up, checkmark pops — then crossfades
into the MagicByte mascot logo. Recolored to the site theme (teal/gold).
Plays once on load with CSS alone; tap the phone to replay. Respects
prefers-reduced-motion (shows the logo statically). Everything else on the
site is unchanged from the previous pass.

## October 2026 — flair, declutter, switches, SEO, accessibility

Body copy is unchanged word for word on every page (checked by diffing all
body text, before and after). The only new customer-facing words are the SEO
titles and descriptions, the label "Ways to pay" (shows only once you list
payment methods), and the two screen-tier labels (show only if you pick a tier).

### 1. Wizard flair (CSS/JS only)
- Mascot hovers with a slight sway; a soft glow underneath shrinks as it rises.
- First homepage visit per session: the mascot rises in, sparkles once, and
  "Get my repair price" gets a single light sweep. Then everything settles.
- Four-point stars twinkle around the homepage mascot. Tap the mascot: it hops.
- Adding to the bag sparkles from the + button — only when the count really
  goes up (not at the quantity cap).
- "Order sent" step in the bag pops gently.
- Animations pause while the mascot is off screen. The background glow moved
  to a fixed layer (smoother scrolling on Android than `background-attachment: fixed`).
- All of it is off under reduced motion, and skipped in browsers without the
  Web Animations API.

### 2. Declutter
- Header tucks away while you scroll down and returns when you scroll up
  (or tab into it). In-page jumps like "Get a price" keep it tucked so it
  can't cover where you land.
- Filter chips no longer stick under the header (was three stacked bars).
- Stacks of separate boxes became one grouped panel each.
- Tabs: Home (Where and when / How an order works / My promises), Services
  (repair menu / screen prices), Ask the Wizard (voice / written — opens the
  written form automatically if the browser can't record), Trust warranty
  (Covered / Not covered / How to claim). Links like `book.html#write` open
  the right tab.
- Shop parts: the three notes became tap-to-open rows.
- Fold open: the two main buttons sit side by side, form fields pair up,
  privacy promises go two-up. Services rows put the price under the
  description on narrow screens.
- Page length on the Fold's outer screen: Home −15%, Services −21%,
  Ask the Wizard −42%, Shop −12%, Trust −9%.

### 3. Switches (EDIT ME)
- Added `heroesPromo`, `screenTier` (+ `screenTierLabels`), `paymentMethods`,
  `airportShiftPremium`, `warrantyText`. All default off/empty. See README.
- Tested: default config shows nothing anywhere; typos, wrong types, deleted
  lines and "on but empty" all show nothing; HTML typed into a switch is shown
  as plain text; the texted order is identical with every switch on.
- "Where's the wizard today" refuses anything that looks like a street
  address, ZIP code, map link or GPS coordinates.

### 4. SEO
- Every page: title pattern "Topic in Wichita, KS | MagicByte", matching
  meta description, canonical URL, full Open Graph set, Twitter card.
- `og:image` is now a full URL (link previews ignore relative ones).
- `<meta charset>` moved first. Redirect pages are `noindex`.

### 5. Accessibility
- Form borders 1.5:1 → 3.7:1 contrast. All text was already 6:1 or better.
- Every control is at least 44×44 px (nav, filters, brand tabs, steppers,
  close buttons, Remove / Clear bag, toast button).
- Focus ring: 3 px teal, no longer clipped in sideways-scrolling rows.
- Keyboard focus stays inside the open bag / phone picker and returns to
  where you were when it closes.
- Emoji icons hidden from screen readers; error messages announced;
  required fields marked.

### Bugs fixed along the way
- Services showed the word "undefined" as the icon for Charging port cleaning.
- Shop parts: an unclosed box nested the other two inside it; a section
  pointed its label at an id that didn't exist.
- Reduced-motion rule missed pseudo-elements, so the orbit rings kept spinning.
- Focus style turned the round + buttons square.
- The bag's quantity number was never styled.
- The "today" box printed "undefined" if its note was blank.

### Checkout
Untouched. Pricing, totals, the bag, the order text and the SMS handoff are
byte-for-byte the original code; the same clicks on the old and new site
produce identical texted orders (multi-item, quantity changes, swap to
install, remove, out-of-town area, error path, Ask the Wizard form).

## Decisions still waiting on you
1. Heroes promo wording — who qualifies, what the $20 covers — and placement.
2. Screen tier — PARTS mixes refurbished (van) and XO7 (ordered) screens, so
   one label would be wrong for some rows. Trust says "aftermarket, not
   original"; Shop says "van screens are refurbished originals". Settle both.
3. Ordered-part timing — Home says 3–5 days; Shop and the FAQ say same or next day.
4. Payment methods — once listed, the FAQ line "I'll confirm which payment
   methods I take…" will read oddly.
5. Airport premium — amount, when it applies, and whether it should ever be
   added to totals (now display only).
6. Facts typed into HTML instead of EDIT ME (warranty ×5, hours, trip fee,
   towns, phone) — wire them to CONFIG?
7. Wizard words in existing copy vs. the brand rule: "The forbidden arts",
   "deep water resurrections", "30-day ward" (×2), "from the wizard".
8. Home tab order — "Where and when" is first; move the sections to change it.
9. If you move to a custom domain, update the canonical/OG URLs in each page head.
