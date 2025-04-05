# 1. Установка зависимостей
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat

RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

WORKDIR /app

# Копируем lock и манифесты
COPY pnpm-lock.yaml package.json ./
COPY turbo.json ./
COPY .npmrc ./

# Копируем все workspace-пакеты
COPY apps ./apps
COPY packages ./packages

# Установка зависимостей с workspace-ами
RUN pnpm install --frozen-lockfile

# 2. Сборка проекта
FROM node:20-alpine AS builder
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

WORKDIR /app
COPY --from=deps /app /app

# Сборка всех пакетов через turbo
RUN pnpm build

# 3. Production образ (только apps/web)
FROM node:20-alpine AS runner
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

ENV NODE_ENV=production

# Копируем только собранный web-пакет
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["pnpm", "start"]

