FROM registry.gitlab.com/meusolutions/vcci-news:base AS builder

COPY . .

RUN node scripts/generate-api.mjs
RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app

COPY --from=builder /app/package*.json ./

COPY --from=builder /app/node_modules ./node_modules

RUN npm prune --production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "run", "start"]
