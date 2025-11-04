FROM $image_name:latest AS buildbase
COPY . .

RUN npm run generate:api
RUN npm run build

FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY --from=buildbase /app/.next ./.next
COPY --from=buildbase /app/public ./public

EXPOSE 3000

CMD ["npm", "run", "start"]