<script setup lang="ts">
import type { Channel } from '../types/channel.types'

defineProps<{
  channels: Channel[]
  selectedChannelId?: string | null
}>()

const emit = defineEmits<{
  (e: 'select', channel: Channel): void
}>()
</script>

<template>
  <div data-testid="channel-grid" class="flex flex-col gap-1 p-3 flex-1 overflow-y-auto">
    <button
      v-for="channel in channels"
      :key="channel.id"
      :data-testid="`channel-${channel.id}`"
      class="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-700 transition-colors cursor-pointer text-left"
      :class="selectedChannelId === channel.id
        ? 'bg-blue-500/15 border border-blue-500/50 text-white'
        : 'border border-transparent'"
      @click="emit('select', channel)"
    >
      <span class="font-medium">{{ channel.name }}</span>
      <span class="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-500">{{ channel.group }}</span>
    </button>
  </div>
</template>
