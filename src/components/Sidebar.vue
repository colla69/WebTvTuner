<script setup lang="ts">
import { ref } from 'vue';

import ChannelCard from '@/components/ChannelCard.vue';
import { channelGroups } from '@/config/channels';
import { usePlayer } from '@/composables/usePlayer';

const { currentChannel, selectChannel } = usePlayer();
const openGroups = ref<Record<string, boolean>>(
  Object.fromEntries(channelGroups.map((group) => [group.name, true])),
);

function toggleGroup(groupName: string) {
  openGroups.value[groupName] = !openGroups.value[groupName];
}

function isGroupOpen(groupName: string) {
  return openGroups.value[groupName] ?? false;
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar__header">
      <p class="sidebar__eyebrow">Web TV Tuner</p>
      <h1 class="sidebar__title">Channels</h1>
    </div>

    <div class="sidebar__groups">
      <section v-for="group in channelGroups" :key="group.name" class="sidebar__group">
        <button
          class="sidebar__group-toggle"
          type="button"
          :aria-expanded="isGroupOpen(group.name)"
          @click="toggleGroup(group.name)"
        >
          <span>{{ group.name }}</span>
          <span class="sidebar__group-meta">
            <span>{{ group.channels.length }}</span>
            <span class="sidebar__chevron">{{ isGroupOpen(group.name) ? '▾' : '▸' }}</span>
          </span>
        </button>

        <div v-if="isGroupOpen(group.name)" class="sidebar__group-list">
          <ChannelCard
            v-for="channel in group.channels"
            :key="channel.id"
            :channel="channel"
            :is-active="currentChannel?.id === channel.id"
            @select="selectChannel(channel)"
          />
        </div>
      </section>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 260px;
  min-width: 260px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.25rem;
  background: var(--sidebar-background);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  overflow-y: auto;
}

.sidebar__header {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.sidebar__eyebrow {
  color: var(--accent-color);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.sidebar__title {
  font-size: 1.75rem;
}

.sidebar__groups {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sidebar__group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sidebar__group-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.35rem 0;
  color: var(--text-color);
  font-size: 0.92rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
}

.sidebar__group-meta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--muted-text-color);
  font-size: 0.78rem;
}

.sidebar__chevron {
  width: 1rem;
  text-align: center;
}

.sidebar__group-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
</style>
