# Dodo Payments — Embeddable Checkout SDK

Frontend Engineer Assignment submission building a lightweight, embeddable checkout SDK, an isolated iframe checkout application, and a merchant demo store.

---

## Submission Summary

- **SDK Implementation**: `src/sdk/dodo-checkout.ts` and `src/sdk/messageProtocol.ts`
- **Checkout Application**: `checkout.html` and `src/checkout/`
- **Merchant Demo Site**: `index.html` and `src/App.tsx`
- **Architecture & Design Decisions**: Documented below and in the in-app Architecture tab

---

## What Was Built

### 1. Embeddable SDK (`src/sdk/dodo-checkout.ts`)

A standalone TypeScript SDK that embeds a checkout into any website. It exposes both modal and inline mounting methods with full callback and telemetry support:

```ts
DodoCheckout.open({
  productId: 'prod_pro',
  customerEmail: 'alex@example.com',
  currency: 'USD',
  onSuccess: ({ sessionId, amount, currency, paymentMethod }) => {
    console.log('Payment succeeded:', sessionId, amount, currency, paymentMethod);
  },
  onClose: ({ reason }) => {
    console.log('Checkout closed:', reason);
  },
  onError: ({ code, message }) => {
    console.error('Payment error:', code, message);
  },
  onEvent: ({ event, timestamp, payload }) => {
    console.log('Lifecycle event:', event, timestamp, payload);
  },
});
```

Key features:
- **Modal and Inline Embedding**: `DodoCheckout.open()` creates a centered backdrop modal, while `DodoCheckout.embed()` mounts into a merchant-provided DOM container.
- **Strict Origin and Session Validation**: Verifies `event.origin`, checks that `event.source` matches the target iframe `contentWindow`, and matches session IDs on every incoming and outgoing message.
- **Idempotency Guard**: Prevents duplicate checkouts or multiple simultaneous modal layers when users click Buy repeatedly. If a checkout is already open, it focuses the active instance.
- **Keyboard and Accessibility Support**: Traps focus inside the modal, allows Escape key dismissal with unsaved changes verification, locks background scroll, and restores focus to the trigger element when closed.

### 2. Isolated Checkout Application (`checkout.html`, `src/checkout/`)

An independent web application hosted inside an iframe sandbox. The host page never accesses the raw card input fields, keeping sensitive PAN, Expiry, and CVC inputs contained.

Implemented test cards:

| Card Number | Behavior | Outcome |
| :--- | :--- | :--- |
| `4242 4242 4242 4242` | Success | Completes payment and fires `onSuccess` with sanitized receipt |
| `4000 0000 0000 0002` | Decline | Displays insufficient funds error and fires `onError` |
| `4000 0000 0000 0341` | Transient failure | Fails on first attempt, allows retry, and succeeds on second attempt |

States and resilience:
- **Form State Preservation**: When an authorization fails, card numbers and personal details remain populated so customers can retry without re-typing.
- **In-flight Double-Submit Protection**: Submit button disables immediately upon click, showing an active loading spinner and preventing duplicate transaction attempts.
- **Discard Confirmation Modal**: Warns users if they attempt to close the checkout while inputs are partially completed.
- **Dynamic Resizing**: Dispatches frame height telemetry so the host container adjusts to error messages, coupon accordions, or success states without nested scrollbars.

### 3. Merchant Demo Site (`src/App.tsx`, `src/components/`)

A realistic SaaS merchant interface demonstrating checkout integration:
- **Plan Cards**: Starter, Pro, Enterprise tiers, and the **Compute Add-on**.
- **Live Callback Log**: Displays fired `onSuccess`, `onClose`, `onError`, and `onEvent` callbacks in real time with payload inspection and copy-to-clipboard actions.
- **Payment Method Rails**: Previews global card networks, digital wallets (Apple Pay, Google Pay), and direct bank rails (SEPA, UPI, iDEAL).
- **Invoicing & Ledger**: Tracks completed transactions and simulated tax remittance.
- **In-App Architecture Documentation**: Interactive documentation detailing message protocols, security boundaries, and trade-offs.

---

## How the Pieces Talk to Each Other

```text
Merchant Page                          Isolated Iframe
     │                                        │
     │─── DodoCheckout.open({ options }) ────►│ (Mounts iframe with session tokens)
     │                                        │
     │◄── DODO_CHECKOUT_READY ────────────────│ (Checkout loaded & ready)
     │◄── DODO_CHECKOUT_EVENT ────────────────│ (e.g. checkout_ready, processing_started)
     │                                        │
     │    [Customer submits card details]     │
     │                                        │
     │◄── DODO_CHECKOUT_SUCCESS ──────────────│ (Sanitized receipt: brand, last4, amount)
     │    or                                  │
     │◄── DODO_CHECKOUT_ERROR ────────────────│ (Code and error message)
     │◄── DODO_CHECKOUT_CLOSE ────────────────│ (Close reason: user_closed, completed)
     │                                        │
     ▼                                        ▼
Merchant Callbacks Executed            Iframe Unmounted / Cleaned Up
```

Security enforcement on every message:
1. Origin verification: Checks `event.origin` against the permitted checkout origin.
2. Source window verification: Confirms `event.source === iframe.contentWindow`.
3. Session identifier check: Rejects any message whose `sessionId` does not match the active session.
4. Specific destination origins: All iframe responses are sent to `parentOrigin` rather than `'*'`.
5. Data sanitization: Only non-sensitive summary fields (`brand`, `last4`, `sessionId`) cross the postMessage boundary.

---

## Two Decisions I Went Back and Forth On

### 1. Iframe Sandbox Modal vs. Full-Page Redirect

- **Context**: A full-page redirect provides complete isolation without iframe configuration, but takes the customer away from the merchant page, breaks client-side state, and reduces conversion.
- **Choice**: Implemented an in-page sandboxed iframe modal. This keeps the customer in context while maintaining isolation between the merchant DOM and card inputs. Sanitized receipts are passed via verified `postMessage` calls.

### 2. Minimal Required Callbacks vs. Granular Telemetry

- **Context**: The assignment required `onSuccess`, `onClose`, and `onError`. However, merchants frequently need to track checkout funnel milestones (when the modal renders, when payment submission begins) to measure drop-off.
- **Choice**: Maintained `onSuccess`, `onClose`, and `onError` as the primary API, and added an optional `onEvent` callback for non-sensitive lifecycle events (`checkout_ready`, `payment_processing_started`, `checkout_closed`). Raw card details, keystrokes, and input events are never emitted.

---

## What I Would Explore Next

1. **Standalone Production CDN Bundle**: Create a single-file compilation step (`dist/sdk.js`) for merchants using script tags (`<script src="https://cdn.dodopayments.com/v1/sdk.js"></script>`).
2. **Dedicated Checkout Subdomain**: Host the checkout application on a separate origin (e.g., `checkout.dodopayments.com`) to enforce cross-origin isolation at the DNS level.
3. **Automated Test Suite**: Add Playwright end-to-end tests for the three card test scenarios, rapid double-clicks, keyboard navigation, and network retry handling.
4. **Server-Signed Checkout Tokens**: Transition from client-generated session tokens to server-signed HMAC sessions initiated via merchant API calls.

---

## How to Run

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The application will run locally on `http://localhost:3000`. Both `index.html` (merchant demo) and `checkout.html` (isolated checkout) are served by Vite.

### 3. Build for Production
```bash
npm run build
```
Generates production-optimized static assets for both HTML entry points in `dist/`.

### 4. Type Checking & Verification
```bash
npm run lint
```
Runs `tsc --noEmit` to verify type safety across the SDK, checkout application, and demo store.
