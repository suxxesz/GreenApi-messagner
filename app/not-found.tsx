import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm border border-slate-200 text-center">
        <h1 className="text-lg font-semibold mb-2">Страница не найдена</h1>
        <p className="text-sm text-slate-500 mb-6">Такого маршрута нет в приложении.</p>
        <Link
          href="/"
          className="inline-block w-full rounded-lg bg-maxblue text-white py-2 text-sm font-medium"
        >
          На главную
        </Link>
      </div>
    </main>
  );
}
