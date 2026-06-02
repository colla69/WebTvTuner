<script setup lang="ts">
import Hls from 'hls.js';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps<{ src: string }>();

const videoRef = ref<HTMLVideoElement | null>(null);
const errorMessage = ref('');
let hls: Hls | null = null;

function cleanup() {
  if (hls) {
    hls.destroy();
    hls = null;
  }
  if (videoRef.value) {
    videoRef.value.pause();
    videoRef.value.removeAttribute('src');
    videoRef.value.load();
  }
}

function attachSource() {
  const video = videoRef.value;
  if (!video) return;

  cleanup();
  errorMessage.value = '';

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = props.src;
    return;
  }

  if (Hls.isSupported()) {
    hls = new Hls();
    hls.loadSource(props.src);
    hls.attachMedia(video);
    hls.on(Hls.Events.ERROR, (_, data) => {
      if (data.fatal) {
        errorMessage.value = 'Unable to load this live stream.';
      }
    });
    return;
  }

  errorMessage.value = 'HLS playback is not supported in this browser.';
}

onMounted(attachSource);
watch(() => props.src, attachSource);
onBeforeUnmount(cleanup);
</script>

<template>
  <div class="hls-player">
    <video ref="videoRef" class="hls-player__video" controls playsinline />
    <p v-if="errorMessage" class="hls-player__error">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.hls-player {
  width: 100%;
  height: 100%;
  background: #000;
}

.hls-player__video {
  width: 100%;
  height: 100%;
}

.hls-player__error {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.8);
  color: #f8b4b4;
  font-size: 0.85rem;
}
</style>
