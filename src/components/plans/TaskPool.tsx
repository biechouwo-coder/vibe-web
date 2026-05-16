'use client'

import { useRef, useState } from 'react'
import { createTemplate, deleteTemplate, copyTemplateToToday } from '@/actions/plans'

interface Template {
  id: string
  title: string
  description: string | null
  sortOrder: number
}

interface TaskPoolProps {
  templates: Template[]
}

export default function TaskPool({ templates }: TaskPoolProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [feedback, setFeedback] = useState('')

  const handleCopy = async (id: string) => {
    setFeedback('')
    const result = await copyTemplateToToday(id)
    if (result?.error) {
      setFeedback(result.error)
      setTimeout(() => setFeedback(''), 2500)
    }
  }

  const handleCreate = async (formData: FormData) => {
    await createTemplate(formData)
    formRef.current?.reset()
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-3">Available Tasks</p>

      {feedback && (
        <p className="mb-2 text-xs text-[var(--academic-red)]">{feedback}</p>
      )}

      <div className="space-y-1.5">
        {templates.length === 0 && (
          <p className="text-xs text-[var(--text-soft)]">No preset tasks yet. Add one below.</p>
        )}
        {templates.map((t) => (
          <div
            key={t.id}
            className="group flex items-center gap-2 rounded-[var(--radius-control)] border bg-[var(--surface)] px-3 py-2.5"
            style={{ borderColor: 'var(--border)' }}
          >
            <span className="flex-1 text-sm text-[var(--text-main)] truncate">{t.title}</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleCopy(t.id)}
                className="rounded p-1 text-[var(--accent)] transition-colors hover:bg-[var(--task-hover)]"
                title="Add to today"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <form action={deleteTemplate.bind(null, t.id)}>
                <button
                  type="submit"
                  className="rounded p-1 text-[var(--text-soft)] opacity-0 transition-all group-hover:opacity-100 hover:text-[var(--academic-red)]"
                  title="Delete template"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      {/* Add new template form */}
      <form ref={formRef} action={handleCreate} className="mt-3 flex gap-2">
        <input
          name="title"
          type="text"
          placeholder="New preset task..."
          required
          className="min-w-0 flex-1 rounded-[var(--radius-control)] border bg-[var(--surface)] px-3 py-2 text-sm outline-none placeholder:text-[var(--text-soft)]"
          style={{ borderColor: 'var(--border)' }}
        />
        <button
          type="submit"
          className="rounded-[var(--radius-control)] bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-white transition-colors hover:brightness-110"
        >
          Add
        </button>
      </form>
    </div>
  )
}
