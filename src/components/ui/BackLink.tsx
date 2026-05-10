import Link from 'next/link'

interface BackLinkProps {
  href: string
  children?: React.ReactNode
}

/**
 * Neutral-styled navigation link for "Back" buttons.
 * Uses subtle zinc tones — not green/emerald — to distinguish
 * navigation from primary actions.
 */
export default function BackLink({ href, children = 'Back' }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
    >
      <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      {children}
    </Link>
  )
}
