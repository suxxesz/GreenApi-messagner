'use client';

import { useEffect, useRef, useState } from 'react';
import { receiveNotificationRequest, deleteNotificationRequest } from '@/shared/api/green-api';
import { POLL_INTERVAL_MS, RECEIVE_TIMEOUT_SEC } from '@/shared/config';
import type { Credentials } from '@/entities/session';
import type { ChatMessage } from '@/entities/message';

export function usePollIncomingMessages(
  creds: Credentials | null,
  appendMessage: (chatId: string, msg: ChatMessage) => void
) {
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef(false);

  useEffect(() => {
    if (!creds) return;
    let cancelled = false;

    async function poll() {
      if (pollingRef.current || cancelled) return;
      pollingRef.current = true;
      try {
        const notification = await receiveNotificationRequest(creds!, RECEIVE_TIMEOUT_SEC);
        if (notification) {
          const { body, receiptId } = notification;
          const text =
            body.messageData?.textMessageData?.textMessage ??
            body.messageData?.extendedTextMessageData?.text;

          if (body.typeWebhook === 'incomingMessageReceived' && body.senderData?.chatId && text) {
            appendMessage(body.senderData.chatId, {
              id: body.idMessage ?? String(receiptId),
              chatId: body.senderData.chatId,
              text,
              direction: 'in',
              timestamp: body.timestamp ? body.timestamp * 1000 : Date.now(),
              status: 'sent',
            });
          }
          await deleteNotificationRequest(creds!, receiptId);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка получения сообщений');
      } finally {
        pollingRef.current = false;
      }
    }

    const interval = setInterval(poll, POLL_INTERVAL_MS);
    poll();

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [creds, appendMessage]);

  return { error };
}
