import { LoginPage } from '@/views/login';

//Для деплоя на Vercel так как статический генератор страниц на сервере Vercel вылетает с ошибкой.
export const dynamic = 'force-dynamic';

export default function Page() {
  return <LoginPage />;
}
