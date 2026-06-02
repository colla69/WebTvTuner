<script setup lang="ts">
import PlayerArea from '@/components/PlayerArea.vue';
import Sidebar from '@/components/Sidebar.vue';
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
