import { useState, useCallback } from 'react';
import { CallbackLogEntry, PaymentSuccessResult } from '../types';

export function useCheckoutState() {
  const [activeTab, setActiveTab] = useState<'store' | 'docs' | 'architecture'>('store');
  const [logs, setLogs] = useState<CallbackLogEntry[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<PaymentSuccessResult[]>([]);
  const [activeProductLoading, setActiveProductLoading] = useState<string | null>(null);

  // Experience Customization state
  const [checkoutMode, setCheckoutMode] = useState<'modal' | 'inline'>('modal');
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'INR'>('USD');
  const [prefillEmail, setPrefillEmail] = useState('alex@cloudflow.io');
  const [prefillName, setPrefillName] = useState('Alex Rivera');
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [activeInteraction, setActiveInteraction] = useState<string | null>(null);

  const isDark = themeMode === 'dark';

  const toggleTheme = useCallback(() => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const addLog = useCallback(
    (
      type: CallbackLogEntry['type'],
      title: string,
      payload: unknown,
      status: CallbackLogEntry['status']
    ) => {
      const newEntry: CallbackLogEntry = {
        id: 'log_' + Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        type,
        title,
        payload,
        status,
      };
      setLogs((prev) => [newEntry, ...prev]);
    },
    []
  );

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return {
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
    setPrefillEmail,
    prefillName,
    setPrefillName,
    themeMode,
    toggleTheme,
    isDark,
    activeInteraction,
    setActiveInteraction,
  };
}
