import type { IncomingNotificationBody, ReceiveNotificationResponse } from '@/shared/api/green-api';

export type { IncomingNotificationBody, ReceiveNotificationResponse };

export interface ChatMessage {
  id: string;
  chatId: string;
  text: string;
  direction: 'in' | 'out';
  timestamp: number;
  status?: 'sending' | 'sent' | 'failed';
}
