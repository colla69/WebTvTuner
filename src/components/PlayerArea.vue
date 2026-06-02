<script setup lang="ts">
import { computed } from 'vue';

import ExternalLink from '@/components/ExternalLink.vue';
import HlsPlayer from '@/components/HlsPlayer.vue';
import IframePlayer from '@/components/IframePlayer.vue';
import { usePlayer } from '@/composables/usePlayer';

const { currentChannel, currentEmbed } = usePlayer();

const iframeEmbed = computed(() => {
  return currentEmbed.value?.strategy === 'iframe' ? currentEmbed.value : null;
});

const hlsEmbed = computed(() => {
  return currentEmbed.value?.strategy === 'hls' ? currentEmbed.value : null;
});

const externalEmbed = computed(() => {
  return currentEmbed.value?.strategy === 'external' ? currentEmbed.value : null;
});
</script>

<template>
  <main class="player-area">
    <div v-if="currentChannel && currentEmbed" class="player-area__content">
      <header class="player-area__header">
        <div>
          <p class="player-area__eyebrow">Now selected</p>
          <h2 data-testid="player-title">{{ currentChannel.name }}</h2>
        </div>
        <span class="player-area__badge">{{ currentChannel.group }}</span>
      </header>

      <div class="player-area__viewport">
        <IframePlayer
          v-if="iframeEmbed"
          :src="iframeEmbed.src"
          :sandbox="iframeEmbed.sandbox"
          :allow="iframeEmbed.allow"
        />
        <HlsPlayer v-else-if="hlsEmbed" :src="hlsEmbed.src" />
        <ExternalLink v-else-if="externalEmbed" :url="externalEmbed.src" :channel-name="currentChannel.name" />
      </div>
    </div>

    <div v-else class="player-area__placeholder" data-testid="player-placeholder">
      <div class="player-area__placeholder-card">
        <p class="player-area__eyebrow">Ready to watch</p>
        <h2>Select a channel to start watching</h2>
        <p class="player-area__placeholder-text">
          Pick a live stream from the sidebar to load it here.
        </p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.player-area {
  flex: 1;
  min-width: 0;
  min-height: 100vh;
  display: flex;
  padding: 1.5rem;
  background:
    radial-gradient(circle at top right, rgba(79, 195, 247, 0.12), transparent 28%),
    var(--app-background);
}

.player-area__content,
.player-area__placeholder {
  width: 100%;
  min-height: 0;
}

.player-area__content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.player-area__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.player-area__eyebrow {
  color: var(--accent-color);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 0.35rem;
}

.player-area__badge {
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  color: var(--muted-text-color);
  font-size: 0.82rem;
  font-weight: 600;
}

.player-area__viewport {
  flex: 1;
  min-height: 520px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  background: rgba(0, 0, 0, 0.25);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.24);
}

.player-area__placeholder {
  display: grid;
  place-items: center;
}

.player-area__placeholder-card {
  width: min(100%, 520px);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.04);
  text-align: center;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.24);
}

.player-area__placeholder-text {
  color: var(--muted-text-color);
  line-height: 1.6;
}
</style>
