// ".server.ts" = server only. The ONE place that talks to the notes table.
// Both the server functions (pages) and the API route use it.
import { desc, eq } from 'drizzle-orm'
import { db } from '../db/client.server'
import { notes } from '../db/schema'

// SELECT * FROM notes ORDER BY created_at DESC
export async function listNotes() {
  return db.select().from(notes).orderBy(desc(notes.createdAt))
}

// SELECT * FROM notes WHERE id = ?
export async function findNote(id: string) {
  const rows = await db.select().from(notes).where(eq(notes.id, id))
  return rows.at(0) ?? null // .at(0) = first row, or undefined if none found
}

// INSERT INTO notes (title, body) VALUES (?, ?)
export async function insertNote(input: { title: string; body: string }) {
  const [note] = await db.insert(notes).values(input).returning()
  return note
}

// DELETE FROM notes WHERE id = ?
export async function removeNote(id: string) {
  await db.delete(notes).where(eq(notes.id, id))
}
