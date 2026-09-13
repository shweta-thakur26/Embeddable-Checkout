import React from 'react';
import { motion } from 'motion/react';
import { Terminal } from 'lucide-react';

interface TestScenarioProps {
  logsLength: number;
}

export function TestScenariosCard({ logsLength }: TestScenarioProps) {
  return (
    <div className="fintech-card rounded-xl p-4 sm:p-5 space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b theme-border">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full theme-accent-bg animate-pulse" />
          <h3 className="font-bold text-xs uppercase tracking-wider font-mono theme-text-primary">
            Assignment Test Cards Reference
          </h3>
        </div>
        <button
          onClick={() => {
            const el = document.getElementById('callback-logs-panel');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="text-xs theme-text-secondary hover:opacity-80 font-mono flex items-center gap-1.5 cursor-pointer underline underline-offset-4 transition-colors"
        >
          <Terminal className="w-3.5 h-3.5 theme-accent" />
          <span>Jump to Live Callback Logs ({logsLength})</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {/* Scenario 1 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="group p-4 rounded-xl border border-[var(--color-border)] bg-transparent hover:bg-[var(--color-surface-subtle)] hover:border-[var(--color-border-strong)] transition-all duration-300 cursor-default flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] shadow-[0_0_6px_var(--color-success)]" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest theme-text-primary">Succeeds</span>
              </div>
              <span className="text-[10px] font-mono theme-text-muted">CVV 123</span>
            </div>
            <div className="font-mono text-sm font-bold theme-text-primary tracking-[0.15em] mb-2">
              4242 4242 4242 4242
            </div>
          </div>
          <p className="text-[11px] theme-text-secondary leading-relaxed">
            Instant auth &rarr; fires <code className="font-mono text-[10px] font-semibold text-[var(--color-text-primary)]">onSuccess</code>
          </p>
        </motion.div>

        {/* Scenario 2 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="group p-4 rounded-xl border border-[var(--color-border)] bg-transparent hover:bg-[var(--color-surface-subtle)] hover:border-[var(--color-border-strong)] transition-all duration-300 cursor-default flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-danger)] shadow-[0_0_6px_var(--color-danger)]" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest theme-text-primary">Declines</span>
              </div>
              <span className="text-[10px] font-mono theme-text-muted">CVV 123</span>
            </div>
            <div className="font-mono text-sm font-bold theme-text-primary tracking-[0.15em] mb-2">
              4000 0000 0000 0002
            </div>
          </div>
          <p className="text-[11px] theme-text-secondary leading-relaxed">
            Issuer decline &rarr; fires <code className="font-mono text-[10px] font-semibold text-[var(--color-text-primary)]">onError</code>
          </p>
        </motion.div>

        {/* Scenario 3 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="group p-4 rounded-xl border border-[var(--color-border)] bg-transparent hover:bg-[var(--color-surface-subtle)] hover:border-[var(--color-border-strong)] transition-all duration-300 cursor-default flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-warning)] shadow-[0_0_6px_var(--color-warning)]" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest theme-text-primary">Fail &rarr; Retry</span>
              </div>
              <span className="text-[10px] font-mono theme-text-muted">CVV 123</span>
            </div>
            <div className="font-mono text-sm font-bold theme-text-primary tracking-[0.15em] mb-2">
              4000 0000 0000 0341
            </div>
          </div>
          <p className="text-[11px] theme-text-secondary leading-relaxed">
            Fails once, 1-click retry routes to second gateway
          </p>
        </motion.div>
      </div>
    </div>
  );
}
