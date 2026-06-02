<script setup lang="ts">
import type { EmbedConfig } from '../adapters/adapter.types'

defineProps<{
  config: EmbedConfig | null
  channelName?: string
}>()
</script>

<template>
  <div data-testid="video-player" class="w-full aspect-video bg-black rounded-lg overflow-hidden relative">
    <!-- No channel selected -->
    <div
      v-if="!config"
      data-testid="player-placeholder"
      class="absolute inset-0 flex items-center justify-center text-gray-500 text-lg"
    >
      Select a channel to start watching
    </div>

    <!-- Iframe embed -->
    <iframe
      v-else-if="config.type === 'iframe'"
      data-testid="video-iframe"
      :src="config.src"
      :sandbox="config.sandbox"
      :allow="config.allow"
      :referrerpolicy="config.referrerPolicy"
      class="w-full h-full border-0"
      allowfullscreen
    />

    <!-- HLS stream (placeholder for future HLS.js integration) -->
    <div
      v-else-if="config.type === 'hls'"
      data-testid="video-hls"
      class="absolute inset-0 flex items-center justify-center text-gray-400"
    >
      HLS stream: {{ config.streamUrl }}
    </div>

    <!-- Error state -->
    <div
      v-else-if="config.type === 'error'"
      data-testid="player-error"
      class="absolute inset-0 flex items-center justify-center text-red-400 text-center p-4"
    >
      <div>
        <p class="text-xl mb-2">⚠️</p>
        <p>{{ config.message }}</p>
      </div>
    </div>
  </div>

  <!-- Channel name display -->
  <div v-if="channelName" data-testid="channel-name" class="text-center text-gray-300 mt-2 text-sm font-medium">
    Now watching: {{ channelName }}
  </div>
</template>
