import React, { useState, useEffect, useRef } from 'react';
import { Layers, Terminal, BookOpen, Menu, X, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  activeTab: 'store' | 'docs' | 'architecture';
  setActiveTab: (tab: 'store' | 'docs' | 'architecture') => void;
  logCount: number;
  themeMode: 'light' | 'dark' | 'auto';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  logCount,
  themeMode,
  onToggleTheme,
}) => {
  const isDark = themeMode === 'dark';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isMobileMenuOpen) setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  // Close mobile menu if window resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  const handleTabSelect = (tab: 'store' | 'docs' | 'architecture') => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    {
      id: 'store' as const,
      label: 'Demo Store',
      description: 'Interactive SaaS billing & checkout flow',
      icon: Layers,
      count: logCount,
    },
    {
      id: 'docs' as const,
      label: 'Integration Code',
      description: 'Zero-redirect drop-in SDK code & usage',
      icon: Terminal,
    },
    {
      id: 'architecture' as const,
      label: 'Architecture',
      description: 'System design, IPC protocol & decision review',
      icon: BookOpen,
    },
  ];

  return (
    <header
      id="main-navbar"
      ref={menuRef}
      className={`sticky top-0 z-40 w-full transition-colors duration-200 border-b backdrop-blur-md ${
        isDark
          ? 'bg-[#080B11]/90 border-slate-800/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)]'
          : 'bg-white/90 border-[var(--color-border)] shadow-[0_2px_12px_-2px_rgba(0,0,0,0.03)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-3">
          
          {/* Left: Minimal Brand Identity with dynamic theme accent */}
          <button
            onClick={() => handleTabSelect('store')}
            className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer group focus-visible:outline-none"
            aria-label="Dodo Payments Home"
          >
            <div className="flex items-center justify-center transition-all shrink-0">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 sm:w-8 sm:h-8">
                <rect x="0.3" y="0.3" width="29.4" height="29.4" rx="14.7" fill="#C6FE1E"/>
                <rect x="0.3" y="0.3" width="29.4" height="29.4" rx="14.7" stroke="#B3E910" strokeWidth="0.6"/>
                <mask id="dodo-mask" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="5" y="8" width="20" height="15">
                  <path d="M24.0038 8H5.99805V23H24.0038V8Z" fill="white"/>
                </mask>
                <g mask="url(#dodo-mask)">
                  <path d="M12.9679 11.4606H12.9599C12.4637 11.3182 11.9387 11.603 11.7707 12.0734C11.585 12.579 11.8795 13.1582 12.3997 13.3182C13.6737 13.6798 14.2211 11.8542 12.9679 11.4606Z" fill="#00160D"/>
                  <path d="M23.8265 14.0425C22.1859 10.4505 16.9523 11.9369 16.4689 10.9961C15.0525 8.77368 12.4084 7.52568 9.54993 8.16888C9.10979 7.99288 7.59411 7.94488 6.6146 8.56088L7.20518 8.82168C7.25 8.84088 7.23719 8.83608 7.30281 8.86008C7.5701 8.96088 7.52368 8.93208 7.33162 9.03768C6.89148 9.29528 6.34251 9.59448 6 10.0441C6.0144 10.0649 6.75384 10.2425 6.75384 10.2425C6.76664 10.2457 6.90429 10.2601 6.87388 10.3209C4.45551 14.1385 8.5336 19.9001 10.5134 23.0009H16.2449C15.3598 21.4169 14.3483 19.2553 14.694 17.7881C14.7564 17.5225 14.8364 17.1849 15.1629 17.1401C15.952 17.0137 17.0083 17.0249 17.7605 16.9401C17.7605 16.9401 17.7643 16.9401 17.7717 16.9401C17.9318 16.9321 21.8498 16.4345 22.7877 18.8761C22.8678 19.1001 23.0518 18.9545 23.1254 18.8073C23.8249 17.4169 24.2762 15.2281 23.8297 14.0441L23.8265 14.0425ZM17.5013 12.8633C17.226 13.3545 17.0387 13.9929 16.9907 14.5497C16.9651 14.9033 17.0019 15.2521 17.0371 15.6057C17.0563 15.8009 17.0579 16.0473 16.9011 16.1753C16.765 16.2905 16.5393 16.3017 16.3121 16.3177C15.1965 16.3129 12.4757 16.3177 11.4273 15.6041L11.4209 15.5993C9.89564 14.6697 9.07938 12.5705 9.98527 10.9401C10.2782 10.3865 10.8175 10.0265 11.4321 9.89048C12.2228 9.70968 13.0935 9.84408 13.7993 10.2137C14.0874 10.3593 14.4315 10.5513 14.694 10.7721C15.2141 11.2265 15.6591 11.6985 16.3409 11.8441C16.6546 11.9337 16.9811 11.9209 17.2948 11.9849C17.8822 12.1257 17.7349 12.4601 17.4997 12.8601L17.5013 12.8633Z" fill="#00160D"/>
                </g>
              </svg>
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className={`font-display font-semibold text-[15px] sm:text-base tracking-tight truncate ${
                  isDark ? 'text-white' : 'text-[var(--color-text-primary)]'
                }`}
              >
                Dodo Payments
              </span>
             
            </div>
          </button>

          {/* Desktop Navigation Tabs */}
          <nav
            aria-label="Desktop Navigation"
            className={`hidden md:flex items-center p-1 rounded-lg border transition-colors ${
              isDark
                ? 'bg-slate-900/60 border-slate-800/80'
                : 'bg-[var(--color-surface-subtle)] border-[var(--color-border)]'
            }`}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => handleTabSelect(item.id)}
                  className={`relative min-h-[32px] px-3.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer focus-visible:outline-none z-10 ${
                    isActive
                      ? isDark
                        ? 'text-white font-semibold'
                        : 'text-[var(--color-text-primary)] font-semibold'
                      : isDark
                      ? 'text-slate-400 hover:text-slate-200'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="desktop-nav-active-tab"
                      className={`absolute inset-0 rounded-md -z-10 shadow-xs ${
                        isDark ? 'bg-slate-800' : 'bg-white border border-[var(--color-border)]'
                      }`}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold leading-none ${
                        isActive
                          ? isDark
                            ? 'bg-slate-700 text-slate-200'
                            : 'bg-slate-200 text-[var(--color-text-primary)]'
                          : isDark
                          ? 'bg-slate-800 text-slate-400'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Theme Mode Toggle + Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Dark/Light Mode Toggle Button */}
            <ThemeToggle isDark={isDark} onToggleTheme={onToggleTheme} />

            {/* Mobile Hamburger Menu Button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              className={`md:hidden min-h-[36px] min-w-[36px] p-2 rounded-lg border transition-colors cursor-pointer flex items-center justify-center focus-visible:outline-none ${
                isDark
                  ? isMobileMenuOpen
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                  : isMobileMenuOpen
                  ? 'bg-[var(--hover-surface)] border-[var(--brand-primary)] text-[var(--color-text-primary)]'
                  : 'bg-[var(--color-surface-inset)] border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--hover-surface)]'
              }`}
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown (Drawer) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className={`md:hidden border-t overflow-hidden transition-colors ${
              isDark
                ? 'bg-[#080B11]/95 border-slate-800/90'
                : 'bg-white/95 border-[var(--color-border)]'
            }`}
          >
            <div className="px-4 py-3 space-y-1.5 max-w-7xl mx-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`mobile-nav-tab-${item.id}`}
                    onClick={() => handleTabSelect(item.id)}
                    className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      isActive
                        ? isDark
                          ? 'bg-slate-800/90 text-white font-medium border border-slate-700/80 shadow-xs'
                          : 'bg-[var(--hover-surface)] text-[var(--color-text-primary)] font-medium border border-[var(--brand-primary)] shadow-xs'
                        : isDark
                        ? 'text-slate-300 hover:bg-slate-900/60 hover:text-white'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-inset)] hover:text-[var(--color-text-primary)]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isActive
                            ? isDark
                              ? 'bg-slate-700 text-white'
                              : 'bg-white text-[var(--color-text-primary)] shadow-2xs'
                            : isDark
                            ? 'bg-slate-900 text-slate-400'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-display font-medium text-sm truncate">
                            {item.label}
                          </span>
                          {item.count !== undefined && item.count > 0 && (
                            <span
                              className="text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold leading-none bg-[var(--color-surface-subtle)] text-[var(--color-text-primary)] border border-[var(--color-border)]"
                            >
                              {item.count} events
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-[11px] truncate mt-0.5 ${
                            isDark ? 'text-slate-400' : 'text-[var(--color-text-muted)]'
                          }`}
                        >
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isActive
                          ? isDark
                            ? 'text-white'
                            : 'text-[var(--color-text-primary)] translate-x-0.5'
                          : isDark
                          ? 'text-slate-600'
                          : 'text-[var(--color-text-muted)]'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;

