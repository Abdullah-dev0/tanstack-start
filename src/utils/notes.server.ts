// ".server.ts" = server only. This is the ONE place that touches notes.json.
// Both the server functions (for our pages) and the API route use it.
import { readFile, writeFile } from 'node:fs/promises'

export type Note = { id: string; title: string; body: string }

const FILE = 'data/notes.json'

export async function readNotes() {
  const text = await readFile(FILE, 'utf-8')
  return JSON.parse(text) as Array<Note>
}

export async function saveNotes(notes: Array<Note>) {
  await writeFile(FILE, JSON.stringify(notes, null, 2))
}
