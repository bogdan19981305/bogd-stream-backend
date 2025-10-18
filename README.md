# bogd-stream-backend

Monorepo service: **NestJS (REST/GraphQL)** + **PostgreSQL** + **Redis** (+ RedisInsight UI).
Ниже — все порты, быстрый запуск и самые нужные команды.

---

## ✨ Стек

- **Backend:** NestJS 11 (TypeScript), GraphQL (Apollo)
- **DB:** PostgreSQL 15
- **Cache/Session:** Redis 7 (официальный клиент `redis@5`)
- **UI для Redis:** RedisInsight
- **ORM:** Prisma 6
- **Package manager:** pnpm
- **Docker:** docker-compose v2

---

## 🔌 Порты и URL

| Сервис                 | URL/Host                                                       | Порт (host → container)            | Примечание                                               |
| ---------------------- | -------------------------------------------------------------- | ---------------------------------- | -------------------------------------------------------- |
| **API (Nest)**         | [http://localhost:3002](http://localhost:3002)                 | 3000 → 3000 (локально)             | Запуск командой `pnpm dev` (по умолчанию). GraphQL ниже. |
| **GraphQL Playground** | [http://localhost:3000/graphql](http://localhost:3000/graphql) | —                                  | Доступен после запуска API.                              |
| **PostgreSQL**         | localhost                                                      | **5433 → 5432**                    | Поднят через Docker. DSN см. ниже.                       |
| **Redis**              | localhost                                                      | **6379 → 6379**                    | Поднят через Docker. `REDIS_URI=redis://localhost:6379`. |
| **RedisInsight (UI)**  | [http://localhost:5540](http://localhost:5540)                 | **5540 → 5540**                    | Подключать DB: host `localhost`, port `6379`.            |
| **Prisma Studio**      | [http://localhost:5555](http://localhost:5555)                 | 5555 → 5555 (локально при запуске) | Старт: `pnpm db:studio`.                                 |

> Если backend будет запущен **внутри docker-compose**, строки подключения меняются на `db:5432` и `redis:6379` (имена сервисов в сети compose).

---

## ⚙️ Переменные окружения (.env)

Пример минимальной конфигурации:

```env
# PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=appdb

# Backend
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5433/${POSTGRES_DB}?schema=public
REDIS_URI=redis://localhost:6379
NODE_ENV=development
SESSION_SECRET=dev_secret
```

> Если API в контейнере, то `DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}?schema=public` и `REDIS_URI=redis://redis:6379`.

---

## 🐳 Docker

### Частые команды Docker

```bash
# поднять всё в фоне
docker compose up -d

# статус сервисов и логи
docker compose ps
docker compose logs -f db
docker compose logs -f redis
docker compose logs -f redisinsight

# перезапуск/остановка
docker compose restart redis
docker compose down          # остановить (данные останутся в volumes)
# docker compose down -v     # остановить и УДАЛИТЬ данные volumes (осторожно)

# быстрые проверки
docker exec -it redis redis-cli ping   # -> PONG
```

---

## 🧰 Скрипты проекта (pnpm)

```bash
pnpm dev           # старт backend с hot-reload (http://localhost:3000)
pnpm start         # обычный старт
pnpm build         # сборка (dist/)
pnpm start:prod    # запуск собранного кода

pnpm lint          # eslint --fix
pnpm test          # unit-тесты
pnpm test:watch    # watch mode
pnpm test:cov      # coverage

pnpm db:push       # prisma db push (применить схему)
pnpm db:studio     # Prisma Studio (http://localhost:5555)
```

### Полезные однострочники

```bash
# применить схему и сгенерить клиент
pnpm db:push && pnpm prisma generate

# перезапустить только Redis
docker compose restart redis

# подключиться к Postgres из psql
docker exec -it postgres psql -U ${POSTGRES_USER} -d ${POSTGRES_DB}
```

---

## 🔒 Пароли и безопасность

- Для продакшена укажи пароль Redis: добавь к команде сервера `--requirepass <pwd>` и используй `REDIS_URI=redis://:<pwd>@redis:6379`.
- Не коммить `.env` с секретами.

---

## 🧪 Troubleshooting

- **ECONNREFUSED к Redis** — сервис не запущен или неверный host. Проверь `docker compose ps` и `REDIS_URI`.
- **API не видит БД** — проверь `DATABASE_URL` (порт 5433 с хоста / 5432 внутри compose).
- **RedisInsight пустой** — добавь базу вручную: host `localhost`, port `6379`.

---

## 🗺️ Памятка по сетям Docker

- Все сервисы в одной сети: `bogd-stream-backend`.
- Из контейнера к контейнеру обращайся по имени сервиса: `db:5432`, `redis:6379`.

---

## Контакты и поддержка

- Стек и конфиг актуализированы под `redis@5` + `connect-redis@9`.
- Вопросы/улучшения — см. Issues или пиши автору репо.
