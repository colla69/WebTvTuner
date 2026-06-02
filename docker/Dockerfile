# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

# Stage 2: Serve (nginx + Node.js stream proxy sidecar)
FROM nginx:alpine AS serve
RUN apk add --no-cache nodejs
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/stream-proxy.mjs /opt/stream-proxy.mjs
COPY --from=build /app/dist /usr/share/nginx/html

# Start script: launch stream proxy then nginx
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 80
CMD ["/entrypoint.sh"]
