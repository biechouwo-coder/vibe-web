/**
 * One-time backfill: assign contentId to old auto-generated learning tasks.
 *
 * Before the @@unique([date, contentId]) migration, auto-generated tasks
 * were created without contentId (contentId = NULL).  After the migration
 * ensureLearningTasks creates tasks WITH contentId, producing duplicates.
 *
 * This script:
 *  1. Finds all tasks where contentId IS NULL AND description = 'Daily learning task'
 *  2. Matches them to DailyContent by date and title prefix ("💬 ", "📝 ", "📄 ")
 *  3. If no conflicting task with that contentId exists → backfills contentId
 *  4. If a conflicting task already exists → deletes the old null-contentId task
 *
 * Safe to re-run (idempotent).
 *
 * Usage:
 *   node scripts/backfill-learning-task-content-id.js
 */

/* eslint-disable @typescript-eslint/no-require-imports */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const EMOJI_PREFIXES = ['💬 ', '📝 ', '📄 ']

function stripPrefix(title) {
  for (const p of EMOJI_PREFIXES) {
    if (title.startsWith(p)) return title.slice(p.length)
  }
  return null
}

async function main() {
  // 1. Find all old learning tasks without contentId
  const oldTasks = await prisma.task.findMany({
    where: {
      contentId: null,
      description: 'Daily learning task',
    },
  })

  if (oldTasks.length === 0) {
    console.log('No old learning tasks to backfill.')
    return
  }

  console.log(`Found ${oldTasks.length} old learning tasks without contentId.`)

  let backfilled = 0
  let deleted = 0
  let skipped = 0

  for (const task of oldTasks) {
    const bareTitle = stripPrefix(task.title)
    if (!bareTitle) {
      skipped++
      continue
    }

    // 2. Find matching DailyContent on the same date
    const content = await prisma.dailyContent.findFirst({
      where: {
        date: task.date,
        title: bareTitle,
      },
    })

    if (!content) {
      skipped++
      continue
    }

    // 3. Check if a task with this contentId already exists for this date
    const existing = await prisma.task.findFirst({
      where: {
        date: task.date,
        contentId: content.id,
      },
    })

    if (existing) {
      // 4. Conflict: delete the old duplicate
      await prisma.task.delete({ where: { id: task.id } })
      deleted++
      console.log(`  DELETED old task "${task.title}" (contentId=${content.id} already exists)`)
    } else {
      // 3. No conflict: backfill contentId
      await prisma.task.update({
        where: { id: task.id },
        data: { contentId: content.id },
      })
      backfilled++
      console.log(`  BACKFILLED "${task.title}" → contentId=${content.id}`)
    }
  }

  console.log(`\nDone. Backfilled: ${backfilled}, Deleted (duplicates): ${deleted}, Skipped (no match): ${skipped}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
