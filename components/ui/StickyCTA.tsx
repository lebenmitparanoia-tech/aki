'use client'
import React from 'react'
import styles from './stickyCta.module.css'

export default function StickyCTA() {
  const onClick = () => {
    const el = document.querySelector('#beta') || document.querySelector('#roadmap')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  return (
    <div className={styles.wrap}>
      <button className={styles.btn} onClick={onClick}>
        Werde Testnutzer:in
      </button>
    </div>
  )
}
