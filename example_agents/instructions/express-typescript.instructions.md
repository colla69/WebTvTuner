---
name: 'PFS Effektivzins Express Backend'
description: 'Guidelines for backend development with Express and TypeScript'
applyTo: 'backend/**/*.ts'
---

# PFS Effektivzins Backend Rules

Use this file for backend-specific guidance. Follow surrounding route and service patterns before introducing new abstractions.

## Core Stack

- Express + TypeScript
- Zod for request and response validation
- Vitest for unit tests
- No ORM or database — this is a stateless calculation API; all state lives in the frontend or in exported documents

## Layer Responsibilities

- **Routes** (`src/routes/`): parse and validate HTTP input with Zod, call one service method, return the result; no business logic here
- **Services** (`src/services/`): all financial calculation logic lives here; pure functions preferred; no HTTP awareness
- **Types** (`src/types/`): shared TypeScript interfaces and Zod schemas; co-locate Zod schemas with their route file, but import types from `src/types/`

## API Design

- All calculation endpoints accept `POST` with a JSON body
- Endpoints:
  - `POST /api/calculate/leasing` — Leasing-Berechnung
  - `POST /api/calculate/finanzierung` — Finanzierung-Berechnung
  - `POST /api/calculate/leasing/soko` — Leasing Sonderkonditionen
  - `POST /api/calculate/finanzierung/soko` — Finanzierung Sonderkonditionen
  - `POST /api/calculate/leasingablöse` — Leasingablöse calculation
- Return `200` with result on success
- Return `400` with Zod error details on validation failure
- Return `500` with a generic error message on unexpected failures — never expose stack traces

## Validation

- Define a Zod schema for every route's request body
- Keep schemas in the same file as the route or in a co-located `*.schema.ts` file
- Validate `pfsZins`: `z.number().min(0.001).max(0.20)` — matches VBA rule (> 0 and ≤ 20%)
- Validate `laufzeit`: `z.number().int().min(1)`
- For conditional validation (e.g., `upe` required only for Leasing): use `z.discriminatedUnion` or `.superRefine()`

## Financial Calculations

- All financial math (GoalSeek, Effektivzins/XIRR, Sollzins, Leasingfaktor) lives in service functions
- **Always** reference `.github/skills/financial-calculations/SKILL.md` before implementing or changing any calculation
- Use 30/360 day count convention (as in the original VBA)
- Iteration-based GoalSeek (binary search) must converge within a defined tolerance (0.01 cent recommended)
- Services must be pure functions — same inputs always produce same outputs

## Error Handling

- Wrap route handlers in a try/catch and pass errors to Express error middleware
- Distinguish domain validation errors (return 400 + message) from unexpected errors (return 500 + generic message)

## Testing

- Write a Vitest unit test for every service function covering:
  - The standard happy path
  - Boundary values from the validation rules (e.g., pfsZins at exactly 0.20)
  - Known reference values from the VBA tool (use `cypress/fixtures/` values for cross-checking)

## Validation Commands

```bash
cd backend
npm ci
npm run test
npm run build
```
