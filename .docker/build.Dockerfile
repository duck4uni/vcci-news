# Stage 1: Build
FROM registry.gitlab.com/meusolutions/vcci-news:base AS buildbase
# 'base' image đã có sẵn node_modules từ job trước (dùng làm cache)

# Copy toàn bộ source code (bao gồm package.json mới)
COPY . .

# *** THÊM LỆNH NÀY ***
# Chạy 'npm install' một lần nữa để đồng bộ node_modules
# với file package.json mới và cài đặt devDependencies (như ts-node, orval)
RUN npm install

# Bây giờ các script build sẽ chạy được
RUN npm run generate:api
RUN npm run build


# Stage 2: Production Image (Không đổi)
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

# Chỉ cài đặt production dependencies cho image cuối cùng
RUN npm install --production

# Copy các file đã build từ stage 'buildbase'
COPY --from=buildbase /app/.next ./.next
COPY --from=buildbase /app/public ./public

EXPOSE 3000

CMD ["npm", "run", "start"]