import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { cloudflare } from '@cloudflare/vite-plugin'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    tailwindcss(),
    // ☁️ Run the server part inside Cloudflare's runtime (dev + build).
    // 📖 Must come BEFORE tanstackStart()
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tanstackStart({
      // 📄 PRERENDER: build these pages into static HTML at BUILD time
      prerender: {
        enabled: true,
        crawlLinks: false, // don't follow links — only the pages below
        filter: ({ path }) => path === '/about',
      },
    }),
    viteReact(),
  ],
})

export default config
