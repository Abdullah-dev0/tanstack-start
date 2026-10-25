// ❤️ HEALTH CHECK: /health — "is the app alive, and can it reach the database?"
// Hosting platforms and uptime monitors call this URL.
// 📖 https://tanstack.com/start/latest/docs/framework/react/guide/observability
import { createFileRoute } from '@tanstack/react-router'
import { sql } from 'drizzle-orm'
import { getDb } from '../db/client.server'

export const Route = createFileRoute('/health')({
  server: {
    handlers: {
      GET: async () => {
        const database = await checkDatabase()
        const healthy = database.status === 'connected'

        return Response.json(
          {
            status: healthy ? 'healthy' : 'unhealthy',
            timestamp: new Date().toISOString(),
            database,
          },
          {
            status: healthy ? 200 : 503, // 503 = "service unavailable"
            headers: { 'Cache-Control': 'no-store' }, // always fresh
          },
        )
      },
    },
  },
})

async function checkDatabase() {
  try {
    const db = await getDb()
    await db.execute(sql`SELECT 1`)
    return { status: 'connected' }
  } catch {
    // ⚠️ Docs: don't leak details — log them on the server, not in the response
    console.error('[HEALTH] database check failed')
    return { status: 'error' }
  }
}
