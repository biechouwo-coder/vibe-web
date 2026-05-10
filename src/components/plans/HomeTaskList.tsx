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

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date() : null } : t
      )
    )

    // Check if this was the last incomplete task
    const remainingIncomplete = tasks.filter((t) => !t.completed).length
    if (!task.completed && remainingIncomplete === 1) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }

    await toggleTask(taskId)
  }, [tasks])

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center">
        <span className="text-2xl">📋</span>
        <p className="text-sm text-zinc-400">No tasks for today</p>
        <Link
          href="/plans"
          className="text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
        >
          Add one →
        </Link>
      </div>
    )
  }

  const completedCount = tasks.filter((t) => t.completed).length

  return (
    <>
      <Confetti active={showConfetti} />

      {/* Mini progress bar */}
      <div className="mb-3 flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-emerald-500"
            initial={false}
            animate={{ width: `${tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-xs text-zinc-400 shrink-0">
          {completedCount}/{tasks.length}
        </span>
      </div>

      <div className="space-y-1.5">
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
      className={`group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
        task.completed
          ? 'bg-emerald-50/50 dark:bg-emerald-950/10'
          : 'hover:bg-zinc-50 dark:hover:bg-zinc-900'
      }`}
    >
      <button
        onClick={() => onToggle(task.id)}
        className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          task.completed
            ? 'border-emerald-500 bg-emerald-500'
            : 'border-zinc-300 hover:border-emerald-400 dark:border-zinc-600'
        }`}
      >
        {task.completed && (
          <motion.svg
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="h-2.5 w-2.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </motion.svg>
        )}
      </button>

      <p
        className={`flex-1 truncate text-sm ${
          task.completed
            ? 'text-zinc-400 line-through dark:text-zinc-500'
            : 'text-zinc-700 dark:text-zinc-300'
        }`}
      >
        {task.title}
      </p>
    </motion.div>
  )
}
