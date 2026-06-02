export type EmbedStrategy = 'iframe' | 'hls' | 'external';

export interface EmbedResult {
  strategy: EmbedStrategy;
  src: string;
  sandbox?: string;
  allow?: string;
}

export interface Embedder {
  id: string;
  name: string;
  domains: string[];
  canHandle(url: string): boolean;
  getEmbed(url: string): EmbedResult;
}
