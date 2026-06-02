<script setup lang="ts">
defineProps<{
  url: string;
  channelName: string;
}>();
</script>

<template>
  <div class="external-link">
    <div class="external-link__card">
      <p class="external-link__eyebrow">External playback required</p>
      <h2>{{ channelName }}</h2>
      <p class="external-link__message">This channel cannot be embedded directly.</p>
      <a class="external-link__button" :href="url" target="_blank" rel="noopener noreferrer">
        Open {{ channelName }} in a new tab
      </a>
    </div>
  </div>
</template>

<style scoped>
.external-link {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  padding: 1.5rem;
}

.external-link__card {
  width: min(100%, 520px);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.04);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.28);
}

.external-link__eyebrow {
  color: var(--accent-color);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.external-link__message {
  color: var(--muted-text-color);
  line-height: 1.5;
}

.external-link__button {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.85rem 1.2rem;
  border-radius: 999px;
  background: var(--accent-color);
  color: #06111b;
  font-weight: 700;
}
</style>
