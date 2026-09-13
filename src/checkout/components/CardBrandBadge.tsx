import React from 'react';
import { CreditCard } from 'lucide-react';

interface CardBrandBadgeProps {
  brand: 'visa' | 'mastercard' | 'amex' | 'discover' | 'card';
}

export const CardBrandBadge: React.FC<CardBrandBadgeProps> = ({ brand }) => {
  switch (brand) {
    case 'visa':
      return (
        <span className="px-1.5 py-0.5 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30 text-[10px] font-black tracking-wider">
          VISA
        </span>
      );
    case 'mastercard':
      return (
        <span className="px-1.5 py-0.5 rounded bg-orange-600/20 text-orange-400 border border-orange-500/30 text-[10px] font-black tracking-wider">
          MC
        </span>
      );
    case 'amex':
      return (
        <span className="px-1.5 py-0.5 rounded bg-teal-600/20 text-teal-400 border border-teal-500/30 text-[10px] font-black tracking-wider">
          AMEX
        </span>
      );
    case 'discover':
      return (
        <span className="px-1.5 py-0.5 rounded bg-amber-600/20 text-amber-400 border border-amber-500/30 text-[10px] font-black tracking-wider">
          DISC
        </span>
      );
    default:
      return <CreditCard className="w-4 h-4 text-[var(--color-text-muted)]" />;
  }
};

export default CardBrandBadge;
