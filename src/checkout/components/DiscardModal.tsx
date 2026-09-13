import React from 'react';
import { AlertCircle } from 'lucide-react';

interface DiscardModalProps {
  isOpen: boolean;
  onStay: () => void;
  onDiscard: () => void;
}

export const DiscardModal: React.FC<DiscardModalProps> = ({
  isOpen,
  onStay,
  onDiscard,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="border rounded-xl p-4 max-w-xs w-full space-y-3 text-center shadow-xl bg-[var(--color-surface)] border-[var(--color-border)]">
        <div className="w-8 h-8 rounded-full mx-auto flex items-center justify-center bg-[var(--hover-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)]">
          <AlertCircle className="w-4 h-4" />
        </div>
        <h4 className="font-bold text-xs uppercase tracking-wider font-mono text-[var(--color-text-primary)]">
          Discard Payment?
        </h4>
        <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">
          Billing details have been entered. If closed now, checkout progress will not be preserved.
        </p>
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={onStay}
            className="flex-1 py-1.5 px-3 font-bold text-xs rounded-lg transition-colors cursor-pointer bg-[var(--brand-primary)] text-[var(--brand-text)] hover:bg-[var(--brand-hover)]"
          >
            Stay
          </button>
          <button
            onClick={onDiscard}
            className="flex-1 py-1.5 px-3 font-semibold text-xs rounded-lg transition-colors cursor-pointer border bg-[var(--color-surface-inset)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--hover-surface)] border-[var(--color-border)]"
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscardModal;
