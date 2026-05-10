'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface ConfettiProps {
  active: boolean
}

interface Particle {
  id: number
  x: number
  color: string
  rotation: number
  duration: number
  delay: number
}

const EMPTY: Particle[] = []

function generateParticles(): Particle[] {
  const colors = ['#10b981', '#34d399', '#6ee7b7', '#fbbf24', '#f59e0b', '#6366f1']
  return Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
    duration: 1.5 + Math.random() * 1,
    delay: Math.random() * 0.3,
  }))
}

export default function Confetti({ active }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>(EMPTY)

  useEffect(() => {
    if (active) {
      setParticles(generateParticles())
    } else {
      setParticles(EMPTY)
    }
  }, [active])

  if (!active || particles.length === 0) return null

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
            y: typeof window !== 'undefined' ? window.innerHeight + 10 : 1000,
            rotate: p.rotation,
          }}
          transition={{
            duration: p.duration,
            ease: 'easeOut',
            delay: p.delay,
          }}
        />
      ))}
    </div>
  )
}
