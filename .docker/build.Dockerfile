FROM registry.gitlab.com/meusolutions/vcci-news:base AS builder

ARG NEXT_PUBLIC_BACKEND_HOST=https://vcci-hcm.org.vn
ARG NEXT_PUBLIC_FRONTEND_HOST=https://vcci-hcm.org.vn

ENV NEXT_PUBLIC_BACKEND_HOST=$NEXT_PUBLIC_BACKEND_HOST
ENV NEXT_PUBLIC_FRONTEND_HOST=$NEXT_PUBLIC_FRONTEND_HOST

COPY . .

RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app

ARG NEXT_PUBLIC_BACKEND_HOST=https://vcci-hcm.org.vn
ARG NEXT_PUBLIC_FRONTEND_HOST=https://vcci-hcm.org.vn

ENV NEXT_PUBLIC_BACKEND_HOST=$NEXT_PUBLIC_BACKEND_HOST
ENV NEXT_PUBLIC_FRONTEND_HOST=$NEXT_PUBLIC_FRONTEND_HOST

COPY --from=builder /app/package*.json ./

COPY --from=builder /app/node_modules ./node_modules

RUN npm prune --production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "run", "start"]
