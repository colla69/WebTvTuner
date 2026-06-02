---
name: 'PFS Effektivzins Vue 3'
description: 'Guidelines for frontend development with Vue 3 and TypeScript'
applyTo: 'frontend/**/*.vue, frontend/**/*.ts, frontend/**/*.js'
---

# PFS Effektivzins Frontend Rules

Use this file for frontend-specific guidance. Follow surrounding component and feature patterns before introducing new abstractions.

## Core Stack

- Vue 3 with `<script setup lang="ts">` — always use Composition API, never Options API
- Pinia for all shared state
- Vue Router for navigation between pages (Rechner, Leasingablöse, Ausgabe)
- PrimeVue for UI components (forms, inputs, dropdowns, buttons, dialogs)
- Tailwind CSS for layout and spacing
- Vite for bundling and dev server
- Vitest + Vue Test Utils for unit tests
- Axios for HTTP calls to the Express backend

## Component Boundaries

- **Pages** (`src/pages/`): route-level components; orchestrate stores and sub-components; contain no business logic
- **Components** (`src/components/`): presentational and interactive UI fragments; receive props, emit events; no direct store access unless clearly stateful
- **Stores** (`src/stores/`): hold API response state, loading/error state, and derived UI state; call backend API via Axios; never contain financial formulas
- **Composables** (`src/composables/`): shared reactive logic (e.g., `useFormValidation`, `useBrand`, `useCurrencyFormat`); keep them small and focused

## Patterns To Follow

- Copy the nearest existing page, component, store, or composable before adding a new one
- Keep loading, empty, error, and success states explicit for every async operation
- Use `v-model` for two-way form binding; keep form state in a composable or page-level ref, not in global Pinia store until submitted
- Prefer named emits with typed payloads over implicit parent mutation

## Forms and Inputs

- All form inputs for the calculation form must have a `data-testid` attribute matching the field name (e.g., `data-testid="upe"`, `data-testid="laufzeit"`)
- Validate on the frontend for UX feedback (non-empty, numeric range) but treat backend validation as authoritative
- Show inline validation errors below each field; do not use modal popups for field-level errors
- Currency fields display values in German locale (e.g., `1.234,56 €`) — use a `useCurrencyFormat` composable

## Brand Switching

- Brand selection updates `brandStore`; components that depend on brand colors/labels read from `brandStore`
- Do not hardcode Porsche/Lamborghini/Bentley colors in components — always read from the store
- Brand-specific primary colors: Porsche `#CE0100`, Lamborghini `#FFC000`, Bentley `#94C11D`

## Routing

- `/` → Rechner (main calculator page)
- `/leasingablöse` → Leasingablöse calculator
- `/ausgabe/:type` → Output view (INTERN_L, EXTERN_L, INTERN_F, EXTERN_F)

## Testing

- For every new component with user interaction, add a Vitest unit test covering the happy path and at least one error state
- For page-level flows (full calculation cycle), use Cypress E2E tests — follow `.github/instructions/cypress-testing.instructions.md`
- Mock Axios in Vitest; do not make real HTTP calls in unit tests
- Use `data-testid` selectors in all tests

## Validation

```bash
cd frontend
npm ci
npm run test
npm run build
```
