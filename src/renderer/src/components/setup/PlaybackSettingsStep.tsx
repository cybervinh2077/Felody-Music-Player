import React from 'react'
import { SetupData } from './SetupWizard'
import styles from './Step.module.css'

interface Props {
  data: SetupData
  onChange: (partial: Partial<SetupData>) => void
  onNext: () => void
  onBack: () => void
}

const toggles: { key: keyof SetupData; label: string; desc: string }[] = [
  { key: 'resumeLastSession', label: 'Tiếp tục phát khi mở lại app', desc: 'Tự phát bài hát cuối cùng khi khởi động' },
  { key: 'rememberQueue', label: 'Ghi nhớ queue cuối cùng', desc: 'Giữ nguyên danh sách phát khi đóng app' },
  { key: 'rememberPosition', label: 'Ghi nhớ vị trí phát cuối', desc: 'Hữu ích với file dài như mix, audiobook' },
  { key: 'gaplessPlayback', label: 'Gapless playback', desc: 'Phát liền mạch không có khoảng ngắt giữa các bài' },
  { key: 'crossfadeEnabled', label: 'Crossfade giữa bài hát', desc: 'Chuyển bài mượt mà với hiệu ứng fade' }
]

export default function PlaybackSettingsStep({ data, onChange, onNext, onBack }: Props): React.ReactElement {
  return (
    <div className={styles.stepCard}>
      <h2 className={styles.stepTitle}>Cài đặt phát nhạc</h2>
      <p className={styles.stepSubtitle}>Tùy chỉnh trải nghiệm nghe nhạc theo sở thích của bạn.</p>

      {toggles.map((t) => (
        <div key={t.key} className={styles.toggleRow}>
          <div>
            <div className={styles.toggleLabel}>{t.label}</div>
            <div className={styles.toggleDesc}>{t.desc}</div>
          </div>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={Boolean(data[t.key])}
              onChange={(e) => onChange({ [t.key]: e.target.checked })}
            />
            <span className={styles.toggleSlider} />
          </label>
        </div>
      ))}

      <div className={styles.stepNav}>
        <button className={styles.btnSecondary} onClick={onBack}>Quay lại</button>
        <button className={styles.btnPrimary} onClick={onNext}>Tiếp theo</button>
      </div>
    </div>
  )
}
