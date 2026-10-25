import { createServerFn } from '@tanstack/react-start'
import { authMiddleware } from '../lib/auth.functions'
import { findNote, insertNote, listNotes, removeNote } from './notes.server'
import { NoteId, NoteInput } from './schemas'

// ---------- READ ----------

// Get all notes
export const getNotes = createServerFn()
  .middleware([authMiddleware]) // 🔐 must be logged in
  .handler(async ({ context }) => {
    return listNotes(context.user.id) // 🔒 only MY notes
  })

// Get one note by id
export const getNote = createServerFn()
  .middleware([authMiddleware]) // 🔐 must be logged in
  .validator(NoteId) // 📋 Zod checks the input
  .handler(async ({ data, context }) => {
    return findNote(data.id, context.user.id) // 🔒 only if it's MINE
  })

// ---------- WRITE ----------

// Create a note
export const createNote = createServerFn({ method: 'POST' })
  .middleware([authMiddleware]) // 🔐 must be logged in
  .validator(NoteInput) // 📋 Zod checks the input on the server
  .handler(async ({ data, context }) => {
    return insertNote(context.user.id, data) // 🔒 owned by ME
  })

// Delete a note
export const deleteNote = createServerFn({ method: 'POST' })
  .middleware([authMiddleware]) // 🔐 must be logged in
  .validator(NoteId) // 📋 Zod checks the input
  .handler(async ({ data, context }) => {
    await removeNote(data.id, context.user.id) // 🔒 only if it's MINE
  })

// ---------- STATS ----------

// Note stats: word count + reading time
export const getNoteStats = createServerFn()
  .middleware([authMiddleware]) // 🔐 must be logged in
  .validator(NoteId) // 📋 Zod checks the input
  .handler(async ({ data, context }) => {
    const note = await findNote(data.id, context.user.id)
    const words = note ? note.body.split(/\s+/).filter(Boolean).length : 0
    return { words, readingSeconds: Math.max(1, Math.round(words / 3)) }
  })
