import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    proxy: {
      '/api/rai-relinker': {
        target: 'https://mediapolis.rai.it',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/rai-relinker/, '/relinker'),
        headers: {
          'Referer': 'https://www.raiplay.it/',
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
