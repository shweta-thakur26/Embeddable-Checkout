import React from 'react';
import { Lock } from 'lucide-react';

interface ProcessingViewProps {
  processingMessage: string;
  processingStep: 1 | 2 | 3;
}

export const ProcessingView: React.FC<ProcessingViewProps> = ({
  processingMessage,
  processingStep,
}) => {
  return (
    <div className="py-12 flex flex-col items-center justify-center text-center space-y-5">
      {/* Animated Ring Spinner */}
      <div className="relative">
        <div
          className="w-12 h-12 rounded-full border-2 animate-spin border-[var(--color-border)] border-t-[var(--brand-primary)]"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Lock className="w-4 h-4 text-[var(--brand-primary)]" />
        </div>
      </div>

      <div className="space-y-1.5 max-w-xs">
        <h3 className="font-bold text-sm font-mono uppercase tracking-wider text-[var(--color-text-primary)]">
          Authorizing Transaction
        </h3>
        <p className="text-xs min-h-[32px] leading-relaxed text-[var(--color-text-secondary)]">
          {processingMessage}
        </p>
      </div>

      {/* Stepped indicators */}
      <div className="flex items-center gap-2 pt-1">
        <div
          className={`w-2 h-2 rounded-full transition-colors ${
            processingStep >= 1 ? 'bg-[var(--brand-primary)]' : 'bg-[var(--color-border)]'
          }`}
        />
        <div
          className={`w-6 h-0.5 transition-colors ${
            processingStep >= 2 ? 'bg-[var(--brand-primary)]' : 'bg-[var(--color-border)]'
          }`}
        />
        <div
          className={`w-2 h-2 rounded-full transition-colors ${
            processingStep >= 2 ? 'bg-[var(--brand-primary)]' : 'bg-[var(--color-border)]'
          }`}
        />
        <div
          className={`w-6 h-0.5 transition-colors ${
            processingStep >= 3 ? 'bg-[var(--brand-primary)]' : 'bg-[var(--color-border)]'
          }`}
        />
        <div
          className={`w-2 h-2 rounded-full transition-colors ${
            processingStep >= 3 ? 'bg-[var(--brand-primary)]' : 'bg-[var(--color-border)]'
          }`}
        />
      </div>

      <div className="text-[10px] font-mono text-[var(--color-text-muted)]">
        Do not refresh or close this view &bull; PCI Isolated
      </div>
    </div>
  );
};

export default ProcessingView;
