import React from 'react';
import { ShieldCheck, X } from 'lucide-react';

interface CheckoutHeaderProps {
  onClose: () => void;
}

export const CheckoutHeader: React.FC<CheckoutHeaderProps> = ({ onClose }) => {
  return (
    <header
      className="flex items-center justify-between px-4 sm:px-5 py-3 border-b sticky top-0 z-20 border-[var(--color-border)] bg-[var(--color-surface)]"
    >
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs bg-[var(--brand-primary)] text-[var(--brand-text)]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c0 .83-.67 1.5-1.5 1.5S10 17.33 10 16.5v-3c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v3zm3-7c0 .55-.45 1-1 1s-1-.45-1-1v-2c0-.55.45-1 1-1s1 .45 1 1v2zm-8 0c0 .55-.45 1-1 1s-1-.45-1-1v-2c0-.55.45-1 1-1s1 .45 1 1v2z" />
          </svg>
        </div>
        <span className="font-semibold text-xs tracking-tight text-[var(--color-text-primary)]">
          Dodo Payments
        </span>
        <span className="text-[10px] flex items-center gap-1 font-mono ml-1 text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          <span>Encrypted</span>
        </span>
      </div>

      <button
        onClick={onClose}
        className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors cursor-pointer text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--hover-surface)]"
        title="Close checkout"
        aria-label="Close checkout"
      >
        <X className="w-4 h-4" />
      </button>
    </header>
  );
};

export default CheckoutHeader;
