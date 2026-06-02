# WebTvTuner — Project Plan

## Overview

A static Vue 3 web app that embeds live Italian TV streams from broadcaster websites into a single interface. Runs in Docker (nginx). Each broadcaster domain gets its own **embedding adapter** — a single file that knows how to extract/embed video from that source.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Browser                                                │
│                                                         │
│  ┌─────────────┐    ┌──────────────┐    ┌───────────┐  │
│  │ Channel Grid│───▶│ Pinia Store  │───▶│ Video     │  │
│  │ (grouped)   │    │ (selection)  │    │ Player    │  │
│  └─────────────┘    └──────┬───────┘    └─────┬─────┘  │
│                            │                   │        │
│                     ┌──────▼───────┐           │        │
│                     │ Adapter      │───────────┘        │
│                     │ Registry     │                    │
│                     └──────┬───────┘                    │
│                            │                            │
│              ┌─────────────┼─────────────┐              │
│              ▼             ▼             ▼              │
│     ┌──────────────┐ ┌──────────┐ ┌──────────┐        │
│     │raiplay.adapter│ │mediaset. │ │ future.  │        │
│     │              │ │adapter   │ │ adapter  │        │
│     └──────────────┘ └──────────┘ └──────────┘        │
└─────────────────────────────────────────────────────────┘
         │
         ▼ (Vite build → static files)
┌─────────────────┐
│  Docker/nginx   │
│  :80 → dist/    │
└─────────────────┘
```

### Core Pattern: Embedding Adapters

Each domain gets **one file** (`src/adapters/[domain].adapter.ts`) implementing:

```typescript
interface EmbedAdapter {
  id: string
  name: string
  domain: string
  getEmbedConfig(channelUrl: string): EmbedConfig
}

type EmbedConfig =
  | { type: 'iframe'; src: string; sandbox?: string; allow?: string }
  | { type: 'hls'; streamUrl: string }
  | { type: 'custom'; component: string; props: Record<string, unknown> }
```

**Why?** Every broadcaster serves video differently. By isolating the logic:
- Add new sources without touching existing code
- Update one source independently
- Test each adapter in isolation

---

## Channel Data

```
RAI (raiplay.it)           → raiplay.adapter.ts
├── Rai 1, Rai 2, Rai 3, Rai 4, Rai 5, Rai Movie, Rai Premium

MEDIASET (mediasetinfinity.mediaset.it) → mediaset.adapter.ts
├── Rete 4, Canale 5, Italia 1, Iris, TgCom24, La5

KIDS (raiplay.it)          → raiplay.adapter.ts (same adapter)
├── Rai Gulp, Rai Yoyo
```

Two adapters needed initially: `raiplay` and `mediaset`.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Vue 3 (`<script setup lang="ts">`) |
| State | Pinia |
| Styling | Tailwind CSS |
| Build | Vite |
| Unit tests | Vitest |
| E2E tests | Cypress |
| Deploy | Docker (multi-stage: node build → nginx serve) |
| Language | TypeScript |

---

## Implementation Phases

### Phase 0: Project Scaffold ✅ (agents done)
- [x] Agent design (`.github/` directory)
- [ ] Vue 3 + Vite + TypeScript + Tailwind project init
- [ ] Cypress + Vitest setup
- [ ] Docker scaffold (Dockerfile + nginx.conf)
- [ ] Basic folder structure

### Phase 1: Core Architecture
- [ ] Define TypeScript types (`Channel`, `ChannelGroup`, `EmbedAdapter`, `EmbedConfig`)
- [ ] Create adapter registry (`src/adapters/index.ts`)
- [ ] Create channel data file (`src/data/channels.ts`)
- [ ] Create Pinia store (`src/stores/channel.store.ts`)

### Phase 2: Embedding Research & Adapters
- [ ] **Research**: How raiplay.it serves live video (use `embed-researcher` agent)
- [ ] **Research**: How mediasetinfinity.mediaset.it serves live video
- [ ] Implement `raiplay.adapter.ts`
- [ ] Implement `mediaset.adapter.ts`
- [ ] Unit tests for both adapters

### Phase 3: UI Components
- [ ] `ChannelGrid.vue` — displays channels grouped with filter tabs
- [ ] `VideoPlayer.vue` — renders iframe/HLS/custom based on EmbedConfig
- [ ] `GroupFilter.vue` — tabs/buttons for RAI, Mediaset, Kids, All
- [ ] `App.vue` — layout (player top, grid bottom or sidebar)
- [ ] Dark theme, responsive mobile-first layout

### Phase 4: Cypress E2E Tests
- [ ] Channel selection → video player loads
- [ ] Group filtering → correct channels shown
- [ ] Channel switching → embed updates
- [ ] Error state when stream unavailable

### Phase 5: Docker & Deployment
- [ ] Multi-stage Dockerfile (node → nginx)
- [ ] nginx.conf with SPA fallback + security headers
- [ ] Verify: `docker build && docker run` works end-to-end

### Phase 6: Polish & Future
- [ ] Channel logos/thumbnails
- [ ] Remember last channel (localStorage)
- [ ] Add more sources as needed (La7, TV8, etc.)

---

## Agent Workflow

```
New source domain? ──▶ embed-researcher ──▶ developer ──▶ reviewer ──▶ commit
New feature?       ──▶ analyst ──▶ developer ──▶ reviewer ──▶ commit
Clear task?        ──▶ developer ──▶ reviewer ──▶ pre-commit-reviewer ──▶ commit
Security concern?  ──▶ security-reviewer (read-only findings)
Need E2E tests?    ──▶ cypress-tester
```

---

## File Structure (target)

```
src/
├── adapters/
│   ├── adapter.types.ts        # EmbedAdapter, EmbedConfig interfaces
│   ├── index.ts                # Registry + getAdapterForUrl()
│   ├── raiplay.adapter.ts      # RAI embedding logic
│   ├── mediaset.adapter.ts     # Mediaset embedding logic
│   └── __tests__/
│       ├── raiplay.adapter.spec.ts
│       └── mediaset.adapter.spec.ts
├── components/
│   ├── ChannelGrid.vue
│   ├── VideoPlayer.vue
│   └── GroupFilter.vue
├── composables/
│   └── useAdapter.ts           # Resolves adapter for current channel
├── data/
│   └── channels.ts             # Static channel/group definitions
├── stores/
│   └── channel.store.ts        # Selected channel, active group
├── types/
│   └── channel.types.ts        # Channel, ChannelGroup interfaces
├── App.vue
└── main.ts
cypress/
├── e2e/
├── support/
└── fixtures/
docker/
├── Dockerfile
└── nginx.conf
```

---

## Next Step

**Phase 0 completion**: Scaffold the Vue 3 project with Vite, install dependencies (Tailwind, Pinia, Cypress, Vitest), create the folder structure, and Docker files. Then move to Phase 1 (types + adapter registry).

Want me to proceed with the scaffold?
