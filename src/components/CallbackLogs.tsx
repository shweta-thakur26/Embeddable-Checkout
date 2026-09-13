import React, { useState } from 'react';
import { Terminal, Trash2, Download, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { CallbackLogEntry } from '../types';
import { LogEntryItem } from './LogEntryItem';

interface CallbackLogsProps {
  logs: CallbackLogEntry[];
  onClear: () => void;
  isDark?: boolean;
}

export const CallbackLogs: React.FC<CallbackLogsProps> = ({ logs, onClear, isDark = false }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'onSuccess' | 'onClose' | 'onError' | 'onEvent' | 'webhook'>('all');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true;
    return log.type === filter;
  });

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyPayload = (id: string, payload: unknown) => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const exportAllLogs = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `dodo_telemetry_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div
      id="callback-logs-panel"
      className={`rounded-xl overflow-hidden border transition-colors duration-300 ${
        isDark
          ? 'bg-[#121620] border-slate-800 shadow-[0_1px_3px_0_rgba(0,0,0,0.3)]'
          : 'bg-[var(--color-surface)] border-[var(--color-border)] shadow-xs'
      }`}
    >
      {/* Header */}
      <div
        className={`p-3.5 sm:p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isDark ? 'border-slate-800 bg-[#121620]' : 'border-[var(--color-border)] bg-[var(--color-surface)]'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-emerald-400'
                : 'bg-[var(--color-surface-inset)] border-[var(--color-border)] text-[var(--color-text-primary)]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3
                className={`font-bold text-xs uppercase tracking-wider font-mono truncate ${
                  isDark ? 'text-white' : 'text-[var(--color-text-primary)]'
                }`}
              >
                SDK Callback Log (Live Firing)
              </h3>
              <span className="flex h-1.5 w-1.5 relative shrink-0">
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 animate-pulse"></span>
              </span>
            </div>
            <motion.p 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
              className="text-[11px] truncate theme-text-secondary mt-0.5 tracking-wide"
            >
              Visible real-time telemetry (<code className="font-mono text-[10px] bg-[var(--color-surface-subtle)] px-1 py-0.5 rounded border border-[var(--color-border)] theme-text-primary">onSuccess</code>, <code className="font-mono text-[10px] bg-[var(--color-surface-subtle)] px-1 py-0.5 rounded border border-[var(--color-border)] theme-text-primary">onClose</code>, <code className="font-mono text-[10px] bg-[var(--color-surface-subtle)] px-1 py-0.5 rounded border border-[var(--color-border)] theme-text-primary">onError</code>).
            </motion.p>
          </div>
        </div>

        {/* Controls Bar with responsive horizontal scroll on mobile */}
        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center p-1 rounded-lg fintech-inset shrink-0 relative">
            {(['all', 'onSuccess', 'onError', 'onClose', 'onEvent', 'webhook'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`relative z-10 min-h-[32px] px-2 sm:px-2.5 py-1 rounded-md text-[10px] font-mono font-bold transition-colors cursor-pointer focus-visible:outline-none shrink-0 ${
                  filter === f ? 'theme-text-primary' : 'theme-text-secondary hover:theme-text-primary'
                }`}
              >
                {filter === f && (
                  <motion.div
                    layoutId="log-filter-indicator"
                    className="absolute inset-0 theme-surface rounded-md shadow-sm border theme-border"
                    style={{ zIndex: -1 }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{f === 'webhook' ? 'Webhooks' : f}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={exportAllLogs}
              disabled={logs.length === 0}
              className={`min-h-[36px] min-w-[36px] p-2 rounded-lg border disabled:opacity-30 transition-colors cursor-pointer flex items-center justify-center ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white'
                  : 'bg-[var(--color-surface-inset)] hover:bg-[var(--hover-surface)] border-[var(--color-border)] text-[var(--color-text-primary)]'
              }`}
              title="Export telemetry logs as JSON"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClear}
              disabled={logs.length === 0}
              className={`min-h-[36px] min-w-[36px] p-2 rounded-lg border disabled:opacity-30 transition-colors cursor-pointer flex items-center justify-center ${
                isDark
                  ? 'bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 border-slate-700 text-slate-300'
                  : 'bg-[var(--color-surface-inset)] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 border-[var(--color-border)] text-[var(--color-text-primary)]'
              }`}
              title="Clear all telemetry entries"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Logs View */}
      <div
        className={`p-3 divide-y max-h-[420px] overflow-y-auto font-mono text-xs ${
          isDark
            ? 'divide-slate-800/80 bg-[#0E121B]'
            : 'divide-[var(--color-border)] bg-[var(--color-surface)]'
        }`}
      >
        {filteredLogs.length === 0 ? (
          <div className="py-10 text-center space-y-1.5 px-4">
            <Info className={`w-6 h-6 mx-auto ${isDark ? 'text-slate-600' : 'text-[var(--color-text-muted)]'}`} />
            <p className={`text-xs font-sans font-medium ${isDark ? 'text-slate-300' : 'text-[var(--color-text-primary)]'}`}>
              Telemetry feed listening &mdash; no entries recorded yet
            </p>
            <p className={`text-[11px] font-sans max-w-sm mx-auto ${isDark ? 'text-slate-500' : 'text-[var(--color-text-secondary)]'}`}>
              Click &quot;Buy&quot; on any product above to trigger real-time lifecycle callbacks (<code className="font-mono">onSuccess</code>, <code className="font-mono">onClose</code>, <code className="font-mono">onError</code>).
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <LogEntryItem
              key={log.id}
              log={log}
              isExpanded={expandedIds[log.id] ?? true}
              isDark={isDark}
              isCopied={copiedId === log.id}
              onToggleExpand={toggleExpand}
              onCopyPayload={copyPayload}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CallbackLogs;
