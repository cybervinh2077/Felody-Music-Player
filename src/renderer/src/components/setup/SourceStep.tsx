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
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink: 0, opacity: 0.4 }}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            <span className={styles.folderPath}>{f}</span>
            <button className={styles.folderRemove} onClick={() => removeFolder(f)}>
              <svg width="10" height="10" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
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
