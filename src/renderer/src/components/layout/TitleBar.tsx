import React from 'react'
import styles from './TitleBar.module.css'

export default function TitleBar(): React.ReactElement {
  return (
    <div className={`${styles.titlebar} drag-region`}>
      <div className={styles.title}>Felody</div>
      <div className={`${styles.controls} no-drag`}>
        <button className={styles.btn} onClick={() => (window as any).api?.windowMinimize?.()}>─</button>
        <button className={styles.btn} onClick={() => (window as any).api?.windowMaximize?.()}>□</button>
        <button className={`${styles.btn} ${styles.close}`} onClick={() => (window as any).api?.windowClose?.()}>✕</button>
      </div>
    </div>
  )
}
