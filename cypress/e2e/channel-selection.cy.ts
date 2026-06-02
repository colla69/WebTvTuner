describe('Channel Selection', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('displays the sidebar', () => {
    cy.get('[data-testid="sidebar"]').should('be.visible')
    cy.get('[data-testid="sidebar"]').should('contain', 'Channels')
  })

  it('displays the channel grid with all channels', () => {
    cy.get('[data-testid="channel-grid"]').should('be.visible')
    cy.get('[data-testid="channel-rai-1"]').should('be.visible')
    cy.get('[data-testid="channel-canale-5"]').scrollIntoView().should('be.visible')
    cy.get('[data-testid="channel-rai-gulp"]').scrollIntoView().should('be.visible')
  })

  it('shows placeholder when no channel is selected', () => {
    cy.get('[data-testid="player-placeholder"]').should('be.visible')
    cy.get('[data-testid="player-placeholder"]').should('contain', 'Select a channel')
  })

  it('loads video player when a channel is clicked', () => {
    cy.selectChannel('rai-1')
    cy.get('[data-testid="video-hls"]').should('exist')
    cy.get('[data-testid="channel-name"]').should('contain', 'Rai 1')
  })

  it('switches video when a different channel is selected', () => {
    cy.selectChannel('rai-1')
    cy.get('[data-testid="video-hls"]').should('exist')

    cy.selectChannel('rai-2')
    cy.get('[data-testid="video-hls"]').should('exist')
    cy.get('[data-testid="channel-name"]').should('contain', 'Rai 2')
  })

  it('loads HLS player for Mediaset channels', () => {
    cy.get('[data-testid="channel-canale-5"]').scrollIntoView()
    cy.selectChannel('canale-5')
    cy.get('[data-testid="video-hls"]').should('exist')
    cy.get('[data-testid="channel-name"]').should('contain', 'Canale 5')
  })

  it('highlights the selected channel in the sidebar', () => {
    cy.selectChannel('rai-2')
    cy.get('[data-testid="channel-rai-2"]').should('have.class', 'bg-blue-500/15')
  })
})
