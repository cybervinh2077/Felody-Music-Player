import React from 'react'
import { SetupData } from './SetupWizard'
import styles from './Step.module.css'

interface Props {
  data: SetupData
  onChange: (partial: Partial<SetupData>) => void
  onNext: () => void
  onBack: () => void
}

export default function AppearanceStep({ data, onChange, onNext, onBack }: Props): React.ReactElement {
  return (
    <div className={styles.stepCard}>
      <h2 className={styles.stepTitle}>Giao diện</h2>
      <p className={styles.stepSubtitle}>Chọn theme và màn hình mặc định khi mở app.</p>

      <div className={styles.field}>
        <label className={styles.fieldLabel}>Theme</label>
        <div className={styles.themePicker}>
          {([
            { value: 'dark', icon: '🌙', label: 'Tối' },
            { value: 'light', icon: '☀️', label: 'Sáng' },
            { value: 'system', icon: '💻', label: 'Theo hệ thống' }
          ] as const).map((t) => (
            <div
              key={t.value}
              className={`${styles.themeCard} ${data.theme === t.value ? styles.selected : ''}`}
              onClick={() => onChange({ theme: t.value })}
            >
              <div className={styles.themeIcon}>{t.icon}</div>
              {t.label}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.field} style={{ marginTop: 20 }}>
        <label className={styles.fieldLabel}>Màn hình mặc định khi mở app</label>
        <div className={styles.radioGroup}>
          <label className={`${styles.radioOption} ${data.defaultView === 'library' ? styles.selected : ''}`}>
            <input type="radio" name="view" onChange={() => onChange({ defaultView: 'library' })} />
            <div>
              <div className={styles.radioTitle}>Thư viện</div>
              <div className={styles.radioDesc}>Hiển thị danh sách bài hát và thư viện ngay khi mở</div>
            </div>
          </label>
          <label className={`${styles.radioOption} ${data.defaultView === 'now-playing' ? styles.selected : ''}`}>
            <input type="radio" name="view" onChange={() => onChange({ defaultView: 'now-playing' })} />
            <div>
              <div className={styles.radioTitle}>Now Playing</div>
              <div className={styles.radioDesc}>Hiển thị màn hình phát nhạc khi mở</div>
            </div>
          </label>
        </div>
      </div>

      <div className={styles.stepNav}>
        <button className={styles.btnSecondary} onClick={onBack}>Quay lại</button>
        <button className={styles.btnPrimary} onClick={onNext}>Tiếp theo</button>
      </div>
    </div>
  )
}
