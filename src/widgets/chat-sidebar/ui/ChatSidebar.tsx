'use client';

import { useMemo } from 'react';
import { chatIdToPhone, formatPhoneDisplay } from '@/entities/chat';
import type { MessagesByChat } from '@/entities/message';
import { getMessengerConfig, type MessengerType } from '@/entities/messenger';
import { NewChatForm } from '@/features/create-chat';
import { Badge } from '@/shared/ui';

interface Props {
  messenger: MessengerType;
  messages: MessagesByChat;
  activeChatId: string | null;
  onSelect: (chatId: string) => void;
  onCreate: (chatId: string) => void;
  onLogout: () => void;
}

export function ChatSidebar({ messenger, messages, activeChatId, onSelect, onCreate, onLogout }: Props) {
  const config = getMessengerConfig(messenger);

  const sortedChatIds = useMemo(() => {
    return Object.keys(messages).sort((a, b) => {
      const lastA = messages[a][messages[a].length - 1]?.timestamp ?? 0;
      const lastB = messages[b][messages[b].length - 1]?.timestamp ?? 0;
      return lastB - lastA;
    });
  }, [messages]);

  return (
    <aside className="w-full h-full border-r border-slate-200 bg-white flex flex-col">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-base">Чаты</span>
          <Badge tone={'blue'}>{config.shortLabel}</Badge>
        </div>
        <button onClick={onLogout} className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1">
          Выйти
        </button>
      </div>

      <NewChatForm messenger={messenger} onCreated={onCreate} />

      <div className="flex-1 overflow-y-auto">
        {sortedChatIds.length === 0 && (
          <p className="text-sm text-slate-400 p-4">Пока нет чатов. Создайте новый по номеру телефона.</p>
        )}
        {sortedChatIds.map((chatId) => {
          const list = messages[chatId];
          const last = list[list.length - 1];
          return (
            <button
              key={chatId}
              onClick={() => onSelect(chatId)}
              className={`w-full text-left px-4 py-3.5 border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                chatId === activeChatId ? 'bg-slate-100' : ''
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium truncate">{formatPhoneDisplay(chatIdToPhone(chatId))}</span>
                {last?.direction === 'out' && last.status === 'sending' && (
                  <span className="shrink-0 text-[10px] text-slate-400">•••</span>
                )}
              </div>
              {last && <div className="text-xs text-slate-400 truncate mt-0.5">{last.text}</div>}
            </button>
          );
        })}
      </div>
    </aside>
  );
}