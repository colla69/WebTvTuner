declare namespace Cypress {
  interface Chainable {
    selectChannel(channelId: string): Chainable<void>
    filterGroup(groupId: string): Chainable<void>
  }
}

Cypress.Commands.add('selectChannel', (channelId: string) => {
  cy.get(`[data-testid="channel-${channelId}"]`).click()
})

Cypress.Commands.add('filterGroup', (groupId: string) => {
  cy.get(`[data-testid="group-${groupId}"]`).click()
})
