import React from 'react'
import styles from './Step.module.css'

interface Props {
  onStart: () => void
  onSkip: () => void
}

export default function WelcomeStep({ onStart, onSkip }: Props): React.ReactElement {
  return (
    <div className={styles.welcomePage}>
      <div className={styles.logo}>
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
          <rect width="72" height="72" rx="18" fill="#1db954" />
          <path d="M22 22L50 36L22 50V22Z" fill="#000" />
        </svg>
      </div>
      <h1 className={styles.welcomeTitle}>Chào mừng đến với Felody</h1>
      <p className={styles.welcomeDesc}>
        Trình phát nhạc local cho Windows — hỗ trợ MP3, FLAC, WAV và nhiều định dạng khác.
        Quản lý thư viện nhạc cá nhân của bạn mà không cần Internet.
      </p>
      <div className={styles.welcomeActions}>
        <button className={styles.btnPrimary} onClick={onStart}>
          Bắt đầu thiết lập
        </button>
        <button className={styles.btnGhost} onClick={onSkip}>
          Bỏ qua, vào app
        </button>
      </div>
    </div>
  )
}
