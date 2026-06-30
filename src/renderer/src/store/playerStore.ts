import { create } from 'zustand'
import { Track } from '../../../shared/types'

interface PlayerState {
  currentTrack: Track | null
  queue: Track[]
  queueIndex: number
  isPlaying: boolean
  volume: number
  progress: number       // 0-1
  duration: number       // seconds
  shuffle: boolean
  repeat: 'none' | 'one' | 'all'
  isFavorite: boolean

  setCurrentTrack: (track: Track, queue?: Track[], index?: number) => void
  setIsPlaying: (v: boolean) => void
  setVolume: (v: number) => void
  setProgress: (v: number) => void
  setDuration: (v: number) => void
  toggleShuffle: () => void
  cycleRepeat: () => void
  nextTrack: () => Track | null
  prevTrack: () => Track | null
  setQueue: (tracks: Track[], index?: number) => void
  toggleFavorite: () => void
  updateCurrentTrackFavorite: (isFav: boolean) => void
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  queue: [],
  queueIndex: 0,
  isPlaying: false,
  volume: 1,
  progress: 0,
  duration: 0,
  shuffle: false,
  repeat: 'none',
  isFavorite: false,

  setCurrentTrack: (track, queue, index = 0) => {
    set({
      currentTrack: track,
      queue: queue ?? get().queue,
      queueIndex: index,
      progress: 0,
      isFavorite: Boolean(track.isFavorite)
    })
  },

  setIsPlaying: (v) => set({ isPlaying: v }),
  setVolume: (v) => set({ volume: v }),
  setProgress: (v) => set({ progress: v }),
  setDuration: (v) => set({ duration: v }),

  toggleShuffle: () => set((s) => ({ shuffle: !s.shuffle })),

  cycleRepeat: () => set((s) => ({
    repeat: s.repeat === 'none' ? 'all' : s.repeat === 'all' ? 'one' : 'none'
  })),

  nextTrack: () => {
    const { queue, queueIndex, shuffle, repeat } = get()
    if (!queue.length) return null

    let next: number
    if (shuffle) {
      next = Math.floor(Math.random() * queue.length)
    } else {
      next = queueIndex + 1
      if (next >= queue.length) {
        if (repeat === 'all') next = 0
        else return null
      }
    }
    set({ queueIndex: next })
    return queue[next]
  },

  prevTrack: () => {
    const { queue, queueIndex } = get()
    if (!queue.length) return null
    const prev = Math.max(0, queueIndex - 1)
    set({ queueIndex: prev })
    return queue[prev]
  },

  setQueue: (tracks, index = 0) => set({ queue: tracks, queueIndex: index }),

  toggleFavorite: () => set((s) => ({ isFavorite: !s.isFavorite })),

  updateCurrentTrackFavorite: (isFav) => set({ isFavorite: isFav })
}))
