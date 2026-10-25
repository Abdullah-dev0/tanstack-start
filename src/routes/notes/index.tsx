import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { notes } from './-data'

export const Route = createFileRoute('/notes/')({
  // Turns the raw ?q= from the URL into typed state
  validateSearch: (search: Record<string, unknown>): { q?: string } => ({
    q: typeof search.q === 'string' ? search.q : undefined,
  }),
  component: NotesIndex,
})

function NotesIndex() {
  const { q = '' } = Route.useSearch()
  const navigate = useNavigate({ from: '/notes/' })

  const filtered = notes.filter((n) =>
    n.title.toLowerCase().includes(q.toLowerCase()),
  )

  return (
    <div>
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
        className="mb-4 w-full rounded-xl border border-(--line) bg-transparent px-4 py-2 text-(--sea-ink)"
      />

      {filtered.length === 0 ? (
        <p className="m-0 text-(--sea-ink-soft)">No notes yet.</p>
      ) : (
        <ul className="m-0 list-none space-y-2 p-0">
          {filtered.map((note) => (
            <li key={note.id}>
              <Link
                to="/notes/$noteId"
                params={{ noteId: note.id }}
                className="font-semibold text-(--lagoon-deep)"
              >
                {note.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
