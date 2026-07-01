import React, { useState } from 'react'
import {
  Play, Pause, SkipBack, SkipForward,
  Shuffle, Repeat, Repeat1, Heart, Volume1, Volume2, VolumeX
} from 'lucide-react'
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
    if (audio && audio.currentTime > 3) { audio.currentTime = 0; return }
    const track = prevTrack()
    if (track) setCurrentTrack(track)
  }

  const handleNext = () => {
    const track = nextTrack()
    if (track) setCurrentTrack(track)
  }

  const handleFavorite = async () => {
    if (!currentTrack) return
    await window.api.toggleFavorite(currentTrack.id)
    toggleFavorite()
  }

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2

  const artworkSrc = currentTrack?.artworkPath
    ? 'file:///' + currentTrack.artworkPath.replace(/\\/g, '/').replace(/ /g, '%20')
    : null

  return (
    <div className={styles.playerBar}>
      {/* Ambient background */}
      {artworkSrc && (
        <div className={styles.bg}>
          <img key={artworkSrc} className={styles.bgImg} src={artworkSrc} alt="" />
          <div className={styles.bgOverlay} />
        </div>
      )}

      {/* Track info */}
      <div className={styles.trackInfo} onClick={onOpenNowPlaying}>
        <div className={styles.artwork}>
          {artworkSrc
            ? <img src={artworkSrc} alt="" />
            : (
              <div className={styles.artworkPlaceholder}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 18V5l12-2v13"/>
                  <circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                </svg>
              </div>
            )
          }
        </div>
        <div className={styles.meta}>
          <div className={styles.trackTitle}>{currentTrack?.title || currentTrack?.fileName || '—'}</div>
          <div className={styles.trackArtist}>{currentTrack?.artist || 'Chưa có nghệ sĩ'}</div>
        </div>
        {currentTrack && (
          <button
            className={`${styles.favBtn} ${isFavorite ? styles.favActive : ''}`}
            onClick={(e) => { e.stopPropagation(); handleFavorite() }}
          >
            <Heart size={14} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>

      {/* Controls */}
      <div className={styles.center}>
        <div className={styles.controls}>
          <button
            className={`${styles.iconBtn} ${shuffle ? styles.active : ''}`}
            onClick={toggleShuffle}
            title="Trộn bài"
          >
            <Shuffle size={14} />
          </button>
          <button className={styles.iconBtn} onClick={handlePrev} title="Trước">
            <SkipBack size={16} />
          </button>
          <button
            className={styles.playBtn}
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Dừng' : 'Phát'}
          >
            {isPlaying
              ? <Pause size={15} fill="currentColor" />
              : <Play size={15} fill="currentColor" style={{ marginLeft: 1 }} />
            }
          </button>
          <button className={styles.iconBtn} onClick={handleNext} title="Tiếp">
            <SkipForward size={16} />
          </button>
          <button
            className={`${styles.iconBtn} ${repeat !== 'none' ? styles.active : ''}`}
            onClick={cycleRepeat}
            title="Lặp lại"
          >
            {repeat === 'one' ? <Repeat1 size={14} /> : <Repeat size={14} />}
          </button>
        </div>

        <div className={styles.progress}>
          <span className={styles.time}>{formatTime(elapsed)}</span>
          <input
            type="range" min={0} max={1} step={0.001}
            value={seeking ? seekVal : progress}
            onChange={handleSeekChange}
            onMouseUp={handleSeekCommit}
            className={styles.progressBar}
            style={{ '--fill': `${(seeking ? seekVal : progress) * 100}%` } as React.CSSProperties}
          />
          <span className={styles.time}>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume */}
      <div className={styles.right}>
        <span className={styles.volBtn}><VolumeIcon size={14} /></span>
        <input
          type="range" min={0} max={1} step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className={styles.volumeBar}
          style={{ '--fill': `${volume * 100}%` } as React.CSSProperties}
        />
      </div>
    </div>
  )
}
