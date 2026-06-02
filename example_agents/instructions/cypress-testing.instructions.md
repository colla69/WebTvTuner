---
name: 'PFS Effektivzins Cypress Testing'
description: 'Guidelines for writing Cypress E2E tests for the PFS Effektivzins Tool'
applyTo: 'frontend/cypress/**/*.ts, frontend/cypress/**/*.cy.ts'
---

# PFS Effektivzins Cypress E2E Testing Rules

Use this file when writing or updating Cypress tests. Follow the patterns already established in `frontend/cypress/` before introducing new helpers.

## Folder Structure

```
frontend/cypress/
├── e2e/                        # Test spec files
│   ├── leasing.calculation.cy.ts
│   ├── finanzierung.calculation.cy.ts
│   ├── leasingablöse.cy.ts
│   ├── brand-switching.cy.ts
│   ├── validation.errors.cy.ts
│   └── ausgabe.export.cy.ts
├── support/
│   ├── commands.ts             # Custom Cypress commands
│   └── e2e.ts                  # Global setup (imports commands)
└── fixtures/
    ├── leasing-reference.json       # Known input/output pairs from VBA
    ├── finanzierung-reference.json
    └── leasingablöse-reference.json
```

## Test Naming Convention

File names: `[feature].[scenario].cy.ts`

Test descriptions: plain language matching a user action — always describe what the **user does**, not what the code does.

```ts
// Good
describe('Leasing-Berechnung', () => {
  it('berechnet den Effektivzins für eine standard Leasing-Rate', () => { ... })
  it('zeigt eine Fehlermeldung wenn die UPE fehlt', () => { ... })
})

// Bad
describe('LeasingCalculationComponent', () => {
  it('should call calculateLeasing service', () => { ... })
})
```

## Selector Strategy

**Always use `data-testid` attributes.** Never use CSS class names or element type selectors for test queries.

```ts
// Good
cy.get('[data-testid="upe"]').type('80000')
cy.get('[data-testid="berechnen-button"]').click()
cy.get('[data-testid="effektivzins-result"]').should('contain', '4,52')

// Bad
cy.get('.p-inputtext').first().type('80000')
cy.get('button').click()
```

Every interactive element in the frontend **must** have a `data-testid`. When you implement a new feature, add `data-testid` to all interactive elements before writing the Cypress test.

## Custom Commands

Define reusable commands in `cypress/support/commands.ts` for repeated form interactions:

```ts
// Fill the standard Leasing form
Cypress.Commands.add('fillLeasingForm', (data: LeasingFormData) => {
  cy.get('[data-testid="upe"]').clear().type(data.upe.toString())
  cy.get('[data-testid="laufzeit"]').clear().type(data.laufzeit.toString())
  cy.get('[data-testid="kilometer"]').clear().type(data.kilometer.toString())
  cy.get('[data-testid="pfs-zins"]').clear().type(data.pfsZins.toString())
  // ...
})

Cypress.Commands.add('fillFinanzierungForm', (data: FinanzierungFormData) => { ... })
Cypress.Commands.add('selectBrand', (brand: 'Porsche' | 'Lamborghini' | 'Bentley') => { ... })
```

## Reference Fixtures

Fixtures in `cypress/fixtures/` contain **known input/output pairs** derived from the original VBA tool. Use these to verify that the new web implementation produces the same results.

```json
// leasing-reference.json
{
  "standard": {
    "input": {
      "upe": 80000,
      "nachlassEUR": 5000,
      "laufzeit": 36,
      "kilometer": 15000,
      "pfsZins": 0.05,
      "zielrestwertPRO": 0.45
    },
    "expected": {
      "cashFlow": 823.45,
      "effektivzins": 5.12,
      "leasingFaktor": 1.03
    }
  }
}
```

Load fixtures in tests:

```ts
cy.fixture('leasing-reference').then((ref) => {
  cy.fillLeasingForm(ref.standard.input)
  cy.get('[data-testid="berechnen-button"]').click()
  cy.get('[data-testid="effektivzins-result"]')
    .should('contain', ref.standard.expected.effektivzins.toFixed(2).replace('.', ','))
})
```

## Coverage Expectations

Every calculation flow must have at least:
1. **Happy path** — valid inputs, correct output matches fixture
2. **Validation error** — required field missing, error message shown
3. **Boundary value** — e.g., pfsZins = 20% (maximum allowed)
4. **Mode switching** — e.g., switching from Leasing to Finanzierung resets form correctly

Additional coverage for:
- Brand switching (Porsche → Lamborghini → Bentley): correct label and color applied
- Zielrate sub-modes: each mode (Sonderzahlung, Nachlass, Restwert) produces a result
- Leasingablöse: full form fill and calculation
- Ausgabe output page: correct values displayed after calculation

## CI Integration

Cypress runs headlessly in CI:

```bash
# Start app first, then run tests
npm run start &
npx cypress run --headless --browser chrome
```

For local development use `npx cypress open` for the interactive runner.

## Constraints

- Do not assert on exact pixel positions or element sizes
- Do not use `cy.wait(ms)` with fixed timeouts — use `cy.get(...).should(...)` with retry-ability
- Do not mock the backend in Cypress tests — tests run against the real running app
- Keep each test independent: reset app state via the UI (navigate to `/`) rather than via direct API calls
