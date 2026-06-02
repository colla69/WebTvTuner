import type { Embedder } from './base';

export const fallbackEmbedder: Embedder = {
  id: 'fallback',
  name: 'External Link',
  domains: [],
  canHandle(): boolean {
    return true;
  },
  getEmbed(url: string) {
    return {
      strategy: 'external' as const,
      src: url,
    };
  },
};
