import type { Embedder } from './base';

export const fallbackEmbedder: Embedder = {
  id: 'fallback',
  name: 'Open externally',
  domains: ['*'],
  canHandle() {
    return true;
  },
  getEmbed(url) {
    if (url.toLowerCase().includes('.m3u8')) {
      return {
        strategy: 'hls',
        src: url,
      };
    }

    return {
      strategy: 'external',
      src: url,
    };
  },
};
