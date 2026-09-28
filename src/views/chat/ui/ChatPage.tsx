'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadCredentials, clearCredentials, type Credentials } from '@/entities/session';
import { useMessagesStore } from '@/entities/message';
import { usePollIncomingMessages } from '@/features/receive-messages';
import { ChatSidebar } from '@/widgets/chat-sidebar';
import { ChatWindow } from '@/widgets/chat-window';
import { readStorage, writeStorage } from '@/shared/lib';
import { STORAGE_KEYS } from '@/shared/config';
import { Spinner } from '@/shared/ui';

export function ChatPage() {
  const router = useRouter();
  const [creds, setCreds] = useState<Credentials | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Скрытие плашки ошибки
  const [dismissedError, setDismissedError] = useState<string | null>(null);

  const scope = creds?.messenger ?? 'whatsapp';
  const { messages, appendMessage, updateMessageStatus } = useMessagesStore(scope);
  const { error: pollError } = usePollIncomingMessages(creds, appendMessage);

  // Автоматическое скрытие ошибки поллинга через 5 секунд
  useEffect(() => {
    if (pollError) {
      setDismissedError(null);
      const timer = setTimeout(() => {
        setDismissedError(pollError);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [pollError]);

  useEffect(() => {
    const saved = loadCredentials();
    if (!saved) {
      router.replace('/');
      return;
    }
    setCreds(saved);
    const savedChat = readStorage<string>(STORAGE_KEYS.activeChat(saved.messenger));
    if (savedChat) setActiveChatId(savedChat);
    setAuthChecked(true);
  }, [router]);

  useEffect(() => {
    if (activeChatId) {
      writeStorage(STORAGE_KEYS.activeChat(scope), activeChatId);
    }
  }, [activeChatId, scope]);

  function handleLogout() {
    clearCredentials();
    router.replace('/');
  }

  function handleSelectChat(chatId: string) {
    setActiveChatId(chatId);
  }

  function handleBack() {
    setActiveChatId(null);
  }

  if (!authChecked) {
    return (
      <main className="flex h-screen items-center justify-center text-slate-400">
        <Spinner className="h-6 w-6" />
      </main>
    );
  }

  const isErrorVisible = pollError && pollError !== dismissedError;

  return (
    <main className="flex h-screen  w-full overflow-hidden bg-white">
      <div
        className={`w-full md:w-80 md:shrink-0 md:block ${
          activeChatId ? 'hidden md:block' : 'block'
        } h-full`}
      >
        <ChatSidebar
          messenger={scope}
          messages={messages}
          activeChatId={activeChatId}
          onSelect={handleSelectChat}
          onCreate={handleSelectChat}
          onLogout={handleLogout}
        />
      </div>

      <div
        className={`w-full flex-1 ${
          activeChatId ? 'block' : 'hidden md:flex'
        } h-full`}
      >
        <ChatWindow
          creds={creds}
          chatId={activeChatId}
          messages={activeChatId ? messages[activeChatId] ?? [] : []}
          appendMessage={appendMessage}
          updateMessageStatus={updateMessageStatus}
          onBack={handleBack}
        />
      </div>

      {isErrorVisible && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center justify-between gap-3 max-w-xs sm:max-w-sm rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-xs text-red-600 shadow-md transition-all">
          <span className="flex-1">{pollError}</span>
          <button
            onClick={() => setDismissedError(pollError)}
            className="shrink-0 text-red-400 hover:text-red-600 font-bold text-sm leading-none p-0.5"
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>
      )}
    </main>
  );
}