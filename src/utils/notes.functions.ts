import { createServerFn } from '@tanstack/react-start'
import { authMiddleware } from './auth.functions'
import { findNote, insertNote, listNotes, removeNote } from './notes.server'
import { NoteId, NoteInput } from './schemas'

// ---------- READ ----------

// Get all notes
export const getNotes = createServerFn()
  .middleware([authMiddleware]) // 🔐 must be logged in
  .handler(async () => {
    console.log('📂 getNotes running on the SERVER')
    return listNotes() // 🐘 from the database
  })

// Get one note by id
export const getNote = createServerFn()
  .middleware([authMiddleware]) // 🔐 must be logged in
  .validator(NoteId) // 📋 Zod checks the input
  .handler(async ({ data }) => {
    console.log(`📂 getNote(${data.id}) running on the SERVER`)
    return findNote(data.id) // 🐘 from the database
  })

// ---------- WRITE ----------

// Create a note
export const createNote = createServerFn({ method: 'POST' })
  .middleware([authMiddleware]) // 🔐 must be logged in
  .validator(NoteInput) // 📋 Zod checks the input on the server
  .handler(async ({ data }) => {
    console.log(`✏️ createNote("${data.title}") running on the SERVER`)
    return insertNote(data) // 🐘 the database makes the id
  })

// Delete a note
export const deleteNote = createServerFn({ method: 'POST' })
  .middleware([authMiddleware]) // 🔐 must be logged in
  .validator(NoteId) // 📋 Zod checks the input
  .handler(async ({ data }) => {
    console.log(`🗑️ deleteNote(${data.id}) running on the SERVER`)
    await removeNote(data.id) // 🐘 delete from the database
  })

// ---------- SLOW (Lesson 9) ----------

// Note stats — pretend this calls a SLOW outside service (AI, analytics...)
export const getNoteStats = createServerFn()
  .middleware([authMiddleware]) // 🔐 must be logged in
  .validator(NoteId) // 📋 Zod checks the input
  .handler(async ({ data }) => {
    console.log(`🐢 getNoteStats(${data.id}) started — takes 2 seconds`)
    await new Promise((resolve) => setTimeout(resolve, 2000)) // 🐢 the slow part

    const note = await findNote(data.id)
    const words = note ? note.body.split(/\s+/).filter(Boolean).length : 0
    return { words, readingSeconds: Math.max(1, Math.round(words / 3)) }
  })
