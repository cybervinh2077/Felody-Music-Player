import React from 'react'
import { SetupData } from './SetupWizard'
import styles from './Step.module.css'

interface Props {
  data: SetupData
  onChange: (partial: Partial<SetupData>) => void
  onNext: () => void
  onBack: () => void
}

export default function SourceStep({ data, onChange, onNext, onBack }: Props): React.ReactElement {
  const addFolders = async () => {
    const paths = await window.api.selectDirectory()
    if (!paths) return
    const newFolders = [...new Set([...data.folders, ...paths])]
    onChange({ folders: newFolders })
  }

  const removeFolder = (path: string) => {
    onChange({ folders: data.folders.filter((f) => f !== path) })
  }

  return (
    <div className={styles.stepCard}>
      <h2 className={styles.stepTitle}>Chọn nguồn nhạc</h2>
      <p className={styles.stepSubtitle}>
        Chọn các thư mục chứa file nhạc của bạn. Felody sẽ tự động quét và index toàn bộ file âm thanh.
      </p>

      <div className={styles.folderList}>
        {data.folders.length === 0 && (
          <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
            Chưa có thư mục nào được chọn
          </div>
        )}
        {data.folders.map((f) => (
          <div key={f} className={styles.folderItem}>
            <span style={{ fontSize: 16 }}>📁</span>
            <span className={styles.folderPath}>{f}</span>
            <button className={styles.folderRemove} onClick={() => removeFolder(f)}>✕</button>
          </div>
        ))}
      </div>

      <button className={styles.addFolderBtn} onClick={addFolders}>
        <span>＋</span> Thêm thư mục nhạc
      </button>

      <div className={styles.toggleRow} style={{ marginTop: 20 }}>
        <div>
          <div className={styles.toggleLabel}>Tự động quét khi thư mục thay đổi</div>
          <div className={styles.toggleDesc}>Phát hiện file mới hoặc bị xóa tự động</div>
        </div>
        <label className={styles.toggle}>
          <input type="checkbox" checked={data.autoScan} onChange={(e) => onChange({ autoScan: e.target.checked })} />
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
