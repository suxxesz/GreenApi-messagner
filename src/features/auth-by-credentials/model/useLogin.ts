'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkCredentials, saveCredentials, type Credentials } from '@/entities/session';

export function useLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(creds: Credentials) {
    setError(null);

    if (!creds.idInstance.trim() || !creds.apiTokenInstance.trim()) {
      setError('Заполните оба поля');
      return;
    }

    setLoading(true);
    try {
      const ok = await checkCredentials(creds);
      if (!ok) {
        setError('Не удалось авторизоваться. Проверьте idInstance и apiTokenInstance.');
        return;
      }
      saveCredentials(creds);
      router.push('/chat');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  }

  return { login, loading, error };
}
