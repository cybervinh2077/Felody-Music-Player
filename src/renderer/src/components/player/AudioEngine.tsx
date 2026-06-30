import React, { useEffect, useRef } from 'react'
import { usePlayerStore } from '../../store/playerStore'

export default function AudioEngine(): React.ReactElement {
  const audioRef = useRef<HTMLAudioElement>(null)
  const {
    currentTrack, isPlaying, volume, repeat,
    setIsPlaying, setProgress, setDuration, nextTrack, setCurrentTrack
  } = usePlayerStore()

  // Event listeners — re-run when repeat mode changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

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
      if (next) setCurrentTrack(next)
      else setIsPlaying(false)
    }
    const onPlay  = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)

    audio.addEventListener('timeupdate',    onTimeUpdate)
    audio.addEventListener('durationchange', onDurationChange)
    audio.addEventListener('ended',         onEnded)
    audio.addEventListener('play',          onPlay)
    audio.addEventListener('pause',         onPause)

    return () => {
      audio.removeEventListener('timeupdate',    onTimeUpdate)
      audio.removeEventListener('durationchange', onDurationChange)
      audio.removeEventListener('ended',         onEnded)
      audio.removeEventListener('play',          onPlay)
      audio.removeEventListener('pause',         onPause)
    }
  }, [repeat])

  // Load new track
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return
    const src = 'file:///' + currentTrack.path.replace(/\\/g, '/').replace(/ /g, '%20')
    if (audio.src !== src) {
      audio.src = src
      audio.load()
    }
    if (isPlaying) audio.play().catch(() => {})
    window.api.incrementPlay(currentTrack.id)
  }, [currentTrack])

  // Play / pause
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) audio.play().catch(() => {})
    else audio.pause()
  }, [isPlaying])

  // Volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  // Render a real <audio> in the DOM so document.querySelector('audio') works for seeking
  return <audio ref={audioRef} style={{ display: 'none' }} />
}
