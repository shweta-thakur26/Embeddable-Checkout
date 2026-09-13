import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const CheckoutFooter: React.FC = () => {
  return (
    <footer
      className="px-5 py-2.5 border-t text-[11px] flex items-center justify-between border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)]"
    >
      <div className="flex items-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span className="text-[var(--color-text-secondary)] font-medium">
          Dodo Payments &bull; Merchant of Record
        </span>
      </div>
      <div className="font-mono text-[10px] text-[var(--color-text-muted)]">
        MoR Protocol v2.4
      </div>
    </footer>
  );
};

export default CheckoutFooter;
