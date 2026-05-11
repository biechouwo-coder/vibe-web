export const dynamic = 'force-dynamic'

import { getNotionConfig } from '@/actions/learn'
import SettingsForm from './SettingsForm'
import ThemeSelector from '@/components/theme/ThemeSelector'

export default async function SettingsPage() {
  const config = await getNotionConfig()

  return (
    <div className="space-y-8">
      <section>
        <h1 className="font-serif text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-stone-500">
          Configure integrations and preferences
        </p>
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
        <h2 className="font-serif text-lg font-semibold">Theme</h2>
        <div className="mt-3">
          <ThemeSelector />
        </div>
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
        <h2 className="font-serif text-lg font-semibold">Notion Integration</h2>
        <p className="mt-1 text-sm text-stone-500">
          Push learning materials and tasks to your Notion databases.
        </p>

        <div className="mt-4 rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm text-stone-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300">
          <p className="font-medium">How to set up:</p>
          <ol className="mt-2 list-inside list-decimal space-y-1 text-xs">
            <li>Go to{' '}
              <a
                href="https://www.notion.so/profile/integrations"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Notion Integrations
              </a>{' '}
              and create a new internal integration
            </li>
            <li>Copy the &quot;Internal Integration Secret&quot; token</li>
            <li>
              Create a Database in Notion for <strong>English Learning</strong> with fields: Date (Date), Type (Select), Title (Title), Tags (Multi-select)
            </li>
            <li>
              Create a Database for <strong>Daily Plans</strong> with fields: Date (Date), Task (Title), Status (Select)
            </li>
            <li>
              Share each database with your integration (Database &rarr; Share &rarr; Add &rarr; your integration)
            </li>
            <li>
              Copy the Database ID from the URL (the string after the workspace name and before the &quot;?&quot;)
            </li>
          </ol>
        </div>

        <SettingsForm config={config} />
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
        <h2 className="font-serif text-lg font-semibold">About</h2>
        <div className="mt-3 space-y-2 text-sm text-stone-500">
          <p>
            This is a personal productivity and English learning tool designed for
            HKUST-GZ&apos;s Carbon Neutrality &amp; Green Finance program.
          </p>
          <p>
            <strong>Daily English</strong> covers conversations, vocabulary, and
            academic passages related to green finance and sustainability.
          </p>
          <p>
            <strong>Daily Plans</strong> help track tasks with streak rewards to
            build consistent study habits.
          </p>
        </div>
      </section>
    </div>
  )
}
