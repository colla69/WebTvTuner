---
name: 'implement-feature'
description: 'Guided prompt for implementing a new feature in WebTvTuner. Routes to analyst for clarification if needed, then to developer for implementation.'
---

# Implement a Feature — WebTvTuner

Use this prompt when you want to add or modify a feature in the WebTvTuner app.

## How To Use

Describe what you want:
- What should the user see or be able to do?
- Is it a UI change, a new adapter, a Docker change, or a combination?
- Do you have a reference for how it should look or work?

**Examples:**
- "I want a search bar to find channels by name"
- "I want the app to remember the last watched channel"
- "I want to add a favorites feature where users can star channels"
- "I want the channel grid to show channel logos"

---

## Routing Logic

**If the feature is ambiguous or incomplete:**
→ Route to `analyst` for clarification and spec.

**If the feature is clear and implementation-ready:**
→ Route directly to `developer`.

**If the feature involves only E2E tests:**
→ Route to `cypress-tester`.

**If the feature involves Docker/deployment changes:**
→ Route to `developer` with Docker instructions reference.

---

## Quality Cycle

Once implementation is complete:

```
1. developer          → implements + runs local tests
2. reviewer           → reviews full implementation
3. developer          → fixes Critical/High findings
4. pre-commit-reviewer → reviews staged diff, suggests commit message
5. commit + push
```

---

## Definition of Done

1. Feature implemented and working locally
2. Unit tests cover new logic
3. Cypress E2E test covers the user flow
4. `npm run test` + `npm run build` pass
5. Docker build succeeds
6. Reviewer reports no Critical or High findings
7. Pre-commit-reviewer confirms clean and suggests commit message
