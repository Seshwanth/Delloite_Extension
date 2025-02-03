import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
// import webExtension from 'vite-plugin-web-extension';

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
