---
name: 'implement-feature'
description: 'Guided prompt for implementing a new PFS Effektivzins feature. Routes to analyst for clarification if needed, then to developer for implementation. Use this as your starting point when you want to add a feature from the old Excel tool to the web app.'
---

# Implement a Feature — PFS Effektivzins Tool

Use this prompt when you want to add or extend a feature in the PFS Effektivzins web app.

## How To Use

Describe the feature in your own words — **you do not need to use technical language**. Describe it the way you would explain it to someone using the old Excel tool:

- What did the user do in the Excel tool?
- What did they enter?
- What did they see as the result?
- Is there a special case or mode switch involved?
- Do you have known input/output values to verify the result against?

**Examples of good descriptions:**
- "In the Excel tool, when the user selects Leasing and enters the UPE, Laufzeit, and PFS-Zins, it calculates the monthly CashFlow and shows the Effektivzins. I want this to work in the web app."
- "There was a Zielrate mode where you could enter the monthly rate you want and the tool would calculate the Restwert for you. I want that."
- "The Leasingablöse sheet had a form for entering contract details and it would calculate the Abzinsung. I need that page."

---

## Routing Logic

Read `copilot-instructions.md` first.

**If the feature description is ambiguous or incomplete** (missing inputs, unclear outputs, unclear which calculation mode):
→ Route to the `analyst` agent. It will ask clarifying questions in German and produce a specification.

**If the feature matches an already-defined calculation mode in `copilot-instructions.md` and the spec is clear:**
→ Route directly to the `developer` agent with this description as the implementation brief.

**If the feature involves only writing E2E tests (the implementation is already done):**
→ Route to the `cypress-tester` agent.

---

## Context To Include

When routing to any agent, include:
- This feature description (provided by the user)
- The relevant section of `copilot-instructions.md` (calculation mode, input fields, output fields)
- Any reference values from the original VBA tool if known (e.g., "with UPE 80.000€, Laufzeit 36 months, PFS-Zins 5%, the Effektivzins should be around 5.12%")

---

## Definition of Done

The feature is complete when:
1. Backend service + route implemented and validated
2. Frontend form + result display implemented
3. `npm run test` passes in both `backend/` and `frontend/`
4. `npx cypress run` passes for the new flow
5. `reviewer` reports no Critical or High findings (or all are fixed)
6. `pre-commit-reviewer` reports no critical findings and suggests commit message
7. Committed with a descriptive message following the convention in `copilot-instructions.md`
8. Pushed to GitLab

## After Implementation — Quality Cycle

Once the `developer` agent completes the implementation:

```
1. developer   → implements + runs local tests
2. reviewer    → reviews full implementation (domain, architecture, tests, security)
3. developer   → fixes Critical and High findings, re-runs tests
4. pre-commit-reviewer → reviews staged diff, confirms clean, suggests commit message
5. commit + push to GitLab
```

**Step 2 — Trigger `reviewer`:**
```
@workspace #reviewer
Review the changes just implemented.
```

**Step 3 — Trigger `developer` with findings:**
```
@workspace #developer
Fix these findings from the reviewer: [paste Critical/High findings]
```

**Step 4 — Trigger `pre-commit-reviewer`:**
```
@workspace #pre-commit-reviewer
```

**Step 5 — Optionally run `security-reviewer`** if the feature involves a new API endpoint or user input handling:
```
@workspace #security-reviewer
```
