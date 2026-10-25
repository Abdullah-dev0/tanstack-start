import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  // 🔎 SEO for the about page
  head: () => ({
    meta: [
      { title: 'About | My Notes' },
      {
        name: 'description',
        content: 'What My Notes is and how it is built with TanStack Start.',
      },
      { property: 'og:title', content: 'About | My Notes' },
    ],
  }),
  // 🌍 PUBLIC page, same for everyone → a CDN may keep a copy
  // 📖 https://tanstack.com/start/latest/docs/framework/react/guide/isr
  headers: () => ({
    // Cache at CDN for 1 hour, allow stale content for up to 1 day
    'Cache-Control':
      'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
  }),
  component: About,
})

function About() {
  return (
    <main className="mx-auto max-w-2xl px-6 pt-20 sm:pt-28">
      <section className="animate-rise">
        <p className="font-mono text-sm text-(--accent)">About</p>
        <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-balance sm:text-5xl">
          A small starter with room to grow.
        </h1>
        <p className="mt-6 font-serif text-xl leading-relaxed text-pretty text-(--muted)">
          TanStack Start gives you type-safe routing, server functions, and
          modern SSR defaults. Use this as a clean foundation, then layer in
          your own routes, styling, and add-ons.
        </p>
      </section>
    </main>
  )
}
