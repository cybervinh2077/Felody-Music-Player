import { useEffect, useRef } from 'react'
import { usePlayerStore } from '../../store/playerStore'

export default function AudioEngine(): null {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { currentTrack, isPlaying, volume, setIsPlaying, setProgress, setDuration, nextTrack, setCurrentTrack, repeat } = usePlayerStore()

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
    }
    const audio = audioRef.current

    const onTimeUpdate = () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration)
    }
    const onDurationChange = () => setDuration(audio.duration || 0)
    const onEnded = () => {
      if (repeat === 'one') {
        audio.currentTime = 0
        audio.play()
        return
      }
      const next = nextTrack()
      if (next) {
        setCurrentTrack(next)
      } else {
        setIsPlaying(false)
      }
    }
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('durationchange', onDurationChange)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('durationchange', onDurationChange)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [repeat])

  // Load new track
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return
    const src = `file:///${currentTrack.path.replace(/\\/g, '/')}`
    if (audio.src !== src) {
      audio.src = src
      audio.load()
    }
    if (isPlaying) {
      audio.play().catch(() => {})
    }
    window.api.incrementPlay(currentTrack.id)
  }, [currentTrack])

  // Play/pause
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }, [isPlaying])

  // Volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  return null
}

// Expose seek function via store subscription
export function seekTo(ratio: number): void {
  const audio = document.querySelector('audio') as HTMLAudioElement | null
  if (audio && audio.duration) {
    audio.currentTime = ratio * audio.duration
  }
}
