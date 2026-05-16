'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { toggleTask, reorderTasks } from '@/actions/plans'
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

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setTasks((prev) => {
      const taskIds = prev.map((t) => t.id)
      const oldIndex = taskIds.indexOf(active.id as string)
      const newIndex = taskIds.indexOf(over.id as string)
      const reordered = arrayMove(prev, oldIndex, newIndex)
      reorderTasks(reordered.map((t) => t.id))
      return reordered
    })
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
  )

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <p className="text-sm text-[var(--text-soft)]">No tasks for today</p>
        <Link href="/plans" className="text-xs font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-main)] dark:text-stone-400 dark:hover:text-stone-200">
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
        <span className="text-xs text-[var(--text-soft)] shrink-0 tabular-nums">{completedCount}/{tasks.length}</span>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-0.5">
            <AnimatePresence>
              {tasks.map((task) => (
                <SortableTaskRow key={task.id} task={task} onToggle={handleToggle} />
              ))}
            </AnimatePresence>
          </div>
        </SortableContext>
      </DndContext>
    </>
  )
}

function SortableTaskRow({ task, onToggle }: { task: TaskWithMeta; onToggle: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })

  const style = useMemo(() => ({
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }), [transform, transition, isDragging])

  return (
    <motion.div
      ref={setNodeRef}
      layout
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      className="group flex items-center gap-2 rounded-[var(--radius-small)] border px-1.5 py-2 transition-colors"
      style={{
        ...style,
        backgroundColor: task.completed ? 'var(--task-hover)' : '#eeece6',
        borderColor: 'var(--border)',
      }}
      onMouseEnter={(e) => { if (!task.completed) e.currentTarget.style.backgroundColor = 'var(--task-hover)'; }}
      onMouseLeave={(e) => { if (!task.completed) e.currentTarget.style.backgroundColor = '#eeece6'; }}
    >
      {/* Drag handle */}
      <button
        className="cursor-grab touch-none px-0.5 text-[var(--text-soft)] opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="8" cy="7" r="1.5" /><circle cx="16" cy="7" r="1.5" />
          <circle cx="8" cy="12" r="1.5" /><circle cx="16" cy="12" r="1.5" />
          <circle cx="8" cy="17" r="1.5" /><circle cx="16" cy="17" r="1.5" />
        </svg>
      </button>

      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className="shrink-0 flex h-4 w-4 items-center justify-center rounded border transition-colors"
        style={{
          borderColor: task.completed ? 'var(--academic-navy)' : 'var(--text-soft)',
          backgroundColor: task.completed ? 'var(--academic-navy)' : 'transparent',
        }}
      >
        {task.completed && (
          <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </motion.svg>
        )}
      </button>

      {/* Title */}
      <p className={`flex-1 truncate text-sm ${task.completed ? 'text-[var(--text-soft)] line-through dark:text-stone-500' : 'text-[var(--text-main)] dark:text-stone-300'}`}>
        {task.title}
      </p>
    </motion.div>
  )
}
