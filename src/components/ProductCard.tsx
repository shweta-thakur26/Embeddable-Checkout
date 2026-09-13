import React from 'react';
import { Check, Lock, ArrowUpRight } from 'lucide-react';
import { Product } from '../types';
import { cn } from '../lib/utils';

interface ProductCardProps {
  product: Product;
  onBuy: (product: Product) => void;
  isLoading?: boolean;
  onHoverChange?: (isHovered: boolean) => void;
  isDark?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onBuy,
  isLoading,
  onHoverChange,
  isDark = false,
}) => {
  return (
    <div
      id={`product-card-${product.id}`}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      onFocus={() => onHoverChange?.(true)}
      onBlur={() => onHoverChange?.(false)}
      className={cn(
        'relative rounded-xl border transition-all duration-300 flex flex-col justify-between p-5',
        isDark ? 'bg-[#121620] text-white' : 'bg-[var(--color-surface)] text-[var(--color-text-primary)]',
        product.popular
          ? 'border-[var(--brand-primary)] ring-1 ring-[var(--brand-primary)] shadow-md'
          : isDark
          ? 'border-slate-800 hover:border-slate-700 shadow-[0_1px_3px_0_rgba(0,0,0,0.3)] hover:shadow-md'
          : 'border-[var(--color-border)] hover:border-[var(--color-border-strong)] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] hover:shadow-md'
      )}
    >
      {product.popular && (
        <div
          className="absolute -top-2.5 right-4 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono shadow-xs border border-[var(--brand-primary)]"
          style={{
            backgroundColor: 'var(--brand-primary)',
            color: 'var(--brand-text)',
          }}
        >
          Recommended
        </div>
      )}

      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <span
              className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${
                isDark ? 'text-slate-400' : 'text-[var(--color-text-muted)]'
              }`}
            >
              {product.category}
            </span>
            <h3
              className={`text-base font-bold mt-0.5 tracking-tight ${
                isDark ? 'text-white' : 'text-[var(--color-text-primary)]'
              }`}
            >
              {product.name}
            </h3>
          </div>
          <div className="text-right shrink-0">
            <span
              className={`text-xl font-bold font-display tracking-tight ${
                isDark ? 'text-white' : 'text-[var(--color-text-primary)]'
              }`}
            >
              ${product.amount.toFixed(2)}
            </span>
            <span
              className={`text-[11px] block font-mono ${
                isDark ? 'text-slate-400' : 'text-[var(--color-text-muted)]'
              }`}
            >
              {product.interval !== 'one-time' ? '/ mo' : 'one-time'}
            </span>
          </div>
        </div>

        <p
          className={`text-xs mt-2 leading-relaxed ${
            isDark ? 'text-slate-300' : 'text-[var(--color-text-secondary)]'
          }`}
        >
          {product.description}
        </p>

        <div
          className={`mt-4 space-y-1.5 border-t pt-3 ${
            isDark ? 'border-slate-800' : 'border-[var(--color-border)]'
          }`}
        >
          <span
            className={`text-[10px] font-medium uppercase tracking-wider font-mono block ${
              isDark ? 'text-slate-400' : 'text-[var(--color-text-muted)]'
            }`}
          >
            Plan Inclusions:
          </span>
          {product.features.map((feature, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2 text-xs ${
                isDark ? 'text-slate-300' : 'text-[var(--color-text-secondary)]'
              }`}
            >
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span className="leading-snug">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`mt-5 pt-3 border-t ${
          isDark ? 'border-slate-800' : 'border-[var(--color-border)]'
        }`}
      >
        <button
          id={`buy-btn-${product.id}`}
          onClick={() => onBuy(product)}
          disabled={isLoading}
          className={cn(
            'w-full min-h-[44px] py-2.5 px-3 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed',
            product.popular
              ? 'btn-primary'
              : isDark
              ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              : 'btn-secondary'
          )}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Checkout with Dodo</span>
          <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

