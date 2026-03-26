# HerAccess — React + Node.js + PostgreSQL + JWT

Полная переработка проекта HerAccess с ASP.NET Core MVC на современный стек:

- **Frontend:** React 18 + React Router 6
- **Backend:** Node.js + Express
- **Database:** PostgreSQL (тот же, что и раньше)
- **Auth:** JWT (JSON Web Tokens) вместо сессий

---

## Структура проекта

```
heraccess/
├── server/                 # Express API
│   ├── src/
│   │   ├── config/         # Подключение к БД
│   │   ├── controllers/    # Auth, Team, Forms, Submissions
│   │   ├── middleware/      # JWT auth, Multer upload
│   │   ├── migrations/     # Создание таблиц + seed admin
│   │   ├── routes/         # API маршруты
│   │   └── index.js        # Точка входа сервера
│   ├── uploads/            # Загруженные фото
│   ├── .env                # Переменные окружения
│   └── package.json
├── client/                 # React SPA
│   ├── public/
│   ├── src/
│   │   ├── components/     # Navbar, Footer, AdminTopbar, Pagination, Icons
│   │   ├── context/        # AuthContext (JWT)
│   │   ├── hooks/          # useForm
│   │   ├── pages/          # HomePage, LoginPage, AdminDashboard, AdminCreateEdit, AdminSubmissions
│   │   ├── styles/         # index.css, admin.css
│   │   ├── api.js          # Все API вызовы
│   │   ├── App.js          # Маршрутизация
│   │   └── index.js        # Точка входа React
│   └── package.json
└── package.json            # Корневые скрипты
```

---

## Быстрый старт

### 1. Требования
- Node.js 18+
- PostgreSQL (работающий на localhost:5432)

### 2. Установка зависимостей

```bash
npm run install:all
```

### 3. Настройка базы данных

Убедитесь что PostgreSQL запущен и база `heraccess` существует:

```sql
CREATE DATABASE heraccess;
```

Настройте подключение в `server/.env` (уже настроено для localhost).

### 4. Миграция БД

```bash
npm run migrate
```

Это создаст все таблицы и добавит admin пользователя (`admin` / `admin123`).

### 5. Запуск

В двух терминалах:

```bash
# Терминал 1 — сервер (порт 5000)
npm run dev:server

# Терминал 2 — клиент (порт 3000)
npm run dev:client
```

Откройте:
- **Сайт:** http://localhost:3000
- **Админ:** http://localhost:3000/admin/login

---

## API Endpoints

### Публичные
| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/team` | Список команды |
| POST | `/api/forms/partnership` | Заявка на партнёрство |
| POST | `/api/forms/volunteer` | Заявка волонтёра |
| POST | `/api/forms/contact` | Контактное сообщение |

### Auth
| Метод | URL | Описание |
|-------|-----|----------|
| POST | `/api/auth/login` | Логин → JWT токен |
| GET | `/api/auth/me` | Текущий admin (🔒) |

### Админ (🔒 JWT Required)
| Метод | URL | Описание |
|-------|-----|----------|
| POST | `/api/team` | Добавить участника |
| PUT | `/api/team/:id` | Редактировать |
| DELETE | `/api/team/:id` | Удалить |
| GET | `/api/admin/submissions` | Все заявки (с пагинацией) |

---

## Что изменилось по сравнению с ASP.NET

| Было (ASP.NET) | Стало (React + Node) |
|----------------|---------------------|
| Razor Views (серверный рендеринг) | React SPA (клиентский рендеринг) |
| Session-based auth | JWT токены |
| Entity Framework Core | Прямые SQL запросы через `pg` |
| Один монолитный проект | Разделение на client/server |
| AntiForgeryToken | CORS + JWT |
| `appsettings.json` | `.env` файлы |

---

## Production Build

```bash
npm run build:client
NODE_ENV=production npm start
```

Сервер будет раздавать билд React и API на одном порте (5000).
