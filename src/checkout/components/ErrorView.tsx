import React from 'react';
import { AlertCircle, Info, RefreshCw } from 'lucide-react';

interface ErrorViewProps {
  errorCode: string;
  errorMessage: string | null;
  onRetryPayment: () => void;
  onEditCardDetails: () => void;
  onCancel: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({
  errorCode,
  errorMessage,
  onRetryPayment,
  onEditCardDetails,
  onCancel,
}) => {
  return (
    <div className="py-6 flex flex-col items-center text-center space-y-4">
      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-rose-50 border border-rose-200 text-rose-600 dark:bg-rose-950/80 dark:border-rose-800/60 dark:text-rose-400">
        <AlertCircle className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 font-semibold">
          {errorCode || 'Authorization Declined'}
        </span>
        <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Payment Declined</h3>
        <p className="text-xs max-w-xs leading-relaxed text-[var(--color-text-secondary)]">
          {errorMessage}
        </p>
      </div>

      {/* Error Diagnosis Card */}
      <div className="w-full rounded-xl p-3 border text-left space-y-1.5 text-xs bg-[var(--color-surface)] border-[var(--color-border)] shadow-xs">
        <div className="font-medium flex items-center gap-1.5 font-mono text-[11px] text-[var(--color-text-primary)]">
          <Info className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
          <span>Next Step Recommendation:</span>
        </div>
        {errorCode === 'GATEWAY_TIMEOUT_TRANSIENT' ? (
          <p className="text-[11px] leading-relaxed text-[var(--color-text-secondary)]">
            The initial connection timed out on primary route. Dodo failover processor is primed. Clicking{' '}
            <strong>Retry Payment</strong> will route through secondary gateway.
          </p>
        ) : (
          <p className="text-[11px] leading-relaxed text-[var(--color-text-secondary)]">
            The issuing bank declined authorization. You may use test card{' '}
            <code className="font-mono text-[var(--color-text-primary)] font-semibold">
              4242 4242 4242 4242
            </code>{' '}
            to proceed.
          </p>
        )}
      </div>

      <div className="w-full space-y-2 pt-1">
        {errorCode === 'GATEWAY_TIMEOUT_TRANSIENT' ? (
          <>
            <button
              onClick={onRetryPayment}
              className="w-full py-2.5 px-3 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] text-[var(--brand-text)] border border-[var(--brand-primary)] shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Payment Now (Secondary Gateway)</span>
            </button>

            <button
              onClick={onEditCardDetails}
              className="w-full py-2 px-3 rounded-xl font-medium text-xs transition-colors border cursor-pointer bg-[var(--color-surface-inset)] hover:bg-[var(--hover-surface)] border-[var(--color-border)] text-[var(--color-text-primary)]"
            >
              Edit Card Details
            </button>
          </>
        ) : (
          <button
            onClick={onEditCardDetails}
            className="w-full py-2.5 px-3 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] text-[var(--brand-text)] border border-[var(--brand-primary)] shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Another Card</span>
          </button>
        )}

        <button
          onClick={onCancel}
          className="w-full py-1.5 text-xs transition-colors cursor-pointer text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
        >
          Cancel and return
        </button>
      </div>
    </div>
  );
};

export default ErrorView;
