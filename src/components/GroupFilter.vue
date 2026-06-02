<script setup lang="ts">
import type { ChannelGroup } from '../types/channel.types'

defineProps<{
  groups: ChannelGroup[]
  activeGroupId: string | null
}>()

const emit = defineEmits<{
  (e: 'filter', groupId: string | null): void
}>()
</script>

<template>
  <div data-testid="group-filter" class="flex gap-2 p-4 overflow-x-auto">
    <button
      data-testid="group-all"
      class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
      :class="activeGroupId === null ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
      @click="emit('filter', null)"
    >
      All
    </button>
    <button
      v-for="group in groups"
      :key="group.id"
      :data-testid="`group-${group.id}`"
      class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
      :class="activeGroupId === group.id ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
      @click="emit('filter', group.id)"
    >
      {{ group.name }}
    </button>
  </div>
</template>
