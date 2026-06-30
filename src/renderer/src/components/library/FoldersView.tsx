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
              <span style={{ fontSize: 24 }}>📁</span>
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
