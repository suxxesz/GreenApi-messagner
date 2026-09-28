export const GREEN_API_BASE = 'https://api.green-api.com';
export const POLL_INTERVAL_MS = 4000;
export const RECEIVE_TIMEOUT_SEC = 5;
/** Минимальная длина номера телефона (цифрами), при которой он считается валидным */
export const MIN_PHONE_DIGITS = 10;

/**
 * Ключи хранилища scope'ятся строкой мессенджера, чтобы при переключении
 * WhatsApp/MAX <-> Telegram чаты и активный чат не смешивались между собой.
 * shared не знает о типе MessengerType (нижний слой FSD не импортирует entities) —
 * поэтому scope принимается как обычная строка.
 */
export const STORAGE_KEYS = {
  credentials: 'green-api-creds',
  messages: (scope: string) => `green-api-messages:${scope}`,
  activeChat: (scope: string) => `green-api-active-chat:${scope}`,
} as const;
