import React from 'react'
import { SetupData } from './SetupWizard'
import styles from './Step.module.css'

interface Props {
  data: SetupData
  onChange: (partial: Partial<SetupData>) => void
  onNext: () => void
  onBack: () => void
}

export default function ScanOptionsStep({ data, onChange, onNext, onBack }: Props): React.ReactElement {
  return (
    <div className={styles.stepCard}>
      <h2 className={styles.stepTitle}>Tùy chọn quét thư viện</h2>
      <p className={styles.stepSubtitle}>Chọn cách Felody đọc và lưu thông tin từ file nhạc.</p>

      <div className={styles.field}>
        <div className={styles.radioGroup}>
          <label className={`${styles.radioOption} ${data.scanMode === 'full' ? styles.selected : ''}`}>
            <input type="radio" name="scanMode" value="full" onChange={() => onChange({ scanMode: 'full' })} />
            <div>
              <div className={styles.radioTitle}>Quét đầy đủ</div>
              <div className={styles.radioDesc}>Đọc metadata, album art, bitrate, sample rate. Chậm hơn nhưng đầy đủ nhất.</div>
            </div>
          </label>
          <label className={`${styles.radioOption} ${data.scanMode === 'quick' ? styles.selected : ''}`}>
            <input type="radio" name="scanMode" value="quick" onChange={() => onChange({ scanMode: 'quick' })} />
            <div>
              <div className={styles.radioTitle}>Quét nhanh</div>
              <div className={styles.radioDesc}>Chỉ đọc tên file và metadata cơ bản. Nhanh hơn nhiều với thư viện lớn.</div>
            </div>
          </label>
        </div>
      </div>

      <div className={styles.toggleRow}>
        <div>
          <div className={styles.toggleLabel}>Bỏ qua file trùng lặp</div>
          <div className={styles.toggleDesc}>Bỏ qua file trùng đường dẫn hoặc hash</div>
        </div>
        <label className={styles.toggle}>
          <input type="checkbox" checked={data.skipDuplicates} onChange={(e) => onChange({ skipDuplicates: e.target.checked })} />
          <span className={styles.toggleSlider} />
        </label>
      </div>

      <div className={styles.toggleRow}>
        <div>
          <div className={styles.toggleLabel}>Bỏ qua file quá ngắn</div>
          <div className={styles.toggleDesc}>Bỏ qua file dưới 5 giây (thường là file hệ thống)</div>
        </div>
        <label className={styles.toggle}>
          <input type="checkbox" checked={data.skipShortFiles} onChange={(e) => onChange({ skipShortFiles: e.target.checked })} />
          <span className={styles.toggleSlider} />
        </label>
      </div>

      <div className={styles.stepNav}>
        <button className={styles.btnSecondary} onClick={onBack}>Quay lại</button>
        <button className={styles.btnPrimary} onClick={onNext}>Tiếp theo</button>
      </div>
    </div>
  )
}
