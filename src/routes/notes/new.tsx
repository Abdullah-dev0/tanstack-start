import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/notes/new')({
  component: NewNote,
})

function NewNote() {
  return (
    <h2 className="m-0 text-xl font-semibold text-(--sea-ink)">
      Create a note
    </h2>
  )
}
