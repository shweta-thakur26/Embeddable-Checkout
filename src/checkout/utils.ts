/**
 * Card Formatting and Validation Utilities
 */

export interface CountryTaxRule {
  code: string;
  name: string;
  flag: string;
  taxRate: number; // e.g. 0.20 for 20% VAT
  taxName: string; // e.g. 'VAT', 'MwSt', 'GST', 'Sales Tax'
}

export const COUNTRIES: CountryTaxRule[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸', taxRate: 0.0825, taxName: 'Sales Tax' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', taxRate: 0.20, taxName: 'VAT' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', taxRate: 0.19, taxName: 'MwSt' },
  { code: 'FR', name: 'France', flag: '🇫🇷', taxRate: 0.20, taxName: 'TVA' },
  { code: 'IN', name: 'India', flag: '🇮🇳', taxRate: 0.18, taxName: 'GST' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', taxRate: 0.13, taxName: 'HST' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', taxRate: 0.10, taxName: 'GST' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', taxRate: 0.09, taxName: 'GST' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', taxRate: 0.10, taxName: 'Consumption Tax' },
];

export function getCurrencySymbol(currency: string = 'USD'): string {
  switch (currency.toUpperCase()) {
    case 'EUR': return '€';
    case 'GBP': return '£';
    case 'INR': return '₹';
    case 'JPY': return '¥';
    case 'USD':
    default:
      return '$';
  }
}

export function formatCardNumber(value: string): string {
  const cleaned = value.replace(/\D/g, '').slice(0, 16);
  const parts = [];
  for (let i = 0; i < cleaned.length; i += 4) {
    parts.push(cleaned.slice(i, i + 4));
  }
  return parts.join(' ');
}

export function formatExpiry(value: string): string {
  const cleaned = value.replace(/\D/g, '').slice(0, 4);
  if (cleaned.length >= 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  }
  return cleaned;
}

export function detectCardBrand(number: string): 'visa' | 'mastercard' | 'amex' | 'discover' | 'card' {
  const clean = number.replace(/\D/g, '');
  if (/^4/.test(clean)) return 'visa';
  if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)/.test(clean)) return 'mastercard';
  if (/^3[47]/.test(clean)) return 'amex';
  if (/^6(?:011|5)/.test(clean)) return 'discover';
  return 'card';
}

export function luhnCheck(num: string): boolean {
  const clean = num.replace(/\D/g, '');
  if (clean.length < 13) return false;
  let sum = 0;
  let isEven = false;
  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean.charAt(i), 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  return sum % 10 === 0;
}

