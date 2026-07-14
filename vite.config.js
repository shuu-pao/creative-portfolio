import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Serve audio files with a header that revalidates on every request. Vite's
  // default `Cache-Control: no-cache` triggers net::ERR_CACHE_OPERATION_NOT_SUPPORTED
  // in some browsers when an <audio> element fetches the file, which aborts
  // playback (battle SFX silently fail to load). `max-age=0` avoids that broken
  // cache path AND still re-fetches whenever the file on disk changes — important
  // during development when audio files are edited in place. (Do NOT use
  // `immutable`: it would cache the first version forever and hide later edits.)
  server: {
    headers: {
      'Cache-Control': 'public, max-age=0',
    },
  },
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=0',
    },
  },
})
