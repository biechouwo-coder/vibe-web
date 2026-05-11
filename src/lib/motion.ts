import { useReducedMotion } from 'framer-motion'

/**
 * Respect user's reduced-motion preference.
 * Returns empty variants when reduced motion is preferred.
 */
export function useSafeMotion() {
  const reduced = useReducedMotion()

  return {
    reduced,
    fadeUp: reduced
      ? { initial: {}, animate: {}, exit: {} }
      : {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 4 },
        },
    fadeIn: reduced
      ? { initial: {}, animate: {}, exit: {} }
      : {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        },
    slideX: (dir = 1) =>
      reduced
        ? { enter: {}, center: {}, exit: {} }
        : {
            enter: { opacity: 0, x: dir * 16 },
            center: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: dir * -16 },
          },
  }
}

/** Container variants for staggering children. */
export const staggerContainer = {
  initial: {},
  animate: { transition: { staggerChildren: 0.03 } },
}

/** Subtle fade-up for list items (used inside AnimatePresence or stagger). */
export const listItem = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
}
