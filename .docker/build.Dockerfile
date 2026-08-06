FROM registry.gitlab.com/meusolutions/vcci-news:base AS builder

ARG NEXT_PUBLIC_BACKEND_HOST=https://news.vccihcm.vn
ARG NEXT_PUBLIC_FRONTEND_HOST=https://news.vccihcm.vn

ENV NEXT_PUBLIC_BACKEND_HOST=$NEXT_PUBLIC_BACKEND_HOST
ENV NEXT_PUBLIC_FRONTEND_HOST=$NEXT_PUBLIC_FRONTEND_HOST

# Copy toàn bộ source (đã được .dockerignore lọc trừ node_modules / .next / openapi)
COPY . .

# Generate API client + build
RUN node scripts/generate-api.mjs
RUN pnpm run build

# ----------------- Production stage -----------------
FROM node:22-alpine AS production
WORKDIR /app

ARG NEXT_PUBLIC_BACKEND_HOST=https://news.vccihcm.vn
ARG NEXT_PUBLIC_FRONTEND_HOST=https://news.vccihcm.vn

ENV NEXT_PUBLIC_BACKEND_HOST=$NEXT_PUBLIC_BACKEND_HOST
ENV NEXT_PUBLIC_FRONTEND_HOST=$NEXT_PUBLIC_FRONTEND_HOST

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy lockfile + manifest + node_modules từ builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml* ./
COPY --from=builder /app/node_modules ./node_modules

# Prune dev deps để giảm image size
RUN pnpm prune --prod

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["pnpm", "run", "start"]
