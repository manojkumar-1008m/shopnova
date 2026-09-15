# ShopNova

**ShopNova** is a synthetic e-commerce storefront built as a local test/demo
environment for **ClauseGuard**, an AI dark-pattern detection system.
Everything here — products, prices, users, stock counts, timers, and
"purchases" — is fake. There is no real backend, no real payments, no real
accounts, and nothing is ever sent anywhere.

The site is deliberately built to *look and behave* like a normal modern
e-commerce platform (Amazon/Flipkart/Myntra-style), while containing eight
realistic dark-pattern scenarios baked directly into the normal shopping
flow, so a detector can be pointed at it and exercise DOM, text, vision,
price, and behavior analysis.

## 1. Install

```bash
npm install
```

## 2. Run

```bash
npm run dev
```

Then open the URL Vite prints (typically `http://localhost:5173`).

## 3. Open the Demo Panel

Click **"Demo Scenarios"** in the category bar of the header, or go directly
to `/demo`. From there you can:

- Toggle each of the 8 scenarios independently
- **Enable All Demo Scenarios**
- **Reset Demo** — clears the cart, add-ons, timer, inventory, viewer
  counts, membership status, and all scenario toggles back to defaults

All scenarios are **on by default**, because in real dark-pattern sites
these behaviors live in the normal flow, not behind a special mode. The
panel exists so a presenter can isolate one scenario at a time.

## 4. Scenario Map

| # | Scenario | Where to find it | Key DOM hooks |
|---|----------|-------------------|----------------|
| A | False Urgency | Product page (`/product/novapods-pro`) — countdown banner | `data-demo-pattern="false_urgency countdown_timer"`, `data-pattern="countdown_timer"` |
| B | Scarcity | Product page & product cards — "Only N left", "people viewing" | `data-pattern="scarcity"` |
| C | Hidden / Drip Pricing | Checkout stepper — fees appear step by step | `data-demo-pattern="drip_pricing"`, `data-price-type="additional_fee"` |
| D | Preselected Paid Add-on | Cart & checkout review step — "Premium Protection" checkbox, checked by default | `data-demo-pattern="preselected_option"`, `data-action="toggle-premium-protection"` |
| E | Confirm Shaming | Popup shown when leaving the cart for checkout | `data-demo-pattern="confirm_shaming"`, `data-action="accept-discount"` / `decline-discount"` |
| F | Cancellation Obstruction | Account page (`/account`) → Cancel Membership | `data-pattern="cancellation"`, `data-demo-pattern="cancellation_step_1"`, `"cancellation_retention_offer"`, `"cancellation_final_confirm"` |
| G | Visual Misdirection | Product page — "Continue with Premium" vs "Continue without Premium" | `data-demo-pattern="visual_misdirection"` |
| H | Social Proof | Product cards & product page — viewer counts, popularity copy | `data-pattern="social_proof"` |

### How to test each one

- **False Urgency (A):** Open any product with a Flash Deal badge
  (e.g. NovaPods Pro). Watch the timer count down from `09:42`; once it
  would drop below `09:01` it silently resets to `09:42` and keeps counting
  down — the "limited time" offer never actually expires.
- **Scarcity (B):** On the same product, note "Only 3 left in stock." Add
  it to the cart — the number decreases. Refresh other product cards to see
  "N people viewing" drift over time.
- **Drip Pricing (C):** Add a product to cart → Proceed to Checkout →
  step through *Delivery address → Delivery option → Payment method*. A new
  fee (`Platform handling fee`, `Convenience fee`, `Service charge`) appears
  in the order summary at each step, none of which were shown on the
  product page.
- **Preselected Add-on (D):** In the cart, or at the "Review order" step of
  checkout, note the **Premium Protection — ₹199** checkbox starts checked.
  It can be freely unchecked and the fee disappears from the total.
- **Confirm Shaming (E):** From the cart, click "Proceed to Checkout." A
  modal offers "Yes, save 20%" (prominent) vs. "No, I don't want to save
  money" (small, plain text).
- **Cancellation Obstruction (F):** Go to `/account` → Cancel Membership.
  You'll pass through "Are you sure?" → two retention offers → a final
  confirmation before the cancellation actually completes. Cancellation is
  always possible — this scenario is about friction, not lockout.
- **Visual Misdirection (G):** On a product page, compare the large,
  high-contrast "Continue with Premium Protection" button against the
  small, plain-text "Continue without Premium" link beside it.
- **Social Proof (H):** Visible throughout as "X people viewing this item,"
  "Popular choice," etc., with numbers that drift over time.

## 5. Connecting ClauseGuard

ShopNova makes no assumptions about how ClauseGuard is implemented. It is
built to be friendly to standard browser-based analysis:

- All buttons are real `<button>` elements, all links are real `<a>`
  (via React Router `Link`), all checkboxes are real `<input type="checkbox">`.
- Prices are plain text in the DOM, tagged with `data-price-type`
  (`base`, `additional_fee`, `subtotal`, `total`) and a numeric
  `data-price` attribute, e.g.:

  ```html
  <span data-price-type="additional_fee" data-price="199">₹199</span>
  ```

- Scenario-relevant elements carry a `data-demo-pattern` and/or
  `data-pattern` attribute naming the pattern, and interactive elements
  carry a `data-action` describing the action (`accept-discount`,
  `cancel-subscription`, `toggle-premium-protection`, etc.). These
  attributes are **supplementary** — the underlying UI text, layout, and
  price differences are real and detectable without them.
- Ordinary browser events fire throughout (`click`, `change`, `input`,
  route navigation via History API) — nothing is faked or sent as a
  synthetic ClauseGuard-specific event.

Point ClauseGuard's browser extension / crawler / instrumentation at
`http://localhost:5173` (or whichever port Vite assigns) and drive it
through the flows above.

## 6. Reset the Demo

Open `/demo` and click **Reset Demo** at any point. This clears the cart,
add-on selections, countdown timer, per-product stock, viewer counts, and
membership status, and re-enables all scenarios — so the same site can be
demoed repeatedly without a page reload.

## 7. Project structure

```
shopnova/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                 # app entry, providers
    ├── App.jsx                  # routes
    ├── context/
    │   └── DemoContext.jsx      # cart, scenario toggles, timers, stock, membership
    ├── data/
    │   └── products.js          # synthetic product catalog
    ├── components/
    │   ├── Header.jsx
    │   ├── Footer.jsx
    │   ├── ProductCard.jsx
    │   ├── ProductImage.jsx     # generated SVG placeholder art
    │   ├── ConfirmShamingModal.jsx
    │   └── ToastStack.jsx
    ├── pages/
    │   ├── Home.jsx
    │   ├── ProductDetail.jsx
    │   ├── Cart.jsx
    │   ├── Checkout.jsx
    │   ├── OrderConfirmation.jsx
    │   ├── Account.jsx          # membership + cancellation flow
    │   └── DemoPanel.jsx        # /demo
    └── styles/
        ├── tokens.css
        └── app.css
```

## 8. Routes

| Path | Page |
|------|------|
| `/` | Homepage |
| `/product/:id` | Product detail |
| `/cart` | Cart |
| `/checkout` | Multi-step checkout |
| `/order-confirmation` | Confirmation (demo order only) |
| `/account` | Membership & cancellation |
| `/demo` | Demo Scenarios control panel |

## 9. Safety notes

- No real payment gateway, authentication service, external database, or
  network calls are used — everything is local React state.
- Checkout uses a clearly labeled "demo — no real transaction" payment
  method; no card details are ever collected.
- All copy referencing quantities, viewer counts, discounts, and countdown
  timers is synthetic and regenerated client-side.
