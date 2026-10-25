// 🗺️ /sitemap.xml — a list of PUBLIC pages for search engines.
// 📖 https://tanstack.com/start/latest/docs/framework/react/guide/seo
// Notes are private (behind login), so they are NOT in the sitemap.
import { createFileRoute } from '@tanstack/react-router'

const publicPages = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.5' },
]

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        // ⚠️ My tweak (same as robots.txt): use the current domain
        const origin = new URL(request.url).origin

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${publicPages
  .map(
    (page) => `  <url>
    <loc>${origin}${page.path}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`

        return new Response(sitemap, {
          headers: {
            'Content-Type': 'application/xml',
          },
        })
      },
    },
  },
})
