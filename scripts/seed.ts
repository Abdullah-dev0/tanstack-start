// 🌱 SEED: copy the old notes from data/notes.json into the database (run once).
// Run with:  npm run db:seed
import { readFile } from 'node:fs/promises'
import { drizzle } from 'drizzle-orm/node-postgres'
import { notes } from '../src/db/schema.ts'

const db = drizzle(process.env.DATABASE_URL!)

const old = JSON.parse(await readFile('data/notes.json', 'utf-8')) as Array<{
  id: string
  title: string
  body: string
}>

const rows = old.map((n) => ({
  id: n.id,
  title: n.title,
  body: n.body,
  // old ids were timestamps (Date.now()) → use them as the creation time
  createdAt: /^\d+$/.test(n.id) ? new Date(Number(n.id)) : new Date(),
}))

await db.insert(notes).values(rows).onConflictDoNothing() // safe to run twice
console.log(`🌱 Seeded ${rows.length} notes`)
process.exit(0)
