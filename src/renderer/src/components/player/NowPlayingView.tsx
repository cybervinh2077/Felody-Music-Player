import React from 'react'
import {
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1,
  Heart, Volume1, Volume2, VolumeX, FolderOpen
} from 'lucide-react'
import { usePlayerStore } from '../../store/playerStore'
import styles from './NowPlayingView.module.css'

function fmt(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function NowPlayingView(): React.ReactElement {
  const {
    currentTrack, isPlaying, progress, duration, volume, shuffle, repeat, isFavorite,
    setIsPlaying, setVolume, toggleShuffle, cycleRepeat, nextTrack, prevTrack, setCurrentTrack, toggleFavorite
  } = usePlayerStore()

  const elapsed = progress * duration

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ratio = Number(e.target.value)
    const audio = document.querySelector('audio') as HTMLAudioElement | null
    if (audio && audio.duration) audio.currentTime = ratio * audio.duration
  }

  const handlePrev = () => {
    const audio = document.querySelector('audio') as HTMLAudioElement | null
    if (audio && audio.currentTime > 3) { audio.currentTime = 0; return }
    const t = prevTrack()
    if (t) setCurrentTrack(t)
  }

  const handleNext = () => {
    const t = nextTrack()
    if (t) setCurrentTrack(t)
  }

  const handleFavorite = async () => {
    if (!currentTrack) return
    await window.api.toggleFavorite(currentTrack.id)
    toggleFavorite()
  }

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2

  if (!currentTrack) {
    return (
      <div className={styles.empty}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" style={{ opacity: 0.15 }}>
          <path d="M9 18V5l12-2v13"/>
          <circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
        </svg>
        <p>Chưa có bài hát nào đang phát</p>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
          Chọn bài hát từ thư viện để bắt đầu
        </p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.artwork}>
        {currentTrack.artworkPath
          ? <img src={'file:///' + currentTrack.artworkPath!.replace(/\\/g, '/').replace(/ /g, '%20')} alt={currentTrack.title || ''} />
          : (
            <div className={styles.artworkPlaceholder}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
                <path d="M9 18V5l12-2v13"/>
                <circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
              </svg>
            </div>
          )
        }
      </div>

      <div className={styles.info}>
        <div className={styles.trackTitle}>{currentTrack.title || currentTrack.fileName}</div>
        <div className={styles.trackArtist}>{currentTrack.artist || 'Không rõ nghệ sĩ'}</div>
        <div className={styles.trackAlbum}>{currentTrack.album || ''}</div>
      </div>

      <div className={styles.progress}>
        <input
          type="range" min={0} max={1} step={0.001}
          value={progress}
          onChange={handleSeek}
          className={styles.progressBar}
          style={{ '--fill': `${progress * 100}%` } as React.CSSProperties}
        />
        <div className={styles.times}>
          <span>{fmt(elapsed)}</span>
          <span>{fmt(duration)}</span>
        </div>
      </div>

      <div className={styles.controls}>
        <button
          className={`${styles.iconBtn} ${shuffle ? styles.active : ''}`}
          onClick={toggleShuffle} title="Shuffle"
        ><Shuffle size={16} /></button>
        <button className={styles.iconBtn} onClick={handlePrev}><SkipBack size={20} /></button>
        <button className={styles.playBtn} onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying
            ? <Pause size={22} fill="currentColor" />
            : <Play size={22} fill="currentColor" style={{ marginLeft: 2 }} />
          }
        </button>
        <button className={styles.iconBtn} onClick={handleNext}><SkipForward size={20} /></button>
        <button
          className={`${styles.iconBtn} ${repeat !== 'none' ? styles.active : ''}`}
          onClick={cycleRepeat}
        >{repeat === 'one' ? <Repeat1 size={16} /> : <Repeat size={16} />}</button>
      </div>

      <div className={styles.extra}>
        <button
          className={`${styles.iconBtn} ${isFavorite ? styles.fav : ''}`}
          onClick={handleFavorite}
        ><Heart size={15} fill={isFavorite ? 'currentColor' : 'none'} /></button>

        <div className={styles.volume}>
          <VolumeIcon size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            type="range" min={0} max={1} step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className={styles.volumeBar}
            style={{ '--fill': `${volume * 100}%` } as React.CSSProperties}
          />
        </div>

        <button
          className={styles.iconBtn}
          onClick={() => window.api.openFolder(currentTrack.path)}
          title="Mở thư mục chứa file"
        ><FolderOpen size={15} /></button>
      </div>

      {currentTrack.album && (
        <div className={styles.metadata}>
          <span>{currentTrack.format}</span>
          {currentTrack.bitrate && <span>{currentTrack.bitrate} kbps</span>}
          {currentTrack.sampleRate && <span>{currentTrack.sampleRate / 1000} kHz</span>}
        </div>
      )}
    </div>
  )
}
