import React from 'react';
import { motion } from 'motion/react';
import { Layers } from 'lucide-react';
import { StoreHeroBanner } from './StoreHeroBanner';
import { TestScenariosCard } from './TestScenariosCard';
import { ProductCard } from './ProductCard';
import { PaymentMethodList } from './PaymentMethodList';
import { CallbackLogs } from './CallbackLogs';
import { InvoiceTable } from './InvoiceTable';
import { PRODUCTS } from '../data/products';
import { Product, CallbackLogEntry, PaymentSuccessResult } from '../types';
import { DodoCheckout } from '../sdk/dodo-checkout';

interface StoreTabProps {
  checkoutMode: 'modal' | 'inline';
  setCheckoutMode: (mode: 'modal' | 'inline') => void;
  selectedCurrency: 'USD' | 'EUR' | 'GBP' | 'INR';
  setSelectedCurrency: (currency: 'USD' | 'EUR' | 'GBP' | 'INR') => void;
  setActiveInteraction: (interaction: string | null) => void;
  logs: CallbackLogEntry[];
  clearLogs: () => void;
  recentTransactions: PaymentSuccessResult[];
  activeProductLoading: string | null;
  handleBuyProduct: (product: Product) => void;
  isDark: boolean;
  inlineContainerRef: React.RefObject<HTMLDivElement>;
  inlineActiveProduct: Product | null;
  setInlineActiveProduct: (product: Product | null) => void;
}

export function StoreTab({
  checkoutMode,
  setCheckoutMode,
  selectedCurrency,
  setSelectedCurrency,
  setActiveInteraction,
  logs,
  clearLogs,
  recentTransactions,
  activeProductLoading,
  handleBuyProduct,
  isDark,
  inlineContainerRef,
  inlineActiveProduct,
  setInlineActiveProduct,
}: StoreTabProps) {
  return (
    <motion.div
      key="store"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-6"
    >
      <StoreHeroBanner
        checkoutMode={checkoutMode}
        setCheckoutMode={setCheckoutMode}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
        setActiveInteraction={setActiveInteraction}
        logsLength={logs.length}
      />

      <TestScenariosCard logsLength={logs.length} />

      {/* Products Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
              <span>Usage-Based &amp; Subscription Tiers</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Clicking any plan mounts <code className="text-slate-800 font-mono font-medium">DodoCheckout.{checkoutMode === 'modal' ? 'open()' : 'embed()'}</code>.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                currency: selectedCurrency,
              }}
              onBuy={handleBuyProduct}
              isLoading={activeProductLoading === product.id}
              isDark={isDark}
              onHoverChange={(hovered) => {
                setActiveInteraction(hovered ? product.id : null);
              }}
            />
          ))}
        </div>
      </div>

      {/* Inline Checkout Mounting Anchor (only active when Inline Mode is chosen) */}
      {checkoutMode === 'inline' && (
        <div
          ref={inlineContainerRef}
          className={`p-5 rounded-xl fintech-card space-y-3 ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className={`flex items-center justify-between pb-2.5 border-b ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <Layers className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              <h3 className={`font-bold text-sm font-mono ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                Inline Host Mounting Target: {inlineActiveProduct ? inlineActiveProduct.name : 'Awaiting Plan Selection'}
              </h3>
            </div>
            {inlineActiveProduct && (
              <button
                onClick={() => {
                  DodoCheckout.close('user_closed');
                  setInlineActiveProduct(null);
                }}
                className={`min-h-[36px] px-2.5 py-1 text-xs font-mono cursor-pointer border rounded-md transition-colors ${
                  isDark
                    ? 'text-slate-300 hover:text-white border-slate-700 hover:bg-slate-800'
                    : 'text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50'
                }`}
              >
                [Dismiss Container]
              </button>
            )}
          </div>

          {!inlineActiveProduct ? (
            <div className={`py-10 text-center space-y-1.5 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
              <p className={`text-xs font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Inline container active</p>
              <p className={`text-[11px] max-w-sm mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Click &quot;Checkout with Dodo&quot; on any plan above. The checkout iframe will be mounted directly in this container.
              </p>
            </div>
          ) : (
            <div
              id="dodo-inline-checkout-container"
              className={`w-full max-w-md mx-auto rounded-lg overflow-hidden min-h-[620px] shadow-sm ${
                isDark ? 'bg-[#0E0F12] border border-[#262930]' : 'bg-white border border-slate-200'
              }`}
            />
          )}
        </div>
      )}

      {/* Real-time Callback & Webhook Log Inspector */}
      <div className="pt-2" id="callback-logs-panel">
        <CallbackLogs logs={logs} onClear={clearLogs} />
      </div>

      {/* Payment Acceptance Rails */}
      <div className="pt-2">
        <PaymentMethodList />
      </div>

      {/* Merchant of Record Invoicing & Tax Remittance Ledger */}
      <div className="pt-2">
        <InvoiceTable recentTransactions={recentTransactions} />
      </div>
    </motion.div>
  );
}
