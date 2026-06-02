# PFS Effektivzins Tool — Repository Instructions

Use this file as the default source of truth for this repository. Trust it first and only search the codebase when the task depends on details not covered here or the code clearly contradicts these instructions.

---

## What This App Does

The **PFS Effektivzins Tool** is a web application used by Porsche, Lamborghini, and Bentley car dealers (Verkaufsberater) to calculate and present vehicle financing and leasing offers for customers.

The tool replaces an existing Excel/VBA workbook (`PFS_Tool_V5.1.xlsm`). All calculation logic, validation rules, and domain terms in this repository trace back to that VBA source.

### Main Features

1. **Leasing-Berechnung** — Calculate monthly leasing rate, residual value, and Effektivzins for a vehicle lease
2. **Finanzierung-Berechnung** — Calculate monthly financing installment, final installment (Schlussrate), and Effektivzins for vehicle financing
3. **Sonderkonditionen (SoKo)** — Calculate special conditions (dealer participation, commission) on top of a completed base calculation
4. **Leasingablöse** — Calculate the early buyout cost for an existing lease contract
5. **Ausgabe (Output)** — Generate internal and external printable result sheets (INTERN/EXTERN × Leasing/Finanzierung)
6. **Brand switching** — Switch between Porsche, Lamborghini, and Bentley; each brand has its own colors and label text

---

## Domain Glossary

| German Term | Meaning |
|---|---|
| Leasing | Vehicle lease (operating lease) |
| Finanzierung | Vehicle financing (hire purchase / loan) |
| Effektivzins | Effective annual interest rate (APR) — the primary output |
| Sollzins | Nominal annual interest rate |
| PFS-Zins | Interest rate provided by Porsche Financial Services |
| UPE | Unverbindliche Preisempfehlung — manufacturer's suggested retail price (MSRP) |
| Kaufpreis / Sonstiges | Purchase price (used for Finanzierung) |
| Nachlass | Discount (in € or %) |
| Anzahlung | Down payment (used for Finanzierung, in € or %) |
| Sonderzahlung | Special upfront payment (used for Leasing, in € or %) |
| Subvention HO | Subsidy from the dealer (Händlerorganisation) |
| Subvention PD | Subsidy from the importer/distributor (Porsche Deutschland) |
| Zusatzleistungen | Additional services bundled into the monthly rate |
| Laufzeit | Contract term in months |
| Kilometer p.a. | Annual mileage (km per year) |
| Restwert | Residual value at end of lease |
| Schlussrate | Final balloon installment at end of financing |
| Zielrestwert | Target residual value (input to work backward from) |
| Zielrate | Target monthly rate (input to work backward from) |
| KGL | Kaufgegenständlicher Listenpreis — net financed amount |
| CashFlow | The monthly rate used for amortization calculation (before additional services) |
| Gesamtrate | Total monthly rate (CashFlow + additional services) |
| Gesamtbetrag | Total of all payments over the contract |
| Summe Zinsen | Total interest paid |
| Tageszins | Daily interest amount |
| Leasingfaktor | Leasing factor (monthly rate as % of vehicle price) |
| Provision | Dealer commission |
| Händlerbeteiligung | Dealer participation (additional dealer cost contribution) |
| Vollamortisation | Full amortization — no residual value (Finanzierung only) |
| Teilamortisation | Partial amortization — with final balloon installment (Finanzierung only) |
| Sonderkonditionen (SoKo) | Special conditions: customer category-based approval process |
| Kundenkategorie | Customer category (e.g., Mitarbeiter der PAG, Key Account) |
| Vertragsart | Contract type: geschlossen (closed) or offen (open) |
| Leasingablöse | Early lease termination / buyout |
| Antragsteller | Person submitting the SoKo or Leasingablöse request |
| Genehmiger | Person approving the request |
| Folgevertrag | Follow-on contract (yes/no flag for Leasingablöse) |
| Abzinsung | Discounted interest rate (Leasingablöse output) |

---

## Calculation Modes

### Leasing

**Mode A — Basis Restwert (standard)**
- User enters: UPE, Nachlass, Sonderzahlung, Laufzeit, Kilometer, PFS-Zins, Zielrestwert
- Tool calculates: CashFlow (monthly rate) via GoalSeek (amortization must reach 0)

**Mode B — Zielrate (target monthly rate)**
The user enters a target monthly rate (`Zielrate`) and the tool solves for one of these by GoalSeek:

| Sub-mode | Solved for |
|---|---|
| Sonderzahlung | Sonderzahlung that achieves the Zielrate |
| Nachlass | Nachlass that achieves the Zielrate |
| Restwert | Residual value that achieves the Zielrate |

### Finanzierung

**Vollamortisation** — No residual value; full amortization over the term.

**Teilamortisation** — With a final Schlussrate (balloon payment).

Same Zielrate sub-modes apply (Anzahlung / Schlussrate instead of Sonderzahlung / Restwert).

### Sonderkonditionen (SoKo)

Runs after a base Leasing or Finanzierung calculation. Calculates the effect of dealer participation and commission on the rate. Requires base results (UPE, CashFlow, Gesamtbetrag) to exist.

---

## Input Fields

All inputs are collected in the frontend form and sent to the backend for calculation.

| Field | Type | Used In | Description |
|---|---|---|---|
| `brand` | `'Porsche' \| 'Lamborghini' \| 'Bentley'` | All | Selected brand |
| `produktart` | `'Leasing' \| 'Finanzierung'` | All | Product type |
| `berechnungsart` | `'BasisRestwert' \| 'Zielrate'` | All | Calculation mode |
| `zielrateZiel` | `'Sonderzahlung' \| 'Nachlass' \| 'Restwert' \| 'Anzahlung' \| 'Schlussrate'` | Zielrate mode | What to solve for |
| `amortisation` | `'Voll' \| 'Teil'` | Finanzierung | Amortization type |
| `upe` | `number` | Leasing | MSRP in € |
| `kaufpreis` | `number` | Finanzierung | Purchase price in € |
| `nachlassEUR` | `number` | All | Discount in € |
| `nachlassPRO` | `number` | All | Discount in % |
| `anzahlungEUR` | `number` | Finanzierung | Down payment in € |
| `anzahlungPRO` | `number` | Finanzierung | Down payment in % |
| `sonderzahlungEUR` | `number` | Leasing | Special payment in € |
| `sonderzahlungPRO` | `number` | Leasing | Special payment in % |
| `subventionHOEUR` | `number` | All | HO subsidy in € |
| `subventionHOPRO` | `number` | All | HO subsidy in % |
| `subventionPDEUR` | `number` | All | PD subsidy in € |
| `subventionPDPRO` | `number` | All | PD subsidy in % |
| `zusatzleistungen` | `ZusatzleistungItem[]` | All | Up to 5 additional services |
| `laufzeit` | `number` | All | Term in months |
| `kilometer` | `number` | Leasing + TeilAmort. | Annual mileage in km |
| `pfsZins` | `number` | All | PFS interest rate (decimal, e.g. 0.05 = 5%) |
| `zielrestwertEUR` | `number` | Zielrate modes | Target residual value in € |
| `zielrestwertPRO` | `number` | Zielrate modes | Target residual value in % |
| `zielrate` | `number` | Zielrate mode | Target monthly rate in € |
| `provisionEUR` | `number` | SoKo | Commission in € |
| `provisionPRO` | `number` | SoKo | Commission in % |
| `haendlerbeteiligungEUR` | `number` | SoKo | Dealer participation in € |
| `haendlerbeteiligungPRO` | `number` | SoKo | Dealer participation in % |

**Customer info (metadata, not used in calculation):**

| Field | Description |
|---|---|
| `porscheZentrum` | Dealer name |
| `kunde` | Customer name |
| `kundenNummer` | Customer number |
| `fahrzeug` | Vehicle description |
| `liefertermin` | Delivery date |
| `verkaufsberater` | Sales consultant name |

**Additional services options:**
`''` (none), `'GAP'`, `'ServicePLUS'`, `'ServicePLUS fuer GW'`, `'Porsche Leasing S'`, `'Porsche Leasing S lite'`

---

## Output Fields

| Field | Description |
|---|---|
| `upe` | UPE used in calculation |
| `nachlass` | Calculated/applied discount |
| `sonderzahlung` | Special payment applied |
| `kgl` | Net financed amount (KGL) |
| `cashFlow` | Monthly base rate |
| `gesamtrate` | Total monthly rate (incl. additional services) |
| `restwert` | Residual value / Schlussrate |
| `summeZinsen` | Total interest |
| `gesamtbetrag` | Total of all payments |
| `tageszins` | Daily interest amount |
| `sollzins` | Nominal interest rate p.a. |
| `effektivzins` | Effective interest rate p.a. (APR) — **main output** |
| `leasingFaktor` | Monthly rate as % of vehicle price |

---

## Validation Rules (from VBA)

- Leasing: `upe > 0`
- Finanzierung: `kaufpreis > 0`
- Leasing + Teilamortisation: `kilometer > 0`
- All: `laufzeit > 0`
- All: `pfsZins > 0` and `pfsZins ≤ 0.20` (20%)
- Warning (non-blocking): Zielrestwert/Schlussrate `< 10%` shows a warning but still calculates
- SoKo: requires a completed base calculation (effektivzins must already exist)

---

## Brands

| Brand | Primary Color | Label |
|---|---|---|
| Porsche | `#CE0100` (RGB 206,1,0) | Porsche Financial Services Deutschland |
| Lamborghini | `#FFC000` (RGB 255,192,0) | Lamborghini Financial Services Deutschland |
| Bentley | `#94C11D` (RGB 148,193,29) | Bentley Financial Services Deutschland |

---

## Tech Stack

- **Frontend**: Vue 3 with `<script setup lang="ts">`, Pinia, Vue Router, PrimeVue, Tailwind CSS, Vite, Vitest, Cypress (E2E)
- **Backend**: Express + TypeScript, Zod (input validation), Vitest (unit tests)
- **Language**: TypeScript throughout
- **Package manager**: npm

---

## Repository Layout

```
/
├── .github/                  # Copilot agent configuration (this folder)
├── frontend/                 # Vue 3 + TypeScript SPA
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Route-level views (Rechner, Leasingablöse, Ausgabe)
│   │   ├── stores/           # Pinia stores (calculationStore, brandStore)
│   │   ├── composables/      # Shared logic (useFormValidation, useBrand)
│   │   ├── types/            # Shared TypeScript types/interfaces
│   │   └── router/           # Vue Router config
│   └── cypress/              # Cypress E2E tests
│       ├── e2e/
│       ├── support/
│       └── fixtures/
├── backend/                  # Express + TypeScript API
│   └── src/
│       ├── routes/           # Express route handlers
│       ├── services/         # Business logic (calculationService, leasingService)
│       └── types/            # Shared TypeScript types/interfaces
└── effektivzinstool/         # Original VBA source (read-only reference)
```

---

## Platform

- **Version control**: GitLab (not GitHub)
- **No CI/CD pipeline** initially — all validation runs locally
- Work is done locally in VS Code with GitHub Copilot; commits are pushed directly to GitLab
- A tech person must be able to understand every change by reading the git log alone

---

## Language Rules

- **User communication**: Always respond to the user in **German** — questions, explanations, status updates, error messages, confirmations
- **Code and technical work**: All code, comments, commit messages, PR descriptions, variable names, function names, file names, and agent outputs are written in **English**
- **Domain terms in code**: German domain nouns are used as-is in TypeScript (e.g., `effektivzins`, `laufzeit`, `pfsZins`) — this is the domain language embedded in English structure, not an exception
- **Documentation**: Developer docs (README, API docs, code comments) in English; user guide (`docs/benutzerhandbuch.md`) in German

This rule applies to all agents. When an agent produces output for the user (findings, questions, status summaries, clarifying questions), it writes in **German**. When it writes code, schemas, tests, or inline comments, it writes in **English**.

---

## Coding Guidelines

- Follow existing code patterns before introducing new structure
- Keep domain terms in German (Leasing, Effektivzins, Laufzeit, etc.); use English for technical connectors and structural names
- Keep calculation logic exclusively in backend services — never in Vue components or stores
- Frontend stores may call backend API and hold response state; they must not contain financial formulas
- Use Zod schemas for all backend input validation; keep schemas co-located with their route files
- Use `data-testid` attributes on all interactive elements to support Cypress tests
- For financial math, always reference `.github/skills/financial-calculations/SKILL.md`
- For clean code patterns, reference `.github/skills/clean-code/SKILL.md`

---

## Commit Convention

Every commit must follow this format so the git log is self-explanatory to a technical reader:

```
<type>(<scope>): <short description in English>

[optional body: explain why, not what]
```

**Types:**

| Type | When to use |
|---|---|
| `feat` | New feature or calculation mode |
| `fix` | Bug fix or wrong formula |
| `test` | Adding or updating tests |
| `docs` | Documentation only |
| `refactor` | Code restructure without behavior change |
| `chore` | Config, deps, tooling |

**Scopes** match the domain: `leasing`, `finanzierung`, `soko`, `leasingablöse`, `brand`, `ausgabe`, `api`, `frontend`, `backend`

**Examples:**
```
feat(leasing): add basis-restwert calculation with GoalSeek solver
test(leasing): add Vitest coverage for calculateLeasing service
feat(finanzierung): add Vollamortisation with BW-Bank rounding
fix(leasing): correct Sollzins when SubventionPD is zero
test(cypress): add E2E fixture and spec for leasing happy path
feat(leasingablöse): add PV/RATE calculation for early buyout
docs(api): document POST /api/calculate/leasing request and response
```

Each commit must be **self-contained and buildable** — tests pass, app builds after every commit.

---

## Feature Slice Definition

A feature is "done" when all of the following are true:
1. Backend service function implemented with correct financial formula
2. Zod schema validates all inputs with correct bounds
3. Express route wired and returns correct response
4. Vue form component with all required `data-testid` attributes
5. Pinia store holds API response and loading/error state
6. Vitest unit tests cover: happy path, boundary values, error cases
7. Cypress E2E spec covers: happy path + at least one validation error
8. All tests pass locally: `npm run test` (backend + frontend) + `npx cypress run`

---

## Build and Validation

No CI/CD pipeline — all validation runs locally before every commit:

```bash
# Backend
cd backend && npm run test && npm run build

# Frontend
cd frontend && npm run test && npm run build

# E2E (requires running app)
cd frontend && npx cypress run
```

---

## Agent Routing

| Situation | Start with |
|---|---|
| Feature request is ambiguous or from a non-technical description | `analyst` |
| Feature spec is clear and approved | `developer` |
| Code review of existing changes | `reviewer` |
| Pre-commit check of staged changes | `pre-commit-reviewer` |
| Security-sensitive change (input handling, file export, API exposure) | `security-reviewer` |
| Writing or updating Cypress E2E tests | `cypress-tester` |
| Writing or updating documentation (README, API docs, user guide) | `documenter` |

For new features not yet designed: prefer `analyst → developer`.

---

## Build and Validation

```bash
# Frontend
cd frontend && npm ci && npm run test && npm run build

# Backend
cd backend && npm ci && npm run test && npm run build

# E2E (requires running app)
cd frontend && npx cypress run
```

---

Trust this file first and search the codebase only when it is incomplete or contradicted by reality.
