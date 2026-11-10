import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // './' — сборка работает из любой подпапки, в том числе из
  // https://<user>.github.io/<repo>/ на GitHub Pages.
  base: './',
})
