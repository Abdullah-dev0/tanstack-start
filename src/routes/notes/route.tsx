import { Link, Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/notes')({
  component: NotesLayout,
})

function NotesLayout() {
  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="display-title m-0 text-4xl font-bold text-(--sea-ink)">
            My Notes
          </h1>
          <Link
            to="/notes/new"
            className="rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold text-(--lagoon-deep) no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]"
          >
            New note
          </Link>
        </div>

        <Outlet />
      </section>
    </main>
  )
}
