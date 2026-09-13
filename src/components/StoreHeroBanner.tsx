import React from 'react';
import { motion } from 'motion/react';
import { Product } from '../types';

interface StoreHeroBannerProps {
  checkoutMode: 'modal' | 'inline';
  setCheckoutMode: (mode: 'modal' | 'inline') => void;
  selectedCurrency: 'USD' | 'EUR' | 'GBP' | 'INR';
  setSelectedCurrency: (currency: 'USD' | 'EUR' | 'GBP' | 'INR') => void;
  setActiveInteraction: (interaction: string | null) => void;
  logsLength: number;
}

export function StoreHeroBanner({
  checkoutMode,
  setCheckoutMode,
  selectedCurrency,
  setSelectedCurrency,
  setActiveInteraction,
}: StoreHeroBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fintech-card rounded-xl p-5 sm:p-6"
    >
      <div className="max-w-3xl space-y-5">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-border)] bg-transparent theme-text-secondary text-[10px] font-mono font-medium tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-border-strong)]" />
          <span>Dodo Payments &bull; Merchant of Record Checkout Engine</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight theme-text-primary">
            Nova Cloud Platform <span className="theme-text-muted font-normal">&bull; Merchant Billing Demo</span>
          </h1>

          <p className="text-sm theme-text-secondary leading-relaxed max-w-2xl">
            Host site demonstrating integration with the drop-in{' '}
            <strong className="theme-text-primary font-semibold">DodoCheckout SDK</strong>. Initiating checkout mounts an isolated iframe with zero host PCI-DSS scope, automated tax remittance, adaptive currency conversion, and cryptographic postMessage session handshakes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Mode Selector */}
          <div className="flex items-center fintech-inset p-1 rounded-lg w-full sm:w-auto justify-between sm:justify-start relative">
            <span className="theme-text-muted font-mono text-[11px] px-2 shrink-0 uppercase font-bold tracking-wider">Mode</span>
            <div className="flex relative">
              <button
                onClick={() => {
                  setCheckoutMode('modal');
                  setActiveInteraction('mode-modal');
                }}
                className={`relative z-10 min-h-[32px] px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none flex-1 sm:flex-initial text-center ${
                  checkoutMode === 'modal' ? 'theme-text-primary' : 'theme-text-secondary hover:theme-text-primary'
                }`}
              >
                {checkoutMode === 'modal' && (
                  <motion.div
                    layoutId="mode-indicator"
                    className="absolute inset-0 theme-surface rounded-md shadow-sm border theme-border"
                    style={{ zIndex: -1 }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                Modal Overlay
              </button>
              <button
                onClick={() => {
                  setCheckoutMode('inline');
                  setActiveInteraction('mode-inline');
                }}
                className={`relative z-10 min-h-[32px] px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none flex-1 sm:flex-initial text-center ${
                  checkoutMode === 'inline' ? 'theme-text-primary' : 'theme-text-secondary hover:theme-text-primary'
                }`}
              >
                {checkoutMode === 'inline' && (
                  <motion.div
                    layoutId="mode-indicator"
                    className="absolute inset-0 theme-surface rounded-md shadow-sm border theme-border"
                    style={{ zIndex: -1 }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                Inline Container
              </button>
            </div>
          </div>

          {/* Currency Selector */}
          <div className="flex items-center fintech-inset p-1 rounded-lg w-full sm:w-auto justify-between sm:justify-start">
            <span className="theme-text-muted font-mono text-[11px] px-2 shrink-0 uppercase font-bold tracking-wider">Currency</span>
            <div className="flex items-center flex-1 sm:flex-initial justify-end sm:justify-start relative">
              {(['USD', 'EUR', 'GBP', 'INR'] as const).map((curr) => (
                <button
                  key={curr}
                  onClick={() => {
                    setSelectedCurrency(curr);
                    setActiveInteraction(`currency-${curr}`);
                  }}
                  className={`relative z-10 min-h-[32px] px-2.5 py-1.5 rounded-md text-xs font-mono font-bold transition-colors cursor-pointer focus-visible:outline-none flex-1 sm:flex-initial text-center ${
                    selectedCurrency === curr ? 'theme-text-primary' : 'theme-text-secondary hover:theme-text-primary'
                  }`}
                >
                  {selectedCurrency === curr && (
                    <motion.div
                      layoutId="currency-indicator"
                      className="absolute inset-0 theme-surface rounded-md shadow-sm border theme-border"
                      style={{ zIndex: -1 }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {curr}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
