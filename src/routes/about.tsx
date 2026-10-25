import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <main className="mx-auto max-w-2xl px-6 pt-20 sm:pt-28">
      <section className="animate-rise">
        <p className="font-mono text-sm text-zinc-400 dark:text-zinc-500">
          About
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tighter text-balance sm:text-5xl">
          A small starter with room to grow.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-pretty text-zinc-500 dark:text-zinc-400">
          TanStack Start gives you type-safe routing, server functions, and
          modern SSR defaults. Use this as a clean foundation, then layer in
          your own routes, styling, and add-ons.
        </p>
      </section>
    </main>
  )
}
