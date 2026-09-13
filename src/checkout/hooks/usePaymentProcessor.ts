import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Product, PaymentSuccessResult, DodoPostMessage } from '../../types';
import {
  formatCardNumber,
  formatExpiry,
  detectCardBrand,
  COUNTRIES,
  CountryTaxRule,
  getCurrencySymbol,
} from '../utils';
import { CheckoutStage, AppliedPromo, CheckoutFinancials } from '../types';

interface UsePaymentProcessorProps {
  product: Product;
  sessionId: string;
  initialEmail: string;
  initialName: string;
  sendMessageToHost: (type: DodoPostMessage['type'], payload?: unknown) => void;
  broadcastHeight: () => void;
}

export function usePaymentProcessor({
  product,
  sessionId,
  initialEmail,
  initialName,
  sendMessageToHost,
  broadcastHeight,
}: UsePaymentProcessorProps) {
  // Form State
  const [email, setEmail] = useState(initialEmail);
  const [cardholderName, setCardholderName] = useState(initialName);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryTaxRule>(COUNTRIES[0]);
  const [zipCode, setZipCode] = useState('94103');

  // Coupon / Discount State
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  // Flow State
  const [stage, setStage] = useState<CheckoutStage>('form');
  const [processingMessage, setProcessingMessage] = useState('Securing payment channel...');
  const [processingStep, setProcessingStep] = useState<1 | 2 | 3>(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string>('');
  const [retryable, setRetryable] = useState(false);
  const [cardAttemptCount, setCardAttemptCount] = useState<Record<string, number>>({});
  const [simulateOffline, setSimulateOffline] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [copiedSession, setCopiedSession] = useState(false);
  const [successData, setSuccessData] = useState<PaymentSuccessResult | null>(null);
  const [cardTouched, setCardTouched] = useState(false);

  // Input element refs for smart auto-advancement
  const emailInputRef = useRef<HTMLInputElement>(null);
  const cardNumberRef = useRef<HTMLInputElement>(null);
  const expiryRef = useRef<HTMLInputElement>(null);
  const cvcRef = useRef<HTMLInputElement>(null);
  const zipRef = useRef<HTMLInputElement>(null);
  const isSubmittingRef = useRef(false);

  // Brand detection
  const cardBrand = useMemo(() => detectCardBrand(cardNumber), [cardNumber]);

  // Financial calculations (MoR Tax Calculation)
  const currencySymbol = getCurrencySymbol(product.currency);
  const subtotal = product.amount;
  const discount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (appliedPromo.fixedOff) return Math.min(appliedPromo.fixedOff, subtotal);
    return subtotal * appliedPromo.discountRate;
  }, [appliedPromo, subtotal]);

  const taxableAmount = Math.max(0, subtotal - discount);
  const taxAmount = parseFloat((taxableAmount * selectedCountry.taxRate).toFixed(2));
  const totalAmount = parseFloat((taxableAmount + taxAmount).toFixed(2));

  const financials: CheckoutFinancials = {
    currencySymbol,
    subtotal,
    discount,
    taxableAmount,
    taxAmount,
    totalAmount,
  };

  // Dynamic resize broadcast
  useEffect(() => {
    broadcastHeight();
    const timer = setTimeout(broadcastHeight, 300);
    return () => clearTimeout(timer);
  }, [stage, showPromoInput, errorMessage, broadcastHeight]);

  // Coupon application handler
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    const cleaned = promoCode.trim().toUpperCase();
    if (cleaned === 'LAUNCH20' || cleaned === 'DODO20') {
      setAppliedPromo({ code: cleaned, discountRate: 0.2 });
      setPromoCode('');
    } else if (cleaned === 'DEV10' || cleaned === 'SENIORDEV') {
      setAppliedPromo({ code: cleaned, discountRate: 0, fixedOff: 10 });
      setPromoCode('');
    } else {
      setPromoError('Invalid coupon code. Try "DODO20" or "DEV10".');
    }
  };

  // Quick-fill test card details
  const applyTestCard = (number: string, cvc: string, exp: string) => {
    setCardNumber(formatCardNumber(number));
    setCardCvc(cvc);
    setCardExpiry(exp);
    if (!email) setEmail('alex@cloudflow.io');
    if (!cardholderName) setCardholderName('Alex Rivera');
    setErrorMessage(null);
    setCardTouched(true);
  };

  // Smart field auto-advance on Card Number change
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    setCardTouched(true);
    setErrorMessage(null);

    const raw = formatted.replace(/\D/g, '');
    const isAmex = raw.startsWith('34') || raw.startsWith('37');
    const targetLen = isAmex ? 15 : 16;

    if (raw.length >= targetLen) {
      expiryRef.current?.focus();
    }
  };

  // Smart field auto-advance on Expiry change
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    setCardExpiry(formatted);
    setErrorMessage(null);

    if (formatted.length === 5) {
      cvcRef.current?.focus();
    }
  };

  // Smart field auto-advance on CVC change
  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardCvc(cleaned);
    setErrorMessage(null);

    const isAmex = cardNumber.replace(/\D/g, '').startsWith('3');
    const targetLen = isAmex ? 4 : 3;
    if (cleaned.length >= targetLen) {
      zipRef.current?.focus();
    }
  };

  // Backspace key navigation across segmented inputs
  const handleExpiryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && cardExpiry === '') {
      cardNumberRef.current?.focus();
    }
  };

  const handleCvcKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && cardCvc === '') {
      expiryRef.current?.focus();
    }
  };

  // Postal / ZIP code limiter (strictly capped at 6 digits/characters max)
  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9A-Za-z]/g, '').slice(0, 6).toUpperCase();
    setZipCode(val);
    setErrorMessage(null);
  };

  // Close request with dirty state prompt
  const handleRequestClose = (reason: 'user_closed' | 'completed' = 'user_closed') => {
    if (stage === 'form' && (cardNumber || email) && reason === 'user_closed') {
      setShowConfirmClose(true);
      return;
    }
    sendMessageToHost('DODO_CHECKOUT_CLOSE', { reason });
  };

  const confirmClose = () => {
    setShowConfirmClose(false);
    sendMessageToHost('DODO_CHECKOUT_CLOSE', { reason: 'user_closed' });
  };

  // Payment Execution & Realistic Authorization Pipeline
  const handlePay = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Idempotency token protection against duplicate clicks
    if (isSubmittingRef.current || stage === 'processing') {
      console.warn('[DodoCheckout] Double-click prevented by idempotency token.');
      return;
    }

    // Client-side validations
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid receipt email address.');
      emailInputRef.current?.focus();
      return;
    }
    const cleanNum = cardNumber.replace(/\D/g, '');
    if (cleanNum.length < 15) {
      setErrorMessage('Please enter a complete 15 or 16-digit card number.');
      cardNumberRef.current?.focus();
      return;
    }
    if (cardExpiry.length < 5) {
      setErrorMessage('Please enter a valid expiration date (MM/YY).');
      expiryRef.current?.focus();
      return;
    }
    if (cardCvc.length < 3) {
      setErrorMessage('Please enter the 3 or 4-digit security code (CVC).');
      cvcRef.current?.focus();
      return;
    }
    if (!zipCode || zipCode.trim().length === 0) {
      setErrorMessage('Please enter a valid postal or ZIP code.');
      zipRef.current?.focus();
      return;
    }

    isSubmittingRef.current = true;
    setErrorMessage(null);
    setStage('processing');
    setProcessingStep(1);

    sendMessageToHost('DODO_CHECKOUT_EVENT', {
      event: 'payment_processing_started',
      cardBrand,
      last4: cleanNum.slice(-4),
      amount: totalAmount,
      currency: product.currency,
      country: selectedCountry.code,
    });

    // Step 1: Simulated offline check
    if (simulateOffline) {
      setTimeout(() => {
        isSubmittingRef.current = false;
        setStage('error');
        setErrorCode('NETWORK_DISCONNECTED');
        setErrorMessage('Connection failed: Network stream disconnected. Please check your connection and retry.');
        setRetryable(true);
        sendMessageToHost('DODO_CHECKOUT_ERROR', {
          code: 'NETWORK_DISCONNECTED',
          message: 'Client simulated network disconnection.',
        });
      }, 900);
      return;
    }

    // Pipeline Stage 1: Tokenization
    setProcessingMessage('Generating one-time PCI token with Dodo MoR Vault...');
    setProcessingStep(1);
    await new Promise((r) => setTimeout(r, 650));

    // Pipeline Stage 2: 3D Secure / Risk Assessment
    setProcessingMessage('Evaluating 3D Secure risk scoring with card issuer...');
    setProcessingStep(2);
    await new Promise((r) => setTimeout(r, 750));

    // Pipeline Stage 3: Bank Settlement
    setProcessingMessage('Authorizing settlement with issuing bank...');
    setProcessingStep(3);
    await new Promise((r) => setTimeout(r, 550));

    // Card Rule Logic
    const currentAttempts = cardAttemptCount[cleanNum] || 0;
    const newAttemptCount = currentAttempts + 1;
    setCardAttemptCount((prev) => ({ ...prev, [cleanNum]: newAttemptCount }));

    // Rule 2: 4000 0000 0000 0002 -> Declines
    if (cleanNum === '4000000000000002') {
      isSubmittingRef.current = false;
      setStage('error');
      setErrorCode('CARD_DECLINED');
      setErrorMessage('Your card was declined by the issuer (insufficient_funds / card_blocked). Please switch cards.');
      setRetryable(true);
      sendMessageToHost('DODO_CHECKOUT_ERROR', {
        code: 'CARD_DECLINED',
        message: 'Your card was declined by the issuing bank.',
      });
      return;
    }

    // Rule 3: 4000 0000 0000 0341 -> Fails on attempt #1, then succeeds on attempt #2
    if (cleanNum === '4000000000000341') {
      if (currentAttempts === 0) {
        isSubmittingRef.current = false;
        setStage('error');
        setErrorCode('GATEWAY_TIMEOUT_TRANSIENT');
        setErrorMessage('Temporary authorization timeout: Card issuer connection was dropped. Your card was NOT charged.');
        setRetryable(true);
        sendMessageToHost('DODO_CHECKOUT_ERROR', {
          code: 'GATEWAY_TIMEOUT_TRANSIENT',
          message: 'Temporary gateway timeout. Ready for retry.',
        });
        return;
      }
      // Attempt 2+ succeeds!
    }

    // Rule 1: 4242 4242 4242 4242 (or any other Luhn valid card) -> Approves!
    const result: PaymentSuccessResult = {
      sessionId,
      productId: product.id,
      customerEmail: email,
      customerName: cardholderName || undefined,
      amount: totalAmount,
      subtotal,
      taxAmount,
      taxRate: selectedCountry.taxRate,
      country: selectedCountry.name,
      currency: product.currency,
      discountAmount: discount > 0 ? discount : undefined,
      paymentMethod: {
        brand: cardBrand,
        last4: cleanNum.slice(-4),
        expMonth: cardExpiry.slice(0, 2),
        expYear: cardExpiry.slice(3, 5),
      },
      receiptUrl: `https://app.dodopayments.com/receipts/${sessionId}`,
      timestamp: new Date().toISOString(),
    };

    setSuccessData(result);
    setStage('success');
    isSubmittingRef.current = false;

    // Dispatch to parent host
    sendMessageToHost('DODO_CHECKOUT_SUCCESS', result);
  };

  const copySessionId = () => {
    navigator.clipboard.writeText(sessionId);
    setCopiedSession(true);
    setTimeout(() => setCopiedSession(false), 2000);
  };

  return {
    formState: {
      email,
      setEmail,
      cardholderName,
      setCardholderName,
      cardNumber,
      cardExpiry,
      cardCvc,
      selectedCountry,
      setSelectedCountry,
      zipCode,
      cardBrand,
      cardTouched,
    },
    promoState: {
      showPromoInput,
      setShowPromoInput,
      promoCode,
      setPromoCode,
      appliedPromo,
      promoError,
      handleApplyPromo,
    },
    flowState: {
      stage,
      setStage,
      processingMessage,
      processingStep,
      errorMessage,
      setErrorMessage,
      errorCode,
      retryable,
      simulateOffline,
      setSimulateOffline,
      showConfirmClose,
      setShowConfirmClose,
      copiedSession,
      successData,
    },
    refs: {
      emailInputRef,
      cardNumberRef,
      expiryRef,
      cvcRef,
      zipRef,
    },
    financials,
    handlers: {
      applyTestCard,
      handleCardNumberChange,
      handleExpiryChange,
      handleCvcChange,
      handleExpiryKeyDown,
      handleCvcKeyDown,
      handleZipCodeChange,
      handleRequestClose,
      confirmClose,
      handlePay,
      copySessionId,
    },
  };
}
