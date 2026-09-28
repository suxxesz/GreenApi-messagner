'use client';

import { getMessengerConfig, type MessengerType } from '@/entities/messenger';
import { useCreateChat } from '../model/useCreateChat';

interface Props {
  messenger: MessengerType;
  onCreated: (chatId: string) => void;
}

export function NewChatForm({ messenger, onCreated }: Props) {
  const { phone, setPhone, createChat, error } = useCreateChat(messenger, onCreated);
  const config = getMessengerConfig(messenger);

  return (
    <div className="border-b border-slate-200">
      <form onSubmit={createChat} className="p-3 flex gap-2">
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={config.chatPlaceholder}
          inputMode="tel"
          className="flex-1 rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-maxblue focus:ring-1 focus:ring-maxblue"
        />
        <button
          type="submit"
          disabled={!phone.trim()}
          className="rounded-lg bg-maxblue text-white px-3 text-sm font-medium disabled:opacity-50"
        >
          +
        </button>
      </form>
      {error && <p className="px-3 pb-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}
