<script setup lang="ts">
import type { Channel } from '@/config/channels';

defineProps<{
  channel: Channel;
  isActive: boolean;
}>();

const emit = defineEmits<{
  select: [];
}>();
</script>

<template>
  <button
    class="channel-card"
    :class="{ 'channel-card--active': isActive }"
    type="button"
    :data-channel-id="channel.id"
    data-testid="channel-card"
    @click="emit('select')"
  >
    <span class="channel-card__name">{{ channel.name }}</span>
    <span class="channel-card__badge">{{ channel.group }}</span>
  </button>
</template>

<style scoped>
.channel-card {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.9rem 1rem;
  border: 1px solid transparent;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-color);
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.channel-card:hover {
  background: var(--card-hover);
  transform: translateY(-1px);
}

.channel-card--active {
  background: rgba(79, 195, 247, 0.16);
  border-color: var(--accent-color);
  box-shadow: inset 0 0 0 1px rgba(79, 195, 247, 0.2);
}

.channel-card__name {
  font-weight: 600;
}

.channel-card__badge {
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: var(--muted-text-color);
  font-size: 0.72rem;
  letter-spacing: 0.04em;
}
</style>
