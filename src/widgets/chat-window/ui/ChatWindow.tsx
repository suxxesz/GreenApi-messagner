'use client';

import { useEffect, useRef } from 'react';
import { chatIdToPhone, formatPhoneDisplay } from '@/entities/chat';
import type { ChatMessage } from '@/entities/message';
import type { Credentials } from '@/entities/session';
import { getMessengerConfig } from '@/entities/messenger';
import { MessageInput } from '@/features/send-message';
import { MessageBubble } from './MessageBubble';

interface Props {
  creds: Credentials | null;
  chatId: string | null;
  messages: ChatMessage[];
  appendMessage: (chatId: string, msg: ChatMessage) => void;
  updateMessageStatus: (chatId: string, id: string, status: ChatMessage['status']) => void;
  onBack?: () => void;
}

export function ChatWindow({ creds, chatId, messages, appendMessage, updateMessageStatus, onBack }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  if (!chatId) {
    return (
      <div className="flex-1 hidden md:flex items-center justify-center text-slate-400 text-sm px-6 text-center">
        Выберите чат слева или создайте новый по номеру телефона
      </div>
    );
  }

  const messengerLabel = creds ? getMessengerConfig(creds.messenger).shortLabel : 'Чат';

  return (
    <section className="flex-1 flex flex-col min-w-0 h-full bg-slate-50/50">
      <div className="border-b border-slate-200 bg-white px-4 py-3 sm:px-6 sm:py-4 flex items-center gap-3 shrink-0">
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden flex items-center gap-1 text-sm text-maxblue font-medium hover:opacity-80 pr-1"
            aria-label="Назад к списку чатов"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Чаты</span>
          </button>
        )}
        <div className="min-w-0 flex-1">
          <div className="font-medium text-sm sm:text-base truncate">{formatPhoneDisplay(chatIdToPhone(chatId))}</div>
          <div className="text-xs text-slate-400">{messengerLabel}</div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 sm:px-6 sm:py-4 space-y-2">
        {messages.length === 0 && (
          <p className="text-sm text-slate-400 text-center mt-8">
            Сообщений пока нет — напишите первое сообщение ниже
          </p>
        )}
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
      </div>

      <MessageInput
        creds={creds}
        chatId={chatId}
        appendMessage={appendMessage}
        updateMessageStatus={updateMessageStatus}
      />
    </section>
  );
}