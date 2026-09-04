FROM registry.gitlab.com/meusolutions/vcci-news:base AS builder

ARG NEXT_PUBLIC_BACKEND_HOST=https://vcci-hcm.org.vn
ARG NEXT_PUBLIC_FRONTEND_HOST=https://vcci-hcm.org.vn

ENV NEXT_PUBLIC_BACKEND_HOST=$NEXT_PUBLIC_BACKEND_HOST
ENV NEXT_PUBLIC_FRONTEND_HOST=$NEXT_PUBLIC_FRONTEND_HOST

# Base image cũ có thể chưa có pnpm — bật corepack ở đâng để chắc chắn.
# (Sau khi base image được rebuild với base.Dockerfile mới, dòng này sẽ là no-op.)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy toàn bộ source (đã được .dockerignore lọc trừ node_modules / .next / openapi)
COPY . .

RUN npm run build

# ----------------- Production stage -----------------
FROM node:22-alpine AS production
WORKDIR /app

ARG NEXT_PUBLIC_BACKEND_HOST=https://vcci-hcm.org.vn
ARG NEXT_PUBLIC_FRONTEND_HOST=https://vcci-hcm.org.vn

ENV NEXT_PUBLIC_BACKEND_HOST=$NEXT_PUBLIC_BACKEND_HOST
ENV NEXT_PUBLIC_FRONTEND_HOST=$NEXT_PUBLIC_FRONTEND_HOST

RUN corepack enable && corepack prepare pnpm@latest --activate

# Chỉ copy manifest + lockfile (KHÔNG copy node_modules).
# Cài fresh production-only deps để tránh `pnpm prune --prod` bị
# ERR_PNPM_IGNORED_BUILDS trên pnpm v11+.
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml* ./
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["pnpm", "run", "start"]
