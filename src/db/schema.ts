// 📐 SCHEMA: what our tables look like.
// Think of a table like an Excel sheet: columns + rows.
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const notes = pgTable('notes', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()), // a new random id for each note
  title: text('title').notNull(),
  body: text('body').notNull().default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// The TypeScript type of one row — Drizzle makes it from the table above
export type Note = typeof notes.$inferSelect
