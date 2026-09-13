# Dodo Payments — Embeddable Checkout

A tiny embeddable checkout built with TypeScript, React and Vite.

The implementation consists of three pieces:

1. **Checkout SDK** — a small TypeScript API that merchants can use to open or embed checkout.
2. **Hosted Checkout App** — an isolated checkout application rendered inside an iframe.
3. **Merchant Demo Site** — a sample store demonstrating the SDK, payment states and callback events.

## Live Demo

https://dodopayments-embaddable-checkout.netlify.app/

## Source Code

https://github.com/shweta-thakur26/Embeddable-Checkout

---

## How to Run

### Requirements

* Node.js 18+
* npm

### Install

```bash
npm install
```

### Start development server

```bash
npm run dev
```

The application runs at:

```text
http://localhost:3000
```

Both the merchant demo (`index.html`) and hosted checkout (`checkout.html`) are served by Vite.

### Production build

```bash
npm run build
```

### Type checking

```bash
npm run lint
```

---

# How the Pieces Talk to Each Other

The merchant integrates the checkout through a small SDK API:

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
```

The flow is:

```text
Merchant Page
     |
     | DodoCheckout.open()
     ↓
Checkout SDK
     |
     | creates isolated iframe
     ↓
Hosted Checkout
     |
     | customer enters payment details
     |
     | verified postMessage
     ↓
Merchant Page
     |
     ├── onSuccess
     ├── onError
     ├── onClose
     └── onEvent
```

The checkout communicates with the merchant using `postMessage`.

Messages include a protocol version and session ID so that unrelated or stale messages are rejected.

---

# Security Boundary

The checkout is isolated from the merchant page using an iframe.

The host page does not directly access the checkout's card fields.

Messages are validated using:

* Allowed origin verification
* `event.source === iframe.contentWindow`
* Matching checkout session ID
* Protocol version validation
* Explicit destination origins

Only sanitized payment information is returned to the merchant, such as:

* Session ID
* Card brand
* Last four digits
* Amount
* Currency
* Payment status

Raw card number, expiry and CVC are never exposed through merchant callbacks.

---

# Payment Scenarios

The assignment-provided test cards are supported:

| Card                  | Behaviour                     |
| --------------------- | ----------------------------- |
| `4242 4242 4242 4242` | Successful payment            |
| `4000 0000 0000 0002` | Card declined                 |
| `4000 0000 0000 0341` | Fails once, succeeds on retry |

The checkout also handles:

* Payment processing state
* Retryable errors
* Network failure simulation
* Duplicate payment submission
* Form validation
* Preserving entered information after a retry
* Closing with unsaved information
* Dynamic iframe height
* Keyboard navigation
* Loading and success states

---

# Two Decisions I Went Back and Forth On

## 1. Iframe Checkout vs Full-Page Redirect

A full-page redirect would provide straightforward isolation, but it would take the customer away from the merchant's page and potentially interrupt the merchant application's state.

I chose an in-page iframe checkout instead.

This keeps the customer within the merchant experience while creating a clear boundary between the merchant DOM and the checkout's sensitive inputs.

The trade-off is that iframe communication and lifecycle management become more complex, so I handled that through a small versioned `postMessage` protocol with origin and source validation.

---

## 2. Minimal Callbacks vs Additional Checkout Telemetry

The assignment requires `onSuccess`, `onClose` and `onError`.

I considered keeping the SDK API strictly minimal, but merchants also need visibility into the checkout lifecycle for analytics and debugging.

I therefore kept the required callbacks as the primary API and added an optional `onEvent` callback for non-sensitive lifecycle events such as:

* `checkout_initiated`
* `checkout_ready`
* `payment_processing_started`
* `checkout_closed`

The important boundary is that telemetry never contains raw card details or keystrokes.

---

# What I Would Explore Next

## 1. Production SDK Distribution

Build a standalone browser bundle that merchants can load directly:

```html
<script src="https://cdn.example.com/dodo-checkout.js"></script>
```

This would make the SDK usable without requiring merchants to bundle the TypeScript source themselves.

## 2. Dedicated Checkout Origin

Move the hosted checkout to a dedicated origin such as:

```text
https://checkout.example.com
```

This would create a stronger cross-origin boundary between merchant applications and the checkout.

## 3. Automated End-to-End Tests

Add Playwright coverage for:

* Successful payment
* Declined payment
* Transient failure + retry
* Double-click submission
* Checkout close behaviour
* Keyboard navigation
* Network failure/retry

## 4. Server-Signed Checkout Sessions

The current assignment intentionally works without a backend.

For production, I would move session creation to a merchant/server API and use server-signed checkout tokens rather than relying on client-generated session information.

This would also allow stronger server-side validation and payment authorization.

---

# Project Structure

```text
src/
├── sdk/
│   ├── dodo-checkout.ts
│   ├── messageProtocol.ts
│   ├── standalone.ts
│   └── standalone-entry.ts
│
├── checkout/
│   ├── App.tsx
│   ├── components/
│   ├── hooks/
│   ├── main.tsx
│   └── utils.ts
│
├── components/
│   ├── StoreTab
│   ├── DocsTab
│   ├── ArchitectureTab
│   ├── CallbackLogs
│   └── ...
│
├── hooks/
├── data/
├── lib/
├── App.tsx
└── main.tsx

index.html       → Merchant demo
checkout.html    → Hosted checkout
```

## Tech Stack

* TypeScript
* React
* Vite
* Tailwind CSS
* Motion
* iframe + `postMessage`

## Note

This is a frontend assignment implementation with simulated payments. No real payment processing or backend is involved.
