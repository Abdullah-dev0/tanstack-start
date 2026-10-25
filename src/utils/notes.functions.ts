import { createServerFn } from '@tanstack/react-start'
import { authMiddleware } from './auth.functions'
import { readNotes, saveNotes } from './notes.server'

// ---------- READ ----------

// Get all notes
export const getNotes = createServerFn()
  .middleware([authMiddleware]) // 🔐 must be logged in
  .handler(async () => {
    console.log('📂 getNotes running on the SERVER')
    return readNotes()
  })

// Get one note by id
export const getNote = createServerFn()
  .middleware([authMiddleware]) // 🔐 must be logged in
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    console.log(`📂 getNote(${data.id}) running on the SERVER`)

    const notes = await readNotes()
    return notes.find((n) => n.id === data.id) ?? null
  })

// ---------- WRITE ----------

// Create a note
export const createNote = createServerFn({ method: 'POST' })
  .middleware([authMiddleware]) // 🔐 must be logged in
  .validator((data: { title: string; body: string }) => {
    const title = data.title.trim()
    if (!title) throw new Error('Title is required')
    return { title, body: data.body.trim() }
  })
  .handler(async ({ data }) => {
    console.log(`✏️ createNote("${data.title}") running on the SERVER`)
    const notes = await readNotes()
    const note = { id: Date.now().toString(), ...data }
    await saveNotes([...notes, note])
    return note
  })

// Delete a note
export const deleteNote = createServerFn({ method: 'POST' })
  .middleware([authMiddleware]) // 🔐 must be logged in
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    console.log(`🗑️ deleteNote(${data.id}) running on the SERVER`)
    const notes = await readNotes()
    await saveNotes(notes.filter((n) => n.id !== data.id))
  })
