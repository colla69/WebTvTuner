describe('Group Filtering', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('displays group filter buttons', () => {
    cy.get('[data-testid="group-filter"]').should('be.visible')
    cy.get('[data-testid="group-all"]').should('be.visible')
    cy.get('[data-testid="group-rai"]').should('be.visible')
    cy.get('[data-testid="group-mediaset"]').should('be.visible')
    cy.get('[data-testid="group-kids"]').should('be.visible')
  })

  it('shows all channels by default', () => {
    cy.get('[data-testid="channel-rai-1"]').should('be.visible')
    cy.get('[data-testid="channel-canale-5"]').should('be.visible')
    cy.get('[data-testid="channel-rai-gulp"]').should('be.visible')
  })

  it('filters to RAI channels only', () => {
    cy.filterGroup('rai')
    cy.get('[data-testid="channel-rai-1"]').should('be.visible')
    cy.get('[data-testid="channel-rai-movie"]').should('be.visible')
    cy.get('[data-testid="channel-canale-5"]').should('not.exist')
    cy.get('[data-testid="channel-rai-gulp"]').should('not.exist')
  })

  it('filters to Mediaset channels only', () => {
    cy.filterGroup('mediaset')
    cy.get('[data-testid="channel-canale-5"]').should('be.visible')
    cy.get('[data-testid="channel-rete-4"]').should('be.visible')
    cy.get('[data-testid="channel-rai-1"]').should('not.exist')
  })

  it('filters to Kids channels only', () => {
    cy.filterGroup('kids')
    cy.get('[data-testid="channel-rai-gulp"]').should('be.visible')
    cy.get('[data-testid="channel-rai-yoyo"]').should('be.visible')
    cy.get('[data-testid="channel-rai-1"]').should('not.exist')
    cy.get('[data-testid="channel-canale-5"]').should('not.exist')
  })

  it('returns to all channels when All is clicked', () => {
    cy.filterGroup('rai')
    cy.get('[data-testid="channel-canale-5"]').should('not.exist')

    cy.get('[data-testid="group-all"]').click()
    cy.get('[data-testid="channel-canale-5"]').should('be.visible')
    cy.get('[data-testid="channel-rai-1"]').should('be.visible')
  })
})
