'use client';

import { useId, useState } from 'react';
import { Button, Select, Spinner, Badge } from '@/shared/ui';
import { MESSENGER_LIST, type MessengerType } from '@/entities/messenger';
import { useLogin } from '../model/useLogin';

export function LoginForm() {
  const idFieldId = useId();
  const tokenFieldId = useId();
  const messengerFieldId = useId();

  const [messenger, setMessenger] = useState<MessengerType>('whatsapp');
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');
  const { login, loading, error } = useLogin();

  const selected = MESSENGER_LIST.find((m) => m.id === messenger);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    login({
      messenger,
      idInstance: idInstance.trim(),
      apiTokenInstance: apiTokenInstance.trim(),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm rounded-2xl bg-white p-5 sm:p-8 shadow-sm border border-slate-200 mx-auto"
    >
      <h1 className="text-xl font-semibold mb-1">Вход в чат</h1>
      <p className="text-sm text-slate-500 mb-6">
        Введите учётные данные вашего инстанса GREEN-API
      </p>

      <label htmlFor={messengerFieldId} className="block text-sm font-medium text-slate-700 mb-1">
        Мессенджер
      </label>
      <div className="mb-4 flex items-center gap-2">
        <Select
          id={messengerFieldId}
          value={messenger}
          onChange={(e) => setMessenger(e.target.value as MessengerType)}
          className="flex-1 text-base sm:text-sm"
        >
          {MESSENGER_LIST.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </Select>
      </div>

      <label htmlFor={idFieldId} className="block text-sm font-medium text-slate-700 mb-1">
        idInstance
      </label>
      <input
        id={idFieldId}
        value={idInstance}
        onChange={(e) => setIdInstance(e.target.value)}
        placeholder="1101123456"
        autoComplete="off"
        className="w-full mb-4 rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm outline-none focus:border-maxblue focus:ring-1 focus:ring-maxblue"
      />

      <label htmlFor={tokenFieldId} className="block text-sm font-medium text-slate-700 mb-1">
        apiTokenInstance
      </label>
      <input
        id={tokenFieldId}
        value={apiTokenInstance}
        onChange={(e) => setApiTokenInstance(e.target.value)}
        type="password"
        placeholder="d4f4d1...token"
        autoComplete="off"
        className="w-full mb-1 rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm outline-none focus:border-maxblue focus:ring-1 focus:ring-maxblue"
      />
      {selected && (
        <a
          href={selected.helpUrl}
          target="_blank"
          rel="noreferrer"
          className="mb-4 inline-block text-xs text-maxblue hover:underline"
        >
          Где взять ключи для {selected.shortLabel}?
        </a>
      )}
      {!selected && <div className="mb-4" />}

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-2.5">
        {loading && <Spinner className="h-4 w-4" />}
        {loading ? 'Проверка…' : 'Войти'}
      </Button>
    </form>
  );
}