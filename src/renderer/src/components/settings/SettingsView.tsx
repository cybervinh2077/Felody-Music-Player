import React, { useEffect, useState } from 'react'
import { FolderSource, ScanProgress } from '../../../../shared/types'
import { useSettingsStore } from '../../store/settingsStore'
import styles from './SettingsView.module.css'

interface Props {
  onReScan: () => void
}

export default function SettingsView({ onReScan }: Props): React.ReactElement {
  const { settings, update } = useSettingsStore()
  const [sources, setSources] = useState<FolderSource[]>([])
  const [progress, setProgress] = useState<ScanProgress | null>(null)
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    window.api.getSources().then(setSources)
  }, [])

  useEffect(() => {
    const unsub = window.api.onScanProgress((p) => {
      setProgress(p)
      if (p.isComplete) {
        setScanning(false)
        onReScan()
      }
    })
    return unsub
  }, [])

  const addFolder = async () => {
    const paths = await window.api.selectDirectory()
    if (!paths) return
    for (const p of paths) {
      const s = await window.api.addSource(p)
      setSources((prev) => [...prev.filter((x) => x.id !== s.id), s])
    }
  }

  const removeFolder = async (id: number) => {
    await window.api.removeSource(id)
    setSources((prev) => prev.filter((s) => s.id !== id))
  }

  const startScan = async () => {
    setScanning(true)
    setProgress(null)
    await window.api.startScan()
  }

  if (!settings) return <div />

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Cài đặt</h1>

      {/* Sources */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Nguồn nhạc</h2>
        <div className={styles.sourceList}>
          {sources.map((s) => (
            <div key={s.id} className={styles.sourceRow}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink: 0, opacity: 0.5 }}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 13 }}>{s.displayName}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.path}</div>
              </div>
              <button onClick={() => removeFolder(s.id)} className={styles.removeBtn}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
              </button>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button className={styles.btnOutline} onClick={addFolder}>+ Thêm thư mục</button>
          <button
            className={styles.btnPrimary}
            onClick={startScan}
            disabled={scanning}
          >
            {scanning ? 'Đang quét...' : '↺ Quét lại thư viện'}
          </button>
        </div>

        {scanning && progress && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
              {progress.scanned} / {progress.total || '?'} · {progress.valid} hợp lệ · {progress.errors} lỗi
            </div>
            <div style={{ background: 'var(--bg-elevated)', borderRadius: 4, height: 4 }}>
              <div style={{
                width: progress.total ? `${(progress.scanned / progress.total) * 100}%` : '0%',
                height: '100%', background: 'var(--accent)', borderRadius: 4, transition: 'width 0.2s'
              }} />
            </div>
          </div>
        )}
      </section>

      {/* Playback */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Phát nhạc</h2>
        {[
          { key: 'resumeLastSession' as const, label: 'Tiếp tục phát khi mở lại app' },
          { key: 'rememberQueue' as const, label: 'Ghi nhớ queue cuối' },
          { key: 'rememberPosition' as const, label: 'Ghi nhớ vị trí phát cuối' },
          { key: 'gaplessPlayback' as const, label: 'Gapless playback' },
          { key: 'crossfadeEnabled' as const, label: 'Crossfade giữa bài hát' },
        ].map((item) => (
          <div key={item.key} className={styles.toggleRow}>
            <span className={styles.toggleLabel}>{item.label}</span>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={Boolean(settings[item.key])}
                onChange={(e) => update({ [item.key]: e.target.checked })}
              />
              <span className={styles.toggleSlider} />
            </label>
          </div>
        ))}
      </section>

      {/* Appearance */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Giao diện</h2>
        <div className={styles.toggleRow}>
          <span className={styles.toggleLabel}>Theme</span>
          <select
            value={settings.theme}
            onChange={(e) => update({ theme: e.target.value as 'light' | 'dark' | 'system' })}
            className={styles.select}
          >
            <option value="dark">Tối</option>
            <option value="light">Sáng</option>
            <option value="system">Theo hệ thống</option>
          </select>
        </div>
      </section>

      {/* Scan */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Quét thư viện</h2>
        <div className={styles.toggleRow}>
          <span className={styles.toggleLabel}>Chế độ quét</span>
          <select
            value={settings.scanMode}
            onChange={(e) => update({ scanMode: e.target.value as 'quick' | 'full' })}
            className={styles.select}
          >
            <option value="full">Đầy đủ</option>
            <option value="quick">Nhanh</option>
          </select>
        </div>
        {[
          { key: 'skipDuplicates' as const, label: 'Bỏ qua file trùng lặp' },
          { key: 'skipShortFiles' as const, label: 'Bỏ qua file dưới 5 giây' },
        ].map((item) => (
          <div key={item.key} className={styles.toggleRow}>
            <span className={styles.toggleLabel}>{item.label}</span>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={Boolean(settings[item.key])}
                onChange={(e) => update({ [item.key]: e.target.checked })}
              />
              <span className={styles.toggleSlider} />
            </label>
          </div>
        ))}
      </section>
    </div>
  )
}
