'use client'

import { useRef } from 'react'
import { createTask } from '@/actions/plans'

export default function AddTaskForm() {
  const formRef = useRef<HTMLFormElement>(null)

  const handleAction = async (formData: FormData) => {
    await createTask(formData)
    formRef.current?.reset()
  }

  return (
    <form ref={formRef} action={handleAction} className="flex gap-2">
      <div className="flex flex-1 gap-2 rounded-2xl border border-stone-200 bg-white p-1 dark:border-stone-800 dark:bg-stone-900">
        <input
          name="title"
          type="text"
          placeholder="Add a new task..."
          required
          className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-stone-400"
        />
        <input
          name="description"
          type="text"
          placeholder="Description (optional)"
          className="hidden w-40 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-stone-400 sm:block"
        />
      </div>
      <button
        type="submit"
        className="rounded-2xl bg-[var(--academic-navy)] px-4 py-2 text-sm font-medium text-white transition-colors hover:brightness-110 active:brightness-90"
      >
        Add
      </button>
    </form>
  )
}
