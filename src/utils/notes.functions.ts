import { createServerFn } from '@tanstack/react-start'
import { readFile } from 'node:fs/promises'

type Note = { id: string; title: string; body: string }

async function readNotes() {
  const text = await readFile('data/notes.json', 'utf-8')
  return JSON.parse(text) as Array<Note>
}

// Get all notes
export const getNotes = createServerFn().handler(async () => {
  console.log('📂 getNotes running on the SERVER')
  return readNotes()
})

// Get one note by id
export const getNote = createServerFn()
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    console.log(`📂 getNote(${data.id}) running on the SERVER`)
    const notes = await readNotes()
    return notes.find((n) => n.id === data.id) ?? null
  })
