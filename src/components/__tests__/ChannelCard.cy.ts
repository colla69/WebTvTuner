import type { Channel } from '@/config/channels';
import ChannelCard from '../ChannelCard.vue';

const channel: Channel = {
  id: 'rai1',
  name: 'Rai 1',
  group: 'RAI',
  url: 'https://www.raiplay.it/dirette/rai1',
};

describe('ChannelCard', () => {
  it('renders channel name and group', () => {
    cy.mount(ChannelCard, {
      props: { channel, isActive: false },
    });
    cy.contains('Rai 1').should('be.visible');
    cy.contains('RAI').should('be.visible');
  });

  it('emits select event when clicked', () => {
    const onSelect = cy.stub().as('onSelect');
    cy.mount(ChannelCard, {
      props: { channel, isActive: false, onSelect },
    });
    cy.get('[data-testid="channel-card"]').click();
    cy.get('@onSelect').should('have.been.calledOnce');
  });

  it('applies active class when isActive is true', () => {
    cy.mount(ChannelCard, {
      props: { channel, isActive: true },
    });
    cy.get('[data-testid="channel-card"]').should('have.class', 'channel-card--active');
  });
});
