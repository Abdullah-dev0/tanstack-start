import { useState } from 'react'
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { createNote } from '../../utils/notes.functions'

export const Route = createFileRoute('/notes/new')({
  component: NewNote,
})

function NewNote() {
  const createNoteFn = useServerFn(createNote)
  const router = useRouter()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      // 1. Save on the server
      const note = await createNoteFn({ data: { title, body } })
      // 2. Tell the router its loader data is old, so the list reloads
      await router.invalidate({ sync: true })
      // 3. Go to the new note
      await navigate({ to: '/notes/$noteId', params: { noteId: note.id } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h2 className="m-0 text-xl font-semibold text-(--sea-ink)">
        Create a note
      </h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full rounded-xl border border-(--line) bg-transparent px-4 py-2 text-(--sea-ink)"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write something..."
        rows={4}
        className="w-full rounded-xl border border-(--line) bg-transparent px-4 py-2 text-(--sea-ink)"
      />

      {error && <p className="m-0 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        className="rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold text-(--lagoon-deep)"
      >
        Save note
      </button>
    </form>
  )
}
