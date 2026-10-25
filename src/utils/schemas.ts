// 📋 Rules for our data, written ONCE with Zod.
// Safe for both browser and server (no secrets here).
import { z } from 'zod'

export const NoteInput = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(100, 'Title is too long'),
  body: z.string().trim().max(5000, 'Note is too long'),
})

export const NoteId = z.object({
  id: z.string().min(1),
})

export const LoginInput = z.object({
  password: z.string().min(1, 'Password is required'),
})
