'use client'

import { useTheme } from './ThemeProvider'

const options = [
  { value: 'light' as const, label: 'Light', desc: 'Always light' },
  { value: 'dark' as const, label: 'Dark', desc: 'Always dark' },
  { value: 'system' as const, label: 'System', desc: 'Follow system' },
]

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="grid gap-1.5 sm:grid-cols-3">
      {options.map((opt) => {
        const selected = theme === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => setTheme(opt.value)}
            className={`rounded-md border px-3.5 py-2.5 text-left text-sm transition-colors ${
              selected
                ? 'border-stone-900 bg-stone-100 font-medium text-stone-900 dark:border-stone-200 dark:bg-stone-800 dark:text-stone-200'
                : 'border-stone-200 bg-white text-stone-500 hover:border-stone-300 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400 dark:hover:border-stone-600 dark:hover:bg-stone-800'
            }`}
          >
            {opt.label}
            <p className="mt-0.5 text-[11px] font-normal text-stone-400 dark:text-stone-500">{opt.desc}</p>
          </button>
        )
      })}
    </div>
  )
}
