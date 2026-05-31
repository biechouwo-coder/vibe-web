'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const navItems = [
  { href: '/', label: 'Study Desk', shortLabel: 'Desk', icon: 'desk' },
  { href: '/learn', label: 'Readings', shortLabel: 'Readings', icon: 'book' },
  { href: '/plans', label: 'Plans', shortLabel: 'Plans', icon: 'list' },
  { href: '/settings', label: 'Settings', shortLabel: 'Settings', icon: 'settings' },
]

function NavIcon({ icon, active }: { icon: string; active: boolean }) {
  const cls = active ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-main)]'
  const className = `h-5 w-5 transition-colors ${cls}`
  switch (icon) {
    case 'desk':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      )
    case 'book':
      return (
        <motion.svg
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Closed book — visible when inactive */}
          <motion.g
            animate={active ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.12 }}
          >
            <rect x="3" y="4" width="18" height="16" rx="1" />
            <line x1="6" y1="5" x2="6" y2="19" strokeWidth={1} strokeOpacity={0.35} />
            <line x1="19" y1="7" x2="19" y2="17" strokeWidth={1} strokeOpacity={0.35} />
            <line x1="20" y1="6" x2="20" y2="18" strokeWidth={1} strokeOpacity={0.2} />
          </motion.g>
          {/* Open book — springs from spine when active */}
          <motion.g
            style={{ originX: 0.5, originY: 0.5 }}
            animate={active
              ? { scaleX: 1, opacity: 1 }
              : { scaleX: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
          >
            <path d="M4 6c0-1.1.9-2 2-2h6v16H6c-1.1 0-2-.9-2-2V6z" />
            <line x1="6" y1="9" x2="11" y2="9" strokeWidth={1} strokeOpacity={0.4} />
            <line x1="6" y1="12" x2="10" y2="12" strokeWidth={1} strokeOpacity={0.4} />
            <path d="M20 6c0-1.1-.9-2-2-2h-6v16h6c1.1 0 2-.9 2-2V6z" />
            <line x1="13" y1="9" x2="18" y2="9" strokeWidth={1} strokeOpacity={0.4} />
            <line x1="13" y1="12" x2="17" y2="12" strokeWidth={1} strokeOpacity={0.4} />
            <line x1="13" y1="15" x2="16" y2="15" strokeWidth={1} strokeOpacity={0.4} />
            <line x1="12" y1="4" x2="12" y2="20" strokeWidth={2} />
          </motion.g>
        </motion.svg>
      )
    case 'list':
      return (
        <motion.svg
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Document outline */}
          <rect x="3" y="3" width="18" height="18" rx="1.5" />
          {/* Folded corner */}
          <path d="M14 3v3h3" strokeWidth={1.2} strokeOpacity={0.35} />
          {/* Line 1 — draws in from left */}
          <motion.path
            d="M6 7h12"
            strokeWidth={2.5}
            initial={{ pathLength: 0 }}
            animate={active ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.2, delay: 0 }}
          />
          {/* Line 2 */}
          <motion.path
            d="M6 10.5h10"
            strokeWidth={2.5}
            initial={{ pathLength: 0 }}
            animate={active ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.2, delay: 0.06 }}
          />
          {/* Line 3 */}
          <motion.path
            d="M6 14h11"
            strokeWidth={2.5}
            initial={{ pathLength: 0 }}
            animate={active ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.2, delay: 0.12 }}
          />
          {/* Line 4 */}
          <motion.path
            d="M6 17.5h9"
            strokeWidth={2.5}
            initial={{ pathLength: 0 }}
            animate={active ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.2, delay: 0.18 }}
          />
        </motion.svg>
      )
    case 'settings':
      return (
        <motion.svg
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          animate={{ rotate: active ? 90 : 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </motion.svg>
      )
    default:
      return null
  }
}

export default function Navbar() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden sm:flex sm:flex-col sm:w-16 md:w-20 lg:w-24 sm:h-full sm:shrink-0 sm:items-center" style={{ backgroundColor: 'var(--sidebar-bg)' }}>
        {/* Brand */}
        <div className="sm:pt-8 sm:pb-6">
          <Link href="/" className="block text-center transition-colors hover:text-[var(--accent)]" aria-label="Home">
            <svg width="48" height="48" viewBox="0 0 32 32" className="mx-auto">
              {/* Chibi pixel art alligator — big head, big eye, tiny body */}
              <g fill="currentColor">
                {/* Tail — tiny stub */}
                <rect x="2" y="14" width="2" height="2" rx="0.3" />
                <rect x="4" y="14" width="2" height="2" rx="0.3" />
                {/* Body — small and compact */}
                <rect x="6" y="12" width="4" height="2" rx="0.3" />
                <rect x="6" y="14" width="8" height="2" rx="0.3" />
                <rect x="6" y="16" width="8" height="2" rx="0.3" />
                <rect x="8" y="18" width="4" height="2" rx="0.3" />
                {/* Head — big, chibi style */}
                <rect x="8" y="6" width="12" height="2" rx="0.3" />
                <rect x="6" y="8" width="16" height="2" rx="0.3" />
                <rect x="6" y="10" width="16" height="2" rx="0.3" />
                <rect x="8" y="12" width="12" height="2" rx="0.3" />
                {/* Short snout */}
                <rect x="20" y="8" width="4" height="2" rx="0.3" />
                <rect x="22" y="10" width="4" height="2" rx="0.3" />
                {/* Back ridge bumps */}
                <rect x="10" y="4" width="2" height="2" rx="0.3" />
                <rect x="14" y="4" width="2" height="2" rx="0.3" />
                {/* Front leg */}
                <rect x="8" y="20" width="4" height="2" rx="0.3" />
                <rect x="8" y="22" width="2" height="2" rx="0.3" />
                {/* Hind leg */}
                <rect x="12" y="20" width="4" height="2" rx="0.3" />
                <rect x="14" y="22" width="2" height="2" rx="0.3" />
              </g>
              {/* Big cute eye */}
              <rect x="14" y="8" width="4" height="4" rx="0.5" fill="var(--sidebar-bg, #faf8f3)" />
              {/* Pupil */}
              <rect x="15" y="9" width="2" height="2" rx="0.3" fill="currentColor" />
              {/* Eye highlight */}
              <rect x="15" y="9" width="1" height="1" rx="0.2" />
              {/* Nostril */}
              <rect x="23" y="8" width="2" height="1" rx="0.2" fill="var(--sidebar-bg, #faf8f3)" />
              {/* Cute smile */}
              <rect x="18" y="12" width="4" height="1" rx="0.2" fill="var(--sidebar-bg, #faf8f3)" />
            </svg>
          </Link>
        </div>

        {/* Divider */}
        <div className="w-8 h-px" style={{ backgroundColor: 'var(--border)' }} />

        {/* Navigation */}
        <nav className="mt-6 flex w-full flex-1 flex-col items-center gap-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative flex w-full flex-col items-center gap-1 py-2"
              >
                {/* Active left bar indicator */}
                {isActive && (
                  <motion.span
                    layoutId="nav-bar"
                    className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r-full bg-[var(--accent)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <NavIcon icon={item.icon} active={isActive} />
                <span className={`text-center transition-colors ${isActive ? 'text-[10px] font-semibold text-[var(--accent)]' : 'text-[10px] text-[var(--text-muted)] group-hover:text-[var(--text-main)]'}`}>
                  {item.shortLabel}
                </span>
              </Link>
            )
          })}
        </nav>

      </aside>

      {/* Mobile top bar */}
      <nav className="shrink-0 z-50 flex w-full items-center justify-between border-b px-4 py-2.5 backdrop-blur-sm sm:hidden" style={{ borderColor: 'var(--border-soft)', backgroundColor: 'var(--sidebar-bg)' }}>
        <Link href="/" className="font-serif text-base font-semibold tracking-tight text-[var(--text-main)]">
          v<span className="text-[var(--accent)]">.</span>w
        </Link>
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            return (
              <Link key={item.href} href={item.href} className={`px-2.5 py-1.5 text-xs font-medium transition-colors ${isActive ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>
                {item.shortLabel}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}

