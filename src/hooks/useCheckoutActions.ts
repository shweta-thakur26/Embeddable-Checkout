import React, { useRef, useCallback } from 'react';
import { DodoCheckout } from '../sdk/dodo-checkout';
import { Product, CallbackLogEntry, PaymentSuccessResult, PaymentErrorData, PaymentCloseData } from '../types';

interface UseCheckoutActionsProps {
  checkoutMode: 'modal' | 'inline';
  selectedCurrency: 'USD' | 'EUR' | 'GBP' | 'INR';
  prefillEmail: string;
  prefillName: string;
  themeMode: 'light' | 'dark';
  setActiveProductLoading: (id: string | null) => void;
  setInlineActiveProduct: (product: Product | null) => void;
  setRecentTransactions: React.Dispatch<React.SetStateAction<PaymentSuccessResult[]>>;
  addLog: (
    type: CallbackLogEntry['type'],
    title: string,
    payload: unknown,
    status: CallbackLogEntry['status']
  ) => void;
}

export function useCheckoutActions({
  checkoutMode,
  selectedCurrency,
  prefillEmail,
  prefillName,
  themeMode,
  setActiveProductLoading,
  setInlineActiveProduct,
  setRecentTransactions,
  addLog,
}: UseCheckoutActionsProps) {
  const inlineContainerRef = useRef<HTMLDivElement>(null);

  const handleBuyProduct = useCallback(
    (product: Product) => {
      setActiveProductLoading(product.id);

      const productWithCurrency: Product = {
        ...product,
        currency: selectedCurrency,
      };

      if (checkoutMode === 'inline') {
        setInlineActiveProduct(productWithCurrency);
        setTimeout(() => {
          inlineContainerRef.current?.scrollIntoView({ behavior: 'smooth' });

          DodoCheckout.embed('#dodo-inline-checkout-container', {
            productId: product.id,
            title: product.name,
            amount: product.amount,
            currency: selectedCurrency,
            customerEmail: prefillEmail,
            customerName: prefillName,
            theme: themeMode,
            onSuccess: (result: PaymentSuccessResult) => {
              setActiveProductLoading(null);
              setRecentTransactions((prev) => [result, ...prev]);
              addLog(
                'onSuccess',
                `Payment Succeeded: $${result.amount.toFixed(2)} (${result.paymentMethod.brand.toUpperCase()} •••• ${result.paymentMethod.last4})`,
                result,
                'success'
              );

              setTimeout(() => {
                addLog(
                  'webhook',
                  'Webhook Dispatched: payment_intent.succeeded',
                  {
                    id: 'evt_' + Math.random().toString(36).substring(2, 10),
                    event: 'payment_intent.succeeded',
                    created_at: new Date().toISOString(),
                    merchant_of_record: 'Dodo Payments Inc.',
                    signature_header: `dodo-signature: t=${Date.now()},v1=8f7e2c91a0b3...`,
                    data: {
                      session_id: result.sessionId,
                      product_id: result.productId,
                      customer: {
                        email: result.customerEmail,
                        name: result.customerName,
                      },
                      amount: result.amount,
                      subtotal: result.subtotal,
                      tax: result.taxAmount,
                      currency: result.currency,
                      country: result.country,
                      payment_method: result.paymentMethod,
                      settlement_status: 'paid',
                    },
                  },
                  'info'
                );
              }, 600);
            },
            onClose: (data: PaymentCloseData) => {
              setActiveProductLoading(null);
              setInlineActiveProduct(null);
              addLog(
                'onClose',
                `Checkout Dismissed: ${data.reason.replace('_', ' ')}`,
                data,
                'warning'
              );
            },
            onError: (error: PaymentErrorData) => {
              setActiveProductLoading(null);
              addLog(
                'onError',
                `Payment Failed: ${error.code}`,
                error,
                'error'
              );
            },
            onEvent: (evt) => {
              addLog(
                'onEvent',
                `Lifecycle: ${evt.event}`,
                evt.payload,
                'info'
              );
            },
          });
        }, 100);
        return;
      }

      DodoCheckout.open({
        productId: product.id,
        title: product.name,
        amount: product.amount,
        currency: selectedCurrency,
        customerEmail: prefillEmail,
        customerName: prefillName,
        theme: themeMode,
        onSuccess: (result: PaymentSuccessResult) => {
          setActiveProductLoading(null);
          setRecentTransactions((prev) => [result, ...prev]);
          addLog(
            'onSuccess',
            `Payment Succeeded: $${result.amount.toFixed(2)} (${result.paymentMethod.brand.toUpperCase()} •••• ${result.paymentMethod.last4})`,
            result,
            'success'
          );

          setTimeout(() => {
            addLog(
              'webhook',
              'Webhook Dispatched: payment_intent.succeeded',
              {
                id: 'evt_' + Math.random().toString(36).substring(2, 10),
                event: 'payment_intent.succeeded',
                created_at: new Date().toISOString(),
                merchant_of_record: 'Dodo Payments Inc.',
                signature_header: `dodo-signature: t=${Date.now()},v1=8f7e2c91a0b3...`,
                data: {
                  session_id: result.sessionId,
                  product_id: result.productId,
                  customer: {
                    email: result.customerEmail,
                    name: result.customerName,
                  },
                  amount: result.amount,
                  subtotal: result.subtotal,
                  tax: result.taxAmount,
                  currency: result.currency,
                  country: result.country,
                  payment_method: result.paymentMethod,
                  settlement_status: 'paid',
                },
              },
              'info'
            );
          }, 600);
        },
        onClose: (data: PaymentCloseData) => {
          setActiveProductLoading(null);
          addLog(
            'onClose',
            `Checkout Dismissed: ${data.reason.replace('_', ' ')}`,
            data,
            'warning'
          );
        },
        onError: (error: PaymentErrorData) => {
          setActiveProductLoading(null);
          addLog(
            'onError',
            `Payment Failed: ${error.code}`,
            error,
            'error'
          );
        },
        onEvent: (evt) => {
          addLog(
            'onEvent',
            `Lifecycle: ${evt.event}`,
            evt.payload,
            'info'
          );
        },
      });
    },
    [
      checkoutMode,
      selectedCurrency,
      prefillEmail,
      prefillName,
      themeMode,
      setActiveProductLoading,
      setInlineActiveProduct,
      setRecentTransactions,
      addLog,
    ]
  );

  return { handleBuyProduct, inlineContainerRef };
}
