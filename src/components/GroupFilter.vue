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
  <div data-testid="group-filter" class="flex flex-wrap gap-1.5 px-3 pt-3">
    <button
      data-testid="group-all"
      class="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
      :class="activeGroupId === null ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'"
      @click="emit('filter', null)"
    >
      All
    </button>
    <button
      v-for="group in groups"
      :key="group.id"
      :data-testid="`group-${group.id}`"
      class="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
      :class="activeGroupId === group.id ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'"
      @click="emit('filter', group.id)"
    >
      {{ group.name }}
    </button>
  </div>
</template>
