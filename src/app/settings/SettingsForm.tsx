'use client'

import { useRef } from 'react'
import { saveNotionConfig } from '@/actions/learn'

interface SettingsFormProps {
  config: {
    dbEnglish: string | null
    dbPlans: string | null
    enabled: boolean
    hasToken: boolean
  } | null
}

export default function SettingsForm({ config }: SettingsFormProps) {
  const formRef = useRef<HTMLFormElement>(null)

  const handleAction = async (formData: FormData) => {
    await saveNotionConfig(formData)
    formRef.current?.reset()
    window.location.reload()
  }

  return (
    <form ref={formRef} action={handleAction} className="mt-6 space-y-4">
      <div>
        <label htmlFor="token" className="block text-sm font-medium text-stone-700 dark:text-stone-300">
          Integration Token
        </label>
        <input
          id="token"
          name="token"
          type="password"
          placeholder={config?.hasToken ? '••••••••••••••••' : 'ntn_xxxxxxxxxxxx'}
          className="mt-1 w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-[var(--academic-navy)] dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
        />
        {config?.hasToken && (
          <p className="mt-1 text-xs text-[var(--academic-navy)] dark:text-[var(--academic-navy)]">
            Token configured. Leave blank to keep the current token.
          </p>
        )}
      </div>

      {config?.hasToken && (
        <label className="flex items-center gap-2">
          <input
            name="clearToken"
            type="checkbox"
            className="h-4 w-4 rounded border-stone-300 text-[var(--academic-red)] focus:ring-[var(--academic-red)]"
          />
          <span className="text-sm text-[var(--academic-red)] dark:text-[var(--academic-red)]">Clear saved token</span>
        </label>
      )}

      <div>
        <label htmlFor="dbEnglish" className="block text-sm font-medium text-stone-700 dark:text-stone-300">
          English Learning Database ID
        </label>
        <input
          id="dbEnglish"
          name="dbEnglish"
          type="text"
          defaultValue={config?.dbEnglish ?? ''}
          placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          className="mt-1 w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-[var(--academic-navy)] dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
        />
      </div>

      <div>
        <label htmlFor="dbPlans" className="block text-sm font-medium text-stone-700 dark:text-stone-300">
          Daily Plans Database ID
        </label>
        <input
          id="dbPlans"
          name="dbPlans"
          type="text"
          defaultValue={config?.dbPlans ?? ''}
          placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          className="mt-1 w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-[var(--academic-navy)] dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
        />
      </div>

      <label className="flex items-center gap-2">
        <input
          name="enabled"
          type="checkbox"
          defaultChecked={config?.enabled ?? false}
          className="h-4 w-4 rounded border-stone-300 text-[var(--academic-navy)] focus:ring-[var(--academic-navy)]"
        />
        <span className="text-sm text-stone-700 dark:text-stone-300">Enable Notion push</span>
      </label>

      <button
        type="submit"
        className="rounded-2xl bg-[var(--academic-navy)] px-5 py-2 text-sm font-medium text-white transition-colors hover:brightness-110"
      >
        Save Settings
      </button>
    </form>
  )
}
