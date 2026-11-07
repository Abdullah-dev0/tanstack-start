// ℹ️ /about — a public page about the app.
import { createFileRoute } from '@tanstack/react-router'

// 🚪 Route settings: SEO tags and the page component
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
  // ℹ️ No public CDN cache / prerender anymore: the navbar shows WHO is logged in,
  //    so this page is no longer the same for everyone (see __root.tsx beforeLoad).
  component: About,
})

// 🖼️ The page content
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
