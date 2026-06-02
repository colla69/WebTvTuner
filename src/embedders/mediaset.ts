import type { Embedder } from './base';

export const mediasetEmbedder: Embedder = {
  id: 'mediaset',
  name: 'Mediaset Infinity',
  domains: ['mediaset.it'],
  canHandle(url: string): boolean {
    try {
      return new URL(url).hostname.includes('mediaset.it');
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
