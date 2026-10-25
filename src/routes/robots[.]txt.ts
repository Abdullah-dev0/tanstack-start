// 🤖 /robots.txt — tells search engines what they may crawl.
// 📖 https://tanstack.com/start/latest/docs/framework/react/guide/seo
// "[.]" in the file name = a real dot in the URL → /robots.txt
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        // ⚠️ My tweak: docs hardcode https://myapp.com — we use the current
        // domain, so it is right locally AND on workers.dev / your own domain.
        const origin = new URL(request.url).origin

        const robots = `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml`

        return new Response(robots, {
          headers: {
            'Content-Type': 'text/plain',
          },
        })
      },
    },
  },
})
