---
name: 'WebTvTuner Docker'
description: 'Guidelines for Docker configuration and deployment'
applyTo: 'docker/**, Dockerfile'
---

# WebTvTuner Docker Rules

Use this file for Docker and deployment-specific guidance.

## Architecture

WebTvTuner uses a **multi-stage Docker build**:
1. **Build stage**: Node.js image runs `npm ci && npm run build` to produce static files
2. **Serve stage**: Nginx Alpine image serves the static build

## Dockerfile Pattern

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine AS serve
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Nginx Configuration

Key requirements:
- **SPA fallback**: all routes serve `index.html` (Vue Router history mode)
- **Security headers**: X-Content-Type-Options, X-Frame-Options, Referrer-Policy
- **Caching**: static assets (JS, CSS, images) with long cache; HTML with no-cache
- **Gzip**: enabled for text assets

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
}
```

## Build and Run Commands

```bash
# Build the image
docker build -t webtvtuner -f docker/Dockerfile .

# Run the container
docker run -d -p 8080:80 --name webtvtuner webtvtuner

# Stop
docker stop webtvtuner && docker rm webtvtuner
```

## Constraints

- Keep the final image as small as possible (nginx:alpine base)
- Do not include source code, node_modules, or .git in the final image
- Do not expose source maps in production
- Nginx must run on port 80 inside the container
- No environment variables needed at runtime (static site)
