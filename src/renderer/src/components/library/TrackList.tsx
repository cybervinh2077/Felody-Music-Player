import React from 'react'
import { Track } from '../../../../shared/types'
import { usePlayerStore } from '../../store/playerStore'
import styles from './TrackList.module.css'

function fmt(ms: number): string {
  const s = Math.floor(ms / 1000)
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`
}

interface Props {
  tracks: Track[]
  onPlay: (track: Track, index: number) => void
}

export default function TrackList({ tracks, onPlay }: Props): React.ReactElement {
  const currentTrack = usePlayerStore((s) => s.currentTrack)

  if (tracks.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>🎵</div>
        <p>Không có bài hát nào</p>
      </div>
    )
  }

  return (
    <div className={styles.list}>
      <div className={styles.header}>
        <span className={styles.colNum}>#</span>
        <span className={styles.colTitle}>Tiêu đề</span>
        <span className={styles.colAlbum}>Album</span>
        <span className={styles.colDuration}>Thời lượng</span>
      </div>
      <div className={styles.tracks}>
        {tracks.map((track, i) => {
          const isActive = currentTrack?.id === track.id
          return (
            <div
              key={track.id}
              className={`${styles.row} ${isActive ? styles.active : ''}`}
              onDoubleClick={() => onPlay(track, i)}
            >
              <span className={styles.colNum}>
                {isActive ? <span className={styles.playing}>▶</span> : <span className={styles.num}>{i + 1}</span>}
              </span>
              <div className={styles.colTitle}>
                <div className={styles.artwork}>
                  {track.artworkPath
                    ? <img src={`file:///${track.artworkPath.replace(/\\/g, '/')}`} alt="" />
                    : <span>🎵</span>
                  }
                </div>
                <div className={styles.trackMeta}>
                  <div className={styles.trackName}>{track.title || track.fileName}</div>
                  <div className={styles.trackArtist}>{track.artist || '—'}</div>
                </div>
              </div>
              <span className={styles.colAlbum}>{track.album || '—'}</span>
              <span className={styles.colDuration}>{fmt(track.durationMs)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
