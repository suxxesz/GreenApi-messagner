'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm border border-slate-200 text-center">
        <h1 className="text-lg font-semibold mb-2">Что-то пошло не так</h1>
        <p className="text-sm text-slate-500 mb-6">{error.message || 'Непредвиденная ошибка приложения'}</p>
        <button
          onClick={reset}
          className="w-full rounded-lg bg-maxblue text-white py-2 text-sm font-medium"
        >
          Попробовать снова
        </button>
      </div>
    </main>
  );
}
