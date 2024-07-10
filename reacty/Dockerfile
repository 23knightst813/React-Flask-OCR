FROM node:21-bookworm AS builder
WORKDIR /app
COPY ./package.json .
COPY ./package-lock.json .
RUN npm ci --force
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
