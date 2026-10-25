import { Link, Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/notes')({
  component: NotesLayout,
})

function NotesLayout() {
  return (
    <main className="mx-auto max-w-5xl px-6 pt-16 sm:pt-20">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-4xl font-semibold tracking-tighter sm:text-5xl">
          My Notes
        </h1>
        <Link
          to="/notes/new"
          className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 active:scale-95 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          New note
        </Link>
      </div>

      <Outlet />
    </main>
  )
}
