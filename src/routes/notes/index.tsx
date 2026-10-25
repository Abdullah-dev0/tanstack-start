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
          className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-(--faint)"
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
          className="w-full rounded-lg border border-(--line) bg-(--card) py-2.5 pr-4 pl-10 text-sm transition outline-none placeholder:text-(--faint) focus:border-(--accent) focus:ring-4 focus:ring-(--accent-soft)"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-(--line) px-6 py-20 text-center">
          <p className="font-serif text-2xl font-medium">
            {q ? 'Nothing matches that search.' : 'No notes yet.'}
          </p>
          <p className="mt-2 text-sm text-(--muted)">
            {q ? 'Try a different word.' : 'Your first idea is one click away.'}
          </p>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-(--line) overflow-hidden rounded-xl border border-(--line) bg-(--card)">
          {filtered.map((note) => (
            <li key={note.id}>
              <Link
                to="/notes/$noteId"
                params={{ noteId: note.id }}
                className="flex items-start justify-between gap-6 px-5 py-4 transition hover:bg-(--sunken)"
              >
                <div className="min-w-0">
                  <p className="font-semibold tracking-tight">{note.title}</p>
                  <p className="mt-1 line-clamp-1 text-sm text-(--muted)">
                    {note.body || 'No content'}
                  </p>
                </div>
                <time className="shrink-0 pt-0.5 text-xs text-(--faint)">
                  {new Date(note.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
