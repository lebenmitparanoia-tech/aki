import React, { PropsWithChildren } from 'react'
import clsx from 'clsx'
import styles from './sections.module.css'

type Variant = 'plain' | 'alt' | 'dark' | 'gradientA' | 'gradientB'

interface Props extends PropsWithChildren {
  id?: string
  variant?: Variant
  className?: string
  container?: boolean
  as?: keyof JSX.IntrinsicElements
}

export default function Section({
  id,
  variant = 'plain',
  className,
  container = TrueAsBoolean(),
  as: Tag = 'section',
  children,
}: Props) {
  return (
    <Tag id={id} className={clsx(styles.section, styles[variant], className)}>
      <div className={clsx(container && styles.container)}>{children}</div>
    </Tag>
  )
}

// Tiny helper to keep default container=true without TS complaining in some configs
function TrueAsBoolean(){ return true as boolean }
