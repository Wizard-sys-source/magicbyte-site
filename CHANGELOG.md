# Changelog

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
