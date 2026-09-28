import { memo } from 'react';
import type { ChatMessage } from '@/entities/message';

interface Props {
  message: ChatMessage;
}

function MessageBubbleImpl({ message }: Props) {
  const isOut = message.direction === 'out';

  return (
    <div className={`flex ${isOut ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
          isOut
            ? 'bg-maxbubbleOut rounded-br-sm'
            : 'bg-maxbubble rounded-bl-sm border border-slate-100'
        }`}
      >
        <div className="whitespace-pre-wrap break-words">{message.text}</div>
        <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
          <span>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isOut && message.status === 'sending' && <span>· отправка…</span>}
          {isOut && message.status === 'failed' && <span className="text-red-400">· ошибка</span>}
        </div>
      </div>
    </div>
  );
}

export const MessageBubble = memo(MessageBubbleImpl);
