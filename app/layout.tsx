import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MAX Chat — GREEN-API',
  description: 'Минимальный клиент для отправки и получения сообщений через GREEN-API',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="bg-maxbg text-slate-900">{children}</body>
    </html>
  );
}
