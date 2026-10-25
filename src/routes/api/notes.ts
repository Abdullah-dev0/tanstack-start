import { createFileRoute } from '@tanstack/react-router'
import { isLoggedIn } from '../../utils/auth.server'
import { listNotes } from '../../utils/notes.server'

// 🌐 SERVER ROUTE: a real URL → /api/notes
// No page, no React. It gets a Request and returns a Response.
export const Route = createFileRoute('/api/notes')({
  server: {
    handlers: {
      GET: async () => {
        // 🔐 Protect the data here too — beforeLoad does NOT cover /api/...
        if (!isLoggedIn()) {
          return Response.json({ error: 'Please log in' }, { status: 401 })
        }

        const notes = await listNotes()
        return Response.json(notes)
      },
    },
  },
})
