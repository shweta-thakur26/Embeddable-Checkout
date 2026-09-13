/**
 * Dodo Payments - Embeddable Checkout Type Definitions
 */

export type BillingInterval = 'month' | 'year' | 'one-time';
export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'INR';
export type CheckoutMode = 'modal' | 'inline';
export type CheckoutTheme = 'light' | 'dark' | 'auto';

export interface Product {
  id: string;
  name: string;
  description: string;
  amount: number;
  currency: SupportedCurrency;
  interval: BillingInterval;
  features: string[];
  popular?: boolean;
  category: 'Subscription' | 'Usage / Add-on';
}

export interface PaymentSuccessResult {
  sessionId: string;
  productId: string;
  customerEmail: string;
  customerName?: string;
  amount: number;
  subtotal: number;
  taxAmount: number;
  taxRate: number;
  currency: SupportedCurrency;
  country: string;
  discountAmount?: number;
  paymentMethod: {
    brand: 'visa' | 'mastercard' | 'amex' | 'discover' | 'card';
    last4: string;
    expMonth: string;
    expYear: string;
  };
  receiptUrl?: string;
  timestamp: string;
}

export interface PaymentCloseData {
  reason:
    | 'user_closed'
    | 'backdrop_click'
    | 'completed'
    | 'cancelled'
    | 'escape_key';
}

export interface PaymentErrorData {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface DodoCheckoutOptions {
  productId: string;
  title?: string;
  amount?: number;
  currency?: SupportedCurrency;
  customerEmail?: string;
  customerName?: string;
  theme?: CheckoutTheme;
  themeColor?: string;
  /** Trusted origin hosting checkout.html. Defaults to the current origin for local/demo use. */
  checkoutOrigin?: string;
  mode?: CheckoutMode;
  container?: HTMLElement | string;
  metadata?: Record<string, unknown>;
  onSuccess: (result: PaymentSuccessResult) => void;
  onClose?: (data: PaymentCloseData) => void;
  onError?: (error: PaymentErrorData) => void;
  onEvent?: (event: { event: string; timestamp: string; payload?: unknown }) => void;
}

export type DodoPostMessageType =
  | 'DODO_CHECKOUT_INIT'
  | 'DODO_CHECKOUT_READY'
  | 'DODO_CHECKOUT_EVENT'
  | 'DODO_CHECKOUT_SUCCESS'
  | 'DODO_CHECKOUT_ERROR'
  | 'DODO_CHECKOUT_CLOSE'
  | 'DODO_CHECKOUT_REQUEST_CLOSE'
  | 'DODO_CHECKOUT_RESIZE';

export interface DodoPostMessage<T = unknown> {
  source: 'dodo-checkout-sdk' | 'dodo-checkout-app';
  type: DodoPostMessageType;
  protocolVersion?: string;
  sessionId: string;
  payload?: T;
}

export interface CallbackLogEntry {
  id: string;
  timestamp: string;
  type: 'onSuccess' | 'onClose' | 'onError' | 'onEvent' | 'webhook';
  title: string;
  payload: unknown;
  status: 'success' | 'error' | 'warning' | 'info';
}

export interface TestCard {
  number: string;
  formatted: string;
  label: string;
  behavior: 'success' | 'decline' | 'fail_then_succeed';
  description: string;
  cvc: string;
  exp: string;
}
