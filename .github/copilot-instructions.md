# WebTvTuner — Repository Instructions

Use this file as the default source of truth for this repository. Trust it first and only search the codebase when the task depends on details not covered here or the code clearly contradicts these instructions.

---

## What This App Does

**WebTvTuner** is a static web application that lets a user watch live Italian TV channels from abroad by embedding video streams from their original broadcaster websites. It aggregates channels from multiple sources (RAI, Mediaset, etc.) into a single, clean interface with channel switching.

### Main Features

1. **Channel Grid** — Browse available channels organized by group (RAI, Mediaset, Kids)
2. **Video Embedding** — Each channel embeds the live video stream from its source website
3. **Source Adapters** — Each broadcaster domain has its own embedding adapter (plugin) that knows how to extract and embed the video
4. **Channel Groups** — Channels are organized into logical groups for easy navigation
5. **Responsive Layout** — Works on desktop and mobile browsers
6. **Dockerized Deployment** — Runs in a Docker container with nginx serving the static build

---

## Channel List

### RAI
| Channel | URL |
|---|---|
| Rai 1 | https://www.raiplay.it/dirette/rai1 |
| Rai 2 | https://www.raiplay.it/dirette/rai2 |
| Rai 3 | https://www.raiplay.it/dirette/rai3 |
| Rai 4 | https://www.raiplay.it/dirette/rai4 |
| Rai 5 | https://www.raiplay.it/dirette/rai5 |
| Rai Movie | https://www.raiplay.it/dirette/raimovie |
| Rai Premium | https://www.raiplay.it/dirette/raipremium |

### Mediaset
| Channel | URL |
|---|---|
| Rete 4 | https://mediasetinfinity.mediaset.it/diretta/rete4_cR4 |
| Canale 5 | https://mediasetinfinity.mediaset.it/diretta/canale5_cC5 |
| Italia 1 | https://mediasetinfinity.mediaset.it/diretta/italia1_cI1 |
| Iris | https://mediasetinfinity.mediaset.it/diretta/iris_cKI |
| TgCom24 | https://mediasetinfinity.mediaset.it/diretta/_cTS |
| La5 | https://mediasetinfinity.mediaset.it/diretta/la5_cKA |

### Kids
| Channel | URL |
|---|---|
| Rai Gulp | https://www.raiplay.it/dirette/raigulp |
| Rai Yoyo | https://www.raiplay.it/dirette/raiyoyo |

---

## Architecture — Embedding Adapter Pattern

The core architectural decision is the **Embedding Adapter** pattern. Each broadcaster domain (raiplay.it, mediasetinfinity.mediaset.it, etc.) has a dedicated adapter file that knows how to embed video from that source.

### Why Adapters?

Every broadcaster website serves video differently:
- Some allow direct iframe embedding
- Some require extracting an HLS/DASH stream URL
- Some need specific query parameters or referrer headers
- Some may change their embed approach over time

By isolating each domain's logic into a single adapter file, we can:
- Add new sources without touching existing code
- Update one source's embedding logic without affecting others
- Test each adapter independently

### Adapter Interface

```typescript
interface EmbedAdapter {
  /** Unique adapter identifier (matches the domain) */
  id: string

  /** Human-readable name */
  name: string

  /** Domain pattern this adapter handles (e.g., "raiplay.it") */
  domain: string

  /** 
   * Given a channel URL, return the embed configuration.
   * Returns an iframe src, or an HLS stream URL, or a custom component config.
   */
  getEmbedConfig(channelUrl: string): EmbedConfig
}

type EmbedConfig =
  | { type: 'iframe'; src: string; sandbox?: string; allow?: string }
  | { type: 'hls'; streamUrl: string }
  | { type: 'custom'; component: string; props: Record<string, unknown> }
```

### Adapter File Location

```
src/adapters/
├── index.ts                    # Adapter registry (auto-discovers adapters)
├── adapter.types.ts            # EmbedAdapter and EmbedConfig type definitions
├── raiplay.adapter.ts          # Adapter for raiplay.it
├── mediaset.adapter.ts         # Adapter for mediasetinfinity.mediaset.it
└── [future-domain].adapter.ts  # Future adapters follow the same pattern
```

### Adding a New Adapter

1. Create `src/adapters/[domain].adapter.ts` implementing `EmbedAdapter`
2. Register it in `src/adapters/index.ts`
3. Add channels using this domain to `src/data/channels.ts`
4. Write a Cypress test for the new adapter
5. Done — no other files need to change

---

## Channel Data Structure

```typescript
interface Channel {
  id: string              // kebab-case unique ID (e.g., "rai-1")
  name: string            // Display name (e.g., "Rai 1")
  group: string           // Group identifier (e.g., "rai", "mediaset", "kids")
  url: string             // Original source URL
  logo?: string           // Optional path to channel logo
}

interface ChannelGroup {
  id: string              // Group identifier
  name: string            // Display name (e.g., "RAI", "Mediaset", "Kids")
  channels: Channel[]
}
```

Channel data lives in `src/data/channels.ts` as a static configuration array.

---

## Tech Stack

- **Framework**: Vue 3 with `<script setup lang="ts">`, Composition API
- **State**: Pinia (selected channel, active group)
- **Router**: Vue Router (optional — may use single-page with dynamic content)
- **Styling**: Tailwind CSS
- **Build**: Vite
- **Testing**: Cypress (E2E), Vitest (unit tests for adapters)
- **Deployment**: Docker (nginx serving static Vite build)
- **Language**: TypeScript throughout
- **Package Manager**: npm

---

## Repository Layout

```
/
├── .github/                     # Copilot agent configuration
│   ├── copilot-instructions.md  # This file
│   ├── agents/                  # Agent definitions
│   ├── instructions/            # Context-specific instructions
│   ├── prompts/                 # Reusable task prompts
│   └── skills/                  # Domain skills
├── src/
│   ├── adapters/                # Embedding adapters (one per domain)
│   ├── components/              # Reusable Vue components
│   ├── composables/             # Shared reactive logic
│   ├── data/                    # Static channel/group data
│   ├── pages/                   # Route-level views
│   ├── stores/                  # Pinia stores
│   ├── types/                   # Shared TypeScript types
│   ├── App.vue                  # Root component
│   ├── main.ts                  # App entry point
│   └── router/                  # Vue Router config
├── cypress/
│   ├── e2e/                     # E2E test specs
│   ├── support/                 # Custom commands
│   └── fixtures/                # Test fixture data
├── public/                      # Static assets (logos, favicon)
├── docker/
│   ├── Dockerfile               # Multi-stage build (node → nginx)
│   └── nginx.conf               # Nginx config for SPA
├── index.html                   # Vite entry HTML
├── vite.config.ts               # Vite configuration
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript config
├── cypress.config.ts            # Cypress configuration
├── package.json
└── README.md
```

---

## Coding Guidelines

- Follow existing code patterns before introducing new structure
- Keep embedding logic exclusively in adapter files — never in Vue components or stores
- Components render what adapters provide; they do not know how embedding works
- Use `data-testid` attributes on all interactive elements to support Cypress tests
- For embedding adapter patterns, reference `.github/skills/embedding-adapters/SKILL.md`

---

## Commit Convention

Every commit must follow this format:

```
<type>(<scope>): <short description>

[optional body: explain why, not what]
```

**Types:**

| Type | When to use |
|---|---|
| `feat` | New feature (adapter, channel, UI component) |
| `fix` | Bug fix |
| `test` | Adding or updating tests |
| `docs` | Documentation only |
| `refactor` | Code restructure without behavior change |
| `chore` | Config, deps, tooling, Docker |

**Scopes**: `adapter`, `ui`, `channel`, `docker`, `cypress`, `config`

**Examples:**
```
feat(adapter): add raiplay embedding adapter
feat(channel): add Mediaset channel group
feat(ui): add channel grid with group filtering
fix(adapter): update raiplay stream URL extraction
test(cypress): add E2E spec for channel switching
chore(docker): add multi-stage Dockerfile with nginx
```

Each commit must be **self-contained and buildable**.

---

## Feature Slice Definition

A feature is "done" when all of the following are true:
1. Adapter implemented (if new source) with correct embedding logic
2. Channel data added to `src/data/channels.ts`
3. Vue component renders the embedded content correctly
4. Vitest unit tests cover adapter logic (URL parsing, config generation)
5. Cypress E2E spec covers: channel selection → video loads
6. All tests pass locally: `npm run test` + `npx cypress run`
7. Docker build succeeds: `docker build -t webtvtuner .`

---

## Build and Validation

```bash
# Development
npm ci
npm run dev

# Unit tests
npm run test

# Build
npm run build

# E2E tests (requires running app)
npm run dev &
npx cypress run

# Docker
docker build -t webtvtuner -f docker/Dockerfile .
docker run -p 8080:80 webtvtuner
```

---

## Agent Routing

| Situation | Start with |
|---|---|
| New source/domain to embed from (research needed) | `embed-researcher` |
| Feature request is vague or needs clarification | `analyst` |
| Feature spec is clear and approved | `developer` |
| Code review of existing changes | `reviewer` |
| Pre-commit check of staged changes | `pre-commit-reviewer` |
| Security concern (CORS, CSP, iframe policies) | `security-reviewer` |
| Writing or updating Cypress E2E tests | `cypress-tester` |
| Writing or updating documentation | `documenter` |

For new embedding sources: prefer `embed-researcher → developer`.
For new features: prefer `analyst → developer`.

---

Trust this file first and search the codebase only when it is incomplete or contradicted by reality.
