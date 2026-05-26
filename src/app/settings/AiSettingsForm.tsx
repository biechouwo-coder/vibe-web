'use client'

import { useRef } from 'react'
import { saveAiConfig } from '@/actions/learn'

interface AiSettingsFormProps {
  config: {
    apiKey: string | null
    enabled: boolean
    hasEnvKey?: boolean
  } | null
}

export default function AiSettingsForm({ config }: AiSettingsFormProps) {
  const formRef = useRef<HTMLFormElement>(null)

  const handleAction = async (formData: FormData) => {
    await saveAiConfig(formData)
    formRef.current?.reset()
    window.location.reload()
  }

  if (config?.hasEnvKey) {
    return (
      <div className="mt-4 rounded-[var(--radius-panel)] border border-stone-200 bg-stone-50 p-4 text-sm text-stone-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-400">
        Using <code className="rounded bg-stone-200 px-1 dark:bg-stone-700">DEEPSEEK_API_KEY</code> from environment variable.
      </div>
    )
  }

  return (
    <form ref={formRef} action={handleAction} className="mt-4 space-y-4">
      <div>
        <label htmlFor="aiKey" className="block text-sm font-medium text-stone-700 dark:text-stone-300">
          DeepSeek API Key
        </label>
        <input
          id="aiKey"
          name="apiKey"
          type="password"
          placeholder={config?.apiKey ? '••••••••••••••••' : 'sk-xxxxxxxxxxxx'}
          className="mt-1 w-full rounded-[var(--radius-control)] border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-[var(--academic-navy)] dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
        />
        {config?.apiKey && (
          <p className="mt-1 text-xs text-[var(--academic-navy)] dark:text-[var(--academic-navy)]">
            Key saved. Leave blank to keep the current key.
          </p>
        )}
      </div>

      <label className="flex items-center gap-2">
        <input
          name="enabled"
          type="checkbox"
          defaultChecked={config?.enabled ?? false}
          className="h-4 w-4 rounded border-stone-300 text-[var(--academic-navy)] focus:ring-[var(--academic-navy)]"
        />
        <span className="text-sm text-stone-700 dark:text-stone-300">Enable AI-generated conversations</span>
      </label>

      <button
        type="submit"
        className="rounded-[var(--radius-panel)] bg-[var(--academic-navy)] px-5 py-2 text-sm font-medium text-white transition-colors hover:brightness-110"
      >
        Save
      </button>
    </form>
  )
}
