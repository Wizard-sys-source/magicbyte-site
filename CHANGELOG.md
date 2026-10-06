# Changelog

## October 2026 — hero animation, face slots, Sheets prices, price display, second-pass switches

(Built by Strider after Claude hit its usage limit mid-pass; same spec, same
rules: checkout code byte-identical, EDIT ME stays the control panel.)

### Hero animation (pure CSS/JS, visuals only)
- A cracked phone drops in and shakes; a teal repair beam sweeps down and the
  cracks fade; the phone shrinks into the mascot with a sparkle; the card flips
  to Jonathan's photo. With no `assets/jonathan.jpg` it holds on the mascot —
  never a broken image, even with JavaScript off. Plays once per session, off
  under reduced motion, pauses off-screen.
- Photo slots: hero (end of the animation), a face card under the Trust intro,
  the About section on Home, and the bag header. Every one falls back to the
  mascot if the photo file is missing.

### Prices from Google Sheets
- New `sheetId` in EDIT ME. When set, the published sheet's `parts`, `labor`
  and `settings` tabs override PARTS / SERVICES labor / trip fee / today box /
  announcement on every page load. Bad rows and unreachable sheets fall back
  to the baked-in values; the page never breaks. Starter CSVs with the exact
  columns are with Jonathan.

### Price display (transparency that doesn't start arguments)
- Repair menu leads with the installed total ("About $136–$151 installed");
  the itemized math (part ~$76 · labor $60–$75 · trip $10) lives behind a
  "See the math" tap. Part prices round to whole dollars in display; checkout
  math keeps exact cents. Same treatment on the van cards and the screen
  table. Service descriptions stay symptom → outcome → price; process details
  stay on the Trust page, out of the sales path.
- Labor reframe line (`priceNote`, editable): "Labor covers the repair, full
  testing, the 30-day warranty, and me driving to you."

### New switches (all off/empty by default)
- `announceBar`, `trustBadges`, `testimonials`, `reviewUrl`, `socials`,
  `buyPhones`, `firstOrder` (display only), `faceCaption`, `callLine`,
  `priceNote`. Same fail-safe rules as the first pass: typos, wrong types and
  deleted lines show nothing; HTML typed into a switch renders as plain text;
  review/social URLs must start with http(s).

### Copy fixes
- "The 30-day ward" → "The 30-day warranty" (both places). "The forbidden
  arts" → "What I don't do". "Glass restoration" removed (not offered yet);
  the "Glass scratched (glass polishing)" option removed from Ask the Wizard.
- "Rather just talk? Call or text 316-559-4816." above the repair menu (editable).
- Shop headline "Order your part from the wizard." → "Order your part."
- Menu badge "Part ships in 3–5 days" → "Part arrives same or next day"
  (matches the decided parts promise).

### Removals
- `consult.html` and `faq.html` deleted; new `404.html` catches dead links and
  forwards old consult URLs to Ask the Wizard, old faq URLs to Trust & FAQ
  (one line to change if you'd rather consults went to Trust).

### Checkout
Untouched: MB.priceLine, MB.totals, MB.setQty, MB.orderText, MB.sms,
renderSheet and readForm are byte-identical to the previous pass (verified by
diff and by running old-vs-new order scenarios in Node: identical totals and
identical texted orders).

## Decisions still waiting on you
1. Photo: drop `assets/jonathan.jpg` in and the hero flip, face card, About and bag light up.
2. Old consult links → Ask the Wizard (one line in 404.html to send them to Trust instead).
3. Google review link: your Business profile lists your street address — linking it puts that address one tap from the site.
4. Screen tier + the aftermarket-vs-refurbished-originals wording contradiction (Trust vs Shop).
5. Payment methods, airport premium, Heroes promo wording/placement, Home tab order, custom domain.
6. "Deep water resurrections" — still wizard-worded in "What I don't do" (kept; flagging).

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
