import React from 'react';
import { CheckCircle2, Copy, Check } from 'lucide-react';
import { PaymentSuccessResult } from '../../types';

interface SuccessViewProps {
  successData: PaymentSuccessResult;
  sessionId: string;
  currencySymbol: string;
  copiedSession: boolean;
  onCopySessionId: () => void;
  onReturnToMerchant: () => void;
}

export const SuccessView: React.FC<SuccessViewProps> = ({
  successData,
  sessionId,
  currencySymbol,
  copiedSession,
  onCopySessionId,
  onReturnToMerchant,
}) => {
  return (
    <div className="py-6 flex flex-col items-center text-center space-y-4">
      <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-xs bg-emerald-50 border border-emerald-200 text-emerald-600 dark:bg-emerald-950/60 dark:border-emerald-800/60 dark:text-emerald-400">
        <CheckCircle2 className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
          Payment Authorized
        </span>
        <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Transaction Complete</h3>
        <p className="text-xs text-[var(--color-text-secondary)]">
          Receipt dispatched to <strong className="font-mono text-[var(--color-text-primary)]">{successData.customerEmail}</strong>
        </p>
      </div>

      {/* Itemized Receipt Details */}
      <div className="w-full rounded-xl p-3.5 border text-left space-y-2 text-xs bg-[var(--color-surface)] border-[var(--color-border)] shadow-xs">
        <div className="flex items-center justify-between pb-1.5 border-b border-[var(--color-border)]">
          <span className="text-[var(--color-text-secondary)]">Session ID:</span>
          <button
            onClick={onCopySessionId}
            className="font-mono text-[11px] flex items-center gap-1 cursor-pointer hover:underline text-[var(--brand-primary)] font-semibold"
          >
            <span>{sessionId.slice(0, 16)}...</span>
            {copiedSession ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[var(--color-text-secondary)]">Amount Charged:</span>
          <span className="font-bold font-mono text-[var(--color-text-primary)]">
            {currencySymbol}{successData.amount.toFixed(2)} {successData.currency}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[var(--color-text-secondary)]">Payment Instrument:</span>
          <span className="font-mono uppercase text-[var(--color-text-primary)]">
            {successData.paymentMethod.brand} •••• {successData.paymentMethod.last4}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[var(--color-text-secondary)]">Tax Jurisdiction:</span>
          <span className="text-[var(--color-text-primary)]">{successData.country} (Remitted by Dodo MoR)</span>
        </div>
      </div>

      <div className="w-full space-y-2 pt-1">
        <button
          onClick={onReturnToMerchant}
          className="w-full py-2.5 px-3 rounded-xl font-bold text-xs transition-colors cursor-pointer bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] text-[var(--brand-text)] border border-[var(--brand-primary)] shadow-xs"
        >
          Return to Merchant Store
        </button>
      </div>
    </div>
  );
};

export default SuccessView;
