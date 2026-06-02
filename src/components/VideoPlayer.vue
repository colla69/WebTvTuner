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
const hlsError = ref<string | null>(null)
const loading = ref(false)
let hls: Hls | null = null
let retryCount = 0
const MAX_RETRIES = 3

function destroyHls() {
  if (hls) {
    hls.destroy()
    hls = null
  }
  retryCount = 0
}

/**
 * Resolves the actual stream URL. For RAI, the proxy returns a plain-text
 * CDN URL that we then pass to hls.js. For Mediaset, the URL is direct.
 */
async function resolveStreamUrl(url: string): Promise<string> {
  if (url.includes('/api/rai-relinker/')) {
    const resp = await fetch(url)
    if (!resp.ok) {
      throw new Error(`Relinker error: HTTP ${resp.status}`)
    }
    const text = (await resp.text()).trim()
    if (!text.startsWith('http')) {
      throw new Error('Relinker returned invalid URL')
    }
    return text
  }
  // Mediaset: direct proxy URL
  return url
}

function initHls(streamUrl: string) {
  destroyHls()
  hlsError.value = null
  const video = videoRef.value
  if (!video) return

  if (Hls.isSupported()) {
    hls = new Hls({ enableWorker: true, lowLatencyMode: true })
    hls.loadSource(streamUrl)
    hls.attachMedia(video)
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      loading.value = false
      hlsError.value = null
      video.play().catch(() => {})
    })
    hls.on(Hls.Events.ERROR, (_event, data) => {
      if (data.fatal) {
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          retryCount++
          if (retryCount <= MAX_RETRIES) {
            setTimeout(() => hls?.startLoad(), 2000)
          } else {
            loading.value = false
            hlsError.value = 'Stream unavailable. Make sure you are connected to an Italian VPN — these streams are geo-restricted to Italy.'
          }
        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls?.recoverMediaError()
        } else {
          loading.value = false
          hlsError.value = 'Failed to load stream. The channel may be temporarily unavailable.'
        }
      }
    })
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = streamUrl
    video.addEventListener('loadedmetadata', () => {
      loading.value = false
      video.play().catch(() => {})
    })
    video.addEventListener('error', () => {
      loading.value = false
      hlsError.value = 'Stream unavailable. Make sure you are connected to an Italian VPN.'
    })
  }
}

async function loadStream(config: EmbedConfig) {
  if (config.type !== 'hls') return
  loading.value = true
  hlsError.value = null
  try {
    const actualUrl = await resolveStreamUrl(config.streamUrl)
    initHls(actualUrl)
  } catch (err: unknown) {
    loading.value = false
    hlsError.value = err instanceof Error ? err.message : 'Failed to resolve stream URL'
  }
}

watch(
  () => props.config,
  (newConfig) => {
    if (newConfig?.type === 'hls') {
      hlsError.value = null
      setTimeout(() => loadStream(newConfig), 0)
    } else {
      destroyHls()
      hlsError.value = null
      loading.value = false
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
      <div
        v-else-if="config.type === 'hls'"
        class="absolute inset-0"
      >
        <video
          ref="videoRef"
          data-testid="video-hls"
          class="w-full h-full bg-black"
          controls
          autoplay
          playsinline
        />
        <!-- Loading overlay -->
        <div
          v-if="loading && !hlsError"
          class="absolute inset-0 flex flex-col items-center justify-center bg-black/80 gap-3"
        >
          <div class="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p class="text-gray-400 text-sm">Connecting to stream...</p>
        </div>
        <!-- HLS error overlay -->
        <div
          v-if="hlsError"
          data-testid="hls-error"
          class="absolute inset-0 flex flex-col items-center justify-center bg-black/90 text-center p-6 gap-4"
        >
          <p class="text-4xl">📡</p>
          <p class="text-red-400 text-lg font-medium">{{ hlsError }}</p>
          <button
            class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
            @click="config.type === 'hls' && loadStream(config)"
          >
            Retry
          </button>
        </div>
      </div>

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
