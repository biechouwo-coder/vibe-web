'use client'

import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import TaskItem from './TaskItem'
import Confetti from '@/components/ui/Confetti'
import type { TaskWithMeta } from '@/types'

interface TaskListProps {
  tasks: TaskWithMeta[]
}

export default function TaskList({ tasks }: TaskListProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  const handleToggle = useCallback(() => {
    const remainingIncomplete = tasks.filter((t) => !t.completed).length
    if (remainingIncomplete === 1) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }, [tasks])

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <p className="text-sm text-stone-400">No tasks for today yet</p>
        <p className="text-xs text-stone-300 dark:text-stone-600">Add one above to get started</p>
      </div>
    )
  }

  const completedTasks = tasks.filter((t) => t.completed)

  return (
    <>
      <Confetti active={showConfetti} />
      <div className="space-y-2">
        <AnimatePresence>
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={handleToggle} />
          ))}
        </AnimatePresence>
      </div>

      {completedTasks.length > 0 && completedTasks.length === tasks.length && (
        <div className="mt-6 rounded-lg border border-stone-200 bg-stone-50 p-4 text-center dark:border-stone-800 dark:bg-stone-800/30">
          <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
            All tasks completed today.
          </p>
        </div>
      )}
    </>
  )
}
