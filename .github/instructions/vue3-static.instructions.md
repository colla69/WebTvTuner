---
name: 'WebTvTuner Vue 3 Static'
description: 'Guidelines for frontend development with Vue 3 and TypeScript as a static site'
applyTo: 'src/**/*.vue, src/**/*.ts'
---

# WebTvTuner Frontend Rules

Use this file for frontend-specific guidance. Follow surrounding component patterns before introducing new abstractions.

## Core Stack

- Vue 3 with `<script setup lang="ts">` — always use Composition API, never Options API
- Pinia for shared state (selected channel, active group filter)
- Vue Router for navigation (if multi-page) or simple reactive state (if single-page)
- Tailwind CSS for layout and styling
- Vite for bundling and dev server
- Vitest + Vue Test Utils for unit tests
- TypeScript throughout

## Component Boundaries

- **Pages** (`src/pages/`): route-level views; orchestrate stores and sub-components
- **Components** (`src/components/`): presentational and interactive UI fragments; receive props, emit events
- **Stores** (`src/stores/`): hold selected channel, active group, and UI state; never contain embedding logic
- **Composables** (`src/composables/`): shared reactive logic (e.g., `useAdapter`, `useChannelFilter`)
- **Adapters** (`src/adapters/`): embedding logic only — no Vue reactivity, no DOM manipulation

## Key Patterns

### Channel Selection Flow

```
User clicks channel → store.selectChannel(channel) → adapter resolves embed config → VideoPlayer renders embed
```

### Video Player Component

The `VideoPlayer` component receives an `EmbedConfig` and renders the appropriate element:
- `iframe` type → renders an `<iframe>` with src, sandbox, allow attributes
- `hls` type → renders a `<video>` element with HLS.js attached
- `custom` type → renders a dynamic component

```vue
<template>
  <div data-testid="video-player">
    <iframe
      v-if="config.type === 'iframe'"
      :src="config.src"
      :sandbox="config.sandbox"
      :allow="config.allow"
      data-testid="video-iframe"
    />
    <VideoHls
      v-else-if="config.type === 'hls'"
      :stream-url="config.streamUrl"
      data-testid="video-hls"
    />
  </div>
</template>
```

### Channel Grid Component

Displays channels as a clickable grid. Supports filtering by group.

```vue
<template>
  <div data-testid="channel-grid">
    <button
      v-for="channel in filteredChannels"
      :key="channel.id"
      :data-testid="`channel-${channel.id}`"
      @click="emit('select', channel)"
    >
      {{ channel.name }}
    </button>
  </div>
</template>
```

## Forms and Inputs

- All interactive elements must have a `data-testid` attribute
- Channel buttons: `data-testid="channel-{id}"`
- Group filters: `data-testid="group-{id}"`
- Video player: `data-testid="video-player"`
- Error states: `data-testid="error-message"`

## Styling

- Use Tailwind utility classes for layout
- Dark theme preferred (TV watching experience)
- Responsive: mobile-first grid layout
- Channel cards should have hover states and active/selected indicators

## Testing

```bash
cd . && npm run test
```

- Mock adapters in Vitest unit tests (test component rendering, not embedding logic)
- Use `data-testid` selectors in all tests
- For E2E (Cypress): test against the real running app with real adapters
