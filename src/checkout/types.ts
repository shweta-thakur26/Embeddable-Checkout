import { Product, PaymentSuccessResult, SupportedCurrency } from '../types';
import { CountryTaxRule } from './utils';

export type CheckoutStage = 'form' | 'processing' | 'success' | 'error';

export interface AppliedPromo {
  code: string;
  discountRate: number;
  fixedOff?: number;
}

export interface CheckoutFinancials {
  currencySymbol: string;
  subtotal: number;
  discount: number;
  taxableAmount: number;
  taxAmount: number;
  totalAmount: number;
}

export interface CheckoutSessionData {
  sessionId: string;
  productId: string;
  product: Product;
  isDark: boolean;
  parentOrigin: string;
  initialEmail: string;
  initialName: string;
}
