import { Link, createFileRoute } from '@tanstack/react-router'
import { getNote } from '../../utils/notes.functions'

export const Route = createFileRoute('/notes/$noteId')({
  loader: ({ params }) => getNote({ data: { id: params.noteId } }),
  component: NoteDetail,
})

function NoteDetail() {
  const note = Route.useLoaderData()

  if (!note) {
    return <p className="m-0 text-(--sea-ink-soft)">Note not found.</p>
  }

  return (
    <article>
      <h2 className="mb-2 text-xl font-semibold text-(--sea-ink)">
        {note.title}
      </h2>
      <p className="mb-4 text-(--sea-ink-soft)">{note.body}</p>
      <Link to="/notes" className="text-sm text-(--lagoon-deep)">
        ← Back to notes
      </Link>
    </article>
  )
}
