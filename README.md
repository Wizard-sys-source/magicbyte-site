# MagicByte Mobile Repair

A static, mobile-first web interface for a mobile tech repair business in Wichita, KS. The site requires no build step and relies on a clean "Tech Wizard" aesthetic to build trust, highlight transparency, and filter out friction[span_8](start_span)[span_8](end_span)[span_9](start_span)[span_9](end_span). 

## File Structure
* `index.html` (The Front Gate / Hero / Trust Oaths / Arch-Mage Bio)[span_10](start_span)[span_10](end_span)
* `inventory.html` (The Armory / Parts Shop)[span_11](start_span)[span_11](end_span)
* `book.html` (The Funnel: Voice Orb, Quick Missive, and Detailed Requisition)[span_12](start_span)[span_12](end_span)[span_13](start_span)[span_13](end_span)
* `services.html` (The Grimoire of Labor / Pricing)[span_14](start_span)[span_14](end_span)
* `faq.html` (The Oracle's Answers)[span_15](start_span)[span_15](end_span)
* `styles.css` (The Visual Magic: Deep plum, teal glows, gold accents)[span_16](start_span)[span_16](end_span)
* `cart.js` (The Satchel logic for ordering parts)[span_17](start_span)[span_17](end_span)
* `assets/` (Folder containing `mascot.png` and `mascot-icon.png`)

---

## 1. Publish to GitHub Pages
1. Upload all files to the **root** of your repository[span_18](start_span)[span_18](end_span).
2. Navigate to **Settings → Pages → Build and deployment → Source**[span_19](start_span)[span_19](end_span).
3. Select **Deploy from a branch**, choose `main` (or `master`) and `/ (root)`, then click Save[span_20](start_span)[span_20](end_span).
4. Your site will be live at `https://yourname.github.io/reponame/` within a few minutes[span_21](start_span)[span_21](end_span).

---

## 2. Capture Customer Data (The Forms)
Since this is a static site, all customer data (text and voice) is routed through Formspree, a free service that turns HTML forms into emails[span_22](start_span)[span_22](end_span). **Until you complete this step, customer submissions will not reach you.**

1. Create a free account at [formspree.io](https://formspree.io)[span_23](start_span)[span_23](end_span).
2. Create **three** separate forms to keep your inbox organized[span_24](start_span)[span_24](end_span):
   * **Form 1: General Consultations** (For the text missive and detailed form on `book.html`).
   * **Form 2: Voice Orb** (For the audio recordings on `book.html`)[span_25](start_span)[span_25](end_span).
   * **Form 3: The Armory** (For parts orders submitted via `cart.js`)[span_26](start_span)[span_26](end_span)[span_27](start_span)[span_27](end_span).
3. Copy the unique Form ID for each (it looks like `xayzabcd`)[span_28](start_span)[span_28](end_span).

### Where to paste your Form IDs:
* **`book.html` (Text Missive & Detailed Form):** Find the `<form class="spellform" action="...">` tags and replace the placeholders[span_29](start_span)[span_29](end_span)[span_30](start_span)[span_30](end_span).
* **`cart.js` (The Satchel):** Find `var FORMSPREE_ENDPOINT = "...";` near the top and replace the placeholder[span_31](start_span)[span_31](end_span)[span_32](start_span)[span_32](end_span).

---

## 3. The Voice Orb Setup
The voice orb records audio directly in the browser and attaches it to a Formspree submission[span_33](start_span)[span_33](end_span)[span_34](start_span)[span_34](end_span). 
* Formspree's free tier automatically accepts file attachments[span_35](start_span)[span_35](end_span). 
* The microphone will only work when the site is hosted on a secure connection (HTTPS). GitHub Pages does this automatically, so it will function properly once the site is live[span_36](start_span)[span_36](end_span). 

---

## 4. Payment Links
To handle deposits for special-order parts safely:
1. Generate a generic "Pay Deposit" link using a free Stripe or Square account[span_37](start_span)[span_37](end_span).
2. Replace the placeholder link in `book.html` (or just keep it saved in your phone to text to customers)[span_38](start_span)[span_38](end_span)[span_39](start_span)[span_39](end_span).

---

## 5. Google Business Verification
To capture local Wichita traffic:
1. Claim your Google Business Profile.
2. Use your residential address to receive the physical verification postcard.
3. **Crucial:** Once verified, set your business as a "Service Area Business" to hide the physical address from the public map, displaying only that you cover Wichita and the surrounding areas.
