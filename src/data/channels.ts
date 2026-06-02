import type { Channel, ChannelGroup } from '../types/channel.types'

export const channels: Channel[] = [
  // RAI
  { id: 'rai-1', name: 'Rai 1', group: 'rai', url: 'https://www.raiplay.it/dirette/rai1' },
  { id: 'rai-2', name: 'Rai 2', group: 'rai', url: 'https://www.raiplay.it/dirette/rai2' },
  { id: 'rai-3', name: 'Rai 3', group: 'rai', url: 'https://www.raiplay.it/dirette/rai3' },
  { id: 'rai-4', name: 'Rai 4', group: 'rai', url: 'https://www.raiplay.it/dirette/rai4' },
  { id: 'rai-5', name: 'Rai 5', group: 'rai', url: 'https://www.raiplay.it/dirette/rai5' },
  { id: 'rai-movie', name: 'Rai Movie', group: 'rai', url: 'https://www.raiplay.it/dirette/raimovie' },
  { id: 'rai-premium', name: 'Rai Premium', group: 'rai', url: 'https://www.raiplay.it/dirette/raipremium' },

  // Mediaset
  { id: 'rete-4', name: 'Rete 4', group: 'mediaset', url: 'https://mediasetinfinity.mediaset.it/diretta/rete4_cR4' },
  { id: 'canale-5', name: 'Canale 5', group: 'mediaset', url: 'https://mediasetinfinity.mediaset.it/diretta/canale5_cC5' },
  { id: 'italia-1', name: 'Italia 1', group: 'mediaset', url: 'https://mediasetinfinity.mediaset.it/diretta/italia1_cI1' },
  { id: 'iris', name: 'Iris', group: 'mediaset', url: 'https://mediasetinfinity.mediaset.it/diretta/iris_cKI' },
  { id: 'tgcom24', name: 'TgCom24', group: 'mediaset', url: 'https://mediasetinfinity.mediaset.it/diretta/_cTS' },
  { id: 'la5', name: 'La5', group: 'mediaset', url: 'https://mediasetinfinity.mediaset.it/diretta/la5_cKA' },

  // Kids
  { id: 'rai-gulp', name: 'Rai Gulp', group: 'kids', url: 'https://www.raiplay.it/dirette/raigulp' },
  { id: 'rai-yoyo', name: 'Rai Yoyo', group: 'kids', url: 'https://www.raiplay.it/dirette/raiyoyo' },
]

export const channelGroups: ChannelGroup[] = [
  { id: 'rai', name: 'RAI', channels: channels.filter(c => c.group === 'rai') },
  { id: 'mediaset', name: 'Mediaset', channels: channels.filter(c => c.group === 'mediaset') },
  { id: 'kids', name: 'Kids', channels: channels.filter(c => c.group === 'kids') },
]
