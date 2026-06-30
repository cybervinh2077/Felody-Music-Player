import React, { useState } from 'react'
import { usePlayerStore } from '../../store/playerStore'
import styles from './PlayerBar.module.css'

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

interface Props {
  onOpenNowPlaying: () => void
}

export default function PlayerBar({ onOpenNowPlaying }: Props): React.ReactElement {
  const {
    currentTrack, isPlaying, volume, progress, duration,
    shuffle, repeat,
    setIsPlaying, setVolume, toggleShuffle, cycleRepeat,
    nextTrack, prevTrack, setCurrentTrack, isFavorite, toggleFavorite
  } = usePlayerStore()

  const [seeking, setSeeking] = useState(false)
  const [seekVal, setSeekVal] = useState(0)

  const elapsed = (seeking ? seekVal : progress) * duration

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeeking(true)
    setSeekVal(Number(e.target.value))
  }

  const handleSeekCommit = (e: React.MouseEvent<HTMLInputElement>) => {
    const ratio = Number((e.target as HTMLInputElement).value)
    const audio = document.querySelector('audio') as HTMLAudioElement | null
    if (audio && audio.duration) audio.currentTime = ratio * audio.duration
    setSeeking(false)
  }

  const handlePrev = () => {
    const audio = document.querySelector('audio') as HTMLAudioElement | null
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0
      return
    }
    const track = prevTrack()
    if (track) setCurrentTrack(track)
  }

  const handleNext = () => {
    const track = nextTrack()
    if (track) setCurrentTrack(track)
  }

  const handleFavorite = async () => {
    if (!currentTrack) return
    const isFav = await window.api.toggleFavorite(currentTrack.id)
    toggleFavorite()
  }

  const repeatIcon = repeat === 'none' ? '↻' : repeat === 'all' ? '↻' : '↺¹'
  const repeatActive = repeat !== 'none'

  return (
    <div className={styles.playerBar}>
      {/* Track info */}
      <div className={styles.trackInfo} onClick={onOpenNowPlaying}>
        <div className={styles.artwork}>
          {currentTrack?.artworkPath
            ? <img src={`file:///${currentTrack.artworkPath.replace(/\\/g, '/')}`} alt="" />
            : <div className={styles.artworkPlaceholder}>🎵</div>
          }
        </div>
        <div className={styles.meta}>
          <div className={styles.trackTitle}>{currentTrack?.title || currentTrack?.fileName || '—'}</div>
          <div className={styles.trackArtist}>{currentTrack?.artist || 'Chưa có nghệ sĩ'}</div>
        </div>
        {currentTrack && (
          <button
            className={`${styles.iconBtn} ${isFavorite ? styles.favActive : ''}`}
            onClick={(e) => { e.stopPropagation(); handleFavorite() }}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
        )}
      </div>

      {/* Controls */}
      <div className={styles.center}>
        <div className={styles.controls}>
          <button
            className={`${styles.iconBtn} ${shuffle ? styles.active : ''}`}
            onClick={toggleShuffle}
            title="Shuffle"
          >⇄</button>
          <button className={styles.iconBtn} onClick={handlePrev} title="Trước">⏮</button>
          <button
            className={styles.playBtn}
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Dừng' : 'Phát'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button className={styles.iconBtn} onClick={handleNext} title="Tiếp">⏭</button>
          <button
            className={`${styles.iconBtn} ${repeatActive ? styles.active : ''}`}
            onClick={cycleRepeat}
            title="Lặp lại"
          >{repeatIcon}</button>
        </div>

        <div className={styles.progress}>
          <span className={styles.time}>{formatTime(elapsed)}</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={seeking ? seekVal : progress}
            onChange={handleSeekChange}
            onMouseUp={handleSeekCommit}
            className={styles.progressBar}
          />
          <span className={styles.time}>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume */}
      <div className={styles.right}>
        <span className={styles.volumeIcon}>{volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className={styles.volumeBar}
        />
      </div>
    </div>
  )
}
