---
name: financial-calculations
description: 'Reference for all financial calculation algorithms in the PFS Effektivzins Tool. Use when implementing or reviewing any calculation service in the backend. All algorithms are derived from the original VBA source (Mod_Kalkulation.bas).'
---

# Financial Calculations — PFS Effektivzins Tool

This skill documents all financial algorithms used in the PFS Effektivzins Tool, translated from the original Excel/VBA implementation into TypeScript-ready pseudocode and formulas. Always read this before implementing or changing any calculation.

---

## VBA → TypeScript Name Mapping

| VBA name | Domain meaning | TypeScript name |
|---|---|---|
| `_1_UPE` | MSRP / list price | `upe` |
| `_1_Sonstiges` | Purchase price | `kaufpreis` |
| `_1_NachlassEUR` | Discount in € | `nachlassEUR` |
| `_1_SonderzahlungEUR` | Special upfront payment | `sonderzahlungEUR` |
| `_1_SubventionHOEUR` | HO subsidy | `subventionHOEUR` |
| `_1_SubventionPDEUR` | PD subsidy | `subventionPDEUR` |
| `_1_Laufzeit` | Term in months | `laufzeit` |
| `_1_PFS` | PFS interest rate (decimal) | `pfsZins` |
| `_1_ZielrestwertEUR` | Target residual value | `zielrestwertEUR` |
| `_1_Zielrate` | Target monthly rate | `zielrate` |
| `_2_Cashflow` | Monthly base rate | `cashFlow` |
| `_2_KGL` | Net financed amount | `kgl` |
| `_2_Restwert` | Residual value | `restwert` |
| `_2_Schlussrate` | Final balloon installment | `schlussrate` |
| `_2_Sollzins` | Nominal annual rate | `sollzins` |
| `_2_Effektivzins` | Effective annual rate | `effektivzins` |
| `_2_Leasingfaktor` | Leasing factor | `leasingFaktor` |
| `_2_Gesamtrate` | Total monthly rate | `gesamtrate` |
| `_2_Gesamtbetrag` | Total of all payments | `gesamtbetrag` |
| `_2_Zinsen` | Total interest | `summeZinsen` |
| `_2_Tageszins` | Daily interest | `tageszins` |

---

## Day Count Convention

**30/360** — all interest calculations use 30-day months, 360-day year.

```ts
const monthlyInterest = (balance: number, annualRate: number): number =>
  balance * annualRate * (30 / 360)
```

---

## Utility: GoalSeek (Binary Search)

The VBA uses Excel's `GoalSeek` function. Replace it with a binary search:

```ts
function goalSeek(
  fn: (x: number) => number,  // function that returns the amortization result
  target: number,              // desired result (usually 0)
  lowerBound: number,
  upperBound: number,
  tolerance = 0.0001,          // €0.0001 convergence tolerance
  maxIterations = 1000
): number {
  let lo = lowerBound
  let hi = upperBound
  for (let i = 0; i < maxIterations; i++) {
    const mid = (lo + hi) / 2
    const result = fn(mid)
    if (Math.abs(result - target) < tolerance) return mid
    if (result < target) lo = mid
    else hi = mid
  }
  return (lo + hi) / 2
}
```

---

## Utility: EFFEKTIV / EFFECT (Excel `EFFEKTIV`)

Converts a nominal annual rate to effective annual rate, compounding monthly.

```ts
// Excel: AUFRUNDEN(EFFEKTIV(sollzins, 12), 4)
function effektiv(nominalRate: number): number {
  return roundUp((1 + nominalRate / 12) ** 12 - 1, 4)
}
```

---

## Utility: AUFRUNDEN (Excel `AUFRUNDEN`)

Round up to a specified number of decimal places (BW-Bank rounding logic).

```ts
function roundUp(value: number, decimals: number): number {
  const factor = 10 ** decimals
  return Math.ceil(value * factor) / factor
}
```

---

## Utility: PV — Present Value (Excel `BW`)

Used in Leasingablöse. Type 1 = payment at beginning of period (annuity due).

```ts
// Excel: -BW(rate, nper, pmt, fv, type)
function presentValue(rate: number, nper: number, pmt: number, fv: number, type: 0 | 1 = 0): number {
  if (rate === 0) return -(pmt * nper + fv)
  const pvFactor = (1 - (1 + rate) ** -nper) / rate
  return -(pmt * pvFactor * (1 + rate * type) + fv / (1 + rate) ** nper)
}
```

---

## Utility: RATE (Excel `ZINS`) — Newton-Raphson

Used in Leasingablöse for Abzinsung. Iterative solver for the periodic interest rate.

```ts
function rate(nper: number, pmt: number, pv: number, fv = 0, type: 0 | 1 = 0, guess = 0.1): number {
  let r = guess
  for (let i = 0; i < 100; i++) {
    const f = presentValue(r, nper, pmt, fv, type) - pv
    // Numerical derivative
    const df = (presentValue(r + 1e-7, nper, pmt, fv, type) - f) / 1e-7
    const rNew = r - f / df
    if (Math.abs(rNew - r) < 1e-10) return rNew
    r = rNew
  }
  return r
}
```

---

## Leasing Calculation

### Step 1: Compute KGL (net financed amount)

```ts
// Standard Basis Restwert and most Zielrate modes:
kgl = upe + sonstiges - nachlassEUR - sonderzahlungEUR - subventionHOEUR

// Zielrate Nachlass mode (nachlass2 = solved discount):
kgl = upe + sonstiges - nachlass2 - sonderzahlung - subventionHOEUR
```

### Step 2: Compute SummeVertragsdaten (financed balance)

```ts
// Basis Restwert:
summeVertragsdaten = upe + sonstiges - nachlassEUR - sonderzahlungEUR - subventionHOEUR - subventionPDEUR

// Zielrate Sonderzahlung / Restwert:
summeVertragsdaten = upe + sonstiges - nachlassEUR - sonderzahlungEUR - subventionHOEUR - subventionPDEUR

// Zielrate Nachlass:
summeVertragsdaten = upe + sonstiges - nachlass2 - sonderzahlungEUR - subventionHOEUR - subventionPDEUR
```

### Step 3: Amortization table

Build an array of `laufzeit + 1` periods. The last period carries the residual value.

```ts
function buildLeasingAmortization(
  summeVertragsdaten: number,
  cashFlow: number,         // monthly base rate (what we solve for in Basis Restwert)
  restwert: number,         // residual value (last period CashFlow)
  pfsZins: number,
  laufzeit: number
): number[] {
  const amount: number[] = []
  for (let i = 1; i <= laufzeit + 1; i++) {
    const cf = i <= laufzeit ? cashFlow : restwert
    const zins = i === 1 ? 0 : amount[i - 2] * pfsZins * (30 / 360)
    const tilgung = cf - zins
    amount[i - 1] = i === 1
      ? summeVertragsdaten - tilgung
      : amount[i - 2] - tilgung
  }
  return amount
}
```

### Step 4: GoalSeek to solve for the unknown

**Basis Restwert** → solve for `cashFlow` such that `amount[laufzeit] = 0`:
```ts
cashFlow = goalSeek(
  (cf) => buildLeasingAmortization(svd, cf, restwert, pfsZins, laufzeit).at(-1)!,
  0, 0, upe * 2
)
```

**Zielrate Sonderzahlung** → solve for `sonderzahlung`:
```ts
sonderzahlung = goalSeek(
  (sz) => buildLeasingAmortization(svd(sz), cashFlow, restwert, pfsZins, laufzeit).at(-1)!,
  0, 0, upe
)
```

**Zielrate Nachlass** → solve for `nachlass2`:
```ts
nachlass2 = goalSeek(
  (nl) => buildLeasingAmortization(svd(nl), cashFlow, restwert, pfsZins, laufzeit).at(-1)!,
  0, 0, upe
)
```

**Zielrate Restwert** → solve for `restwert`:
```ts
restwert = goalSeek(
  (rv) => buildLeasingAmortization(svd, cashFlow, rv, pfsZins, laufzeit).at(-1)!,
  0, 0, upe
)
```

### Step 5: Compute Sollzins

Recalculate amortization but with KGL **including SubventionPD** as starting balance, and solve for the interest rate that makes the balance reach 0:

```ts
// Rebuild amortization with (kgl + subventionPDEUR) as starting balance
// Solve for sollzins using goalSeek:
sollzins = goalSeek(
  (rate) => buildLeasingAmortizationWithRate(kgl + subventionPDEUR, cashFlow, restwert, rate, laufzeit).at(-1)!,
  0, 0, 0.5
)
sollzins = Math.max(sollzins, 0)  // VBA: if < 0, set to 0
```

### Step 6: Compute derived outputs

```ts
gesamtrate = cashFlow + zusatzleistung1 + zusatzleistung2 + zusatzleistung3 + zusatzleistung4 + zusatzleistung5
gesamtbetrag = gesamtrate * laufzeit + sonderzahlungEUR
summeZinsen = Math.round(cashFlow * 100) / 100 * laufzeit - (upe + sonstiges - nachlassEUR - sonderzahlungEUR - restwert)
tageszins = (kgl - subventionPDEUR) * pfsZins / 360
leasingFaktor = Math.round(cashFlow / (upe + sonstiges) * 100 * 10000) / 10000
effektivzins = effektiv(sollzins)  // (1 + sollzins/12)^12 - 1, rounded up to 4dp
```

---

## Finanzierung Calculation

### Step 1: Compute SummeVertragsdaten

```ts
// Standard modes:
summeVertragsdaten = roundTo2(kaufpreis - sonderzahlungEUR - subventionHOEUR)

// Zielrate Anzahlung mode:
summeVertragsdaten = roundTo2(kaufpreis - anzahlung - subventionHOEUR)
```

### Step 2: Amortization (advance annuity, beginning-of-period payments)

```ts
// Finanzierung uses beginning-of-period payments (Vorschüssige Annuität):
// Amount_0 = svd * (1 + pfsZins * 30/360) - cashFlow
// Amount_i = Amount_{i-1} * (1 + pfsZins * 30/360) - cashFlow
function buildFinanzierungAmortization(
  svd: number,
  cashFlow: number,
  pfsZins: number,
  laufzeit: number  // note: VBA uses laufzeit - 1 months for loop (i = 0 to laufzeit-1)
): number[] {
  const amount: number[] = []
  for (let i = 0; i < laufzeit; i++) {
    const prev = i === 0 ? svd : amount[i - 1]
    amount[i] = prev * (1 + pfsZins * (30 / 360)) - cashFlow
  }
  return amount
}
```

### Step 3: GoalSeek

**Vollamortisation** → solve for `cashFlow` such that `amount[laufzeit-1] = 0`:
```ts
cashFlow = goalSeek(
  (cf) => buildFinanzierungAmortization(svd, cf, pfsZins, laufzeit).at(-1)!,
  0, 0, kaufpreis * 2
)
```

**Teilamortisation, Basis Schlussrate** → solve for `cashFlow` such that `amount[laufzeit-1] + cashFlow = zielrestwertEUR`:
```ts
cashFlow = goalSeek(
  (cf) => {
    const amounts = buildFinanzierungAmortization(svd, cf, pfsZins, laufzeit)
    return amounts.at(-1)! + cf  // last balloon = remaining balance + one more payment
  },
  zielrestwertEUR, 0, kaufpreis * 2
)
```

**Zielrate Schlussrate** → CashFlow is fixed (= zielrate); no GoalSeek needed.

**Zielrate Anzahlung** → solve for `anzahlung` such that `amount[laufzeit-1] + cashFlow = zielrestwertEUR`:
```ts
// Fix cashFlow = zielrate, solve for anzahlung
anzahlung = goalSeek(
  (az) => {
    const svd = roundTo2(kaufpreis - az - subventionHOEUR)
    const amounts = buildFinanzierungAmortization(svd, zielrate, pfsZins, laufzeit)
    return amounts.at(-1)! + zielrate
  },
  zielrestwertEUR, 0, kaufpreis
)
```

### Step 4: BW-Bank Rounding

Always round CashFlow **up** to 2 decimal places after GoalSeek:
```ts
cashFlow = roundUp(cashFlow, 2)
```

### Step 5: NAF90 Rule

After calculation, check that `schlussrate ≤ 0.9 * (kaufpreis - sonderzahlungEUR)`. If violated, recalculate with `zielrestwertEUR = 0.9 * (kaufpreis - sonderzahlungEUR)`:

```ts
const naf90Max = (kaufpreis - sonderzahlungEUR) * 0.9
if (schlussrate > naf90Max) {
  // Recalculate with zielrestwertEUR = naf90Max (Teilamortisation, Basis Schlussrate)
}
```

### Step 6: Compute derived outputs (Vollamortisation)

```ts
gesamtrate = cashFlow + amount[laufzeit - 1]  // last period remainder added to final rate
gesamtbetrag = gesamtrate + cashFlow * (laufzeit - 1)
summeZinsen = gesamtbetrag - kgl
sollzins = pfsZins  // for Finanzierung, Sollzins = PFS-Zins directly
effektivzins = effektiv(sollzins)  // (1 + sollzins/12)^12 - 1, rounded up to 4dp
tageszins = kgl * pfsZins / 360
kgl = kaufpreis - sonderzahlungEUR  // (simplified; exact formula in VBA: _2_UPE - _2_Sonderzahlung)
```

---

## Leasingablöse Calculation

Inputs: `passiv` (passive rate, decimal), `restlaufzeit` (months), `rateNetto` (net monthly rate), `restwert` (residual value), `verbessert` (improved payout value)

```ts
// Gross rate
ablöseRateBrutto = rateNetto * 1.19

// Original lease buyout (present value of remaining payments, grossed up by 19% VAT)
// Excel: -BW(passiv/12, restlaufzeit, rateNetto, restwert, 1) * 1.19
ablöseOriginal = -presentValue(passiv / 12, restlaufzeit, rateNetto, restwert, 1) * 1.19

// Difference (how much the improved offer saves)
ablöseDifferenz = ablöseOriginal - verbessert

// Discounted rate: the implied interest rate of the improved offer
// Excel: RUNDEN(ZINS(restlaufzeit, rateNetto, -(ablöseOriginal/1.19 - ablöseDifferenz/1.19), restwert, 1) * 12 * 100, 2) / 100
const pvImproved = -(ablöseOriginal / 1.19 - ablöseDifferenz / 1.19)
ablöseAbzinsung = Math.round(
  rate(restlaufzeit, rateNetto, pvImproved, restwert, 1) * 12 * 100 * 100
) / 100 / 100

ablöseVerbessertProz = ablöseAbzinsung - passiv
```

---

## Validation Rules (exact thresholds from VBA)

| Rule | Condition | Behavior |
|---|---|---|
| UPE required for Leasing | `upe === 0` | Error — block calculation |
| Kaufpreis required for Finanzierung | `kaufpreis === 0` | Error — block calculation |
| Kilometer required for Leasing | `kilometer === 0` | Error — block calculation |
| Kilometer required for Teilamortisation | `kilometer === 0` | Error — block calculation |
| Laufzeit must be positive | `laufzeit === 0` | Error — block calculation |
| PFS-Zins minimum | `pfsZins === 0` | Error — block calculation |
| PFS-Zins maximum | `pfsZins > 0.20` | Error — block calculation |
| Zielrestwert/Schlussrate minimum warning | `zielrestwertPRO < 0.10` | Warning (non-blocking) — calculate anyway |
| NAF90 rule | `schlussrate > (kaufpreis - sonderzahlung) * 0.9` | Auto-recalculate with capped Schlussrate |
| SoKo requires base calculation | `effektivzins === 0` | Error — run base calc first |

---

## Leasingfaktor Formula

```ts
// Excel: RUNDEN(CashFlow / (UPE + Sonstiges) * 100, 4)
leasingFaktor = Math.round(cashFlow / (upe + sonstiges) * 100 * 10000) / 10000
// e.g. 1.03 means 1.03% of vehicle price per month
```

---

## Implementation Notes

- All intermediate values should be computed in full precision; only round outputs at the display layer (except CashFlow which uses BW-Bank rounding after GoalSeek)
- GoalSeek tolerance of `0.0001` (€0.0001) is sufficient for all use cases
- GoalSeek bounds: use `[0, upe * 3]` for CashFlow/Restwert, `[-upe, upe]` for Nachlass/Sonderzahlung
- The `rate()` function for Leasingablöse should start with `guess = passiv` for faster convergence
- Test every service function against values from `cypress/fixtures/` (derived from the VBA tool)
