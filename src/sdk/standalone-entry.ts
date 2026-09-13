import { DodoCheckoutSDK } from './dodo-checkout';

export type { CheckoutHandle } from './dodo-checkout';
export type { DodoCheckoutOptions, PaymentErrorData, PaymentCloseData, PaymentSuccessResult } from '../types';

if (typeof window !== 'undefined') {
  window.DodoCheckout = DodoCheckoutSDK;
}

export default DodoCheckoutSDK;
