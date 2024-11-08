'use client'

import { ReactNode } from 'react'
import PropTypes from 'prop-types'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import FrozenRoute from './FrozenRoute'

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
        <FrozenRoute>{children}</FrozenRoute>
      </motion.div>
    </AnimatePresence>
  )
}

// Add PropTypes for ESLint validation
PageAnimatePresence.propTypes = {
  children: PropTypes.node.isRequired,
}

export default PageAnimatePresence
