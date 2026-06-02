<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue';
import PlayerArea from '@/components/PlayerArea.vue';
</script>

<template>
  <div class="app-shell">
    <Sidebar />
    <PlayerArea />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  background: var(--app-background);
}
</style>
