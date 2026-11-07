// 🎓 Server function for the streaming demo page.
import { createServerFn } from '@tanstack/react-start'

// 🧑‍🍳 THE WAITER: runs on the server, brings posts back.
// ⚠️ Demo only (not from the docs): fake posts + a 2s pause to act like a slow database,
//    so you can SEE the streaming happen.
let calls = 0 // ⚠️ Demo only: counts orders, so every 2nd one can fail

export const getPosts = createServerFn().handler(async () => {
  calls++
  await new Promise((resolve) => setTimeout(resolve, 2000))
  // ⚠️ Demo only: every 2nd order fails → lets you SEE a failed refresh
  if (calls % 2 === 0) throw new Error('The kitchen is closed right now')
  return {
    fetchedAt: new Date().toLocaleTimeString(), // when the server finished cooking
    posts: [
      { id: 1, title: 'Learning TanStack Start' },
      { id: 2, title: 'Server functions are just functions' },
      { id: 3, title: 'Streaming feels like magic' },
    ],
  }
})
