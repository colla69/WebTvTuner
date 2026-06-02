import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Channel } from '../types/channel.types'
import { channels, channelGroups } from '../data/channels'

export const useChannelStore = defineStore('channel', () => {
  const selectedChannel = ref<Channel | null>(null)
  const activeGroupId = ref<string | null>(null)

  const allChannels = computed(() => channels)
  const groups = computed(() => channelGroups)

  const filteredChannels = computed(() => {
    if (!activeGroupId.value) return channels
    return channels.filter(c => c.group === activeGroupId.value)
  })

  function selectChannel(channel: Channel) {
    selectedChannel.value = channel
  }

  function setActiveGroup(groupId: string | null) {
    activeGroupId.value = groupId
  }

  return {
    selectedChannel,
    activeGroupId,
    allChannels,
    groups,
    filteredChannels,
    selectChannel,
    setActiveGroup,
  }
})
