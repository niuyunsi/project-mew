FROM node:20-alpine as builder

WORKDIR /app

COPY package.json .
RUN npm install
COPY . .
RUN npm run clean
RUN npm run build

FROM nginx
EXPOSE 80
COPY --from=builder /app/public /usr/share/nginx/html