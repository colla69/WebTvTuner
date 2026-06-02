---
name: clean-code
description: 'Guide for applying Clean Code principles in the PFS Effektivzins Tool. Use when writing new code, refactoring, reducing duplication, reviewing maintainability, or enforcing SOLID, DRY, KISS in TypeScript, Vue 3, and Express work.'
---

# Clean Code — PFS Effektivzins Tool

Use this skill when the task is about making code easier to understand, safer to change, and consistent with the existing codebase.

## Default Mode

- Prefer clarity over cleverness
- Fix the root cause, not just the local symptom
- Make the smallest change that improves the design
- Leave touched code cleaner than you found it
- Preserve repository conventions unless the convention itself is the problem

## Domain Naming Rules

**German for domain concepts; English for technical structure:**

```ts
// Good — domain term in German
function berechneEffektivzins(sollzins: number): number { ... }
const leasingFaktor = cashFlow / upe * 100

// Bad — domain term translated to English
function calculateEffectiveInterestRate(...) { ... }
const leasingFactor = ...
```

**TypeScript types use German domain names for domain-level properties:**
```ts
interface LeasingEingabe {
  upe: number
  nachlassEUR: number
  laufzeit: number
  pfsZins: number
}

interface LeasingErgebnis {
  cashFlow: number
  effektivzins: number
  leasingFaktor: number
}
```

**Function names use English action verbs + German noun:**
```ts
// Good
calculateLeasing(eingabe: LeasingEingabe): LeasingErgebnis
buildAmortisierungstabelle(...)
validateLeasingEingabe(...)

// Bad
leasing_calc(...)
doFinanzierung(...)
```

## Backend (Express Services)

- Keep service functions **pure**: same inputs always produce same outputs; no side effects
- Each service function should do one thing: compute, validate, or transform — not all three
- Keep route handlers thin:
  ```ts
  // Route handler (thin)
  router.post('/calculate/leasing', (req, res, next) => {
    const result = leasingSchema.safeParse(req.body)
    if (!result.success) return res.status(400).json({ errors: result.error.issues })
    res.json(calculateLeasing(result.data))
  })
  ```
- GoalSeek and iterative solvers belong in a shared `src/utils/solver.ts`, not duplicated in each service

## Frontend (Vue 3 Components)

- Keep components focused on presentation; move shared stateful logic to stores or composables
- Do not hide business rules inside `<template>` expressions or watchers
- Keep async flows readable: loading, success, empty, and error states must be explicit
  ```vue
  <template>
    <div v-if="store.loading">Berechnung läuft...</div>
    <div v-else-if="store.error">{{ store.error }}</div>
    <LeasingErgebnis v-else-if="store.ergebnis" :ergebnis="store.ergebnis" />
  </template>
  ```
- Prefer named emits with typed payloads over implicit parent mutation:
  ```ts
  const emit = defineEmits<{ (e: 'submit', data: LeasingEingabe): void }>()
  ```

## Common Smells To Fix

- Long calculation functions with multiple responsibilities → split into `validate`, `computeAmortization`, `computeOutputs`
- Repeated `if/else` for mode switching (Leasing/Finanzierung/Zielrate) → extract a typed discriminated union and dispatch cleanly
- Magic numbers in formulas → named constants:
  ```ts
  // Bad
  interest = balance * rate * 30 / 360
  
  // Good
  const DAYS_PER_MONTH = 30
  const DAYS_PER_YEAR = 360
  interest = balance * rate * DAYS_PER_MONTH / DAYS_PER_YEAR
  ```
- Primitive brand string passed everywhere → use a branded type or enum:
  ```ts
  type Brand = 'Porsche' | 'Lamborghini' | 'Bentley'
  ```

## SOLID in Practice

- **Single Responsibility**: `calculateLeasing` computes; a separate `validateLeasingEingabe` validates; a separate `formatLeasingErgebnis` formats for display
- **Open/Closed**: add new Zielrate sub-modes by extending a type union and adding a case, not by editing every existing branch
- **Interface Segregation**: `LeasingEingabe` and `FinanzierungEingabe` are separate types; do not merge them into one oversized `KalkulationEingabe`

## Validation Expectations

```bash
# After backend changes
cd backend && npm run test

# After frontend changes
cd frontend && npm run test && npm run build
```
