import { useState } from 'react'
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { createNote } from '../../utils/notes.functions'
import { NoteInput } from '../../utils/schemas'

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

    // 0. Check in the BROWSER first (instant message, no server trip).
    //    Same rules as the server — written once in schemas.ts
    const check = NoteInput.safeParse({ title, body })
    if (!check.success) {
      setError(check.error.issues[0].message)
      return
    }

    try {
      // 1. Save on the server (the server checks AGAIN — never trust the browser)
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
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-2xl animate-rise rounded-xl border border-(--line) bg-(--card) p-8 shadow-sm transition focus-within:shadow-lg focus-within:shadow-black/5 sm:p-12"
    >
      <h2 className="font-mono text-xs text-(--accent)">Create a note</h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="mt-4 w-full bg-transparent font-serif text-4xl font-medium tracking-tight outline-none placeholder:text-(--faint) sm:text-5xl"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write something..."
        rows={4}
        className="mt-6 min-h-48 w-full resize-none bg-transparent font-serif text-xl leading-relaxed outline-none placeholder:text-(--faint)"
      />

      {error && (
        <p className="mt-4 rounded-lg bg-(--accent-soft) px-4 py-2.5 text-sm text-(--accent)">
          {error}
        </p>
      )}

      <div className="mt-8 flex justify-end border-t border-(--line) pt-6">
        <button
          type="submit"
          className="rounded-lg bg-(--accent) px-5 py-2.5 text-sm font-medium text-(--accent-ink) transition hover:opacity-90 active:scale-95"
        >
          Save note
        </button>
      </div>
    </form>
  )
}
