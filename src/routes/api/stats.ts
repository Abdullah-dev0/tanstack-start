import { createFileRoute } from '@tanstack/react-router'
import { countAllNotes } from '../../utils/notes.server'

// 🌍 PUBLIC endpoint: /api/stats — the same answer for EVERYONE (no login)
export const Route = createFileRoute('/api/stats')({
  server: {
    handlers: {
      GET: async () => {
        const totalNotes = await countAllNotes()
        return Response.json(
          { totalNotes, time: new Date().toLocaleTimeString() },
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
