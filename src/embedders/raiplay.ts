import type { Embedder } from './base';

const iframeSandbox = 'allow-scripts allow-same-origin allow-presentation allow-popups';
const iframeAllow = 'autoplay; fullscreen; encrypted-media; picture-in-picture';

export const raiPlayEmbedder: Embedder = {
  id: 'raiplay',
  name: 'RaiPlay',
  domains: ['raiplay.it'],
  canHandle(url) {
    try {
      return new URL(url).hostname.includes('raiplay.it');
    } catch {
      return false;
    }
  },
  getEmbed(url) {
    return {
      strategy: 'iframe',
      src: url,
      sandbox: iframeSandbox,
      allow: iframeAllow,
    };
  },
};
