import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { getNotes } from '../../utils/notes.functions'

export const Route = createFileRoute('/notes/')({
  // Turns the raw ?q= from the URL into typed state
  validateSearch: (search: Record<string, unknown>): { q?: string } => ({
    q: typeof search.q === 'string' ? search.q : undefined,
  }),
  loader: () => getNotes(),
  component: NotesIndex,
})

function NotesIndex() {
  const { q = '' } = Route.useSearch()
  const notes = Route.useLoaderData()
  const navigate = useNavigate({ from: '/notes/' })

  const filtered = notes.filter((n) =>
    n.title.toLowerCase().includes(q.toLowerCase()),
  )

  return (
    <div>
      <div className="relative">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-zinc-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          value={q}
          onChange={(e) =>
            // replace: true updates the URL without a history entry per keystroke
            navigate({
              search: { q: e.target.value || undefined },
              replace: true,
            })
          }
          placeholder="Search notes..."
          className="w-full rounded-2xl border border-zinc-900/10 bg-white py-3.5 pr-4 pl-11 text-base shadow-sm shadow-zinc-900/5 transition outline-none placeholder:text-zinc-400 focus:border-zinc-900/20 focus:ring-4 focus:ring-amber-400/20 dark:border-white/10 dark:bg-zinc-900 dark:focus:border-white/20"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="mt-6 rounded-3xl border border-dashed border-zinc-900/10 px-6 py-20 text-center text-zinc-500 dark:border-white/10 dark:text-zinc-400">
          No notes yet.
        </p>
      ) : (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((note) => (
            <li key={note.id}>
              <Link
                to="/notes/$noteId"
                params={{ noteId: note.id }}
                className="group flex h-full items-center justify-between gap-3 rounded-2xl border border-zinc-900/5 bg-white p-5 font-semibold tracking-tight transition hover:-translate-y-0.5 hover:border-zinc-900/10 hover:shadow-lg hover:shadow-zinc-900/5 dark:border-white/10 dark:bg-zinc-900/50 dark:hover:border-white/20 dark:hover:shadow-black/30"
              >
                {note.title}
                <span className="-translate-x-1 text-zinc-400 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
