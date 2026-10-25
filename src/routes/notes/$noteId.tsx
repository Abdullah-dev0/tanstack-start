import {
  Await,
  Link,
  createFileRoute,
  notFound,
  useNavigate,
  useRouter,
} from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { deleteNote, getNote, getNoteStats } from '../../utils/notes.functions'

export const Route = createFileRoute('/notes/$noteId')({
  // 1. LOAD the data
  loader: async ({ params }) => {
    // 🐢 SLOW data: start it, but do NOT await → the page won't wait for it
    const statsPromise = getNoteStats({ data: { id: params.noteId } })

    // ⚡ FAST data: await it → the page shows as soon as this is ready
    const note = await getNote({ data: { id: params.noteId } })
    if (!note) throw notFound() // no note? → show notFoundComponent

    return { note, statsPromise }
  },

  // ⚡ CACHE: for 30 seconds, re-opening this note uses the saved data
  staleTime: 30_000,

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
  const { note, statsPromise } = Route.useLoaderData()
  const deleteNoteFn = useServerFn(deleteNote)
  const router = useRouter()
  const navigate = useNavigate()

  async function handleDelete() {
    // 1. Delete on the server
    await deleteNoteFn({ data: { id: note.id } })
    // 2. Leave this page FIRST (this note no longer exists)
    await navigate({ to: '/notes' })
    // 3. Then reload the list so the deleted note disappears
    await router.invalidate({ sync: true })
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
