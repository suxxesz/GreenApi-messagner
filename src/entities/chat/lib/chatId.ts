import { MIN_PHONE_DIGITS } from '@/shared/config';

/**
 * Нормализует номер телефона в chatId формата GREEN-API: 79991234567@c.us.
 * Формат общий для WhatsApp/MAX и Telegram-продукта GREEN-API.
 */
export function phoneToChatId(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, '');
  if (digits.length < MIN_PHONE_DIGITS) {
    throw new Error(`Номер должен содержать минимум ${MIN_PHONE_DIGITS} цифр`);
  }
  return `${digits}@c.us`;
}

export function chatIdToPhone(chatId: string): string {
  return chatId.replace('@c.us', '').replace('@g.us', '');
}

export function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 11) return phone;
  return `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
}
