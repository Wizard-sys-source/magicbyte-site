# MagicByte Mobile Repair

A static, mobile-first web interface for a mobile tech repair business in Wichita, KS. The site requires no build step and relies on a kooky "Wizard and Knight" aesthetic to build trust and filter out friction. 

## File Structure
* `index.html` (The Front Gate / Trust Oaths / Arch-Mage Bio)
* `inventory.html` (The Armory / Parts Shop)
* `book.html` (The Funnel: Voice Orb, Quick Missive, and Detailed Knight's Requisition)
* `services.html` (The Grimoire of Labor / Pricing)
* `faq.html` (The Oracle's Answers)
* `styles.css` (The Visual Magic: Deep plum, teal glows, and forged steel UI)
* `cart.js` (The Satchel logic for ordering parts)
* `assets/` (Folder containing `mascot.png` and `mascot-icon.png`)

---

## 1. Publish to GitHub Pages
1. Upload all files to the **root** of your repository.
2. Navigate to **Settings → Pages → Build and deployment → Source**.
3. Select **Deploy from a branch**, choose `main` (or `master`) and `/ (root)`, then click Save.
4. Your site will be live at `https://yourname.github.io/reponame/` within a few minutes.

---

## 2. Capture Customer Data (The Forms)
Since this is a static site, all customer data (text and voice) is routed through Formspree, a free service that turns HTML forms into emails. **Until you complete this step, customer submissions will not reach you.**

1. Create a free account at [formspree.io](https://formspree.io).
2. Create **three** separate forms to keep your inbox organized:
   * **Form 1: General Consultations** (For the Quick Missive and Knight's Requisition on `book.html`).
   * **Form 2: Voice Orb** (For the audio recordings on `book.html`).
   * **Form 3: The Armory** (For parts orders submitted via `cart.js`).
3. Copy the unique Form ID for each (it looks like `xayzabcd`).

### Where to paste your Form IDs:
* **`book.html` (Text Missive):** Find `<form class="spellform" action="https://formspree.io/f/REPLACE_WITH_YOUR_CONSULT_FORM_ID" method="POST">` and replace the placeholder.
* **`book.html` (Knight's Requisition):** Find `<form class="spellform" action="https://formspree.io/f/REPLACE_WITH_YOUR_FORM_ID" method="POST">` and replace the placeholder.
* **`cart.js` (The Satchel):** Find `var FORMSPREE_ENDPOINT = "https://formspree.io/f/REPLACE_WITH_YOUR_PARTS_FORM_ID";` near the top and replace the placeholder.

---

## 3. The Voice Orb Setup
The voice orb records audio directly in the browser and attaches it to a Formspree submission. 
* Formspree's free tier automatically accepts file attachments. 
* The microphone will only work when the site is hosted on a secure connection (HTTPS). GitHub Pages does this automatically, so it will function properly once the site is live. 

---

## 4. Payment Links
To handle deposits for special-order parts safely:
1. Generate a generic "Pay Deposit" link using a free Stripe or Square account.
2. Keep this link saved in your phone's notes. When a customer submits a requisition for a part you do not stock, reply with your text template and this link.

---

## 5. Google Business Verification
To capture local Wichita traffic:
1. Claim your Google Business Profile.
2. Use your residential address to receive the physical verification postcard.
3. **Crucial:** Once verified, set your business as a "Service Area Business" to hide the physical address from the public map, displaying only that you cover Wichita and the surrounding areas.
