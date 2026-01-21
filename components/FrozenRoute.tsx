'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'

export default function PageAnimatePresence({
  children,
}: {
  children: ReactNode
}) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25 }}
        style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
