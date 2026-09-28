'use client';

import { useState, type FormEvent } from 'react';
import { phoneToChatId } from '@/entities/chat';
import { STORAGE_KEYS } from '@/shared/config';
import { writeStorage } from '@/shared/lib';

export function useCreateChat(scope: string, onCreated: (chatId: string) => void) {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  function createChat(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const chatId = phoneToChatId(phone);
      writeStorage(STORAGE_KEYS.activeChat(scope), chatId);
      onCreated(chatId);
      setPhone('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Некорректный номер');
    }
  }

  return { phone, setPhone, createChat, error };
}
