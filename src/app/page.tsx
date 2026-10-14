export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getDailyStats, getTodaysTasks } from '@/actions/plans'
import { fetchTodaysContent } from '@/actions/learn'
import ProgressBar from '@/components/layout/ProgressBar'
import DailyCard from '@/components/learn/DailyCard'
import HomeTaskList from '@/components/plans/HomeTaskList'
import { formatShanghaiDate, getShanghaiDayOfWeek } from '@/lib/date'

const linkClass =
  'inline-flex min-h-10 items-center justify-center gap-2 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]'

const studySteps = [
  { label: 'Reading 1', description: 'Start with the first passage and its key terms.', action: 'Read today’s passage' },
  { label: 'Reading 2', description: 'Continue the passage and build on yesterday’s vocabulary.', action: 'Continue reading' },
  { label: 'Reading 3', description: 'Finish the reading sequence and explore the writing focus.', action: 'Continue reading' },
  { label: 'Reading follow-up', description: 'Revisit the paper details and reflect on this week’s reading.', action: 'Open reading notes' },
  { label: 'Vocabulary', description: 'Review the full set of terms from this week’s paper.', action: 'Review vocabulary' },
  { label: 'Discussion', description: 'Use the discussion questions to put your ideas into words.', action: 'Open discussion' },
  { label: 'Weekly review', description: 'Bring the passage, vocabulary and discussion together.', action: 'Review the week' },
]

function getReadingMetadata(content: string, key: string) {
  const prefix = `**${key}:**`
  return content.split('\n').find((line) => line.startsWith(prefix))?.slice(prefix.length).trim()
}

function Arrow() {
  return (
    <svg aria-hidden="true" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  )
}

export default async function Home() {
  // Generate today's materials and tasks before querying their progress.
  const content = await fetchTodaysContent()
  const stats = await getDailyStats()
  const tasks = await getTodaysTasks()
  const remainingTasks = stats.totalTasks - stats.completedTasks
  const nextTask = tasks.find((task) => !task.completed)
  const nextHref = nextTask?.contentId ? `/learn/${nextTask.contentId}` : '/plans'
  const dayOfWeek = getShanghaiDayOfWeek()
  const studyStep = studySteps[dayOfWeek]
  const focusHref = `/learn/${dayOfWeek === 4 ? content.vocabulary.id : content.passage.id}`
  const paperTitle = getReadingMetadata(content.passage.content, 'Paper') || content.passage.title
  const journal = getReadingMetadata(content.passage.content, 'Journal')
  const year = getReadingMetadata(content.passage.content, 'Year')
  const paperMeta = [journal, year].filter(Boolean).join(' · ')

  return (
    <div className="space-y-8 sm:space-y-10">
      <header className="flex flex-col gap-5 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">Study Desk</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight tracking-tight text-[var(--foreground)] sm:text-4xl">Your study, in focus.</h1>
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            {formatShanghaiDate('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link href="/plans" className={`${linkClass} self-start sm:shrink-0`}>
          Plan your day <Arrow />
        </Link>
      </header>

      <div className="grid gap-5 lg:grid-cols-5">
        <section aria-labelledby="focus-heading" className="rounded-[var(--radius-panel)] border border-[var(--border)] border-l-4 border-l-[var(--accent)] bg-[var(--soft-panel-bg)] p-5 sm:p-6 lg:col-span-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="focus-heading" className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">This week’s paper</h2>
            <span className="rounded-[var(--radius-small)] border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-xs text-[var(--text-muted)]">{studyStep.label}</span>
          </div>
          <h3 className="mt-4 font-serif text-xl font-semibold leading-snug text-[var(--foreground)] sm:text-2xl">{paperTitle}</h3>
          {paperMeta && <p className="mt-3 text-xs leading-relaxed text-[var(--text-muted)]">{paperMeta}</p>}
          <div className="mt-5 border-t border-[var(--border)] pt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">Today’s focus</p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--foreground)]">{studyStep.description}</p>
            <Link href={focusHref} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-control)] bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--surface)] transition-colors hover:bg-[var(--accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]">
              {studyStep.action} <Arrow />
            </Link>
          </div>
        </section>

        <section aria-labelledby="progress-heading" className="rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 lg:col-span-2">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="progress-heading" className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">Today’s progress</h2>
            <p className="text-2xl font-semibold tabular-nums text-[var(--accent)]">{stats.completionRate}<span className="text-sm">%</span></p>
          </div>
          <div className="mt-4"><ProgressBar value={stats.completionRate} /></div>
          <dl className="mt-5 grid grid-cols-3 divide-x divide-[var(--border)] text-center">
            <div className="pr-2">
              <dt className="text-xs text-[var(--text-muted)]">Done</dt>
              <dd className="mt-1 text-xl font-semibold tabular-nums">{stats.completedTasks}</dd>
            </div>
            <div className="px-2">
              <dt className="text-xs text-[var(--text-muted)]">To do</dt>
              <dd className="mt-1 text-xl font-semibold tabular-nums">{remainingTasks}</dd>
            </div>
            <div className="pl-2">
              <dt className="text-xs text-[var(--text-muted)]">Streak</dt>
              <dd className="mt-1 text-xl font-semibold tabular-nums">{stats.streak.currentStreak}<span className="ml-1 text-xs font-normal text-[var(--text-muted)]">{stats.streak.currentStreak === 1 ? 'day' : 'days'}</span></dd>
            </div>
          </dl>
          <div className="mt-5 border-t border-[var(--border)] pt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">{nextTask ? 'Up next' : stats.totalTasks ? 'All done for today' : 'Make room for your priorities'}</p>
            <p className="mt-2 break-words text-sm leading-relaxed text-[var(--foreground)]">
              {nextTask ? nextTask.title.replace(/^[💬📝📄]\s*/u, '') : stats.totalTasks ? 'Your planned tasks are complete. Revisit a lesson or plan your next step.' : 'Add a task to shape today’s study session.'}
            </p>
            <Link href={nextTask ? nextHref : stats.totalTasks ? '/learn' : '/plans'} className="mt-3 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]">
              {nextTask?.contentId ? 'Continue learning' : nextTask ? 'Open task planner' : stats.totalTasks ? 'Explore lessons' : 'Add a task'} <Arrow />
            </Link>
          </div>
        </section>
      </div>

      <section aria-labelledby="tasks-heading">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="tasks-heading" className="font-serif text-xl font-semibold text-[var(--foreground)]">Today’s Tasks</h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">A small plan, one task at a time.</p>
          </div>
          <Link href="/plans" className={linkClass}>Manage tasks <Arrow /></Link>
        </div>
        <div className="rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--soft-panel-bg)] p-4 sm:p-5">
          <HomeTaskList tasks={tasks} />
        </div>
      </section>

      <section aria-labelledby="queue-heading">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="queue-heading" className="font-serif text-xl font-semibold text-[var(--foreground)]">Learning Queue</h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Speak naturally. Build your vocabulary. Read with purpose.</p>
          </div>
          <Link href="/learn" className={linkClass}>View study materials <Arrow /></Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <DailyCard title={content.conversation.title} type="conversation" content={content.conversation.content} tags={content.conversation.tags} pushed={content.conversation.pushed} detailHref={`/learn/${content.conversation.id}`} />
          <DailyCard title={content.vocabulary.title} type="vocabulary" content={content.vocabulary.content} tags={content.vocabulary.tags} pushed={content.vocabulary.pushed} detailHref={`/learn/${content.vocabulary.id}`} />
          <DailyCard title={content.passage.title} type="passage" content={content.passage.content} tags={content.passage.tags} pushed={content.passage.pushed} detailHref={`/learn/${content.passage.id}`} />
        </div>
      </section>
    </div>
  )
}
