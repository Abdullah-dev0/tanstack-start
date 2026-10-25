import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { createNote } from '../../utils/notes.functions'
import { notesQuery } from '../../utils/notes.queries'
import { NoteInput } from '../../utils/schemas'

export const Route = createFileRoute('/notes/new')({
  component: NewNote,
})

function NewNote() {
  const createNoteFn = useServerFn(createNote)
  const navigate = useNavigate()

  // ✏️ CREATE with useMutation → isPending + error for free
  // 📖 https://tanstack.com/query/latest/docs/framework/react/guides/mutations
  const createMutation = useMutation({
    mutationFn: (input: { title: string; body: string }) =>
      createNoteFn({ data: input }),
    // Saved → mark the notes list as old, so it refetches (only 'notes', not everything)
    onSuccess: (_note, _input, _onMutateResult, context) =>
      context.client.invalidateQueries({ queryKey: notesQuery.queryKey }),
  })

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

    setError('')
    try {
      // 1. Save on the server (the server checks AGAIN — never trust the browser)
      const note = await createMutation.mutateAsync({ title, body })
      // 2. Go to the new note
      await navigate({ to: '/notes/$noteId', params: { noteId: note.id } })
    } catch {
      // the message is in createMutation.error (shown below)
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

      {(error || createMutation.error) && (
        <p className="mt-4 rounded-lg bg-(--accent-soft) px-4 py-2.5 text-sm text-(--accent)">
          {error || createMutation.error?.message}
        </p>
      )}

      <div className="mt-8 flex justify-end border-t border-(--line) pt-6">
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="rounded-lg bg-(--accent) px-5 py-2.5 text-sm font-medium text-(--accent-ink) transition hover:opacity-90 active:scale-95 disabled:opacity-50"
        >
          {createMutation.isPending ? 'Saving…' : 'Save note'}
        </button>
      </div>
    </form>
  )
}
