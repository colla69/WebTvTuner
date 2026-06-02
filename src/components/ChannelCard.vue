<script setup lang="ts">
import type { Channel } from '@/config/channels';

defineProps<{
  channel: Channel;
  isActive: boolean;
}>();

defineEmits<{
  select: [];
}>();
</script>

<template>
  <button
    data-testid="channel-card"
    class="channel-card"
    :class="{ 'channel-card--active': isActive }"
    type="button"
    @click="$emit('select')"
  >
    <span class="channel-card__name">{{ channel.name }}</span>
    <span class="channel-card__badge">{{ channel.group }}</span>
  </button>
</template>

<style scoped>
.channel-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-color);
  font-size: 0.88rem;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  border: 1px solid transparent;
}

.channel-card:hover {
  background: rgba(255, 255, 255, 0.07);
}

.channel-card--active {
  background: rgba(79, 195, 247, 0.12);
  border-color: var(--accent-color);
}

.channel-card__name {
  font-weight: 500;
}

.channel-card__badge {
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  color: var(--muted-text-color);
}
</style>
