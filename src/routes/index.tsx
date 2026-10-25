import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  // 🔎 SEO for the home page
  // 📖 https://tanstack.com/start/latest/docs/framework/react/guide/seo
  head: () => ({
    meta: [
      { title: 'My Notes — simple, private notes' },
      {
        name: 'description',
        content:
          'Write, search and organize your notes. Fast, private and free.',
      },
      { property: 'og:title', content: 'My Notes — simple, private notes' },
      {
        property: 'og:description',
        content:
          'Write, search and organize your notes. Fast, private and free.',
      },
    ],
    // 🧩 Structured data (JSON-LD): tells Google "this is a website called My Notes"
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'My Notes',
          description: 'A simple, private notes app.',
        }),
      },
    ],
  }),
  component: App,
})

const code =
  'rounded-md border border-zinc-900/10 bg-zinc-50 px-1.5 py-0.5 font-mono text-[0.85em] text-zinc-700 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300'

function App() {
  return (
    <main className="mx-auto max-w-5xl px-6">
      <section className="animate-rise pt-20 pb-24 sm:pt-28">
        <p className="inline-flex items-center gap-2 rounded-full border border-zinc-900/10 py-1 pr-3 pl-1.5 text-xs font-medium text-zinc-600 dark:border-white/10 dark:text-zinc-300">
          <span className="size-2 rounded-full bg-amber-400" />
          TanStack Start Base Template
        </p>
        <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tighter text-balance sm:text-7xl">
          Start simple,{' '}
          <span className="bg-[linear-gradient(transparent_58%,var(--color-amber-300)_58%)] dark:bg-[linear-gradient(transparent_58%,color-mix(in_oklab,var(--color-amber-500)_45%,transparent)_58%)]">
            ship quickly.
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-pretty text-zinc-500 dark:text-zinc-400">
          This base starter intentionally keeps things light: two routes, clean
          structure, and the essentials you need to build from scratch.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            to="/about"
            className="group inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            About This Starter
            <span className="transition group-hover:translate-x-0.5">→</span>
          </Link>
          <a
            href="https://tanstack.com/router"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-5 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-900/5 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
          >
            Router Guide
          </a>
        </div>
      </section>

      <section className="grid gap-px overflow-hidden rounded-3xl border border-zinc-900/5 bg-zinc-900/5 sm:grid-cols-2 lg:grid-cols-4 dark:border-white/10 dark:bg-white/10">
        {[
          [
            'Type-Safe Routing',
            'Routes and links stay in sync across every page.',
          ],
          [
            'Server Functions',
            'Call server code from your UI without creating API boilerplate.',
          ],
          [
            'Streaming by Default',
            'Ship progressively rendered responses for faster experiences.',
          ],
          [
            'Tailwind Native',
            'Design quickly with utility-first styling and reusable tokens.',
          ],
        ].map(([title, desc], index) => (
          <article
            key={title}
            className="animate-rise bg-white p-8 transition hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900"
            style={{ animationDelay: `${index * 90 + 80}ms` }}
          >
            <h2 className="font-semibold tracking-tight">{title}</h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              {desc}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-3xl border border-zinc-900/5 p-8 dark:border-white/10">
        <p className="font-mono text-xs text-zinc-400 dark:text-zinc-500">
          Quick Start
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-600 marker:text-zinc-300 dark:text-zinc-400 dark:marker:text-zinc-700">
          <li>
            Edit <code className={code}>src/routes/index.tsx</code> to customize
            the home page.
          </li>
          <li>
            Update <code className={code}>src/components/Header.tsx</code> and{' '}
            <code className={code}>src/components/Footer.tsx</code> for brand
            links.
          </li>
          <li>
            Add routes in <code className={code}>src/routes</code> and tweak
            visual tokens in <code className={code}>src/styles.css</code>.
          </li>
        </ul>
      </section>
    </main>
  )
}
