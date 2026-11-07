// ⚡ Vite settings: the plugins that build and run the app.
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'

import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    // 🛠️ Devtools: shown in dev, REMOVED from production builds automatically.
    // 📖 https://tanstack.com/devtools/latest/docs/production — must be the FIRST plugin
    devtools(),
    tailwindcss(),
    // (Prerendering /about was removed: every page shows the logged-in user now.)
    tanstackStart(),
    viteReact(),
  ],
})

export default config
