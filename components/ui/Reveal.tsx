'use client'
import React, { PropsWithChildren } from 'react'
import { motion } from 'framer-motion'

interface Props extends PropsWithChildren {
  y?: number
  delay?: number
  once?: boolean
}

export default function Reveal({ children, y = 16, delay = 0.05, once = true }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  )
}
