'use client'

import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.12 }}
    >
      {children}
    </motion.div>
  )
}
