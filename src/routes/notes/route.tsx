// 🔒 Layout for every /notes page: login check and the title bar.
import { Link, Outlet, createFileRoute, redirect } from '@tanstack/react-router'

// 🚪 Route settings: no-cache header + login guard
export const Route = createFileRoute('/notes')({
  // 🔒 PRIVATE pages (logged-in data) → nobody may keep a copy
  // 📖 https://tanstack.com/start/latest/docs/framework/react/guide/server-functions
  headers: () => ({ 'Cache-Control': 'no-store' }),

  // 🚪 PAGE GUARD: runs before ANY /notes page loads.
  // The user was already loaded by __root.tsx → just read it from context
  // (no second getSession() call). Not logged in? → send to /login.
  // (This is for a nice UX. The real security is authMiddleware.)
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: '/login' })
    return { user: context.user } // 👤 now typed as "definitely logged in" for child pages
  },
  component: NotesLayout,
})

// 🖼️ Title bar (email, new note) + the child page in <Outlet />
// (Log out lives in the navbar now — see Header.tsx)
function NotesLayout() {
  const { user } = Route.useRouteContext()

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
        <Link
          to="/notes/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-(--accent) px-4 py-2 text-sm font-medium text-(--accent-ink) shadow-sm transition hover:opacity-90 active:scale-95"
        >
          <span className="text-base leading-none">+</span> New note
        </Link>
      </div>

      <Outlet />
    </main>
  )
}
