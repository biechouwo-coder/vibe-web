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
    <nav className="sticky top-0 z-50 border-b border-stone-200 bg-stone-50/90 backdrop-blur-sm dark:border-stone-800 dark:bg-stone-950/90">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="font-serif text-lg font-semibold tracking-tight text-stone-900 dark:text-stone-100">
          vibe<span className="text-emerald-700 dark:text-emerald-500">.</span>web
        </Link>
        <div className="flex items-center gap-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-1.5 text-sm transition-colors ${
                  isActive
                    ? 'font-medium text-stone-900 dark:text-stone-100'
                    : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[var(--academic-navy)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
