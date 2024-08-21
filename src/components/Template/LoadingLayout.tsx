import { motion } from 'framer-motion'

import { LayoutProps } from '@/types/types'

export function LoadingLayout({ children }: LayoutProps) {
  return (
    <motion.div
      initial={{ x: 150, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 150, opacity: 0 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  )
}
