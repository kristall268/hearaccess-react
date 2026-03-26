# Деплой HerAccess на Vercel

## Архитектура

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────┐
│  Vercel (React)  │────▶│  Vercel (Express) │────▶│  Neon.tech   │
│  heraccess.com   │     │  api.heraccess... │     │  PostgreSQL  │
└─────────────────┘     └───────┬──────────┘     └─────────────┘
                                │
                        ┌───────▼──────────┐
                        │   Cloudinary      │
                        │   (фото команды)  │
                        └──────────────────┘
```

Два отдельных проекта на Vercel:
- **client** — React SPA (фронтенд)
- **server** — Express API (бэкенд как serverless function)

---

## Шаг 1: Создать бесплатную БД на Neon.tech

1. Зайдите на https://neon.tech и зарегистрируйтесь
2. Создайте проект (например `heraccess`)
3. Скопируйте **Connection string** — она выглядит так:
   ```
   postgresql://user:pass@ep-xxx.region.aws.neon.tech/heraccess?sslmode=require
   ```
4. Запустите миграцию локально, указав эту строку:
   ```bash
   DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/heraccess?sslmode=require" node server/src/migrations/run.js
   ```

---

## Шаг 2: Создать аккаунт Cloudinary

1. Зайдите на https://cloudinary.com и зарегистрируйтесь (бесплатно)
2. В Dashboard скопируйте:
   - **Cloud Name** (например `dxyz12345`)
   - **API Key**
   - **API Secret**

---

## Шаг 3: Залить код на GitHub

Создайте **один репозиторий** с двумя папками:

```
heraccess/
├── server/
├── client/
├── package.json
└── .gitignore
```

```bash
cd heraccess
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/heraccess.git
git push -u origin main
```

---

## Шаг 4: Деплой Backend (Express API) на Vercel

1. Зайдите на https://vercel.com → "Add New Project"
2. Импортируйте ваш GitHub репозиторий
3. **Важно:** В настройках укажите:
   - **Root Directory:** `server`
   - **Framework Preset:** `Other`
4. Добавьте **Environment Variables**:

   | Variable | Value |
   |----------|-------|
   | `DATABASE_URL` | `postgresql://user:pass@ep-xxx.neon.tech/heraccess?sslmode=require` |
   | `JWT_SECRET` | `ваш-длинный-секретный-ключ` |
   | `JWT_EXPIRES_IN` | `4h` |
   | `ADMIN_USERNAME` | `admin` |
   | `ADMIN_PASSWORD` | `ваш-пароль` |
   | `CLIENT_URL` | `https://heraccess-client.vercel.app` (заполните после деплоя клиента) |
   | `CLOUDINARY_CLOUD_NAME` | значение из Cloudinary Dashboard |
   | `CLOUDINARY_API_KEY` | значение из Cloudinary Dashboard |
   | `CLOUDINARY_API_SECRET` | значение из Cloudinary Dashboard |
   | `SMTP_HOST` | `smtp.gmail.com` |
   | `SMTP_PORT` | `587` |
   | `SMTP_USER` | `heraccess6` |
   | `SMTP_PASS` | `culs gjhs iryv vfdv` |
   | `SMTP_FROM` | `kristallik355@gmail.com` |
   | `SMTP_TO` | `heraccess6@gmail.com` |

5. Нажмите **Deploy**
6. После деплоя скопируйте URL бэкенда (например `https://heraccess-server.vercel.app`)

---

## Шаг 5: Деплой Frontend (React) на Vercel

1. На Vercel → "Add New Project"
2. Импортируйте **тот же** GitHub репозиторий
3. В настройках:
   - **Root Directory:** `client`
   - **Framework Preset:** `Create React App`
4. Добавьте **Environment Variables**:

   | Variable | Value |
   |----------|-------|
   | `REACT_APP_API_URL` | `https://heraccess-server.vercel.app/api` |

5. Нажмите **Deploy**
6. Скопируйте URL фронтенда (например `https://heraccess.vercel.app`)

---

## Шаг 6: Обновить CLIENT_URL на бэкенде

1. Зайдите в проект бэкенда на Vercel → Settings → Environment Variables
2. Обновите `CLIENT_URL` на реальный URL фронтенда:
   ```
   https://heraccess.vercel.app
   ```
3. Redeploy бэкенд (Deployments → ... → Redeploy)

---

## Шаг 7: Запустить миграцию (если не сделали в шаге 1)

Локально:
```bash
cd server
DATABASE_URL="ваша-neon-строка" node src/migrations/run.js
```

---

## Готово!

- **Сайт:** https://heraccess.vercel.app
- **Админка:** https://heraccess.vercel.app/admin/login
- **API:** https://heraccess-server.vercel.app/api/team

---

## Чеклист после деплоя

- [ ] Открывается главная страница
- [ ] Формы (партнёрство, волонтёры, контакт) отправляются
- [ ] Приходят email-уведомления на heraccess6@gmail.com
- [ ] Вход в админку работает
- [ ] CRUD команды работает (создание, редактирование, удаление)
- [ ] Загрузка фото работает (через Cloudinary)
- [ ] Фото отображаются на сайте

---

## Кастомный домен (опционально)

В настройках каждого Vercel проекта → Domains → добавьте ваш домен.
Vercel выпустит SSL-сертификат автоматически.
