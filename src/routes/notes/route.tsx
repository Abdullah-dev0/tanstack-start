import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { getAuthStatus, logout } from '../../utils/auth.functions'

export const Route = createFileRoute('/notes')({
  // 🔒 PRIVATE pages (logged-in data) → nobody may keep a copy
  // 📖 https://tanstack.com/start/latest/docs/framework/react/guide/server-functions
  headers: () => ({ 'Cache-Control': 'no-store' }),

  // 🚪 PAGE GUARD: runs before ANY /notes page loads.
  // Not logged in? → send to /login.
  // (This is for a nice UX. The real security is authMiddleware.)
  beforeLoad: async () => {
    const { loggedIn } = await getAuthStatus()
    if (!loggedIn) throw redirect({ to: '/login' })
  },
  component: NotesLayout,
})

function NotesLayout() {
  const logoutFn = useServerFn(logout)
  const navigate = useNavigate()

  async function handleLogout() {
    await logoutFn()
    await navigate({ to: '/login' })
  }

  return (
    <main className="mx-auto max-w-5xl px-6 pt-16 sm:pt-20">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-4xl font-semibold tracking-tighter sm:text-5xl">
          My Notes
        </h1>
        <div className="flex items-center gap-2">
          <Link
            to="/notes/new"
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 active:scale-95 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            New note
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full px-4 py-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            Log out
          </button>
        </div>
      </div>

      <Outlet />
    </main>
  )
}
