/**
 * Dodo Payments - Embeddable Checkout SDK (v1.3.0)
 *
 * Small TypeScript SDK for opening an isolated hosted checkout without
 * navigating the merchant page away from its current context.
 */

import {
  DodoCheckoutOptions,
  DodoPostMessage,
  PaymentSuccessResult,
  PaymentErrorData,
  PaymentCloseData,
} from '../types';
import {
  CHECKOUT_SOURCE,
  PROTOCOL_VERSION,
  isCheckoutMessage,
  createHostMessage,
} from './messageProtocol';

export interface CheckoutHandle {
  sessionId: string;
  close: (reason?: PaymentCloseData['reason']) => void;
  iframe: HTMLIFrameElement | null;
  focus: () => void;
}

const DEFAULT_CHECKOUT_PATH = '/checkout.html';
const DEFAULT_HANDSHAKE_TIMEOUT_MS = 12000;

function resolveCheckoutOrigin(options: DodoCheckoutOptions): string {
  if (typeof window === 'undefined') return '';
  const configured = options.checkoutOrigin?.trim();
  if (!configured) return window.location.origin;

  try {
    return new URL(configured, window.location.href).origin;
  } catch {
    throw new Error('DodoCheckout checkoutOrigin must be a valid absolute or same-origin URL.');
  }
}

function getCheckoutUrl(options: DodoCheckoutOptions): { src: string; origin: string } {
  const origin = resolveCheckoutOrigin(options);
  return {
    src: `${origin}${DEFAULT_CHECKOUT_PATH}`,
    origin,
  };
}

export class DodoCheckoutSDK {
  public static readonly version = '1.3.0';

  private static activeSessionId: string | null = null;
  private static activeOverlay: HTMLDivElement | null = null;
  private static activeIframe: HTMLIFrameElement | null = null;
  private static activeContainer: HTMLElement | null = null;
  private static activeOptions: DodoCheckoutOptions | null = null;
  private static activeCheckoutOrigin: string | null = null;
  private static messageHandler: ((event: MessageEvent) => void) | null = null;
  private static keydownHandler: ((event: KeyboardEvent) => void) | null = null;
  private static prevFocusedElement: HTMLElement | null = null;
  private static prevBodyOverflow = '';
  private static prevBodyPaddingRight = '';
  private static loadTimeoutTimer: ReturnType<typeof setTimeout> | null = null;

  /** Preload the checkout document without opening a checkout session. */
  public static preload(options?: Pick<DodoCheckoutOptions, 'checkoutOrigin'>): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    const origin = resolveCheckoutOrigin({
      productId: 'preload',
      checkoutOrigin: options?.checkoutOrigin,
      onSuccess: () => {},
    });

    const existing = document.querySelector<HTMLIFrameElement>('iframe[data-dodo-checkout-preload="true"]');
    if (existing) return;

    const iframe = document.createElement('iframe');
    iframe.dataset.dodoCheckoutPreload = 'true';
    iframe.style.cssText = 'position:absolute;width:0;height:0;border:0;visibility:hidden;pointer-events:none;';
    iframe.setAttribute('aria-hidden', 'true');
    iframe.setAttribute('tabindex', '-1');
    iframe.src = `${origin}${DEFAULT_CHECKOUT_PATH}?preload=true`;
    document.body.appendChild(iframe);
  }

  public static open(options: DodoCheckoutOptions): CheckoutHandle {
    return this.initializeCheckout({ ...options, mode: 'modal' });
  }

  public static embed(target: string | HTMLElement, options: DodoCheckoutOptions): CheckoutHandle {
    if (!options?.productId) {
      return this.failInvalidOptions(options, 'DodoCheckout requires a valid "productId".');
    }

    const container =
      typeof target === 'string'
        ? (document.querySelector(target) as HTMLElement | null)
        : target;

    if (!container) {
      const err: PaymentErrorData = {
        code: 'TARGET_CONTAINER_NOT_FOUND',
        message: `DodoCheckout.embed() target element "${String(target)}" was not found in the DOM.`,
      };
      options.onError?.(err);
      return this.emptyHandle();
    }

    return this.initializeCheckout({ ...options, mode: 'inline', container });
  }

  private static emptyHandle(): CheckoutHandle {
    return { sessionId: '', close: () => {}, iframe: null, focus: () => {} };
  }

  private static failInvalidOptions(
    options: DodoCheckoutOptions | undefined,
    message: string,
  ): CheckoutHandle {
    options?.onError?.({ code: 'INVALID_OPTIONS', message });
    return this.emptyHandle();
  }

  private static initializeCheckout(options: DodoCheckoutOptions): CheckoutHandle {
    if (!options?.productId || typeof document === 'undefined' || typeof window === 'undefined') {
      return this.failInvalidOptions(options, 'DodoCheckout requires a browser environment and a valid "productId".');
    }

    if (this.activeSessionId) {
      this.activeIframe?.focus();
      return {
        sessionId: this.activeSessionId,
        close: () => this.close('user_closed'),
        iframe: this.activeIframe,
        focus: () => this.activeIframe?.focus(),
      };
    }

    try {
      const checkout = getCheckoutUrl(options);
      const sessionId = `dodo_sess_${crypto.randomUUID()}`;

      this.prevFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      this.activeSessionId = sessionId;
      this.activeOptions = options;
      this.activeCheckoutOrigin = checkout.origin;

      options.onEvent?.({
        event: 'checkout_initiated',
        timestamp: new Date().toISOString(),
        payload: { sessionId, productId: options.productId, mode: options.mode || 'modal' },
      });

      if (options.mode === 'inline' && options.container) {
        this.mountInline(sessionId, options, checkout.src);
      } else {
        this.mountModal(sessionId, options, checkout.src);
      }

      return {
        sessionId,
        close: (reason) => this.close(reason || 'user_closed'),
        iframe: this.activeIframe,
        focus: () => this.activeIframe?.focus(),
      };
    } catch (error) {
      this.teardownDOM();
      const message = error instanceof Error ? error.message : 'Unable to initialize checkout.';
      options.onError?.({ code: 'CHECKOUT_INITIALIZATION_FAILED', message });
      return this.emptyHandle();
    }
  }

  public static close(reason: PaymentCloseData['reason'] = 'user_closed') {
    if (!this.activeSessionId) return;
    const currentOptions = this.activeOptions;
    this.teardownDOM();
    currentOptions?.onClose?.({ reason });
    currentOptions?.onEvent?.({
      event: 'checkout_closed',
      timestamp: new Date().toISOString(),
      payload: { reason },
    });
  }

  public static isOpened(): boolean {
    return this.activeSessionId !== null;
  }

  private static createIframe(
    sessionId: string,
    options: DodoCheckoutOptions,
    checkoutUrl: string,
  ): HTMLIFrameElement {
    const iframe = document.createElement('iframe');
    iframe.id = 'dodo-checkout-iframe';
    iframe.title = 'Dodo Payments Secure Checkout';
    iframe.setAttribute('allow', 'payment');
    iframe.setAttribute('tabindex', '0');
    iframe.setAttribute('sandbox', 'allow-scripts allow-forms allow-same-origin');
    iframe.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
      background: transparent;
      opacity: 0;
      transition: opacity 240ms ease-out;
      flex: 1;
    `;

    const url = new URL(checkoutUrl, window.location.href);
    url.searchParams.set('sessionId', sessionId);
    url.searchParams.set('productId', options.productId);
    if (options.amount !== undefined) url.searchParams.set('amount', String(options.amount));
    if (options.currency) url.searchParams.set('currency', options.currency);
    if (options.title) url.searchParams.set('title', options.title);
    if (options.customerEmail) url.searchParams.set('customerEmail', options.customerEmail);
    if (options.customerName) url.searchParams.set('customerName', options.customerName);
    
    const isDarkTheme =
      options.theme === 'dark' ||
      (options.theme !== 'light' &&
        typeof document !== 'undefined' &&
        (document.documentElement.classList.contains('dark') ||
          document.documentElement.getAttribute('data-theme') === 'dark'));
    url.searchParams.set('theme', isDarkTheme ? 'dark' : 'light');
    if (options.mode) url.searchParams.set('mode', options.mode);

    const currentBrandColor =
      options.themeColor ||
      (typeof window !== 'undefined'
        ? getComputedStyle(document.documentElement).getPropertyValue('--brand-primary').trim()
        : '');
    if (currentBrandColor) {
      url.searchParams.set('themeColor', currentBrandColor);
    }

    iframe.src = url.toString();
    return iframe;
  }

  private static mountModal(sessionId: string, options: DodoCheckoutOptions, checkoutUrl: string) {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    this.prevBodyOverflow = document.body.style.overflow;
    this.prevBodyPaddingRight = document.body.style.paddingRight;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    const isDark =
      options.theme === 'dark' ||
      (options.theme !== 'light' &&
        typeof document !== 'undefined' &&
        (document.documentElement.classList.contains('dark') ||
          document.documentElement.getAttribute('data-theme') === 'dark'));
    const isLight = !isDark;

    const overlay = document.createElement('div');
    overlay.id = 'dodo-checkout-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Dodo Payments Secure Checkout');
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      background: ${isLight ? 'rgba(9, 9, 11, 0.72)' : 'rgba(0, 0, 0, 0.85)'};
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 200ms cubic-bezier(0.16, 1, 0.3, 1);
      padding: clamp(6px, 2.5vw, 16px);
      box-sizing: border-box;
    `;

    const frameWrapper = document.createElement('div');
    frameWrapper.id = 'dodo-checkout-modal-container';
    frameWrapper.style.cssText = `
      position: relative;
      width: 100%;
      max-width: 490px;
      height: 100%;
      max-height: min(740px, 96vh);
      background: ${isLight ? '#FFFFFF' : '#0E0F12'};
      border-radius: 14px;
      box-shadow: ${
        isLight
          ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)'
          : '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.08)'
      };
      border: 1px solid ${isLight ? '#E2E8F0' : '#262930'};
      overflow: hidden;
      transform: scale(0.97) translateY(8px);
      transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1), height 200ms ease;
      display: flex;
      flex-direction: column;
    `;

    const loader = this.createLoader(options.theme);
    const iframe = this.createIframe(sessionId, options, checkoutUrl);
    frameWrapper.append(loader, iframe);
    overlay.appendChild(frameWrapper);
    document.body.appendChild(overlay);

    this.activeOverlay = overlay;
    this.activeIframe = iframe;

    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      frameWrapper.style.transform = 'scale(1) translateY(0)';
    });

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) this.close('backdrop_click');
    });

    this.keydownHandler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        this.close('escape_key');
      }
    };
    window.addEventListener('keydown', this.keydownHandler);
    this.setupPostMessageListener(sessionId, loader, iframe, frameWrapper);
  }

  private static mountInline(sessionId: string, options: DodoCheckoutOptions, checkoutUrl: string) {
    const targetElement = options.container
      ? typeof options.container === 'string'
        ? (document.querySelector(options.container) as HTMLElement | null)
        : options.container
      : null;

    if (!targetElement) {
      throw new Error('Inline checkout target container was not found.');
    }

    targetElement.innerHTML = '';
    targetElement.style.position = 'relative';
    targetElement.style.minHeight = '640px';

    const loader = this.createLoader(options.theme);
    const iframe = this.createIframe(sessionId, options, checkoutUrl);
    targetElement.append(loader, iframe);
    this.activeContainer = targetElement;
    this.activeIframe = iframe;
    this.setupPostMessageListener(sessionId, loader, iframe, targetElement);
  }

  private static createLoader(theme?: 'dark' | 'light' | 'auto'): HTMLDivElement {
    const isDark =
      theme === 'dark' ||
      (theme !== 'light' &&
        typeof document !== 'undefined' &&
        (document.documentElement.classList.contains('dark') ||
          document.documentElement.getAttribute('data-theme') === 'dark'));
    const isLight = !isDark;
    const loader = document.createElement('div');
    loader.id = 'dodo-checkout-loader';
    loader.style.cssText = `
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: ${isLight ? '#FFFFFF' : '#0E0F12'};
      color: ${isLight ? '#64748B' : '#A0A0A0'};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 13px;
      z-index: 10;
      gap: 12px;
      transition: opacity 180ms ease;
    `;
    loader.innerHTML = `
      <div style="width: 32px; height: 32px; border: 2px solid ${isLight ? '#E2E8F0' : '#262930'}; border-top-color: ${isLight ? '#0F172A' : '#B6FF00'}; border-radius: 50%; animation: dodo-spin 0.7s cubic-bezier(0.4, 0, 0.2, 1) infinite;"></div>
      <div style="font-weight: 600; color: ${isLight ? '#0F172A' : '#F5F5F5'}; display: flex; align-items: center; gap: 6px; font-size: 13px;">
        <span>Opening secure checkout</span>
      </div>
      <style>@keyframes dodo-spin { to { transform: rotate(360deg); } }</style>
    `;
    return loader;
  }

  private static setupPostMessageListener(
    sessionId: string,
    loader: HTMLDivElement,
    iframe: HTMLIFrameElement,
    wrapper: HTMLElement,
  ) {
    this.loadTimeoutTimer = setTimeout(() => {
      if (!this.activeSessionId || this.activeSessionId !== sessionId) return;
      loader.textContent = 'Checkout could not be loaded. Please close and try again.';
      loader.style.opacity = '1';
      iframe.style.opacity = '0';
      this.activeOptions?.onError?.({
        code: 'CHECKOUT_HANDSHAKE_TIMEOUT',
        message: `Checkout did not become ready within ${DEFAULT_HANDSHAKE_TIMEOUT_MS / 1000} seconds.`,
        details: { sessionId },
      });
    }, DEFAULT_HANDSHAKE_TIMEOUT_MS);

    this.messageHandler = (event: MessageEvent) => {
      if (!this.activeCheckoutOrigin || event.origin !== this.activeCheckoutOrigin) return;
      if (event.source !== iframe.contentWindow) return;
      if (!isCheckoutMessage(event.data)) return;
      if (event.data.source !== CHECKOUT_SOURCE) return;
      if (event.data.sessionId !== sessionId) return;

      switch (event.data.type) {
        case 'DODO_CHECKOUT_READY': {
          this.clearHandshakeTimer();
          loader.style.opacity = '0';
          window.setTimeout(() => loader.parentElement?.removeChild(loader), 240);
          iframe.style.opacity = '1';
          iframe.focus();
          this.activeOptions?.onEvent?.({
            event: 'checkout_ready',
            timestamp: new Date().toISOString(),
            payload: { sessionId },
          });
          break;
        }

        case 'DODO_CHECKOUT_RESIZE': {
          const height = (event.data.payload as { height?: unknown } | undefined)?.height;
          if (typeof height === 'number' && Number.isFinite(height) && height > 300) {
            wrapper.style.maxHeight = `${Math.min(height + 10, window.innerHeight * 0.94)}px`;
          }
          break;
        }

        case 'DODO_CHECKOUT_EVENT': {
          const payload = event.data.payload as { event?: unknown } | undefined;
          this.activeOptions?.onEvent?.({
            event: typeof payload?.event === 'string' ? payload.event : 'checkout_progress',
            timestamp: new Date().toISOString(),
            payload: event.data.payload,
          });
          break;
        }

        case 'DODO_CHECKOUT_SUCCESS': {
          this.activeOptions?.onEvent?.({
            event: 'payment_settled',
            timestamp: new Date().toISOString(),
            payload: event.data.payload,
          });
          this.activeOptions?.onSuccess(event.data.payload as PaymentSuccessResult);
          break;
        }

        case 'DODO_CHECKOUT_ERROR': {
          this.activeOptions?.onEvent?.({
            event: 'payment_failed',
            timestamp: new Date().toISOString(),
            payload: event.data.payload,
          });
          this.activeOptions?.onError?.(event.data.payload as PaymentErrorData);
          break;
        }

        case 'DODO_CHECKOUT_CLOSE': {
          const reason =
            (event.data.payload as { reason?: PaymentCloseData['reason'] } | undefined)?.reason ||
            'completed';
          this.close(reason);
          break;
        }
      }
    };

    window.addEventListener('message', this.messageHandler);

    const initMessage = createHostMessage('DODO_CHECKOUT_INIT', sessionId, {
      productId: this.activeOptions?.productId,
      mode: this.activeOptions?.mode,
    });
    iframe.addEventListener('load', () => {
      iframe.contentWindow?.postMessage(initMessage, this.activeCheckoutOrigin || '*');
    }, { once: true });
  }

  private static clearHandshakeTimer() {
    if (this.loadTimeoutTimer) {
      clearTimeout(this.loadTimeoutTimer);
      this.loadTimeoutTimer = null;
    }
  }

  private static teardownDOM() {
    this.clearHandshakeTimer();

    if (this.messageHandler) {
      window.removeEventListener('message', this.messageHandler);
      this.messageHandler = null;
    }
    if (this.keydownHandler) {
      window.removeEventListener('keydown', this.keydownHandler);
      this.keydownHandler = null;
    }

    const overlay = this.activeOverlay;
    if (overlay) {
      overlay.style.opacity = '0';
      const container = overlay.querySelector('#dodo-checkout-modal-container') as HTMLElement | null;
      if (container) container.style.transform = 'scale(0.96) translateY(12px)';
      window.setTimeout(() => overlay.parentElement?.removeChild(overlay), 220);
    }

    if (this.activeContainer) {
      this.activeContainer.innerHTML = '';
      this.activeContainer = null;
    }

    if (typeof document !== 'undefined') {
      document.body.style.overflow = this.prevBodyOverflow;
      document.body.style.paddingRight = this.prevBodyPaddingRight;
    }

    const previousFocus = this.prevFocusedElement;
    this.prevFocusedElement = null;
    if (previousFocus?.isConnected) {
      try {
        previousFocus.focus();
      } catch {
        // Ignore focus restoration failures when the element was removed.
      }
    }

    this.activeOverlay = null;
    this.activeIframe = null;
    this.activeSessionId = null;
    this.activeOptions = null;
    this.activeCheckoutOrigin = null;
  }
}

export const DodoCheckout = DodoCheckoutSDK;

if (typeof window !== 'undefined') {
  (window as typeof window & { DodoCheckout?: typeof DodoCheckoutSDK }).DodoCheckout = DodoCheckoutSDK;
}
