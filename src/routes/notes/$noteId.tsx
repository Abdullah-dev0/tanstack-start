import {
  Link,
  createFileRoute,
  useNavigate,
  useRouter,
} from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { deleteNote, getNote } from '../../utils/notes.functions'

export const Route = createFileRoute('/notes/$noteId')({
  loader: ({ params }) => getNote({ data: { id: params.noteId } }),
  component: NoteDetail,
})

function NoteDetail() {
  const note = Route.useLoaderData()
  const deleteNoteFn = useServerFn(deleteNote)
  const router = useRouter()
  const navigate = useNavigate()

  if (!note) {
    return <p className="m-0 text-(--sea-ink-soft)">Note not found.</p>
  }

  async function handleDelete() {
    if (!note) return
    // 1. Delete on the server
    await deleteNoteFn({ data: { id: note.id } })
    // 2. Leave this page FIRST (this note no longer exists)
    await navigate({ to: '/notes' })
    // 3. Then reload the list so the deleted note disappears
    await router.invalidate({ sync: true })
  }

  return (
    <article>
      <h2 className="mb-2 text-xl font-semibold text-(--sea-ink)">
        {note.title}
      </h2>
      <p className="mb-4 text-(--sea-ink-soft)">{note.body}</p>
      <div className="flex items-center gap-4">
        <Link to="/notes" className="text-sm text-(--lagoon-deep)">
          ← Back to notes
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          className="text-sm font-semibold text-red-600"
        >
          Delete
        </button>
      </div>
    </article>
  )
}
