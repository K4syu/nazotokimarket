import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        index: 'index.html',
        desktop: 'desktop.html',
        mobile: 'mobile.html',
      },
    },
  },
})
