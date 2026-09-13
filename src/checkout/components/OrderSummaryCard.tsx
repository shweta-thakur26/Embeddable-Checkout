import React from 'react';
import { Tag } from 'lucide-react';
import { Product } from '../../types';
import { AppliedPromo, CheckoutFinancials } from '../types';

interface OrderSummaryCardProps {
  product: Product;
  financials: CheckoutFinancials;
  promoState: {
    showPromoInput: boolean;
    setShowPromoInput: (show: boolean) => void;
    promoCode: string;
    setPromoCode: (code: string) => void;
    appliedPromo: AppliedPromo | null;
    promoError: string | null;
    handleApplyPromo: (e: React.FormEvent) => void;
  };
}

export const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  product,
  financials,
  promoState,
}) => {
  const { currencySymbol, totalAmount, taxAmount, discount } = financials;
  const {
    showPromoInput,
    setShowPromoInput,
    promoCode,
    setPromoCode,
    appliedPromo,
    promoError,
    handleApplyPromo,
  } = promoState;

  return (
    <div className="p-3 rounded-xl border bg-[var(--color-surface)] border-[var(--color-border)] shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-sm tracking-tight text-[var(--color-text-primary)]">
            {product.name}
          </h2>
          <p className="text-[11px] text-[var(--color-text-muted)]">
            {product.interval === 'one-time' ? 'One-time payment' : 'Billed monthly'}
          </p>
        </div>
        <div className="text-right">
          <div className="text-base font-bold font-mono text-[var(--color-text-primary)]">
            {currencySymbol}{totalAmount.toFixed(2)}
          </div>
          {taxAmount > 0 && (
            <div className="text-[10px] font-mono text-[var(--color-text-muted)]">
              +{currencySymbol}{taxAmount.toFixed(2)} tax
            </div>
          )}
        </div>
      </div>

      {/* Promo Code Toggle */}
      {!appliedPromo ? (
        <div className="pt-2 mt-2 border-t border-[var(--color-border)]">
          {!showPromoInput ? (
            <button
              type="button"
              onClick={() => setShowPromoInput(true)}
              className="text-[11px] font-mono flex items-center gap-1 transition-colors cursor-pointer text-[var(--color-text-secondary)] hover:text-[var(--brand-primary)]"
            >
              <Tag className="w-3 h-3" />
              <span>Have a promo code?</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="e.g. LAUNCH20"
                className="border rounded-lg px-2.5 py-1 text-xs uppercase flex-1 outline-none focus:outline-none focus-visible:outline-none font-mono bg-[var(--color-surface-inset)] border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--brand-primary)]"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                className="px-2.5 py-1 font-mono text-xs rounded-lg transition-colors cursor-pointer border bg-[var(--color-surface-inset)] hover:bg-[var(--hover-surface)] text-[var(--color-text-primary)] border-[var(--color-border)]"
              >
                Apply
              </button>
            </div>
          )}
          {promoError && (
            <p className="text-[11px] text-rose-500 mt-1 font-mono">{promoError}</p>
          )}
        </div>
      ) : (
        <div className="pt-2 mt-2 border-t border-[var(--color-border)] flex items-center justify-between text-xs text-emerald-600">
          <span className="flex items-center gap-1">
            <Tag className="w-3 h-3" />
            <span>Coupon ({appliedPromo.code})</span>
          </span>
          <span className="font-mono">-{currencySymbol}{discount.toFixed(2)}</span>
        </div>
      )}
    </div>
  );
};

export default OrderSummaryCard;
