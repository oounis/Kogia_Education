import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// `@core` = ../core/src — la logique métier, partagée mot pour mot avec
// l'application Android. Elle vit hors de `app/` pour qu'aucun des deux clients
// ne puisse la considérer comme la sienne.
const core = fileURLToPath(new URL('../core/src', import.meta.url))

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@core': core } },
  // le cœur est hors de la racine Vite : il faut l'autoriser explicitement
  server: { fs: { allow: ['..'] } },
})
