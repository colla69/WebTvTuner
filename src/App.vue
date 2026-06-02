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
  <div class="min-h-screen bg-gray-900 text-white flex flex-col">
    <!-- Header -->
    <header data-testid="app-header" class="bg-gray-800 border-b border-gray-700 px-4 py-3">
      <h1 class="text-xl font-bold text-blue-400">📺 WebTvTuner</h1>
    </header>

    <!-- Main content -->
    <main class="flex-1 flex flex-col max-w-7xl mx-auto w-full">
      <!-- Video Player -->
      <section class="p-4">
        <VideoPlayer
          :config="embedConfig"
          :channel-name="store.selectedChannel?.name"
        />
      </section>

      <!-- Group Filter -->
      <GroupFilter
        :groups="store.groups"
        :active-group-id="store.activeGroupId"
        @filter="store.setActiveGroup"
      />

      <!-- Channel Grid -->
      <ChannelGrid
        :channels="store.filteredChannels"
        :selected-channel-id="store.selectedChannel?.id"
        @select="store.selectChannel"
      />
    </main>
  </div>
</template>
