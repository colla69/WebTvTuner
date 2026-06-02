import type { Embedder } from './base';

export const raiPlayEmbedder: Embedder = {
  id: 'raiplay',
  name: 'RaiPlay',
  domains: ['raiplay.it'],
  canHandle(url: string): boolean {
    try {
      return new URL(url).hostname.includes('raiplay.it');
    } catch {
      return false;
    }
  },
  getEmbed(url: string) {
    return {
      strategy: 'iframe' as const,
      src: url,
      sandbox: 'allow-scripts allow-same-origin allow-presentation allow-popups',
      allow: 'autoplay; fullscreen; encrypted-media; picture-in-picture',
    };
  },
};
