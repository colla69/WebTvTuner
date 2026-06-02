describe('Channel Selection', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('displays the app header', () => {
    cy.get('[data-testid="app-header"]').should('be.visible')
    cy.get('[data-testid="app-header"]').should('contain', 'WebTvTuner')
  })

  it('displays the channel grid with all channels', () => {
    cy.get('[data-testid="channel-grid"]').should('be.visible')
    cy.get('[data-testid="channel-rai-1"]').should('be.visible')
    cy.get('[data-testid="channel-canale-5"]').should('be.visible')
    cy.get('[data-testid="channel-rai-gulp"]').should('be.visible')
  })

  it('shows placeholder when no channel is selected', () => {
    cy.get('[data-testid="player-placeholder"]').should('be.visible')
    cy.get('[data-testid="player-placeholder"]').should('contain', 'Select a channel')
  })

  it('loads video player when a channel is clicked', () => {
    cy.selectChannel('rai-1')
    cy.get('[data-testid="video-iframe"]').should('exist')
    cy.get('[data-testid="video-iframe"]').should('have.attr', 'src')
    cy.get('[data-testid="channel-name"]').should('contain', 'Rai 1')
  })

  it('switches video when a different channel is selected', () => {
    cy.selectChannel('rai-1')
    cy.get('[data-testid="video-iframe"]')
      .should('have.attr', 'src')
      .and('contain', 'rai1')

    cy.selectChannel('canale-5')
    cy.get('[data-testid="video-iframe"]')
      .should('have.attr', 'src')
      .and('contain', 'canale5')
    cy.get('[data-testid="channel-name"]').should('contain', 'Canale 5')
  })

  it('highlights the selected channel', () => {
    cy.selectChannel('rai-2')
    cy.get('[data-testid="channel-rai-2"]').should('have.class', 'ring-2')
  })
})
