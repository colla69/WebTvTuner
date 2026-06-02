import { computed } from 'vue'
import { useChannelStore } from '../stores/channel.store'
import { getAdapterForUrl } from '../adapters'
import type { EmbedConfig } from '../adapters/adapter.types'

/**
 * Composable that resolves the EmbedConfig for the currently selected channel.
 */
export function useAdapter() {
  const store = useChannelStore()

  const embedConfig = computed<EmbedConfig | null>(() => {
    const channel = store.selectedChannel
    if (!channel) return null

    const adapter = getAdapterForUrl(channel.url)
    if (!adapter) {
      return { type: 'error', message: `No adapter found for ${channel.url}` }
    }

    return adapter.getEmbedConfig(channel.url)
  })

  return { embedConfig }
}
