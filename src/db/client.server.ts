// app/db/index.ts
import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import { serverEnv } from '../utils/env.server'

const pool = new pg.Pool({
  connectionString: serverEnv().DATABASE_URL, // 📋 checked by Zod
})

export const db = drizzle(pool)
