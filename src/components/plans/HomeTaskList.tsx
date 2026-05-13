'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toggleTask } from '@/actions/plans'
import Confetti from '@/components/ui/Confetti'
import Link from 'next/link'
import type { TaskWithMeta } from '@/types'

interface HomeTaskListProps {
  tasks: TaskWithMeta[]
}

export default function HomeTaskList({ tasks: initialTasks }: HomeTaskListProps) {
  const [tasks, setTasks] = useState(initialTasks)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleToggle = useCallback(async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date() : null } : t
      )
    )

    const remainingIncomplete = tasks.filter((t) => !t.completed).length
    if (!task.completed && remainingIncomplete === 1) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }

    await toggleTask(taskId)
  }, [tasks])

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <p className="text-sm text-stone-400">No tasks for today</p>
        <Link href="/plans" className="text-xs font-medium text-stone-500 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200">
          Add one
        </Link>
      </div>
    )
  }

  const completedCount = tasks.filter((t) => t.completed).length

  return (
    <>
      <Confetti active={showConfetti} />
      <div className="mb-2 flex items-center gap-2">
        <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--task-track)' }}>
          <motion.div
            className="h-full rounded-full" style={{ backgroundColor: 'var(--accent)' }}
            initial={false}
            animate={{ width: `${tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-xs text-stone-400 shrink-0 tabular-nums">{completedCount}/{tasks.length}</span>
      </div>
      <div className="space-y-0.5">
        <AnimatePresence>
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} onToggle={handleToggle} />
          ))}
        </AnimatePresence>
      </div>
    </>
  )
}

function TaskRow({ task, onToggle }: { task: TaskWithMeta; onToggle: (id: string) => void }) {
  return (
    <motion.div
      layout
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      className={`group flex items-center gap-2.5 rounded-md px-2.5 py-2 transition-colors ${
        task.completed
          ? ''
          : ''
      }`}
      style={{
        backgroundColor: task.completed ? 'var(--task-hover)' : undefined,
      }}
      onMouseEnter={(e) => { if (!task.completed) e.currentTarget.style.backgroundColor = 'var(--task-hover)'; }}
      onMouseLeave={(e) => { if (!task.completed) e.currentTarget.style.backgroundColor = ''; }}
    >
      <button
        onClick={() => onToggle(task.id)}
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
          task.completed
            ? 'border-[var(--academic-navy)] bg-[var(--academic-navy)] dark:border-[var(--accent)] dark:bg-[var(--accent)]'
            : 'border-stone-300 hover:border-stone-500 dark:border-stone-600 dark:hover:border-stone-400'
        }`}
      >
        {task.completed && (
          <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </motion.svg>
        )}
      </button>
      <p className={`flex-1 truncate text-sm ${task.completed ? 'text-stone-400 line-through dark:text-stone-500' : 'text-stone-700 dark:text-stone-300'}`}>
        {task.title}
      </p>
    </motion.div>
  )
}
