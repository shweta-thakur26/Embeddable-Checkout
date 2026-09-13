import React from 'react';
import { Lock, ArrowRight, ChevronDown, AlertCircle } from 'lucide-react';
import { COUNTRIES, CountryTaxRule } from '../utils';
import { CheckoutFinancials } from '../types';
import { CardBrandBadge } from './CardBrandBadge';

interface PaymentFormProps {
  formState: {
    email: string;
    setEmail: (v: string) => void;
    cardholderName: string;
    setCardholderName: (v: string) => void;
    cardNumber: string;
    cardExpiry: string;
    cardCvc: string;
    selectedCountry: CountryTaxRule;
    setSelectedCountry: (c: CountryTaxRule) => void;
    zipCode: string;
    cardBrand: 'visa' | 'mastercard' | 'amex' | 'discover' | 'card';
    cardTouched: boolean;
  };
  financials: CheckoutFinancials;
  errorMessage: string | null;
  isDark: boolean;
  refs: {
    emailInputRef: React.RefObject<HTMLInputElement>;
    cardNumberRef: React.RefObject<HTMLInputElement>;
    expiryRef: React.RefObject<HTMLInputElement>;
    cvcRef: React.RefObject<HTMLInputElement>;
    zipRef: React.RefObject<HTMLInputElement>;
  };
  handlers: {
    handleCardNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleExpiryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCvcChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleExpiryKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    handleCvcKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    handleZipCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handlePay: (e?: React.FormEvent) => void;
    applyTestCard: (number: string, cvc: string, exp: string) => void;
  };
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  formState,
  financials,
  errorMessage,
  isDark,
  refs,
  handlers,
}) => {
  const {
    email,
    setEmail,
    cardNumber,
    cardExpiry,
    cardCvc,
    selectedCountry,
    setSelectedCountry,
    zipCode,
    cardBrand,
  } = formState;

  const { currencySymbol, totalAmount } = financials;
  const { emailInputRef, cardNumberRef, expiryRef, cvcRef, zipRef } = refs;
  const {
    handleCardNumberChange,
    handleExpiryChange,
    handleCvcChange,
    handleExpiryKeyDown,
    handleCvcKeyDown,
    handleZipCodeChange,
    handlePay,
    applyTestCard,
  } = handlers;

  return (
    <form onSubmit={handlePay} className="space-y-3.5">
      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold text-rose-200 font-mono text-[11px]">
              Payment Authorization Failed
            </div>
            <p className="text-[11px] text-rose-300/90 mt-0.5 leading-relaxed">
              {errorMessage}
            </p>
          </div>
        </div>
      )}

      {/* Contact Email Field */}
      <div className="space-y-1">
        <label className="block text-xs font-medium text-[var(--color-text-primary)]">
          Email
        </label>
        <input
          ref={emailInputRef}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="founder@company.com"
          required
          className="w-full px-3 py-2 border rounded-lg text-xs transition-colors font-mono outline-none focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)] bg-[var(--color-surface-inset)] border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] shadow-xs"
        />
      </div>

      {/* Card Information Segmented Input */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-medium text-[var(--color-text-primary)]">
            Card Information
          </label>
          <div className="flex items-center gap-1 text-[10px] font-mono text-[var(--color-text-muted)]">
            <Lock className="w-2.5 h-2.5 text-emerald-500" />
            <span>Secure</span>
          </div>
        </div>

        <div className="rounded-lg border overflow-hidden focus-within:ring-2 focus-within:ring-[var(--brand-primary)]/30 focus-within:border-[var(--brand-primary)] transition-colors border-[var(--color-border)] bg-[var(--color-surface-inset)] shadow-xs">
          {/* Card Number Line */}
          <div className="flex items-center px-3 py-2 border-b border-[var(--color-border)]">
            <input
              ref={cardNumberRef}
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="Card number"
              className="w-full bg-transparent text-xs font-mono outline-none focus:outline-none focus-visible:outline-none text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]"
            />
            <div className="ml-2 shrink-0 flex items-center gap-1.5">
              <CardBrandBadge brand={cardBrand} />
            </div>
          </div>

          {/* Expiry and CVC Line */}
          <div className="grid grid-cols-2 divide-x divide-[var(--color-border)]">
            <div className="px-3 py-2">
              <input
                ref={expiryRef}
                type="text"
                inputMode="numeric"
                autoComplete="cc-exp"
                value={cardExpiry}
                onChange={handleExpiryChange}
                onKeyDown={handleExpiryKeyDown}
                placeholder="MM / YY"
                maxLength={5}
                className="w-full bg-transparent text-xs font-mono outline-none focus:outline-none focus-visible:outline-none text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]"
              />
            </div>
            <div className="px-3 py-2">
              <input
                ref={cvcRef}
                type="text"
                inputMode="numeric"
                autoComplete="cc-csc"
                value={cardCvc}
                onChange={handleCvcChange}
                onKeyDown={handleCvcKeyDown}
                placeholder="CVC"
                maxLength={4}
                className="w-full bg-transparent text-xs font-mono outline-none focus:outline-none focus-visible:outline-none text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Country & Postal / ZIP Code */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-[var(--color-text-primary)]">Country</label>
          <div className="relative">
            <select
              value={selectedCountry.code}
              onChange={(e) => {
                const found = COUNTRIES.find((c) => c.code === e.target.value);
                if (found) setSelectedCountry(found);
              }}
              className="w-full appearance-none px-3 py-2 border rounded-lg text-xs pr-8 transition-colors cursor-pointer outline-none focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)] bg-[var(--color-surface-inset)] border-[var(--color-border)] text-[var(--color-text-primary)] shadow-xs"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-[var(--color-surface)] text-[var(--color-text-primary)]">
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-[var(--color-text-primary)]">Postal / ZIP</label>
          <input
            ref={zipRef}
            type="text"
            maxLength={6}
            value={zipCode}
            onChange={handleZipCodeChange}
            placeholder="6 digits"
            className="w-full px-3 py-2 border rounded-lg text-xs transition-colors font-mono outline-none focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)] bg-[var(--color-surface-inset)] border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] shadow-xs"
          />
        </div>
      </div>

      {/* Submit Pay Button */}
      <div className="pt-1.5">
        <button
          type="submit"
          className="w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] active:scale-[0.99] bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] text-[var(--brand-text)] border border-[var(--brand-primary)] shadow-xs"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Pay {currencySymbol}{totalAmount.toFixed(2)}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick Minimal Test Card Pills */}
      <div className={`pt-2 border-t flex items-center justify-between ${isDark ? 'border-white/[0.06]' : 'border-slate-100'}`}>
        <span className={`text-[10px] font-mono ${isDark ? 'text-[#848B98]' : 'text-slate-400'}`}>
          Test card:
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => applyTestCard('4242424242424242', '123', '12/28')}
            className={`px-2 py-0.5 rounded text-[10px] font-mono border cursor-pointer transition-colors ${
              isDark
                ? 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-[#00D87D]'
                : 'bg-slate-50 hover:bg-emerald-50 border-slate-200 text-emerald-700'
            }`}
          >
            ✓ 4242 (Pass)
          </button>
          <button
            type="button"
            onClick={() => applyTestCard('4000000000000002', '123', '12/28')}
            className="px-2 py-0.5 rounded text-[10px] font-mono border cursor-pointer transition-colors bg-[var(--color-surface-inset)] hover:bg-[var(--hover-surface)] border-[var(--color-border)] text-rose-600 dark:text-rose-400"
          >
            ✕ 0002 (Decline)
          </button>
          <button
            type="button"
            onClick={() => applyTestCard('4000000000000341', '123', '12/28')}
            className="px-2 py-0.5 rounded text-[10px] font-mono border cursor-pointer transition-colors bg-[var(--color-surface-inset)] hover:bg-[var(--hover-surface)] border-[var(--color-border)] text-amber-700 dark:text-amber-400"
          >
            ↻ 0341 (Retry)
          </button>
        </div>
      </div>
    </form>
  );
};

export default PaymentForm;
