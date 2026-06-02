export interface IframeEmbedConfig {
  type: 'iframe'
  src: string
  sandbox?: string
  allow?: string
  referrerPolicy?: ReferrerPolicy
}

export interface HlsEmbedConfig {
  type: 'hls'
  streamUrl: string
  headers?: Record<string, string>
}

export interface ExternalEmbedConfig {
  type: 'external'
  url: string
  message: string
}

export interface CustomEmbedConfig {
  type: 'custom'
  component: string
  props: Record<string, unknown>
}

export interface ErrorEmbedConfig {
  type: 'error'
  message: string
}

export type EmbedConfig = IframeEmbedConfig | HlsEmbedConfig | ExternalEmbedConfig | CustomEmbedConfig | ErrorEmbedConfig

export interface EmbedAdapter {
  id: string
  name: string
  domain: string
  getEmbedConfig(channelUrl: string): EmbedConfig
}
