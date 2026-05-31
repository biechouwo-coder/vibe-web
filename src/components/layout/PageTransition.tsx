'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

const FLIP_PAGES = 3

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [content, setContent] = useState(children)
  const [state, setState] = useState<'idle' | 'flipping'>('idle')
  const prevPath = useRef(pathname)

  useEffect(() => {
    if (pathname !== prevPath.current) {
      prevPath.current = pathname
      setState('flipping')

      const flipTime = 80 + FLIP_PAGES * 70
      setTimeout(() => {
        setContent(children)
        setTimeout(() => setState('idle'), 40)
      }, flipTime)
    } else {
      setContent(children)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <>
      {/* Page content — hidden during flip */}
      <div style={{ display: state === 'flipping' ? 'none' : '' }}>
        {content}
      </div>

      {/* Page-flip overlay */}
      <AnimatePresence>
        {state === 'flipping' && (
          <motion.div
            className="fixed inset-0 z-50"
            style={{ perspective: '1200px', backgroundColor: 'var(--paper, #faf8f3)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            {Array.from({ length: FLIP_PAGES }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-y-0 right-0"
                style={{
                  width: `${78 - i * 3}%`,
                  backgroundColor: 'var(--surface, #ffffff)',
                  transformOrigin: '0 50%',
                  zIndex: 20 - i,
                  boxShadow: '-1px 0 3px rgba(26,24,23,0.07)',
                  borderRight: '1px solid var(--border, #e8e4dd)',
                }}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: -180 }}
                exit={{ rotateY: -180 }}
                transition={{
                  duration: 0.28,
                  delay: i * 0.06,
                  ease: [0.4, 0, 0.2, 1],
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
