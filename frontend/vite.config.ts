import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      // Таргет через env (2.2): dev — стаб контракта :4020; переключение на
      // реальный бэк (3.5) — одна строка VITE_API_TARGET, без правки этого файла.
      // `||`, а не `??`: compose.dev прокидывает переменную пустой строкой.
      '/api': {
        target: process.env.VITE_API_TARGET || 'http://localhost:4020',
        changeOrigin: true,
      },
    },
  },
});
