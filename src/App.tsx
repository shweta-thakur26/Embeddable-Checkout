import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Navbar,
  AmbientBackground,
  StoreTab,
  DocsTab,
  ArchitectureTab,
  Footer,
} from './components';
import { Product } from './types';
import { useCheckoutState } from './hooks/useCheckoutState';
import { useCheckoutActions } from './hooks/useCheckoutActions';

export default function App() {
  const {
    activeTab,
    setActiveTab,
    logs,
    addLog,
    clearLogs,
    recentTransactions,
    setRecentTransactions,
    activeProductLoading,
    setActiveProductLoading,
    checkoutMode,
    setCheckoutMode,
    selectedCurrency,
    setSelectedCurrency,
    prefillEmail,
    prefillName,
    themeMode,
    toggleTheme,
    isDark,
    activeInteraction,
    setActiveInteraction,
  } = useCheckoutState();

  const [inlineActiveProduct, setInlineActiveProduct] = useState<Product | null>(null);

  const { handleBuyProduct, inlineContainerRef } = useCheckoutActions({
    checkoutMode,
    selectedCurrency,
    prefillEmail,
    prefillName,
    themeMode,
    setActiveProductLoading,
    setInlineActiveProduct,
    setRecentTransactions,
    addLog,
  });

  return (
    <div
      className={`min-h-screen app-bg-transition flex flex-col font-sans relative overflow-x-hidden ${
        isDark ? 'dark bg-[#0A0C12] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
      data-theme={themeMode}
    >
      {/* Smooth Ambient Background Canvas reacting to theme & checkout component interactions */}
      <AmbientBackground 
        isDark={isDark} 
        activeProductLoading={activeProductLoading} 
        activeInteraction={activeInteraction} 
        checkoutMode={checkoutMode} 
      />

      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        logCount={logs.length}
        themeMode={themeMode}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full relative">
        <AnimatePresence mode="wait">
          {activeTab === 'store' && (
            <StoreTab
              checkoutMode={checkoutMode}
              setCheckoutMode={setCheckoutMode}
              selectedCurrency={selectedCurrency}
              setSelectedCurrency={setSelectedCurrency}
              setActiveInteraction={setActiveInteraction}
              logs={logs}
              clearLogs={clearLogs}
              recentTransactions={recentTransactions}
              activeProductLoading={activeProductLoading}
              handleBuyProduct={handleBuyProduct}
              isDark={isDark}
              inlineContainerRef={inlineContainerRef}
              inlineActiveProduct={inlineActiveProduct}
              setInlineActiveProduct={setInlineActiveProduct}
            />
          )}

        {/* DOCS TAB */}
        {activeTab === 'docs' && <DocsTab isDark={isDark} />}

        {/* ARCHITECTURE & WRITEUP TAB */}
        {activeTab === 'architecture' && <ArchitectureTab isDark={isDark} />}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer isDark={isDark} setActiveTab={setActiveTab} />
    </div>
  );
}
