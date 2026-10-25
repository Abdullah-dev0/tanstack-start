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

const features = [
  ['Type-safe routing', 'Routes and links stay in sync across every page.'],
  [
    'Server functions',
    'Call server code from your UI without API boilerplate.',
  ],
  [
    'Private by default',
    'Every note belongs to you — nobody else can read it.',
  ],
]

// A small, static picture of the app (sidebar + note), Bear style
const previewNotes = [
  ['Weekend ideas', 'Hike, farmers market, finish the book…'],
  ['Groceries', 'Eggs, coffee, lemons, olive oil'],
  ['Meeting notes', 'Ship the redesign on Friday'],
]

function App() {
  return (
    <main className="mx-auto max-w-5xl px-6">
      <section className="animate-rise pt-20 pb-16 text-center sm:pt-28">
        <p className="inline-flex items-center gap-2 rounded-full bg-(--accent-soft) px-3 py-1 text-xs font-medium text-(--accent)">
          <span className="size-1.5 rounded-full bg-(--accent)" />
          Simple, private notes
        </p>
        <h1 className="mx-auto mt-6 max-w-3xl font-serif text-5xl font-medium tracking-tight text-balance sm:text-7xl">
          A quiet place for <em className="text-(--accent)">your thoughts.</em>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-pretty text-(--muted)">
          Write it down, find it later. A calm, focused notes app with nothing
          in your way.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/notes"
            className="group inline-flex items-center gap-2 rounded-lg bg-(--accent) px-5 py-2.5 text-sm font-medium text-(--accent-ink) shadow-sm transition hover:opacity-90"
          >
            Open my notes
            <span className="transition group-hover:translate-x-0.5">→</span>
          </Link>
          <Link
            to="/register"
            className="rounded-lg border border-(--line) bg-(--card) px-5 py-2.5 text-sm font-medium transition hover:bg-(--sunken)"
          >
            Create account
          </Link>
        </div>
      </section>

      {/* 🖼️ App preview */}
      <section
        aria-hidden="true"
        className="animate-rise overflow-hidden rounded-xl border border-(--line) bg-(--card) shadow-xl shadow-black/5 [animation-delay:120ms]"
      >
        <div className="flex h-9 items-center gap-1.5 border-b border-(--line) px-4">
          <span className="size-2.5 rounded-full bg-(--line)" />
          <span className="size-2.5 rounded-full bg-(--line)" />
          <span className="size-2.5 rounded-full bg-(--line)" />
        </div>
        <div className="grid sm:grid-cols-[240px_1fr]">
          <ul className="hidden border-r border-(--line) bg-(--paper) sm:block">
            {previewNotes.map(([title, body], index) => (
              <li
                key={title}
                className={`border-b border-(--line) px-4 py-3 ${index === 0 ? 'bg-(--accent-soft)' : ''}`}
              >
                <p className="text-sm font-semibold">{title}</p>
                <p className="mt-0.5 truncate text-xs text-(--muted)">{body}</p>
              </li>
            ))}
          </ul>
          <div className="p-8 text-left sm:p-10">
            <p className="font-serif text-3xl font-medium tracking-tight">
              Weekend ideas
            </p>
            <p className="mt-4 font-serif text-lg leading-relaxed text-(--muted)">
              Hike up the north trail early, then the farmers market for
              peaches. Finish the last chapters of the book on the porch.
            </p>
            <p className="mt-6 text-xs text-(--faint)">
              24 words · ~8s to read
            </p>
          </div>
        </div>
      </section>

      <section className="mt-16 grid gap-8 sm:grid-cols-3">
        {features.map(([title, desc], index) => (
          <article
            key={title}
            className="animate-rise"
            style={{ animationDelay: `${index * 90 + 200}ms` }}
          >
            <span className="block h-0.5 w-8 rounded-full bg-(--accent)" />
            <h2 className="mt-4 font-semibold tracking-tight">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-(--muted)">
              {desc}
            </p>
          </article>
        ))}
      </section>
    </main>
  )
}
