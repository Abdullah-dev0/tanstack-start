import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import {
  Await,
  Link,
  createFileRoute,
  notFound,
  useNavigate,
  useRouter,
} from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { deleteNote, getNoteStats } from '../../utils/notes.functions'
import { noteQuery, notesQuery } from '../../utils/notes.queries'

export const Route = createFileRoute('/notes/$noteId')({
  // 1. LOAD the data
  loader: async ({ params, context }) => {
    // 🐢 SLOW data: start it, but do NOT await → the page won't wait for it
    const statsPromise = getNoteStats({ data: { id: params.noteId } })

    // 📦 FAST data: put the note in Query's cache (key ['notes', id])
    const note = await context.queryClient.query({
      ...noteQuery(params.noteId),
      staleTime: 'static',
    })
    if (!note) throw notFound() // no note? → show notFoundComponent

    return { note, statsPromise }
  },

  // 2. Browser tab title
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.note.title ?? 'Note'} | My Notes` }],
  }),

  // 3. The 4 screens this page can show
  component: NoteDetail, //           ✅ success
  pendingComponent: NoteLoading, //   ⏳ still loading
  notFoundComponent: NoteNotFound, // 🔍 note doesn't exist
  errorComponent: NoteError, //       💥 something crashed
})

const card =
  'mx-auto max-w-2xl animate-rise rounded-xl border border-(--line) bg-(--card) p-8 shadow-sm sm:p-12'
const backLink = 'text-sm text-(--muted) transition hover:text-(--ink)'

// ✅ Success screen
function NoteDetail() {
  const { noteId } = Route.useParams()
  const { statsPromise } = Route.useLoaderData()
  // 📦 Read the note FROM the Query cache
  const { data: note } = useSuspenseQuery(noteQuery(noteId))
  const deleteNoteFn = useServerFn(deleteNote)
  const navigate = useNavigate()

  // 🗑️ DELETE with an OPTIMISTIC update
  // 📖 https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNoteFn({ data: { id } }),
    // Runs BEFORE the server answers → remove the note from the list right away
    onMutate: async (id, context) => {
      await context.client.cancelQueries({ queryKey: notesQuery.queryKey })
      const previousNotes = context.client.getQueryData(notesQuery.queryKey) // 📸 snapshot
      context.client.setQueryData(notesQuery.queryKey, (old) =>
        old?.filter((n) => n.id !== id),
      )
      return { previousNotes }
    },
    // Server failed → put the snapshot back
    onError: (_err, _id, onMutateResult, context) => {
      context.client.setQueryData(
        notesQuery.queryKey,
        onMutateResult?.previousNotes,
      )
    },
    // Success or failure → refetch the notes from the server to be sure
    onSettled: (_data, _error, _id, _onMutateResult, context) =>
      context.client.invalidateQueries({ queryKey: notesQuery.queryKey }),
  })

  if (!note) return null // deleted while on this page

  function handleDelete() {
    if (!note) return
    deleteMutation.mutate(note.id) // starts the optimistic update
    void navigate({ to: '/notes' }) // go back — the note is already gone from the list
  }

  return (
    <article className={card}>
      <h2 className="font-serif text-4xl font-medium tracking-tight text-balance sm:text-5xl">
        {note.title}
      </h2>
      <p className="mt-6 font-serif text-xl leading-relaxed whitespace-pre-line text-(--ink)/85">
        {note.body}
      </p>

      {/* 🐢 The slow part: shows "Calculating..." first, then the result */}
      <Await
        promise={statsPromise}
        fallback={
          <p className="mt-8 animate-pulse text-xs text-(--faint)">
            🐢 Calculating stats...
          </p>
        }
      >
        {(stats) => (
          <p className="mt-8 text-xs text-(--faint)">
            📊 {stats.words} words · ~{stats.readingSeconds}s to read
          </p>
        )}
      </Await>
      <div className="mt-10 flex items-center justify-between gap-4 border-t border-(--line) pt-6">
        <Link to="/notes" className={backLink}>
          ← Back to notes
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          className="rounded-lg px-3 py-2 text-sm font-medium text-(--accent) transition hover:bg-(--accent-soft) active:scale-95"
        >
          Delete
        </button>
      </div>
    </article>
  )
}

// ⏳ Loading screen
function NoteLoading() {
  return (
    <p className="mx-auto max-w-2xl animate-pulse text-(--muted)">
      ⏳ Loading note...
    </p>
  )
}

// 🔍 Not found screen
function NoteNotFound() {
  const { noteId } = Route.useParams()
  return (
    <div className={card}>
      <p className="font-serif text-xl">🔍 Note "{noteId}" does not exist.</p>
      <Link to="/notes" className={`${backLink} mt-6 inline-block`}>
        ← Back to notes
      </Link>
    </div>
  )
}

// 💥 Error screen
function NoteError({ error }: { error: unknown }) {
  const router = useRouter()
  return (
    <div className={card}>
      <p className="font-serif text-xl text-(--accent)">
        💥 {error instanceof Error ? error.message : 'Something went wrong'}
      </p>
      <button
        type="button"
        onClick={() => router.invalidate()} // re-runs the loader = "try again"
        className="mt-6 rounded-lg bg-(--accent) px-4 py-2 text-sm font-medium text-(--accent-ink) transition hover:opacity-90 active:scale-95"
      >
        Try again
      </button>
    </div>
  )
}
