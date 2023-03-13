FROM node:16.19.0-alpine AS builder
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

FROM nginx:alpine AS base
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist .
ENTRYPOINT ["nginx", "-g", "daemon off;"]
