import React, { useState, useEffect } from 'react'
import { SetupData } from './SetupWizard'
import { ScanProgress } from '../../../../shared/types'
import styles from './Step.module.css'

interface Props {
  data: SetupData
  onFinish: () => Promise<void>
  onBack: () => void
}

export default function SummaryStep({ data, onFinish, onBack }: Props): React.ReactElement {
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState<ScanProgress | null>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!scanning) return
    const unsub = window.api.onScanProgress((p) => {
      setProgress(p)
      if (p.isComplete) setDone(true)
    })
    return unsub
  }, [scanning])

  const handleFinish = async () => {
    setScanning(true)
    await onFinish()
  }

  const themeLabel = { dark: 'Tối', light: 'Sáng', system: 'Theo hệ thống' }[data.theme]
  const viewLabel = data.defaultView === 'library' ? 'Thư viện' : 'Now Playing'

  if (scanning && progress) {
    return (
      <div className={styles.stepCard}>
        <h2 className={styles.stepTitle}>{done ? 'Hoàn tất!' : 'Đang quét thư viện...'}</h2>
        <p className={styles.stepSubtitle}>
          {done
            ? `Tìm thấy ${progress.valid} bài hát hợp lệ.`
            : `Đang đọc file nhạc từ ${data.folders.length} thư mục.`}
        </p>

        <div style={{ margin: '20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
            <span>{progress.scanned} / {progress.total || '?'} file</span>
            <span>{progress.valid} hợp lệ · {progress.errors} lỗi</span>
          </div>
          <div style={{ background: 'var(--bg-elevated)', borderRadius: 4, height: 4, overflow: 'hidden' }}>
            <div
              style={{
                width: progress.total ? `${(progress.scanned / progress.total) * 100}%` : '0%',
                height: '100%',
                background: 'var(--accent)',
                transition: 'width 0.2s'
              }}
            />
          </div>
          {!done && (
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {progress.currentFile}
            </div>
          )}
        </div>

        {done && (
          <button className={styles.btnPrimary} style={{ width: '100%' }} onClick={() => window.location.reload()}>
            Vào Felody
          </button>
        )}
        {!done && (
          <button className={styles.btnGhost} onClick={() => window.location.reload()}>
            Vào app (quét tiếp nền)
          </button>
        )}
      </div>
    )
  }

  return (
    <div className={styles.stepCard}>
      <h2 className={styles.stepTitle}>Tóm tắt thiết lập</h2>
      <p className={styles.stepSubtitle}>Kiểm tra lại và bắt đầu xây dựng thư viện nhạc.</p>

      <div className={styles.summaryList}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryKey}>Thư mục nhạc</span>
          <span className={styles.summaryVal}>
            {data.folders.length === 0
              ? <em style={{ color: 'var(--text-muted)' }}>Chưa chọn</em>
              : `${data.folders.length} thư mục`}
          </span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryKey}>Chế độ quét</span>
          <span className={styles.summaryVal}>{data.scanMode === 'full' ? 'Đầy đủ' : 'Nhanh'}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryKey}>Bỏ qua trùng lặp</span>
          <span className={styles.summaryVal}>{data.skipDuplicates ? 'Có' : 'Không'}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryKey}>Ghi nhớ queue</span>
          <span className={styles.summaryVal}>{data.rememberQueue ? 'Có' : 'Không'}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryKey}>Gapless playback</span>
          <span className={styles.summaryVal}>{data.gaplessPlayback ? 'Bật' : 'Tắt'}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryKey}>Theme</span>
          <span className={styles.summaryVal}>{themeLabel}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryKey}>Màn hình mặc định</span>
          <span className={styles.summaryVal}>{viewLabel}</span>
        </div>
      </div>

      <div className={styles.stepNav}>
        <button className={styles.btnSecondary} onClick={onBack}>Quay lại</button>
        <button className={styles.btnPrimary} onClick={handleFinish}>
          Bắt đầu xây dựng thư viện
        </button>
      </div>
    </div>
  )
}
