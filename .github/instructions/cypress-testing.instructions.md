---
name: 'WebTvTuner Cypress Testing'
description: 'Guidelines for writing Cypress E2E tests for the WebTvTuner app'
applyTo: 'cypress/**/*.ts, cypress/**/*.cy.ts'
---

# WebTvTuner Cypress E2E Testing Rules

Use this file when writing or updating Cypress tests. Follow the patterns already established in `cypress/` before introducing new helpers.

## Folder Structure

```
cypress/
├── e2e/                           # Test spec files
│   ├── channel-selection.cy.ts
│   ├── group-filtering.cy.ts
│   ├── video-player.cy.ts
│   ├── responsive-layout.cy.ts
│   └── error-handling.cy.ts
├── support/
│   ├── commands.ts                # Custom Cypress commands
│   └── e2e.ts                     # Global setup
└── fixtures/
    └── channels.json              # Channel test data
```

## Test Naming Convention

File names: `[feature].[scenario].cy.ts`

Test descriptions: plain language matching a user action.

```ts
// Good
describe('Channel Selection', () => {
  it('loads the video player when a channel is clicked', () => { ... })
  it('switches the video when a different channel is selected', () => { ... })
})

// Bad
describe('ChannelGridComponent', () => {
  it('should emit select event', () => { ... })
})
```

## Selector Strategy

**Always use `data-testid` attributes.** Never use CSS class names or element type selectors.

```ts
// Good
cy.get('[data-testid="channel-rai-1"]').click()
cy.get('[data-testid="video-player"]').should('be.visible')
cy.get('[data-testid="video-iframe"]').should('have.attr', 'src')

// Bad
cy.get('.channel-card').first().click()
cy.get('iframe').should('exist')
```

## Custom Commands

```ts
// Select a channel by its ID
Cypress.Commands.add('selectChannel', (channelId: string) => {
  cy.get(`[data-testid="channel-${channelId}"]`).click()
})

// Filter by group
Cypress.Commands.add('filterGroup', (groupId: string) => {
  cy.get(`[data-testid="group-${groupId}"]`).click()
})

// Verify video player is showing content
Cypress.Commands.add('verifyVideoPlaying', () => {
  cy.get('[data-testid="video-player"]').should('be.visible')
  cy.get('[data-testid="video-player"]')
    .find('iframe, video')
    .should('exist')
})
```

## Coverage Expectations

Every user flow must have at least:
1. **Happy path** — action leads to expected result
2. **Error state** — stream unavailable, adapter missing
3. **State transition** — switching from one channel to another

## Constraints

- Do not assert on exact pixel positions or element sizes
- Do not use `cy.wait(ms)` with fixed millisecond waits — use `cy.get(...).should(...)` with retry-ability
- Do not mock adapters in Cypress — tests run against the real app
- Keep each test independent: navigate to `/` at the start of each test
- If a required `data-testid` is missing, stop and note it — do not use fragile selectors
