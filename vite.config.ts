import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves project sites under /<repo>/ — set GITHUB_PAGES=true in
// the deploy workflow so asset URLs resolve there. Local dev stays at '/'.
const isPages = process.env.GITHUB_PAGES === 'true'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: isPages ? '/ParyPro/' : '/',
})