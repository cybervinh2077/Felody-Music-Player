import React from 'react'
import styles from './TitleBar.module.css'

export default function TitleBar(): React.ReactElement {
  return (
    <div className={`${styles.titlebar} drag-region`}>
      <div className={styles.title}>Felody</div>
      <div className={`${styles.controls} no-drag`}>
        <button className={styles.btn} onClick={() => (window as any).api?.windowMinimize?.()}>
          <svg width="10" height="1" viewBox="0 0 10 1" fill="currentColor"><rect width="10" height="1"/></svg>
        </button>
        <button className={styles.btn} onClick={() => (window as any).api?.windowMaximize?.()}>
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1"><rect x="0.5" y="0.5" width="8" height="8"/></svg>
        </button>
        <button className={`${styles.btn} ${styles.close}`} onClick={() => (window as any).api?.windowClose?.()}>
          <svg width="9" height="9" viewBox="0 0 9 9" stroke="currentColor" strokeWidth="1.2"><line x1="0" y1="0" x2="9" y2="9"/><line x1="9" y1="0" x2="0" y2="9"/></svg>
        </button>
      </div>
    </div>
  )
}
