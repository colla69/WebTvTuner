import { computed, ref } from 'vue';

import type { Channel } from '@/config/channels';
import { getEmbed } from '@/embedders';
import type { EmbedResult } from '@/embedders';

const currentChannel = ref<Channel | null>(null);
const currentEmbed = computed<EmbedResult | null>(() => {
  return currentChannel.value ? getEmbed(currentChannel.value.url) : null;
});

function selectChannel(channel: Channel): void {
  currentChannel.value = channel;
}

export function usePlayer() {
  return {
    currentChannel,
    currentEmbed,
    selectChannel,
  };
}
