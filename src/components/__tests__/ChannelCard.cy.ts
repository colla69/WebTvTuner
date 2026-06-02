import type { Channel } from '@/config/channels';
import ChannelCard from '../ChannelCard.vue';

const channel: Channel = {
  id: 'rai1',
  name: 'Rai 1',
  group: 'RAI',
  url: 'https://www.raiplay.it/dirette/rai1',
};

describe('ChannelCard', () => {
  it('renders channel details', () => {
    cy.mount(ChannelCard, {
      props: {
        channel,
        isActive: false,
      },
    });

    cy.contains('Rai 1').should('be.visible');
    cy.contains('RAI').should('be.visible');
  });

  it('emits a select event when clicked', () => {
    const onSelect = cy.stub().as('onSelect');

    cy.mount(ChannelCard, {
      props: {
        channel,
        isActive: true,
        onSelect,
      },
    });

    cy.get('[data-testid="channel-card"]').should('have.class', 'channel-card--active').click();
    cy.get('@onSelect').should('have.been.calledOnce');
  });
});
