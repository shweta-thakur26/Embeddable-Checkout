import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggleTheme: () => void;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  isDark,
  onToggleTheme,
  className = '',
}) => {
  return (
    <button
      id="theme-toggle-btn"
      type="button"
      onClick={onToggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`min-h-[36px] min-w-[36px] p-2 rounded-lg border transition-colors cursor-pointer flex items-center justify-center focus-visible:outline-none ${
        isDark
          ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
          : 'bg-[var(--color-surface-inset)] border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--hover-surface)]'
      } ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 text-slate-700" />
      )}
    </button>
  );
};

export default ThemeToggle;
