<script setup lang="ts">
defineProps<{
  url: string;
  channelName: string;
}>();
</script>

<template>
  <div class="external-link">
    <p class="external-link__message">This channel cannot be embedded directly.</p>
    <a :href="url" target="_blank" rel="noopener noreferrer" class="external-link__button">
      Open {{ channelName }} in new tab ↗
    </a>
  </div>
</template>

<style scoped>
.external-link {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  text-align: center;
  gap: 1.5rem;
  padding: 2rem;
}

.external-link__message {
  color: var(--muted-text-color);
  font-size: 1.1rem;
}

.external-link__button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  background: var(--accent-color);
  color: #0f0f1a;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.15s;
}

.external-link__button:hover {
  opacity: 0.85;
}
</style>
