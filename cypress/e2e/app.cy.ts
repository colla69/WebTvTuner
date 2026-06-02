describe('WebTvTuner App', () => {
  it('shows placeholder when no channel selected', () => {
    cy.visit('/');
    cy.get('[data-testid="player-placeholder"]').should('contain', 'Select a channel to start watching');
  });

  it('lets users select a channel and shows player', () => {
    cy.visit('/');
    cy.contains('button', 'Rai 1').click();
    cy.get('[data-testid="player-title"]').should('contain', 'Rai 1');
    cy.get('iframe').should('exist');
  });

  it('switches channels', () => {
    cy.visit('/');
    cy.contains('button', 'Rai 1').click();
    cy.get('[data-testid="player-title"]').should('contain', 'Rai 1');
    cy.contains('button', 'Canale 5').click();
    cy.get('[data-testid="player-title"]').should('contain', 'Canale 5');
  });
});
