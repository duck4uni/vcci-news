FROM node:22-alpine AS base
WORKDIR /app

# Cài pnpm qua corepack — cách chính thức của Node.js
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy manifest + lockfile trước để tận dụng Docker layer cache
COPY package.json pnpm-lock.yaml* ./

# Cài dependencies production + dev (cần dev vì next build, eslint, orval tại build stage)
RUN pnpm install --frozen-lockfile
