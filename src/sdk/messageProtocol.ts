export const SDK_SOURCE = 'dodo-checkout-sdk' as const;
export const CHECKOUT_SOURCE = 'dodo-checkout-app' as const;
export const PROTOCOL_VERSION = '1.0' as const;

export const CHECKOUT_TO_HOST_TYPES = [
  'DODO_CHECKOUT_READY',
  'DODO_CHECKOUT_EVENT',
  'DODO_CHECKOUT_SUCCESS',
  'DODO_CHECKOUT_ERROR',
  'DODO_CHECKOUT_CLOSE',
  'DODO_CHECKOUT_RESIZE',
] as const;

export type CheckoutToHostType = (typeof CHECKOUT_TO_HOST_TYPES)[number];
export type HostToCheckoutType =
  | 'DODO_CHECKOUT_INIT'
  | 'DODO_CHECKOUT_REQUEST_CLOSE';

export interface CheckoutMessage {
  source: typeof CHECKOUT_SOURCE;
  type: CheckoutToHostType;
  protocolVersion: typeof PROTOCOL_VERSION;
  sessionId: string;
  payload?: unknown;
}

export interface HostMessage {
  source: typeof SDK_SOURCE;
  type: HostToCheckoutType;
  protocolVersion: typeof PROTOCOL_VERSION;
  sessionId: string;
  payload?: unknown;
}

export function isCheckoutMessage(value: unknown): value is CheckoutMessage {
  if (!value || typeof value !== 'object') return false;

  const message = value as Record<string, unknown>;

  return (
    message.source === CHECKOUT_SOURCE &&
    typeof message.type === 'string' &&
    (CHECKOUT_TO_HOST_TYPES as readonly string[]).includes(message.type) &&
    message.protocolVersion === PROTOCOL_VERSION &&
    typeof message.sessionId === 'string' &&
    message.sessionId.length > 0
  );
}

export function isHostMessage(value: unknown): value is HostMessage {
  if (!value || typeof value !== 'object') return false;

  const message = value as Record<string, unknown>;

  return (
    message.source === SDK_SOURCE &&
    (message.type === 'DODO_CHECKOUT_INIT' ||
      message.type === 'DODO_CHECKOUT_REQUEST_CLOSE') &&
    message.protocolVersion === PROTOCOL_VERSION &&
    typeof message.sessionId === 'string' &&
    message.sessionId.length > 0
  );
}

export function createHostMessage(
  type: HostToCheckoutType,
  sessionId: string,
  payload?: unknown,
): HostMessage {
  return {
    source: SDK_SOURCE,
    type,
    protocolVersion: PROTOCOL_VERSION,
    sessionId,
    ...(payload === undefined ? {} : { payload }),
  };
}
