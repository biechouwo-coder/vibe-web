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
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { toggleTask, deleteTask, reorderTasks } from '@/actions/plans'
import Confetti from '@/components/ui/Confetti'
import type { TaskWithMeta } from '@/types'

interface TaskListProps {
  tasks: TaskWithMeta[]
}

export default function TaskList({ tasks: initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState(initialTasks)
  const [activeTask, setActiveTask] = useState<TaskWithMeta | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleToggle = useCallback(async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    await toggleTask(taskId)

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
    )

    const remainingIncomplete = tasks.filter((t) => !t.completed).length
    if (!task.completed && remainingIncomplete === 1) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }, [tasks])

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveTask(tasks.find((t) => t.id === event.active.id) ?? null)
  }, [tasks])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveTask(null)
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

  const completedCount = tasks.filter((t) => t.completed).length

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <p className="text-sm text-stone-400">No tasks for today yet</p>
        <p className="text-xs text-stone-300 dark:text-stone-600">Add one above to get started</p>
      </div>
    )
  }

  return (
    <>
      <Confetti active={showConfetti} />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            <AnimatePresence>
              {tasks.map((task) => (
                <SortableTaskItem key={task.id} task={task} onToggle={handleToggle} />
              ))}
            </AnimatePresence>
          </div>
        </SortableContext>
        <DragOverlay>
          {activeTask ? (
            <div className="flex items-center gap-2 rounded-[var(--radius-control)] border bg-[var(--surface)] p-3 shadow-lg" style={{ borderColor: 'var(--border-card)' }}>
              <svg className="h-4 w-4 shrink-0 text-[var(--text-soft)]" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="8" cy="7" r="1.5" /><circle cx="16" cy="7" r="1.5" />
                <circle cx="8" cy="12" r="1.5" /><circle cx="16" cy="12" r="1.5" />
                <circle cx="8" cy="17" r="1.5" /><circle cx="16" cy="17" r="1.5" />
              </svg>
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded border" style={{ borderColor: 'var(--text-soft)' }}>
                {activeTask.completed && (
                  <svg className="h-3 w-3 text-[var(--academic-navy)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-main)]">{activeTask.title}</p>
                {activeTask.description && (
                  <p className="mt-0.5 text-xs text-[var(--text-muted)]">{activeTask.description}</p>
                )}
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {completedCount > 0 && completedCount === tasks.length && (
        <div className="mt-6 rounded-[var(--radius-panel)] border border-stone-200 bg-stone-50 p-4 text-center dark:border-stone-800 dark:bg-stone-800/30">
          <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
            All tasks completed today.
          </p>
        </div>
      )}
    </>
  )
}

function SortableTaskItem({ task, onToggle }: { task: TaskWithMeta; onToggle: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })

  const style = useMemo(() => ({
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  }), [transform, transition, isDragging])

  return (
    <motion.div
      ref={setNodeRef}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className="group flex items-center gap-2 rounded-[var(--radius-control)] border p-3 transition-colors hover:border-[var(--text-muted)]"
      style={{
        ...style,
        borderColor: 'var(--border-card)',
        backgroundColor: task.completed ? 'var(--task-surface)' : '#ffffff',
      }}
    >
      {/* Drag handle */}
      <button
        className="cursor-grab touch-none shrink-0 text-[var(--text-soft)] opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
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
        className="shrink-0 flex h-5 w-5 items-center justify-center rounded border transition-colors"
        style={{
          borderColor: task.completed ? 'var(--academic-navy)' : 'var(--text-soft)',
          backgroundColor: task.completed ? 'var(--academic-navy)' : 'transparent',
        }}
      >
        {task.completed && (
          <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </motion.svg>
        )}
      </button>

      {/* Title + description */}
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

      {/* Delete */}
      <form action={deleteTask.bind(null, task.id)} className="shrink-0 self-center">
        <button type="submit" className="rounded p-1.5 text-[var(--text-soft)] transition-colors hover:text-[var(--academic-red)] hover:bg-[var(--task-hover)]">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </form>
    </motion.div>
  )
}
