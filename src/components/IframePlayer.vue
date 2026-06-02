<script setup lang="ts">
defineProps<{
  src: string;
  sandbox?: string;
  allow?: string;
}>();
</script>

<template>
  <iframe
    class="iframe-player"
    :src="src"
    :sandbox="sandbox"
    :allow="allow"
    frameborder="0"
    allowfullscreen
  />
</template>

<style scoped>
.iframe-player {
  width: 100%;
  height: 100%;
  border: none;
  background: #000;
}
</style>
