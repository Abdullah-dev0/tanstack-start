// 🔌 The database connection (server only) — for a normal Node server / VPS.
// One shared POOL of connections, reused by all requests.
// 📖 https://www.better-auth.com/docs/installation (drizzle instance passed to Better Auth)
import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import { serverEnv } from '../utils/env.server'

const pool = new pg.Pool({
  connectionString: serverEnv().DATABASE_URL, // 📋 checked by Zod
})

export const db = drizzle(pool)
