import type { Embedder, EmbedResult } from './base';
import { fallbackEmbedder } from './fallback';
import { mediasetEmbedder } from './mediaset';
import { raiPlayEmbedder } from './raiplay';

const embedders: Embedder[] = [raiPlayEmbedder, mediasetEmbedder, fallbackEmbedder];

export function resolveEmbedder(url: string): Embedder {
  return embedders.find((e) => e.canHandle(url)) ?? fallbackEmbedder;
}

export function getEmbed(url: string): EmbedResult {
  return resolveEmbedder(url).getEmbed(url);
}

export type { Embedder, EmbedResult, EmbedStrategy } from './base';
