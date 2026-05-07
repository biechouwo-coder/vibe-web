'use client'

import { motion } from 'framer-motion'

interface ConfettiProps {
  active: boolean
}

export default function Confetti({ active }: ConfettiProps) {
  if (!active) return null

  const colors = ['#10b981', '#34d399', '#6ee7b7', '#fbbf24', '#f59e0b', '#6366f1']
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
  }))

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute h-2 w-2 rounded-full"
          style={{ left: `${p.x}%`, top: '-10px', backgroundColor: p.color }}
          initial={{ opacity: 1, y: -10, rotate: 0 }}
          animate={{
            opacity: 0,
            y: window.innerHeight + 10,
            rotate: p.rotation,
          }}
          transition={{
            duration: 1.5 + Math.random() * 1,
            ease: 'easeOut',
            delay: Math.random() * 0.3,
          }}
        />
      ))}
    </div>
  )
}
