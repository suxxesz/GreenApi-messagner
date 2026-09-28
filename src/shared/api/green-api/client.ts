import { GREEN_API_BASE } from '@/shared/config';
import type { GreenApiCredentials, ReceiveNotificationResponse } from './types';

export class GreenApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number
  ) {
    super(message);
    this.name = 'GreenApiError';
  }
}

function buildUrl(creds: GreenApiCredentials, method: string, extra = ''): string {
  return `${GREEN_API_BASE}/waInstance${creds.idInstance}/${method}/${creds.apiTokenInstance}${extra}`;
}

async function safeText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return '';
  }
}

/**
 * Безопасный парсинг JSON: GREEN-API может отдать 200 OK с пустым телом
 * (например, receiveNotification при пустой очереди — это не всегда 204,
 * как можно было бы ожидать). Голый res.json() на пустом теле падает с
 * "Unexpected end of JSON input"; здесь пустое/невалидное тело — это null.
 */
async function safeJson<T>(res: Response): Promise<T | null> {
  const text = await safeText(res);
  if (!text.trim()) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

/**
 * Проверка валидности учётных данных инстанса.
 */
export async function getSettingsRequest(creds: GreenApiCredentials): Promise<boolean> {
  const res = await fetch(buildUrl(creds, 'getSettings'));
  return res.ok;
}

/**
 * Отправка текстового сообщения.
 * POST /waInstance{idInstance}/sendMessage/{apiTokenInstance}
 * https://green-api.com/v3/docs/api/sending/SendMessage/
 */
export async function sendMessageRequest(
  creds: GreenApiCredentials,
  chatId: string,
  message: string
): Promise<{ idMessage: string }> {
  const res = await fetch(buildUrl(creds, 'sendMessage'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId, message }),
  });
  if (!res.ok) throw new GreenApiError(`Ошибка отправки: ${await safeText(res)}`, res.status);
  const data = await safeJson<{ idMessage: string }>(res);
  if (!data) throw new GreenApiError('Сервер вернул пустой ответ на отправку сообщения', res.status);
  return data;
}

/**
 * Получение одного уведомления из очереди.
 * GET /waInstance{idInstance}/receiveNotification/{apiTokenInstance}?receiveTimeout=N
 * https://green-api.com/v3/docs/api/receiving/technology-http-api/
 */
export async function receiveNotificationRequest(
  creds: GreenApiCredentials,
  receiveTimeout: number,
  signal?: AbortSignal
): Promise<ReceiveNotificationResponse | null> {
  const res = await fetch(buildUrl(creds, 'receiveNotification', `?receiveTimeout=${receiveTimeout}`), {
    signal,
  });
  // Пустая очередь: GREEN-API отдаёт либо 204 без тела, либо 200 с пустым/`null` телом.
  if (res.status === 204) return null;
  if (!res.ok) throw new GreenApiError(`Ошибка получения уведомлений: ${await safeText(res)}`, res.status);
  return safeJson<ReceiveNotificationResponse>(res);
}

/**
 * Удаление обработанного уведомления из очереди.
 * DELETE /waInstance{idInstance}/deleteNotification/{apiTokenInstance}/{receiptId}
 */
export async function deleteNotificationRequest(creds: GreenApiCredentials, receiptId: number): Promise<void> {
  const res = await fetch(buildUrl(creds, 'deleteNotification', `/${receiptId}`), { method: 'DELETE' });
  if (!res.ok) throw new GreenApiError(`Ошибка удаления уведомления: ${await safeText(res)}`, res.status);
}
