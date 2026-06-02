describe('TV tuner app', () => {
  it('lets users select a channel', () => {
    cy.visit('/');
    cy.get('[data-testid="player-placeholder"]').should('contain', 'Select a channel to start watching');

    cy.contains('button', 'Rai 1').click();

    cy.get('[data-testid="player-title"]').should('contain', 'Rai 1');
    cy.get('iframe').should('exist');
  });
});
