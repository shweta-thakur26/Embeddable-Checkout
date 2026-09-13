import React from 'react';
import { ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';
import { CallbackLogEntry } from '../types';

interface LogEntryItemProps {
  log: CallbackLogEntry;
  isExpanded: boolean;
  isDark: boolean;
  isCopied: boolean;
  onToggleExpand: (id: string) => void;
  onCopyPayload: (id: string, payload: unknown) => void;
}

export const LogEntryItem: React.FC<LogEntryItemProps> = ({
  log,
  isExpanded,
  isDark,
  isCopied,
  onToggleExpand,
  onCopyPayload,
}) => {
  return (
    <div className="py-2.5 first:pt-0 last:pb-0 space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <button
            onClick={() => onToggleExpand(log.id)}
            className={`p-1 cursor-pointer shrink-0 ${
              isDark ? 'text-slate-400 hover:text-white' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
            }`}
            aria-label={isExpanded ? 'Collapse log payload' : 'Expand log payload'}
          >
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Tag badge */}
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-wider shrink-0 whitespace-nowrap ${
              log.type === 'onSuccess'
                ? isDark
                  ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : log.type === 'onError'
                ? isDark
                  ? 'bg-rose-950/70 text-rose-300 border border-rose-800'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                : log.type === 'onClose'
                ? isDark
                  ? 'bg-amber-950/70 text-amber-300 border border-amber-800'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                : log.type === 'onEvent'
                ? isDark
                  ? 'bg-purple-950/70 text-purple-300 border border-purple-800'
                  : 'bg-purple-50 text-purple-700 border border-purple-200'
                : log.type === 'webhook'
                ? isDark
                  ? 'bg-blue-950/70 text-blue-300 border border-blue-800'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
                : isDark
                ? 'bg-slate-800 text-slate-300 border border-slate-700'
                : 'bg-[var(--color-surface-inset)] text-[var(--color-text-primary)] border border-[var(--color-border)]'
            }`}
          >
            {log.type === 'webhook' ? 'Webhook' : `${log.type}()`}
          </span>

          <span
            className={`font-medium text-xs whitespace-nowrap truncate min-w-0 ${
              isDark ? 'text-white' : 'text-[var(--color-text-primary)]'
            }`}
          >
            {log.title}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 pl-1">
          <span className={`text-[10px] font-mono hidden min-[480px]:inline ${isDark ? 'text-slate-500' : 'text-[var(--color-text-muted)]'}`}>
            {log.timestamp}
          </span>
          <button
            onClick={() => onCopyPayload(log.id, log.payload)}
            className={`min-h-[32px] min-w-[32px] p-1 rounded-md transition-colors cursor-pointer flex items-center justify-center ${
              isDark
                ? 'hover:bg-slate-800 text-slate-400 hover:text-white'
                : 'hover:bg-[var(--hover-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
            title="Copy payload JSON"
            aria-label="Copy payload JSON"
          >
            {isCopied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div
          className={`ml-5 rounded-lg p-2.5 sm:p-3 border overflow-x-auto text-[11px] leading-relaxed max-h-[280px] ${
            isDark
              ? 'bg-[#090C13] border-slate-800 text-slate-300'
              : 'bg-[var(--color-surface-inset)] border-[var(--color-border)] text-[var(--color-text-primary)]'
          }`}
        >
          <pre>{JSON.stringify(log.payload, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default LogEntryItem;
