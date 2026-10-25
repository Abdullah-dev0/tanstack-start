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
  'mx-auto max-w-2xl animate-rise rounded-3xl border border-zinc-900/5 bg-white p-8 shadow-sm shadow-zinc-900/5 sm:p-12 dark:border-white/10 dark:bg-zinc-900/50'
const backLink =
  'text-sm text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'

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
      <h2 className="text-3xl font-semibold tracking-tighter text-balance sm:text-4xl">
        {note.title}
      </h2>
      <p className="mt-6 text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
        {note.body}
      </p>

      {/* 🐢 The slow part: shows "Calculating..." first, then the result */}
      <Await
        promise={statsPromise}
        fallback={
          <p className="mt-6 animate-pulse text-sm text-zinc-400">
            🐢 Calculating stats...
          </p>
        }
      >
        {(stats) => (
          <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
            📊 {stats.words} words · ~{stats.readingSeconds}s to read
          </p>
        )}
      </Await>
      <div className="mt-10 flex items-center justify-between gap-4 border-t border-zinc-900/5 pt-6 dark:border-white/10">
        <Link to="/notes" className={backLink}>
          ← Back to notes
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          className="rounded-full px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 active:scale-95 dark:text-red-400 dark:hover:bg-red-500/10"
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
    <p className="mx-auto max-w-2xl animate-pulse text-zinc-500 dark:text-zinc-400">
      ⏳ Loading note...
    </p>
  )
}

// 🔍 Not found screen
function NoteNotFound() {
  const { noteId } = Route.useParams()
  return (
    <div className={card}>
      <p className="text-lg text-zinc-600 dark:text-zinc-300">
        🔍 Note "{noteId}" does not exist.
      </p>
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
      <p className="text-lg text-red-600 dark:text-red-400">
        💥 {error instanceof Error ? error.message : 'Something went wrong'}
      </p>
      <button
        type="button"
        onClick={() => router.invalidate()} // re-runs the loader = "try again"
        className="mt-6 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 active:scale-95 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Try again
      </button>
    </div>
  )
}
