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
  email: z.email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

export const RegisterInput = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
