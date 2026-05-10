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
      // This was the last one to complete
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }, [tasks])

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <span className="text-3xl">🎯</span>
        <p className="text-sm text-zinc-400">No tasks for today yet</p>
        <p className="text-xs text-zinc-300 dark:text-zinc-600">Add one above to get started</p>
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
        <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-center dark:bg-emerald-950/30">
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
            🎉 All tasks completed! Great job today!
          </p>
        </div>
      )}
    </>
  )
}
