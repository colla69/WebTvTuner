# Issue: Build WebTvTuner - Vue 3 Italian TV streaming aggregator

> Create this as a GitHub issue at https://github.com/colla69/WebTvTuner/issues/new
> Then assign it to Copilot cloud agent on branch `with_agent_AI`

---

## Task

Build a static Vue 3 web application that aggregates Italian TV live streams into a single dark-themed interface with a sidebar + player layout.

## Requirements

### Architecture: Embedder Plugin System
Each video source domain gets its own **isolated embedder file** in `src/embedders/`:

- `src/embedders/base.ts` — TypeScript interface definitions (`Embedder`, `EmbedStrategy`, `EmbedResult`)
- `src/embedders/raiplay.ts` — Handles `raiplay.it` URLs (iframe strategy)
- `src/embedders/mediaset.ts` — Handles `mediasetinfinity.mediaset.it` URLs (iframe strategy)
- `src/embedders/fallback.ts` — Generic fallback (opens in new tab)
- `src/embedders/index.ts` — Registry: `resolveEmbedder(url)` finds the right embedder

**Hybrid embedding strategy:** Try iframe first. If source blocks it, fall back to external link. HLS stream extraction is a future upgrade path.

### Channel List (data-driven in `src/config/channels.ts`)

**RAI:**
- https://www.raiplay.it/dirette/rai1
- https://www.raiplay.it/dirette/rai2
- https://www.raiplay.it/dirette/rai3
- https://www.raiplay.it/dirette/rai4
- https://www.raiplay.it/dirette/rai5
- https://www.raiplay.it/dirette/raimovie
- https://www.raiplay.it/dirette/raipremium

**MEDIASET:**
- https://mediasetinfinity.mediaset.it/diretta/rete4_cR4
- https://mediasetinfinity.mediaset.it/diretta/canale5_cC5
- https://mediasetinfinity.mediaset.it/diretta/italia1_cI1
- https://mediasetinfinity.mediaset.it/diretta/iris_cKI
- https://mediasetinfinity.mediaset.it/diretta/_cTS
- https://mediasetinfinity.mediaset.it/diretta/la5_cKA

**KIDS:**
- https://www.raiplay.it/dirette/raigulp
- https://www.raiplay.it/dirette/raiyoyo

### UI Components
- `App.vue` — Flexbox layout: sidebar (260px) + player area
- `Sidebar.vue` — Grouped channel list with collapsible headers
- `ChannelCard.vue` — Individual channel item (props: channel, isActive)
- `PlayerArea.vue` — Renders IframePlayer/HlsPlayer/ExternalLink based on embed strategy
- `IframePlayer.vue` — Full-size iframe wrapper
- `HlsPlayer.vue` — Uses hls.js for HLS streams
- `ExternalLink.vue` — Fallback with "open in new tab" button

### State Management
- `src/composables/usePlayer.ts` — Shared reactive state (currentChannel, currentEmbed, selectChannel)
- No Pinia store needed; use module-level refs

### Styling
- Dark theme: background #0f0f1a, sidebar #1a1a2e, text #e0e0e0, accent #4fc3f7
- Global styles in `src/assets/styles/main.css`
- CSS variables for theming

### Testing (Cypress)
- Component tests for ChannelCard and PlayerArea
- E2E test: visit app → select channel → verify player renders

### Docker Deployment
- `Dockerfile` — Multi-stage: node:22-alpine build → nginx:alpine serve
- `docker-compose.yml` — Service on port 8080
- `nginx.conf` — SPA fallback + static asset caching
- `.dockerignore` — Exclude node_modules, dist, .git

### Tech Stack
- Vue 3 (Composition API, `<script setup lang="ts">`)
- TypeScript
- Vite
- Cypress (E2E + component)
- hls.js
- Docker + nginx

## Acceptance Criteria
- [ ] `npm run build` passes (type-check + vite build)
- [ ] `npm run test:unit` passes (Cypress component tests)
- [ ] `npm run test:e2e` passes (Cypress E2E tests)
- [ ] Docker build succeeds
- [ ] Selecting a channel shows the player with the correct embed
