import type { MessengerConfig, MessengerType } from './types';

// 
//   WhatsApp/MAX и Telegram у GREEN-API используют один и тот же формат запроса
//  ({{apiUrl}}/waInstance{{idInstance}}/{{method}}/{{apiTokenInstance}}) и один
//  и тот же формат chatId (<номер>@c.us), поэтому оба варианта обслуживает
//  один и тот же shared/api/green-api клиент   
export const MESSENGERS: Record<MessengerType, MessengerConfig> = {
  whatsapp: {
    id: 'whatsapp',
    label: 'WhatsApp / MAX',
    shortLabel: 'WhatsApp',
    chatPlaceholder: '79991234567',
    helpUrl: 'https://green-api.com/max',
  },
  telegram: {
    id: 'telegram',
    label: 'Telegram',
    shortLabel: 'Telegram',
    chatPlaceholder: '79991234567',
    helpUrl: 'https://green-api.com/telegram',
  },
};

export const MESSENGER_LIST: MessengerConfig[] = Object.values(MESSENGERS);

export function getMessengerConfig(type: MessengerType): MessengerConfig {
  return MESSENGERS[type];
}
