import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../lib/utils';

export interface StatCardProps {
  label: string;
  value: string;
  subtext?: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  meta?: string;
  icon?: LucideIcon;
  badge?: {
    text: string;
    variant?: 'emerald' | 'amber' | 'neutral';
  };
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  change,
  trend,
  meta,
  icon: Icon,
  badge,
  className,
}) => {
  const displaySubtext = subtext || meta || '';
  const displayBadgeText = badge?.text || change;
  const badgeVariant =
    badge?.variant ||
    (trend === 'up' ? 'emerald' : trend === 'down' ? 'amber' : 'neutral');

  return (
    <div
      className={cn(
        'fintech-card fintech-card-hover rounded-xl p-4 sm:p-5 flex flex-col justify-between border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--brand-primary)] transition-all',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <span className="text-[11px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider font-mono">
            {label}
          </span>
          <div className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] font-display tracking-tight">
            {value}
          </div>
        </div>
        {Icon && typeof Icon === 'function' ? (
          <div className="w-8 h-8 rounded-lg bg-[var(--color-surface-inset)] border border-[var(--color-border)] text-[var(--color-text-primary)] flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4" />
          </div>
        ) : trend ? (
          <div
            className={cn(
              'w-8 h-8 rounded-lg border flex items-center justify-center shrink-0',
              trend === 'up' && 'bg-emerald-50 border-emerald-200 text-emerald-600',
              trend === 'down' && 'bg-amber-50 border-amber-200 text-amber-600',
              trend === 'neutral' && 'bg-[var(--color-surface-inset)] border-[var(--color-border)] text-[var(--color-text-secondary)]'
            )}
          >
            {trend === 'up' && <TrendingUp className="w-4 h-4" />}
            {trend === 'down' && <TrendingDown className="w-4 h-4" />}
            {trend === 'neutral' && <Minus className="w-4 h-4" />}
          </div>
        ) : null}
      </div>

      {(displaySubtext || displayBadgeText) && (
        <div className="mt-3 pt-2.5 border-t border-[var(--color-border)] flex items-center justify-between text-xs">
          <span className="text-[var(--color-text-secondary)] truncate mr-2">{displaySubtext}</span>
          {displayBadgeText && (
            <span
              className={cn(
                'px-2 py-0.5 rounded-md text-[10px] font-mono font-medium shrink-0',
                badgeVariant === 'emerald' &&
                  'bg-emerald-50 text-emerald-700 border border-emerald-200/70',
                badgeVariant === 'amber' &&
                  'bg-amber-50 text-amber-700 border border-amber-200/70',
                badgeVariant === 'neutral' &&
                  'bg-[var(--color-surface-inset)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'
              )}
            >
              {displayBadgeText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
