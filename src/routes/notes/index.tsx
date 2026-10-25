import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/notes/')({
  component: NotesIndex,
})

function NotesIndex() {
  return <p className="m-0 text-[var(--sea-ink-soft)]">No notes yet.</p>
}
