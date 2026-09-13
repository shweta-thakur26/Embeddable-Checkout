import { useMemo, useEffect, useCallback } from 'react';
import { PRODUCTS } from '../../data/products';
import { Product, DodoPostMessage } from '../../types';
import { CHECKOUT_SOURCE, PROTOCOL_VERSION } from '../../sdk/messageProtocol';
import { CheckoutSessionData } from '../types';

function getParentOrigin(): string {
  try {
    return document.referrer ? new URL(document.referrer).origin : window.location.origin;
  } catch {
    return window.location.origin;
  }
}

export function useCheckoutSession(): {
  sessionData: CheckoutSessionData;
  sendMessageToHost: (type: DodoPostMessage['type'], payload?: unknown) => void;
  broadcastHeight: () => void;
} {
  // Parse session and parameters from URL
  const searchParams = useMemo(() => new URLSearchParams(window.location.search), []);

  const sessionId = useMemo(() => {
    return searchParams.get('sessionId') || 'dodo_sess_demo_' + Math.random().toString(36).substring(2, 7);
  }, [searchParams]);

  const productId = searchParams.get('productId') || 'prod_pro';
  const customAmount = searchParams.get('amount') ? parseFloat(searchParams.get('amount')!) : undefined;
  const customCurrency = (searchParams.get('currency') as any) || 'USD';
  const customTitle = searchParams.get('title') || undefined;
  const initialEmail = searchParams.get('customerEmail') || '';
  const initialName = searchParams.get('customerName') || '';
  const initialTheme = searchParams.get('theme') || 'light';
  const initialThemeColor = searchParams.get('themeColor');
  const isDark = initialTheme === 'dark';
  const parentOrigin = useMemo(() => getParentOrigin(), []);

  // Theme color setup and dynamic postMessage listener
  useEffect(() => {
    if (initialThemeColor) {
      document.documentElement.style.setProperty('--brand-primary', initialThemeColor);
      document.documentElement.style.setProperty('--color-accent', initialThemeColor);
    }
    const handleThemeMessage = (e: MessageEvent) => {
      if (e.data?.source === 'dodo-theme-manager' && e.data?.themeColor) {
        document.documentElement.style.setProperty('--brand-primary', e.data.themeColor);
        if (e.data.hoverColor) document.documentElement.style.setProperty('--brand-hover', e.data.hoverColor);
        if (e.data.hoverSurface) document.documentElement.style.setProperty('--hover-surface', e.data.hoverSurface);
        if (e.data.buttonText) document.documentElement.style.setProperty('--brand-text', e.data.buttonText);
        document.documentElement.style.setProperty('--color-accent', e.data.themeColor);
      }
    };
    window.addEventListener('message', handleThemeMessage);
    return () => window.removeEventListener('message', handleThemeMessage);
  }, [initialThemeColor]);

  // Host communication helper
  const sendMessageToHost = useCallback(
    (type: DodoPostMessage['type'], payload?: unknown) => {
      if (window.parent === window) return;
      window.parent.postMessage(
        {
          source: CHECKOUT_SOURCE,
          type,
          protocolVersion: PROTOCOL_VERSION,
          sessionId,
          payload,
        } satisfies DodoPostMessage,
        parentOrigin
      );
    },
    [sessionId, parentOrigin]
  );

  const broadcastHeight = useCallback(() => {
    const height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    sendMessageToHost('DODO_CHECKOUT_RESIZE', { height });
  }, [sendMessageToHost]);

  // Initial ready event and resize listeners
  useEffect(() => {
    sendMessageToHost('DODO_CHECKOUT_READY', { sessionId, productId });
    broadcastHeight();
    const timer = window.setTimeout(broadcastHeight, 300);
    window.addEventListener('resize', broadcastHeight);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', broadcastHeight);
    };
  }, [sessionId, productId, sendMessageToHost, broadcastHeight]);

  // Product definition
  const product: Product = useMemo(() => {
    const found = PRODUCTS.find((p) => p.id === productId);
    if (found) {
      return {
        ...found,
        amount: customAmount !== undefined ? customAmount : found.amount,
        currency: customCurrency || found.currency,
        name: customTitle || found.name,
      };
    }
    return {
      id: productId,
      name: customTitle || 'Pro Developer Plan',
      description: 'API & cloud platform subscription',
      amount: customAmount || 49.0,
      currency: customCurrency || 'USD',
      interval: 'month',
      features: ['Real-time usage metering', 'Merchant of Record tax remittance', 'Global payout routing'],
      category: 'Subscription',
    };
  }, [productId, customAmount, customCurrency, customTitle]);

  const sessionData: CheckoutSessionData = {
    sessionId,
    productId,
    product,
    isDark,
    parentOrigin,
    initialEmail,
    initialName,
  };

  return {
    sessionData,
    sendMessageToHost,
    broadcastHeight,
  };
}
