import { useState } from 'react'
import {
  Link,
  createFileRoute,
  useNavigate,
  useRouter,
} from '@tanstack/react-router'
import { authClient } from '../lib/auth-client'
import { RegisterInput } from '../utils/schemas'

export const Route = createFileRoute('/register')({
  head: () => ({ meta: [{ title: 'Create account | My Notes' }] }),
  component: RegisterPage,
})

const input =
  'w-full rounded-lg border border-(--line) bg-(--paper) px-3.5 py-2.5 text-sm outline-none transition placeholder:text-(--faint) focus:border-(--accent) focus:ring-4 focus:ring-(--accent-soft)'

function RegisterPage() {
  const router = useRouter()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Instant check in the browser (same Zod rules as the server)
    const check = RegisterInput.safeParse({ name, email, password })
    if (!check.success) {
      setError(check.error.issues[0].message)
      return
    }

    // 📖 Better Auth: sign up → creates the user, hashes the password, logs in
    const result = await authClient.signUp.email({ name, email, password })
    if (result.error) {
      setError(result.error.message ?? 'Something went wrong')
      return
    }
    await router.invalidate()
    await navigate({ to: '/notes' })
  }

  return (
    <main className="mx-auto max-w-sm px-6 pt-16 sm:pt-24">
      <form
        onSubmit={handleSubmit}
        className="animate-rise space-y-3 rounded-xl border border-(--line) bg-(--card) p-8 shadow-sm"
      >
        <div className="mb-6 text-center">
          <span className="mx-auto flex size-9 items-center justify-center rounded-lg bg-(--accent) text-sm font-bold text-(--accent-ink)">
            N
          </span>
          <h1 className="mt-4 font-serif text-3xl font-medium tracking-tight">
            Create account
          </h1>
          <p className="mt-1 text-sm text-(--muted)">
            Start writing in under a minute.
          </p>
        </div>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className={input}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className={input}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (8+ characters)"
          className={input}
        />

        {error && (
          <p className="rounded-lg bg-(--accent-soft) px-3.5 py-2.5 text-sm text-(--accent)">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-(--accent) px-4 py-2.5 text-sm font-medium text-(--accent-ink) transition hover:opacity-90 active:scale-[0.98]"
        >
          Create account
        </button>

        <p className="pt-2 text-center text-sm text-(--muted)">
          Have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-(--accent) hover:underline"
          >
            Log in
          </Link>
        </p>
      </form>
    </main>
  )
}
