import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    // 🛠️ Devtools: shown in dev, REMOVED from production builds automatically.
    // 📖 https://tanstack.com/devtools/latest/docs/production — must be the FIRST plugin
    devtools(),
    tailwindcss(),
    tanstackStart({
      // 📄 PRERENDER: build these pages into static HTML at BUILD time
      prerender: {
        enabled: true,
        crawlLinks: false, // don't follow links — only the pages below
        filter: ({ path }) => path === '/about',
      },
    }),
    // 🖥️ Nitro = turns the app into a Node server for a VPS (node .output/server/index.mjs)
    // 📖 https://tanstack.com/start/latest/docs/framework/react/guide/hosting
    nitro(),
    viteReact(),
  ],
})

export default config
