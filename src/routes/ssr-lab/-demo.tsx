// "-" in the name = NOT a page. Just shared code for the SSR Lab.

// Who is cooking? If there is no "window", we are on the server.
export function whoCooked() {
  return typeof window === 'undefined' ? 'SERVER 🖥️' : 'BROWSER 🌐'
}
