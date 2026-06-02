<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    src: string;
    sandbox?: string;
    allow?: string;
  }>(),
  {
    sandbox: 'allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox allow-presentation',
    allow: 'autoplay; encrypted-media; fullscreen; picture-in-picture',
  },
);
</script>

<template>
  <iframe
    class="iframe-player"
    :src="props.src"
    :sandbox="props.sandbox"
    :allow="props.allow"
    allowfullscreen
    loading="lazy"
    referrerpolicy="strict-origin-when-cross-origin"
    :title="`Player for ${props.src}`"
  />
</template>

<style scoped>
.iframe-player {
  width: 100%;
  height: 100%;
  border: 0;
  border-radius: 18px;
  background: #05050a;
}
</style>
