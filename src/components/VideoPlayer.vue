<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import Hls from 'hls.js'
import type { EmbedConfig } from '../adapters/adapter.types'

const props = defineProps<{
  config: EmbedConfig | null
  channelName?: string
  channelGroup?: string
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
let hls: Hls | null = null

function destroyHls() {
  if (hls) {
    hls.destroy()
    hls = null
  }
}

function initHls(streamUrl: string) {
  destroyHls()
  const video = videoRef.value
  if (!video) return

  if (Hls.isSupported()) {
    hls = new Hls({ enableWorker: true, lowLatencyMode: true })
    hls.loadSource(streamUrl)
    hls.attachMedia(video)
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      video.play().catch(() => {})
    })
    hls.on(Hls.Events.ERROR, (_event, data) => {
      if (data.fatal) {
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          hls?.startLoad()
        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls?.recoverMediaError()
        }
      }
    })
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    // Safari native HLS support
    video.src = streamUrl
    video.addEventListener('loadedmetadata', () => {
      video.play().catch(() => {})
    })
  }
}

watch(
  () => props.config,
  (newConfig) => {
    if (newConfig?.type === 'hls') {
      // Wait for next tick so videoRef is rendered
      setTimeout(() => initHls(newConfig.streamUrl), 0)
    } else {
      destroyHls()
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  destroyHls()
})
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
      <video
        v-else-if="config.type === 'hls'"
        ref="videoRef"
        data-testid="video-hls"
        class="w-full h-full bg-black"
        controls
        autoplay
        playsinline
      />

      <!-- External link (cannot be embedded) -->
      <div
        v-else-if="config.type === 'external'"
        data-testid="player-external"
        class="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center"
      >
        <p class="text-gray-400 text-lg">{{ config.message }}</p>
        <a
          :href="config.url"
          target="_blank"
          rel="noopener noreferrer"
          data-testid="external-link"
          class="inline-block px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
        >
          Open {{ channelName }} in new tab ↗
        </a>
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
