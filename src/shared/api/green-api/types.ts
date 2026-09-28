/**
 * Сырые контракты GREEN-API (WhatsApp/MAX и Telegram-продукт используют
 * одинаковую форму запроса/ответа). Эти типы — граница внешней системы,
 * поэтому живут в shared, а не в entities: entities/session и
 * entities/message переиспользуют их сверху вниз, не создавая обратной
 * зависимости shared -> entities.
 */
export interface GreenApiCredentials {
  idInstance: string;
  apiTokenInstance: string;
}

export interface IncomingNotificationBody {
  typeWebhook: string;
  timestamp?: number;
  idMessage?: string;
  senderData?: {
    chatId: string;
    sender: string;
    senderName?: string;
  };
  messageData?: {
    typeMessage: string;
    textMessageData?: { textMessage: string };
    extendedTextMessageData?: { text: string };
  };
}

export interface ReceiveNotificationResponse {
  receiptId: number;
  body: IncomingNotificationBody;
}
