import { createFileRoute } from '@tanstack/react-router'
import { listNotes } from '../../utils/notes.server'

// 🌍 PUBLIC endpoint: /api/stats — the same answer for EVERYONE (no login)
export const Route = createFileRoute('/api/stats')({
  server: {
    handlers: {
      GET: async () => {
        const notes = await listNotes()
        return Response.json(
          { totalNotes: notes.length, time: new Date().toLocaleTimeString() },
          {
            headers: {
              // 🌍 PUBLIC + same for everyone → browsers & CDNs may keep it
              // 📖 https://tanstack.com/start/latest/docs/framework/react/guide/isr
              'Cache-Control':
                'public, max-age=300, stale-while-revalidate=600',
            },
          },
        )
      },
    },
  },
})
