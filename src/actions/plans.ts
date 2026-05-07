'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

function getToday(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

export async function getTodaysTasks() {
  const date = getToday()
  return prisma.task.findMany({
    where: { date },
    orderBy: { sortOrder: 'asc' },
  })
}

export async function createTask(formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string | null

  if (!title?.trim()) return { error: 'Task title is required' }

  const date = getToday()
  const lastTask = await prisma.task.findFirst({
    where: { date },
    orderBy: { sortOrder: 'desc' },
  })

  await prisma.task.create({
    data: {
      date,
      title: title.trim(),
      description: description?.trim() || null,
      sortOrder: (lastTask?.sortOrder ?? -1) + 1,
    },
  })

  revalidatePath('/plans')
  revalidatePath('/')
}

export async function toggleTask(taskId: string) {
  const task = await prisma.task.findUnique({ where: { id: taskId } })
  if (!task) return { error: 'Task not found' }

  const now = task.completed ? null : new Date()

  await prisma.task.update({
    where: { id: taskId },
    data: {
      completed: !task.completed,
      completedAt: now,
    },
  })

  // Update streak when completing tasks
  if (!task.completed) {
    await updateStreak()
  }

  revalidatePath('/plans')
  revalidatePath('/')
}

export async function deleteTask(taskId: string) {
  await prisma.task.delete({ where: { id: taskId } })
  revalidatePath('/plans')
  revalidatePath('/')
}

export async function updateStreak() {
  const today = getToday()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const streak = await prisma.streak.findFirst()
  if (!streak) {
    await prisma.streak.create({
      data: { currentStreak: 1, longestStreak: 1, lastActive: today },
    })
    return
  }

  const lastActive = streak.lastActive
  let newStreak = streak.currentStreak

  if (!lastActive) {
    newStreak = 1
  } else {
    const lastDate = new Date(lastActive)
    lastDate.setHours(0, 0, 0, 0)

    if (lastDate.getTime() === today.getTime()) {
      // Already counted today, no change
      return
    }

    const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / 86400000)
    if (diffDays === 1) {
      newStreak += 1
    } else {
      newStreak = 1
    }
  }

  const longestStreak = Math.max(streak.longestStreak, newStreak)

  await prisma.streak.update({
    where: { id: streak.id },
    data: { currentStreak: newStreak, longestStreak, lastActive: today },
  })
}

export async function getStreak() {
  const streak = await prisma.streak.findFirst()
  return streak ?? { id: 'default', currentStreak: 0, longestStreak: 0, lastActive: null }
}

export async function getDailyStats() {
  const date = getToday()
  const tasks = await prisma.task.findMany({ where: { date } })
  const completed = tasks.filter((t) => t.completed).length
  const streak = await getStreak()

  return {
    totalTasks: tasks.length,
    completedTasks: completed,
    completionRate: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0,
    streak,
  }
}
