'use client'

import { useTheme } from './ThemeProvider'

const options = [
  { value: 'light' as const, label: '☀️ Light', desc: 'Always light mode' },
  { value: 'dark' as const, label: '🌙 Dark', desc: 'Always dark mode' },
  { value: 'system' as const, label: '💻 System', desc: 'Follow your system setting' },
]

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {options.map((opt) => {
        const selected = theme === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => setTheme(opt.value)}
            className={`rounded-xl border p-3.5 text-left transition-all ${
              selected
                ? 'border-emerald-400 bg-emerald-50 shadow-sm dark:border-emerald-600 dark:bg-emerald-950/30'
                : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-black dark:hover:border-zinc-600'
            }`}
          >
            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{opt.label}</p>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{opt.desc}</p>
          </button>
        )
      })}
    </div>
  )
}
