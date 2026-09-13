import React from 'react';
import { useCheckoutSession } from './hooks/useCheckoutSession';
import { usePaymentProcessor } from './hooks/usePaymentProcessor';
import {
  CheckoutHeader,
  OrderSummaryCard,
  PaymentForm,
  ProcessingView,
  SuccessView,
  ErrorView,
  CheckoutFooter,
  DiscardModal,
} from './components';

export default function CheckoutApp() {
  const { sessionData, sendMessageToHost, broadcastHeight } = useCheckoutSession();
  const { product, sessionId, initialEmail, initialName, isDark } = sessionData;

  const {
    formState,
    promoState,
    flowState,
    refs,
    financials,
    handlers,
  } = usePaymentProcessor({
    product,
    sessionId,
    initialEmail,
    initialName,
    sendMessageToHost,
    broadcastHeight,
  });

  const { stage, processingMessage, processingStep, errorMessage, errorCode, showConfirmClose, copiedSession, successData } = flowState;
  const { handleRequestClose, confirmClose, copySessionId, handlePay } = handlers;

  return (
    <div
      className="min-h-screen flex flex-col justify-between text-sm font-sans antialiased bg-[var(--color-canvas)] text-[var(--color-text-primary)] selection:bg-[var(--brand-primary)] selection:text-[var(--brand-text)]"
    >
      {/* Checkout Top Header */}
      <CheckoutHeader onClose={() => handleRequestClose('user_closed')} />

      {/* Main Checkout Body */}
      <main className="flex-1 px-3.5 sm:px-5 py-3.5 sm:py-4 overflow-y-auto">
        {/* STAGE: FORM INPUTS */}
        {stage === 'form' && (
          <div className="space-y-3.5">
            <OrderSummaryCard
              product={product}
              financials={financials}
              promoState={promoState}
            />

            <PaymentForm
              formState={formState}
              financials={financials}
              errorMessage={errorMessage}
              isDark={isDark}
              refs={refs}
              handlers={handlers}
            />
          </div>
        )}

        {/* STAGE: PROCESSING */}
        {stage === 'processing' && (
          <ProcessingView
            processingMessage={processingMessage}
            processingStep={processingStep}
          />
        )}

        {/* STAGE: SUCCESS */}
        {stage === 'success' && successData && (
          <SuccessView
            successData={successData}
            sessionId={sessionId}
            currencySymbol={financials.currencySymbol}
            copiedSession={copiedSession}
            onCopySessionId={copySessionId}
            onReturnToMerchant={() => handleRequestClose('completed')}
          />
        )}

        {/* STAGE: ERROR */}
        {stage === 'error' && (
          <ErrorView
            errorCode={errorCode}
            errorMessage={errorMessage}
            onRetryPayment={() => handlePay()}
            onEditCardDetails={() => {
              flowState.setStage('form');
              flowState.setErrorMessage(null);
            }}
            onCancel={() => handleRequestClose('user_closed')}
          />
        )}
      </main>

      {/* Checkout Footer Trust Badges */}
      <CheckoutFooter />

      {/* Dirty-Form Exit Confirmation Modal */}
      <DiscardModal
        isOpen={showConfirmClose}
        onStay={() => flowState.setShowConfirmClose(false)}
        onDiscard={confirmClose}
      />
    </div>
  );
}
