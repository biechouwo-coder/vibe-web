'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getShanghaiDate } from '@/lib/date'
import { pushTaskToNotion } from '@/lib/notion'

function getToday(): Date {
  return getShanghaiDate()
}

export async function getTodaysTasks() {
  const date = getToday()
  return prisma.task.findMany({
    where: { date },
    orderBy: [
      { completed: 'asc' },
      { sortOrder: 'asc' },
    ],
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

  const task = await prisma.task.create({
    data: {
      date,
      title: title.trim(),
      description: description?.trim() || null,
      sortOrder: (lastTask?.sortOrder ?? -1) + 1,
    },
  })

  // Fire-and-forget Notion push; failure must not block user
  pushTaskToNotion(task.id).catch(() => {})

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

  // Fire-and-forget Notion push on toggle
  pushTaskToNotion(taskId).catch(() => {})

  revalidatePath('/plans')
  revalidatePath('/')
}

export async function reorderTasks(taskIds: string[]) {
  for (let i = 0; i < taskIds.length; i++) {
    await prisma.task.update({
      where: { id: taskIds[i] },
      data: { sortOrder: i },
    })
  }
  revalidatePath('/')
  revalidatePath('/plans')
}

export async function deleteTask(taskId: string) {
  await prisma.task.delete({ where: { id: taskId } })
  revalidatePath('/plans')
  revalidatePath('/')
}

export async function getTemplates() {
  return prisma.taskTemplate.findMany({ orderBy: { sortOrder: 'asc' } })
}

export async function createTemplate(formData: FormData) {
  const title = formData.get('title') as string
  if (!title?.trim()) return { error: 'Title is required' }

  const lastTemplate = await prisma.taskTemplate.findFirst({ orderBy: { sortOrder: 'desc' } })

  await prisma.taskTemplate.create({
    data: {
      title: title.trim(),
      description: (formData.get('description') as string)?.trim() || null,
      sortOrder: (lastTemplate?.sortOrder ?? -1) + 1,
    },
  })

  revalidatePath('/plans')
}

export async function deleteTemplate(id: string) {
  await prisma.taskTemplate.delete({ where: { id } })
  revalidatePath('/plans')
}

export async function copyTemplateToToday(templateId: string) {
  const template = await prisma.taskTemplate.findUnique({ where: { id: templateId } })
  if (!template) return { error: 'Template not found' }

  const date = getToday()

  // Prevent duplicate: same template can only be added once per day
  const existing = await prisma.task.findFirst({
    where: { date, templateId },
  })
  if (existing) return { error: 'This task is already on today\'s list' }

  const lastTask = await prisma.task.findFirst({
    where: { date },
    orderBy: { sortOrder: 'desc' },
  })

  await prisma.task.create({
    data: {
      date,
      title: template.title,
      description: template.description,
      templateId,
      sortOrder: (lastTask?.sortOrder ?? -1) + 1,
    },
  })

  revalidatePath('/plans')
  revalidatePath('/')
}

export async function updateStreak() {
  const today = getToday()

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
    if (lastActive.getTime() === today.getTime()) {
      return
    }
    const diffDays = Math.round((today.getTime() - lastActive.getTime()) / 86400000)
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
  const completed = tasks.filter((t: { completed: boolean }) => t.completed).length
  const streak = await getStreak()

  return {
    totalTasks: tasks.length,
    completedTasks: completed,
    completionRate: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0,
    streak,
  }
}
