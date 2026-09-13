import { DodoCheckoutSDK } from './dodo-checkout';

export const DodoCheckout = DodoCheckoutSDK;

export { DodoCheckoutSDK };

export type { CheckoutHandle } from './dodo-checkout';

export * from '../types';

declare global {
  interface Window {
    DodoCheckout: typeof DodoCheckoutSDK;
  }
}

if (typeof window !== 'undefined') {
  window.DodoCheckout = DodoCheckoutSDK;
}