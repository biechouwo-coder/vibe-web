/**
 * Inline script injected into <head> to prevent flash of wrong theme.
 * Must be a separate RSC-compatible file (no 'use client', returns JSX directly).
 */
const STORAGE_KEY = 'vibe-theme'

export function ThemeScript() {
  const fn = `(function(){var t;try{t=localStorage.getItem('${STORAGE_KEY}')}catch(e){}var r=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme:dark)').matches)?'dark':'light';var d=r==='dark';document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light'})()`
  return <script dangerouslySetInnerHTML={{ __html: fn }} />
}
