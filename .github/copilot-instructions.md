# Copilot Coding Agent Instructions

## Project: WebTvTuner

A static Vue 3 web application for streaming Italian TV channels. The app aggregates live TV streams from different sources into a single dark-themed interface.

## Architecture Requirements

### Embedder Plugin System
The core architecture is a **plugin-based embedder system**. Each video source domain (e.g., raiplay.it, mediaset.it) has its own isolated embedder file:

- `src/embedders/base.ts` — Type definitions (Embedder interface, EmbedStrategy, EmbedResult)
- `src/embedders/raiplay.ts` — Handles raiplay.it URLs
- `src/embedders/mediaset.ts` — Handles mediasetinfinity.mediaset.it URLs
- `src/embedders/fallback.ts` — Generic fallback (open in new tab)
- `src/embedders/index.ts` — Registry that resolves URL → embedder

Each embedder implements a common interface and determines the embedding strategy (iframe → HLS → external link fallback).

### Adding new domains in the future
1. Create a new file in `src/embedders/`
2. Register it in the index
3. No other code changes needed

## Tech Stack
- **Vue 3** with Composition API (`<script setup lang="ts">`)
- **TypeScript**
- **Vite** for build
- **Cypress** for testing (E2E + component tests)
- **hls.js** for HLS stream playback
- **Docker** with nginx for deployment

## UI Layout
- Sidebar (260px) with channel list grouped by category (collapsible groups)
- Main player area fills remaining space
- Dark theme (background: #0f0f1a, sidebar: #1a1a2e, accent: #4fc3f7)

## Testing
- Use Cypress for both component tests and E2E tests
- Test channel selection, player rendering, embedder resolution
- Run tests with `npm run test:unit` (component) and `npm run test:e2e` (E2E)

## Docker
- Multi-stage Dockerfile: node:22-alpine build → nginx:alpine serve
- docker-compose.yml for easy local deployment on port 8080
- nginx.conf with SPA fallback routing

## Build & Run Commands
- `npm run dev` — local dev server
- `npm run build` — production build (type-check + vite build)
- `npm run test:unit` — Cypress component tests
- `npm run test:e2e` — Cypress E2E tests
- `docker compose up` — containerized deployment
