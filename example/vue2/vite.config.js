import path from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
import AutoImport from 'unplugin-auto-import/vite';

const config = defineConfig({
  resolve: {
    alias: {
      '@': `${path.resolve(__dirname, 'src')}`,
    },
  },

  build: {
    minify: true,
  },

  plugins: [
    vue(),
    AutoImport({
      imports: ['@vueuse/core'],
      dts: 'src/auto-imports.d.ts',
    }),
  ],

  server: {
    port: 3333,
    proxy: {
      '/api': {
        target: 'http://localhost:8600',
        changeOrigin: true,
        rewrite(path) {
          return path.replace('/api', '');
        },
      },
    },
  },
});

export default config;
