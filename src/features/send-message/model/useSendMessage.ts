'use client';

import { useState, type FormEvent } from 'react';
import { sendMessageRequest } from '@/shared/api/green-api';
import type { Credentials } from '@/entities/session';
import type { ChatMessage } from '@/entities/message';

interface Params {
  creds: Credentials | null;
  chatId: string | null;
  appendMessage: (chatId: string, msg: ChatMessage) => void;
  updateMessageStatus: (chatId: string, id: string, status: ChatMessage['status']) => void;
}

export function useSendMessage({ creds, chatId, appendMessage, updateMessageStatus }: Params) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send(e: FormEvent) {
    e.preventDefault();
    if (!creds || !chatId || !text.trim()) return;

    const body = text.trim();
    const tempId = `local-${Date.now()}`;
    setText('');
    setSending(true);
    setError(null);

    appendMessage(chatId, {
      id: tempId,
      chatId,
      text: body,
      direction: 'out',
      timestamp: Date.now(),
      status: 'sending',
    });

    try {
      await sendMessageRequest(creds, chatId, body);
      updateMessageStatus(chatId, tempId, 'sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка отправки сообщения');
      updateMessageStatus(chatId, tempId, 'failed');
    } finally {
      setSending(false);
    }
  }

  return { text, setText, send, sending, error };
}
