// 🎓 Server function for the streaming demo page.
import { createServerFn } from '@tanstack/react-start'

// 🧑‍🍳 THE WAITER: runs on the server, brings posts back.
// ⚠️ Demo only (not from the docs): fake posts + a 2s pause to act like a slow database,
//    so you can SEE the streaming happen.
export const getPosts = createServerFn().handler(async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  return {
    fetchedAt: new Date().toLocaleTimeString(), // when the server finished cooking
    posts: [
      { id: 1, title: 'Learning TanStack Start' },
      { id: 2, title: 'Server functions are just functions' },
      { id: 3, title: 'Streaming feels like magic' },
    ],
  }
})
