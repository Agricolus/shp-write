import { defineConfig } from 'vite';
import dts from 'unplugin-dts/vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: () => 'index.js',
    },
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: ['jszip'],
    },
  },
  plugins: [dts({ include: ['src'] })],
});
