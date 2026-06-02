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
  <div data-testid="channel-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 p-4">
    <button
      v-for="channel in channels"
      :key="channel.id"
      :data-testid="`channel-${channel.id}`"
      class="flex items-center justify-center p-4 rounded-lg border border-gray-700 bg-gray-800 hover:bg-gray-700 hover:border-blue-500 transition-all duration-200 text-sm font-medium text-gray-200 cursor-pointer"
      :class="{ 'ring-2 ring-blue-500 bg-gray-700': selectedChannelId === channel.id }"
      @click="emit('select', channel)"
    >
      {{ channel.name }}
    </button>
  </div>
</template>
