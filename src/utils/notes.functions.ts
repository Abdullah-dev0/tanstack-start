import { createServerFn } from '@tanstack/react-start'
import { authMiddleware } from '../lib/auth.functions'
import { findNote, insertNote, listNotes, removeNote } from './notes.server'
import { NoteId, NoteInput } from './schemas'

// ---------- READ ----------

// Get all notes
export const getNotes = createServerFn()
  .middleware([authMiddleware]) // 🔐 must be logged in
  .handler(async ({ context }) => {
    console.log('📂 getNotes running on the SERVER')
    return listNotes(context.user.id) // 🔒 only MY notes
  })

// Get one note by id
export const getNote = createServerFn()
  .middleware([authMiddleware]) // 🔐 must be logged in
  .validator(NoteId) // 📋 Zod checks the input
  .handler(async ({ data, context }) => {
    console.log(`📂 getNote(${data.id}) running on the SERVER`)
    return findNote(data.id, context.user.id) // 🔒 only if it's MINE
  })

// ---------- WRITE ----------

// Create a note
export const createNote = createServerFn({ method: 'POST' })
  .middleware([authMiddleware]) // 🔐 must be logged in
  .validator(NoteInput) // 📋 Zod checks the input on the server
  .handler(async ({ data, context }) => {
    console.log(`✏️ createNote("${data.title}") running on the SERVER`)
    return insertNote(context.user.id, data) // 🔒 owned by ME
  })

// Delete a note
export const deleteNote = createServerFn({ method: 'POST' })
  .middleware([authMiddleware]) // 🔐 must be logged in
  .validator(NoteId) // 📋 Zod checks the input
  .handler(async ({ data, context }) => {
    console.log(`🗑️ deleteNote(${data.id}) running on the SERVER`)
    await removeNote(data.id, context.user.id) // 🔒 only if it's MINE
  })

// ---------- SLOW (Lesson 9) ----------

// Note stats — pretend this calls a SLOW outside service (AI, analytics...)
export const getNoteStats = createServerFn()
  .middleware([authMiddleware]) // 🔐 must be logged in
  .validator(NoteId) // 📋 Zod checks the input
  .handler(async ({ data, context }) => {
    console.log(`🐢 getNoteStats(${data.id}) started — takes 2 seconds`)
    await new Promise((resolve) => setTimeout(resolve, 2000)) // 🐢 the slow part

    const note = await findNote(data.id, context.user.id)
    const words = note ? note.body.split(/\s+/).filter(Boolean).length : 0
    return { words, readingSeconds: Math.max(1, Math.round(words / 3)) }
  })
