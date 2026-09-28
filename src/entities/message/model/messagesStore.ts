'use client';

import { useCallback, useEffect, useState } from 'react';
import { STORAGE_KEYS } from '@/shared/config';
import { readStorage, writeStorage } from '@/shared/lib';
import type { ChatMessage } from './types';

export type MessagesByChat = Record<string, ChatMessage[]>;

// 
//   Хранилище сообщений по чатам с персистентностью в localStorage.
//   scope — идентификатор мессенджера ('whatsapp' | 'telegram'), чтобы чаты
//  разных мессенджеров не пересекались в одном хранилище.
//  
export function useMessagesStore(scope: string) {
  const [messages, setMessages] = useState<MessagesByChat>({});
  const storageKey = STORAGE_KEYS.messages(scope);

  useEffect(() => {
    setMessages(readStorage<MessagesByChat>(storageKey) ?? {});
  }, [storageKey]);

  useEffect(() => {
    writeStorage(storageKey, messages);
  }, [storageKey, messages]);

  const appendMessage = useCallback((chatId: string, msg: ChatMessage) => {
    setMessages((prev) => {
      const existing = prev[chatId] ?? [];
      // если DeleteNotification не успел примениться между поллами.
      if (existing.some((m) => m.id === msg.id)) return prev;
      return { ...prev, [chatId]: [...existing, msg] };
    });
  }, []);

  const updateMessageStatus = useCallback(
    (chatId: string, id: string, status: ChatMessage['status']) => {
      setMessages((prev) => ({
        ...prev,
        [chatId]: (prev[chatId] ?? []).map((m) => (m.id === id ? { ...m, status } : m)),
      }));
    },
    []
  );

  return { messages, appendMessage, updateMessageStatus };
}
