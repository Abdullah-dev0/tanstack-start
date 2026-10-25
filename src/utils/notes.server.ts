// ".server.ts" = server only. The ONE place that talks to the notes table.
// 🔒 Every query is limited to ONE user — you can never see someone else's note.
// 📖 Docs pattern: db.orders.findMany({ where: { userId: context.session.userId } })
import { and, count, desc, eq } from 'drizzle-orm'
import { db } from '../db/client.server'
import { notes } from '../db/schema'

// SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC
export async function listNotes(userId: string) {
  return db
    .select()
    .from(notes)
    .where(eq(notes.userId, userId))
    .orderBy(desc(notes.createdAt))
}

// SELECT * FROM notes WHERE id = ? AND user_id = ?
export async function findNote(id: string, userId: string) {
  const rows = await db
    .select()
    .from(notes)
    .where(and(eq(notes.id, id), eq(notes.userId, userId)))
  return rows.at(0) ?? null
}

// INSERT INTO notes (title, body, user_id) VALUES (?, ?, ?)
export async function insertNote(
  userId: string,
  input: { title: string; body: string },
) {
  const [note] = await db
    .insert(notes)
    .values({ ...input, userId })
    .returning()
  return note
}

// DELETE FROM notes WHERE id = ? AND user_id = ?
export async function removeNote(id: string, userId: string) {
  await db.delete(notes).where(and(eq(notes.id, id), eq(notes.userId, userId)))
}

// SELECT COUNT(*) FROM notes — a public number, no private data
export async function countAllNotes() {
  const [row] = await db.select({ total: count() }).from(notes)
  return row.total
}
