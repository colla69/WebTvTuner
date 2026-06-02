<script setup lang="ts">
import type { EmbedConfig } from '../adapters/adapter.types'

defineProps<{
  config: EmbedConfig | null
  channelName?: string
  channelGroup?: string
}>()
</script>

<template>
  <div class="flex-1 flex flex-col">
    <!-- Channel header -->
    <header v-if="channelName" class="flex items-center justify-between mb-4">
      <h2 data-testid="channel-name" class="text-2xl font-bold text-white">{{ channelName }}</h2>
      <span v-if="channelGroup" class="px-3 py-1 rounded-full bg-white/5 text-gray-400 text-sm font-medium">
        {{ channelGroup }}
      </span>
    </header>

    <!-- Player viewport -->
    <div data-testid="video-player" class="flex-1 min-h-[500px] bg-black rounded-2xl overflow-hidden border border-gray-700/50 relative">
      <!-- No channel selected -->
      <div
        v-if="!config"
        data-testid="player-placeholder"
        class="absolute inset-0 flex flex-col items-center justify-center text-gray-500 gap-2"
      >
        <h2 class="text-xl font-medium text-gray-300">Select a channel to start watching</h2>
        <p class="text-sm">Pick a live stream from the sidebar.</p>
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

      <!-- HLS stream -->
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
  </div>
</template>
