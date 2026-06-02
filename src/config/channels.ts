export interface Channel {
  id: string;
  name: string;
  group: string;
  url: string;
  logo?: string;
}

export interface ChannelGroup {
  name: string;
  channels: Channel[];
}

export const channelGroups: ChannelGroup[] = [
  {
    name: 'RAI',
    channels: [
      { id: 'rai1', name: 'Rai 1', group: 'RAI', url: 'https://www.raiplay.it/dirette/rai1' },
      { id: 'rai2', name: 'Rai 2', group: 'RAI', url: 'https://www.raiplay.it/dirette/rai2' },
      { id: 'rai3', name: 'Rai 3', group: 'RAI', url: 'https://www.raiplay.it/dirette/rai3' },
      { id: 'rai4', name: 'Rai 4', group: 'RAI', url: 'https://www.raiplay.it/dirette/rai4' },
      { id: 'rai5', name: 'Rai 5', group: 'RAI', url: 'https://www.raiplay.it/dirette/rai5' },
      { id: 'raimovie', name: 'Rai Movie', group: 'RAI', url: 'https://www.raiplay.it/dirette/raimovie' },
      { id: 'raipremium', name: 'Rai Premium', group: 'RAI', url: 'https://www.raiplay.it/dirette/raipremium' },
    ],
  },
  {
    name: 'MEDIASET',
    channels: [
      { id: 'rete4', name: 'Rete 4', group: 'MEDIASET', url: 'https://mediasetinfinity.mediaset.it/diretta/rete4_cR4' },
      { id: 'canale5', name: 'Canale 5', group: 'MEDIASET', url: 'https://mediasetinfinity.mediaset.it/diretta/canale5_cC5' },
      { id: 'italia1', name: 'Italia 1', group: 'MEDIASET', url: 'https://mediasetinfinity.mediaset.it/diretta/italia1_cI1' },
      { id: 'iris', name: 'Iris', group: 'MEDIASET', url: 'https://mediasetinfinity.mediaset.it/diretta/iris_cKI' },
      { id: 'tgcom24', name: 'TGCom24', group: 'MEDIASET', url: 'https://mediasetinfinity.mediaset.it/diretta/_cTS' },
      { id: 'la5', name: 'La5', group: 'MEDIASET', url: 'https://mediasetinfinity.mediaset.it/diretta/la5_cKA' },
    ],
  },
  {
    name: 'KIDS',
    channels: [
      { id: 'raigulp', name: 'Rai Gulp', group: 'KIDS', url: 'https://www.raiplay.it/dirette/raigulp' },
      { id: 'raiyoyo', name: 'Rai Yoyo', group: 'KIDS', url: 'https://www.raiplay.it/dirette/raiyoyo' },
    ],
  },
];
