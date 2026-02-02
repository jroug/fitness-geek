'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'

interface PageAnimatePresenceProps {
  children: ReactNode
}

const PageAnimatePresence: React.FC<PageAnimatePresenceProps> = ({ children }) => {
  const pathname = usePathname()

  const firstLoadVariants = {
    initial: { opacity: 0 },
    enter: { opacity: 1 },
    exit: { opacity: 0 },
  }
  const pageTransition = {
    duration: 0.6,
    ease: "easeInOut",
  }

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={pathname}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={firstLoadVariants}
        transition={pageTransition}
        className="outer-motion-div"
      >
       {children}
      </motion.div>
    </AnimatePresence>
  )
}

 

export default PageAnimatePresence
