<script setup lang="ts">
import { computed } from 'vue';
import IframePlayer from '@/components/IframePlayer.vue';
import HlsPlayer from '@/components/HlsPlayer.vue';
import ExternalLink from '@/components/ExternalLink.vue';
import { usePlayer } from '@/composables/usePlayer';

const { currentChannel, currentEmbed } = usePlayer();

const iframeEmbed = computed(() =>
  currentEmbed.value?.strategy === 'iframe' ? currentEmbed.value : null
);
const hlsEmbed = computed(() =>
  currentEmbed.value?.strategy === 'hls' ? currentEmbed.value : null
);
const externalEmbed = computed(() =>
  currentEmbed.value?.strategy === 'external' ? currentEmbed.value : null
);
</script>

<template>
  <main class="player-area">
    <div v-if="currentChannel && currentEmbed" class="player-area__content">
      <header class="player-area__header">
        <h2 data-testid="player-title">{{ currentChannel.name }}</h2>
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
        <ExternalLink
          v-else-if="externalEmbed"
          :url="externalEmbed.src"
          :channel-name="currentChannel.name"
        />
      </div>
    </div>

    <div v-else class="player-area__placeholder" data-testid="player-placeholder">
      <h2>Select a channel to start watching</h2>
      <p>Pick a live stream from the sidebar.</p>
    </div>
  </main>
</template>

<style scoped>
.player-area {
  flex: 1;
  min-height: 100vh;
  display: flex;
  padding: 1.5rem;
  background: var(--app-background);
}

.player-area__content {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.player-area__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.player-area__badge {
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  color: var(--muted-text-color);
  font-size: 0.82rem;
  font-weight: 600;
}

.player-area__viewport {
  flex: 1;
  min-height: 500px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
}

.player-area__placeholder {
  width: 100%;
  display: grid;
  place-items: center;
  text-align: center;
  color: var(--muted-text-color);
}

.player-area__placeholder h2 {
  color: var(--text-color);
  margin-bottom: 0.5rem;
}
</style>
