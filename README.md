# MAX Chat

<p align="left">
  <img src="https://img.shields.io/badge/Next.js-16.0-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19.2-149ECA?style=flat-square&logo=react&logoColor=white" alt="React 19.2" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript 5.7" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 3.4" />
  <img src="https://img.shields.io/badge/Turbopack-stable-FF3E00?style=flat-square&logo=turbopack&logoColor=white" alt="Turbopack" />
  <br/>
  <img src="https://img.shields.io/badge/Architecture-Feature--Sliced_Design-8A4FFF?style=flat-square" alt="Feature-Sliced Design" />
  <img src="https://img.shields.io/badge/GREEN--API-WhatsApp_%2F_MAX-25D366?style=flat-square" alt="GREEN-API WhatsApp/MAX" />
  <img src="https://img.shields.io/badge/GREEN--API-Telegram_(beta)-26A5E4?style=flat-square&logo=telegram&logoColor=white" alt="GREEN-API Telegram" />
  <img src="https://img.shields.io/badge/ESLint-9-4B32C3?style=flat-square&logo=eslint&logoColor=white" alt="ESLint 9" />
  <img src="https://img.shields.io/badge/Node-%E2%89%A520.9-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node >=20.9" />
</p>

Тестовое задание «Фронтенд разработчик React (v5)»: минимальный клиент для
отправки и получения текстовых сообщений через [GREEN-API](https://green-api.com)
— поддерживает **WhatsApp/MAX** и **Telegram** (переключается на экране входа,
без изменения кода). Стек: **Next.js 16** (App Router, Turbopack, React 19.2),
TypeScript, Tailwind CSS, архитектура **Feature-Sliced Design**.

## Быстрый старт

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # прод-сборка
npm run start    # прод-сервер
npm run lint     # eslint . (flat config, eslint-config-next)
```

Проект проверен: `tsc --noEmit`, `eslint .` и `next build` проходят без единой
ошибки или предупреждения.

## Как пользоваться

1. На `/` выбираете мессенджер (**WhatsApp/MAX** или **Telegram**) и вводите `idInstance` / `apiTokenInstance` соответствующего
   инстанса GREEN-API. Под полем токена — ссылка на доки, где эти ключи взять.
   Валидность проверяется через `getSettings`.
2. В `/chat` слева вводите номер телефона получателя (без `+`) и жмёте **+** —
   создаётся новый чат.
3. Пишете текст и жмёте **Отправить** — уходит через
   [`SendMessage`](https://green-api.com/v3/docs/api/sending/SendMessage/).
4. Ответы подтягиваются автоматически: раз в 4 секунды приложение опрашивает
   [`ReceiveNotification`](https://green-api.com/v3/docs/api/receiving/technology-http-api/)
   и сразу подтверждает обработку через `DeleteNotification`. Входящие
   дедуплицируются по `id` на случай повторной доставки уведомления.
5. Чаты в сайдбаре отсортированы по времени последнего сообщения.
6. **Выйти** — очищает креды текущего мессенджера и возвращает на `/`.

Состояние (креды, история сообщений, активный чат) хранится в `localStorage`,
**отдельным неймспейсом на каждый мессенджер** — можно выйти из WhatsApp/MAX и
зайти в Telegram, не потеряв историю по WhatsApp.

## Поддержка Telegram

У GREEN-API есть отдельный продукт «Telegram API» (пока `beta`), который
использует **тот же формат запроса**, что и WhatsApp/MAX-продукт:

```
{apiUrl}/waInstance{idInstance}/{method}/{apiTokenInstance}
```

те же методы (`SendMessage`, `ReceiveNotification`, `DeleteNotification`,
`getSettings`) и тот же формат `chatId` (`<номер>@c.us`). Поэтому единый
клиент в `shared/api/green-api` обслуживает оба мессенджера без ветвления —
достаточно завести инстанс в Telegram-кабинете GREEN-API и выбрать
«Telegram» на экране входа. Домен API (`GREEN_API_BASE` в
`shared/config`) один на оба продукта; если для вашего Telegram-инстанса
понадобится другой хост — меняется в одном месте.

## Архитектура (FSD)

Next.js требует, чтобы файловый роутинг жил в `app/` в корне проекта — эта
папка намеренно «тонкая»: только `layout`, `error`, `not-found`, `globals.css`
и `page.tsx`-файлы, подключающие готовые страницы из `src/views`. Вся
бизнес-логика — в `src/`, слои идут сверху вниз, слой видит только
нижележащие:

```
app/                              Next.js App Router (только роутинг)
  layout.tsx
  error.tsx                       глобальный error boundary (App Router convention)
  not-found.tsx                   страница 404
  globals.css
  page.tsx                        → views/login
  chat/page.tsx                   → views/chat

src/
  views/                         composition root страниц
    login/ui/LoginPage.tsx
    chat/ui/ChatPage.tsx           состояние авторизации, scope мессенджера

  widgets/                       самостоятельные блоки интерфейса
    chat-sidebar/                 список чатов (сортировка по recency) + создание чата
    chat-window/                  лента сообщений (MessageBubble, memo) + шапка

  features/                      пользовательские сценарии
    auth-by-credentials/          вход: выбор мессенджера + idInstance/apiTokenInstance
    create-chat/                   создание чата по номеру телефона
    send-message/                   отправка текстового сообщения
    receive-messages/               поллинг входящих (ReceiveNotification)

  entities/                      бизнес-сущности
    messenger/                    MessengerType, конфиг WhatsApp/MAX и Telegram
    session/                      Credentials (+ messenger), localStorage, checkCredentials
    chat/                         phoneToChatId / chatIdToPhone / formatPhoneDisplay
    message/                      ChatMessage, стор сообщений (scope + дедупликация)

  shared/                        переиспользуемый код без бизнес-логики
    api/green-api/                 низкоуровневые запросы + сырые контракты API + GreenApiError
    config/                        константы, storage-ключи (scope-функции)
    lib/                           типобезопасная обёртка над localStorage
    ui/                             UI-кит: Button, Select, Spinner, Badge
```

Правило импортов FSD: `views → widgets → features → entities → shared`,
горизонтальные импорты внутри одного слоя запрещены, обращение — всегда через
публичный `index.ts` слайса. Контракты внешнего API (`GreenApiCredentials`,
`ReceiveNotificationResponse`) намеренно объявлены в `shared/api/green-api`, а
не в `entities`, — так `entities/session` и `entities/message` переиспользуют
их сверху вниз, не создавая обратной зависимости `shared → entities`
(проверено `grep` по импортам, см. ниже).

Алиас `@/*` в `tsconfig.json` указывает на `./src/*`.

## Что оптимизировано / доведено до продакшен-состояния

- **Дедупликация входящих** — `appendMessage` игнорирует сообщение, если `id`
  уже есть в чате (защита от повторной доставки уведомления между поллами).
- **`MessageBubble` вынесен и обёрнут в `memo`** — при добавлении нового
  сообщения не перерисовывается вся лента.
- **Скоуп по мессенджеру** — история сообщений и активный чат хранятся под
  ключами `green-api-messages:<messenger>` / `green-api-active-chat:<messenger>`,
  чтобы WhatsApp/MAX и Telegram не путались в одном браузере.
- **Типизированные ошибки** — `GreenApiError` с `status`, понятное сообщение
  при сетевом сбое на этапе входа.
- **Экран загрузки при проверке авторизации** — `ChatPage` не мигает пустым
  сайдбаром до чтения `localStorage`.
- **Next.js App Router конвенции** — добавлены `app/error.tsx` (error
  boundary с retry) и `app/not-found.tsx` (кастомная 404).
- **Сортировка чатов** по времени последнего сообщения (`useMemo`).
- **Валидация и форматирование номера** — `phoneToChatId` требует минимум 10
  цифр, `formatPhoneDisplay` красиво показывает номер в сайдбаре/шапке.
- **Доступность форм** — `useId()` + `htmlFor`/`id` на всех полях логина.
- **Рабочий lint** — `next lint` убрали в Next.js 16, поэтому подключён
  нативный flat-config ESLint (`eslint-config-next/core-web-vitals`,
  `react-hooks/set-state-in-effect` и др. правила React Compiler-плагина).
  Два места, где чтение `localStorage` намеренно вынесено в `useEffect`
  (чтобы не ловить hydration mismatch), точечно помечены
  `eslint-disable-next-line` с комментарием.
- Всё дерево проходит `tsc --noEmit`, `eslint .` и `next build` без единой
  ошибки или предупреждения.

## Технические решения

- **Next.js 16**: Turbopack как бандлер по умолчанию, React 19.2. Серверных
  data-фетчей с кэшированием (`"use cache"`) в проекте нет — вся работа с
  GREEN-API идёт на клиенте, поэтому фичи кэширования Next 16 здесь не
  задействованы намеренно.
- Учётные данные и история сообщений — в `localStorage`, бэкенд не требуется,
  как и предполагает минимальный набор функций из ТЗ.
- `chatId` — формат `<номер>@c.us` (общий для WhatsApp/MAX и Telegram-продукта
  GREEN-API), логика — в `entities/chat/lib/chatId.ts`.
- Внешний вид интерфейса ориентирован на прототип https://web.max.ru/.
- Для реального продакшена стоит вынести приём уведомлений на сервер (Route
  Handler / вебхук), чтобы не хранить токен в браузере — в рамках тестового
  задания это сознательно упрощено в пользу клиентской FSD-архитектуры без
  бэкенда.

## Деплой

```bash
npm run build
npm run start
```

или `vercel deploy` после `vercel link`.
