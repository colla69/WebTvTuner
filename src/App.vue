<script setup lang="ts">
import { useChannelStore } from './stores/channel.store'
import { useAdapter } from './composables/useAdapter'
import ChannelGrid from './components/ChannelGrid.vue'
import GroupFilter from './components/GroupFilter.vue'
import VideoPlayer from './components/VideoPlayer.vue'

const store = useChannelStore()
const { embedConfig } = useAdapter()
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white flex">
    <!-- Sidebar -->
    <aside data-testid="sidebar" class="w-64 min-w-64 h-screen flex flex-col bg-gray-800 border-r border-gray-700 overflow-y-auto sticky top-0">
      <div class="p-4 border-b border-gray-700">
        <p class="text-xs font-bold tracking-widest uppercase text-blue-400">WebTvTuner</p>
        <h1 class="text-xl font-bold text-white mt-1">Channels</h1>
      </div>

      <!-- Group Filter -->
      <GroupFilter
        :groups="store.groups"
        :active-group-id="store.activeGroupId"
        @filter="store.setActiveGroup"
      />

      <!-- Channel List -->
      <ChannelGrid
        :channels="store.filteredChannels"
        :selected-channel-id="store.selectedChannel?.id"
        @select="store.selectChannel"
      />
    </aside>

    <!-- Main Player Area -->
    <main class="flex-1 min-h-screen flex flex-col p-6">
      <VideoPlayer
        :config="embedConfig"
        :channel-name="store.selectedChannel?.name"
        :channel-group="store.selectedChannel?.group"
      />
    </main>
  </div>
</template>
