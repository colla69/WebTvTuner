export interface Channel {
  id: string
  name: string
  group: string
  url: string
  logo?: string
}

export interface ChannelGroup {
  id: string
  name: string
  channels: Channel[]
}
