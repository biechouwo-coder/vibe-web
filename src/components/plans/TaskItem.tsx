'use client'

import { motion } from 'framer-motion'
import { toggleTask, deleteTask } from '@/actions/plans'
import type { TaskWithMeta } from '@/types'

interface TaskItemProps {
  task: TaskWithMeta
  onToggle: () => void
}

export default function TaskItem({ task, onToggle }: TaskItemProps) {
  const handleToggle = async () => {
    await toggleTask(task.id)
    onToggle()
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className={`group flex items-start gap-3 rounded-[var(--radius-control)] border p-3 transition-colors ${
        task.completed
          ? ''
          : 'hover:border-[var(--text-muted)]'
      }`}
      style={{
        borderColor: 'var(--border-card)',
        backgroundColor: task.completed ? 'var(--task-surface)' : 'var(--card-bg)',
      }}
    >
      <button
        onClick={handleToggle}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
          task.completed
            ? 'border-[var(--academic-navy)] bg-[var(--academic-navy)] dark:border-[var(--accent)] dark:bg-[var(--accent)]'
            : 'border-[var(--text-soft)] hover:border-[var(--text-muted)] dark:border-stone-600 dark:hover:border-stone-400'
        }`}
      >
        {task.completed && (
          <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </motion.svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm ${task.completed ? 'text-[var(--text-soft)] line-through dark:text-stone-500' : 'text-[var(--text-main)] dark:text-stone-200'}`}>
          {task.title}
        </p>
        {task.description && (
          <p className={`mt-0.5 text-xs ${task.completed ? 'text-[var(--text-soft)]/60 dark:text-stone-600' : 'text-[var(--text-muted)] dark:text-stone-400'}`}>
            {task.description}
          </p>
        )}
      </div>

      <form action={deleteTask.bind(null, task.id)}>
        <button type="submit" className="rounded p-1.5 text-[var(--text-soft)] transition-colors hover:text-[var(--academic-red)] hover:bg-[var(--task-hover)] sm:opacity-0 sm:group-hover:opacity-100">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </form>
    </motion.div>
  )
}
