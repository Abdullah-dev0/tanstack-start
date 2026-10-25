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
  'w-full rounded-xl border border-zinc-900/10 bg-transparent px-4 py-2 dark:border-white/10'

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
    <main className="mx-auto max-w-md px-6 pt-16 sm:pt-20">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-3xl border border-zinc-900/5 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-zinc-900/50"
      >
        <h1 className="text-3xl font-semibold tracking-tighter">
          Create account
        </h1>

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

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 active:scale-95 dark:bg-white dark:text-zinc-900"
        >
          Create account
        </button>

        <p className="text-sm text-zinc-500">
          Have an account?{' '}
          <Link to="/login" className="underline">
            Log in
          </Link>
        </p>
      </form>
    </main>
  )
}
