import React, { useEffect, useState } from 'react'
import { FolderSource, Track } from '../../../../shared/types'
import { usePlayerStore } from '../../store/playerStore'
import TrackList from './TrackList'
import styles from './View.module.css'

export default function FoldersView(): React.ReactElement {
  const [sources, setSources] = useState<FolderSource[]>([])
  const [selectedSource, setSelectedSource] = useState<FolderSource | null>(null)
  const [folderTracks, setFolderTracks] = useState<Track[]>([])
  const { setCurrentTrack, setIsPlaying } = usePlayerStore()

  useEffect(() => {
    window.api.getSources().then(setSources)
  }, [])

  const openFolder = async (source: FolderSource) => {
    setSelectedSource(source)
    const tracks = await window.api.getTracks()
    setFolderTracks(tracks.filter((t) => t.path.startsWith(source.path)))
  }

  const playTrack = (track: Track, index: number) => {
    setCurrentTrack(track, folderTracks, index)
    setIsPlaying(true)
  }

  if (selectedSource) {
    return (
      <div className={styles.view}>
        <div className={styles.header}>
          <button onClick={() => setSelectedSource(null)} style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            ← Tất cả thư mục
          </button>
          <h1 className={styles.title}>{selectedSource.displayName}</h1>
          <span className={styles.count}>{folderTracks.length} bài</span>
        </div>
        <TrackList tracks={folderTracks} onPlay={playTrack} />
      </div>
    )
  }

  return (
    <div className={styles.view}>
      <div className={styles.header}>
        <h1 className={styles.title}>Thư mục</h1>
        <span className={styles.count}>{sources.length} nguồn</span>
      </div>
      <div style={{ overflow: 'auto', flex: 1 }}>
        {sources.length === 0 ? (
          <div className={styles.loading}>Chưa có thư mục nhạc nào. Thêm trong Cài đặt.</div>
        ) : (
          sources.map((s) => (
            <div
              key={s.id}
              onClick={() => openFolder(s)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px', borderRadius: 8, cursor: 'pointer',
                transition: 'background 0.1s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink: 0, opacity: 0.4 }}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              <div>
                <div style={{ fontWeight: 500 }}>{s.displayName}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.path}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
