'use client';

import { useEffect, useState } from 'react';
import type { Credentials } from '@/entities/session';
import type { ChatMessage } from '@/entities/message';
import { useSendMessage } from '../model/useSendMessage';

interface Props {
  creds: Credentials | null;
  chatId: string | null;
  appendMessage: (chatId: string, msg: ChatMessage) => void;
  updateMessageStatus: (chatId: string, id: string, status: ChatMessage['status']) => void;
}

export function MessageInput({ creds, chatId, appendMessage, updateMessageStatus }: Props) {
  const { text, setText, send, sending, error } = useSendMessage({
    creds,
    chatId,
    appendMessage,
    updateMessageStatus,
  });

  const [dismissedError, setDismissedError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      setDismissedError(null);
      const timer = setTimeout(() => {
        setDismissedError(error);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const isErrorVisible = error && error !== dismissedError;

  return (
    <div className="shrink-0 bg-white">
      {isErrorVisible && (
        <div className="px-4 py-2 text-xs text-red-600 bg-red-50 border-t border-red-100 flex items-center justify-between gap-2">
          <span className="flex-1 break-words">{error}</span>
          <button
            type="button"
            onClick={() => setDismissedError(error)}
            className="shrink-0 text-red-400 hover:text-red-600 font-bold text-sm leading-none p-1"
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>
      )}
      <form onSubmit={send} className="border-t border-slate-200 px-3 py-2.5 sm:px-4 sm:py-3 flex gap-2 items-center">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Написать сообщение…"
          className="flex-1 rounded-full border border-slate-300 px-4 py-2 text-base sm:text-sm outline-none focus:border-maxblue focus:ring-1 focus:ring-maxblue"
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="rounded-full bg-maxblue text-white px-4 sm:px-5 py-2 text-sm font-medium disabled:opacity-50 shrink-0"
        >
          Отправить
        </button>
      </form>
    </div>
  );
}