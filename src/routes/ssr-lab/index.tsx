import { createFileRoute, useHydrated } from '@tanstack/react-router'

export const Route = createFileRoute('/ssr-lab/')({
  component: Page,
})

function Page() {
  // false = still the "photo" from the server 📸
  // true  = the page woke up, buttons work ⚡
  const awake = useHydrated()

  const time = new Date().toLocaleTimeString()

  return (
    <div>
      <h2>Is the page awake?</h2>
      <p>{awake ? '⚡ Yes, awake!' : '📸 No, still a photo'}</p>

      <h2>❌ Bad clock</h2>
      {/* Server and browser show different seconds → hydration error */}
      <p>{time}</p>

      <h2>✅ Good clock</h2>
      {/* Wait until awake → server and browser match at first */}
      <p>{awake ? time : '--:--:--'}</p>
    </div>
  )
}
