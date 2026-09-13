import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface FooterProps {
  isDark: boolean;
  setActiveTab: (tab: 'store' | 'docs' | 'architecture') => void;
}

export function Footer({ isDark, setActiveTab }: FooterProps) {
  return (
    <footer
      className={`border-t py-5 text-xs mt-10 transition-colors duration-300 ${
        isDark
          ? 'border-slate-800 bg-[#0B0E17] text-slate-400'
          : 'border-slate-200 bg-white text-slate-500'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
          <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Dodo Payments Checkout SDK
          </span>
          <span className="hidden sm:inline">&bull;</span>
          <span className="block sm:inline w-full sm:w-auto">Global Merchant of Record Infrastructure</span>
        </div>
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-4 text-[11px]">
          <span
            className={`flex items-center gap-1 font-mono ${
              isDark ? 'text-emerald-400' : 'text-emerald-700'
            }`}
          >
            <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
            <span>Zero-Redirect Embed</span>
          </span>
          <span>&bull;</span>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`font-mono cursor-pointer min-h-[36px] sm:min-h-0 flex items-center hover:underline ${
              isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Architecture &amp; System Decisions
          </button>
        </div>
      </div>
    </footer>
  );
}
