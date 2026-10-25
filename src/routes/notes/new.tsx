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
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-2xl animate-rise rounded-3xl border border-zinc-900/5 bg-white p-8 shadow-sm shadow-zinc-900/5 transition focus-within:border-zinc-900/10 focus-within:shadow-lg sm:p-12 dark:border-white/10 dark:bg-zinc-900/50 dark:focus-within:border-white/20"
    >
      <h2 className="font-mono text-xs text-zinc-400 dark:text-zinc-500">
        Create a note
      </h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="mt-4 w-full bg-transparent text-3xl font-semibold tracking-tighter outline-none placeholder:text-zinc-300 sm:text-4xl dark:placeholder:text-zinc-700"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write something..."
        rows={4}
        className="mt-6 min-h-40 w-full resize-none bg-transparent text-lg leading-relaxed text-zinc-600 outline-none placeholder:text-zinc-300 dark:text-zinc-300 dark:placeholder:text-zinc-700"
      />

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="mt-8 flex justify-end border-t border-zinc-900/5 pt-6 dark:border-white/10">
        <button
          type="submit"
          className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 active:scale-95 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Save note
        </button>
      </div>
    </form>
  )
}
