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
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      )
    case 'list':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
        </svg>
      )
    case 'settings':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
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
              {/* Pixel art alligator — 2px sprites, facing right */}
              <g fill="currentColor">
                {/* Tail — staircase */}
                <rect x="3" y="6" width="2" height="2" rx="0.3" />
                <rect x="5" y="8" width="2" height="2" rx="0.3" />
                <rect x="7" y="8" width="2" height="2" rx="0.3" />
                <rect x="9" y="10" width="2" height="2" rx="0.3" />
                {/* Body */}
                <rect x="11" y="8" width="14" height="2" rx="0.3" />
                <rect x="9" y="10" width="18" height="2" rx="0.3" />
                <rect x="7" y="12" width="20" height="2" rx="0.3" />
                <rect x="7" y="14" width="16" height="2" rx="0.3" />
                <rect x="9" y="16" width="12" height="2" rx="0.3" />
                {/* Back ridges */}
                <rect x="13" y="6" width="2" height="2" rx="0.3" />
                <rect x="17" y="6" width="2" height="2" rx="0.3" />
                <rect x="21" y="6" width="2" height="2" rx="0.3" />
                {/* Head */}
                <rect x="25" y="8" width="2" height="2" rx="0.3" />
                <rect x="27" y="10" width="4" height="2" rx="0.3" />
                <rect x="27" y="12" width="4" height="2" rx="0.3" />
                <rect x="27" y="14" width="2" height="2" rx="0.3" />
                {/* Front leg */}
                <rect x="11" y="18" width="4" height="2" rx="0.3" />
                <rect x="11" y="20" width="2" height="2" rx="0.3" />
                {/* Hind leg */}
                <rect x="17" y="18" width="4" height="2" rx="0.3" />
                <rect x="19" y="20" width="2" height="2" rx="0.3" />
              </g>
              {/* Eye (white) */}
              <rect x="24" y="10" width="2" height="2" rx="0.3" fill="var(--sidebar-bg, #faf8f3)" />
              {/* Eye pupil */}
              <rect x="24" y="10" width="1" height="1" rx="0.2" fill="currentColor" />
              {/* Eye highlight */}
              <rect x="24" y="10" width="1" height="1" rx="0.2" />
              {/* Smile (white cutout) */}
              <rect x="28" y="14" width="2" height="1" rx="0.2" fill="var(--sidebar-bg, #faf8f3)" />
              {/* Nostril */}
              <rect x="30" y="12" width="1" height="1" rx="0.2" fill="var(--sidebar-bg, #faf8f3)" />
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

        {/* Version */}
        <div className="pb-4">
          <p className="text-[9px] text-[var(--text-soft)]" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
            v0.1
          </p>
        </div>
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

