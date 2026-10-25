import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import { getSession } from '../../lib/auth.functions'
import { authClient } from '../../lib/auth-client'

export const Route = createFileRoute('/notes')({
  // 🔒 PRIVATE pages (logged-in data) → nobody may keep a copy
  // 📖 https://tanstack.com/start/latest/docs/framework/react/guide/server-functions
  headers: () => ({ 'Cache-Control': 'no-store' }),

  // 🚪 PAGE GUARD: runs before ANY /notes page loads.
  // Not logged in? → send to /login.
  // (This is for a nice UX. The real security is authMiddleware.)
  beforeLoad: async () => {
    const session = await getSession()
    if (!session) throw redirect({ to: '/login' })
    return { user: session.user } // 👤 child pages can read it with Route.useRouteContext()
  },
  component: NotesLayout,
})

function NotesLayout() {
  const { user } = Route.useRouteContext()
  const navigate = useNavigate()

  async function handleLogout() {
    await authClient.signOut() // 📖 Better Auth: ends the session
    await navigate({ to: '/login' })
  }

  return (
    <main className="mx-auto max-w-5xl px-6 pt-12 sm:pt-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-(--line) pb-6">
        <div>
          <h1 className="font-serif text-4xl font-medium tracking-tight">
            My Notes
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-(--muted)">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            {user.email}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg px-3 py-2 text-sm font-medium text-(--muted) transition hover:bg-(--sunken) hover:text-(--ink)"
          >
            Log out
          </button>
          <Link
            to="/notes/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-(--accent) px-4 py-2 text-sm font-medium text-(--accent-ink) shadow-sm transition hover:opacity-90 active:scale-95"
          >
            <span className="text-base leading-none">+</span> New note
          </Link>
        </div>
      </div>

      <Outlet />
    </main>
  )
}
