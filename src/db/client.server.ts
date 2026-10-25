// 🔌 The database connection (server only) — on Cloudflare Workers.
// 📖 https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/postgres-drivers-and-libraries/drizzle-orm/
// Cloudflare's rule: create a NEW client for each request.
// (Hyperdrive keeps the real connection pool, so this is fast.)
import { env } from 'cloudflare:workers'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Client } from 'pg'

export async function getDb() {
  // Local dev → Docker Postgres (localConnectionString in wrangler.jsonc)
  // Production → your online Postgres, through Hyperdrive
  const client = new Client({
    connectionString: env.HYPERDRIVE.connectionString,
  })
  await client.connect()
  return drizzle(client)
}
