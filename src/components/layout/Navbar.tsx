'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const navItems = [
  { href: '/', label: 'Study Desk' },
  { href: '/learn', label: 'Readings' },
  { href: '/plans', label: 'Plans' },
  { href: '/settings', label: 'Settings' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden sm:flex sm:flex-col sm:w-16 md:w-20 lg:w-24 sm:h-full sm:shrink-0 sm:items-center sm:pt-8 sm:gap-8" style={{ backgroundColor: 'var(--sidebar-bg)' }}>
        <Link href="/" className="font-serif text-lg font-semibold tracking-tight text-[var(--text-main)]">
          v<span className="text-[var(--accent)]">.</span>w
        </Link>
        <nav className="flex flex-col items-center gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            return (
              <Link key={item.href} href={item.href} className="relative flex flex-col items-center gap-0.5 px-2 py-2">
                <span className={`transition-colors ${isActive ? 'text-sm font-bold text-[var(--accent)]' : 'text-xs text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>
                  {item.label === 'Study Desk' ? 'Desk' : item.label}
                </span>
                {isActive && (
                  <motion.span layoutId="nav-underline" className="h-0.5 w-4 rounded-full bg-[var(--accent)]" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                )}
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
                {item.label === 'Study Desk' ? 'Desk' : item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
