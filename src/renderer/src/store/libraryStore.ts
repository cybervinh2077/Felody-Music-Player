import { create } from 'zustand'
import { Track, Album, Artist, Playlist, LibraryStats } from '../../../shared/types'

interface LibraryState {
  tracks: Track[]
  albums: Album[]
  artists: Artist[]
  playlists: Playlist[]
  stats: LibraryStats | null
  isLoading: boolean

  loadTracks: () => Promise<void>
  loadAlbums: () => Promise<void>
  loadArtists: () => Promise<void>
  loadPlaylists: () => Promise<void>
  loadStats: () => Promise<void>
  loadAll: () => Promise<void>

  createPlaylist: (name: string) => Promise<void>
  deletePlaylist: (id: number) => Promise<void>
  updateTrackFavorite: (id: number, isFav: boolean) => void
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  tracks: [],
  albums: [],
  artists: [],
  playlists: [],
  stats: null,
  isLoading: false,

  loadTracks: async () => {
    const tracks = await window.api.getTracks()
    set({ tracks })
  },

  loadAlbums: async () => {
    const albums = await window.api.getAlbums()
    set({ albums })
  },

  loadArtists: async () => {
    const artists = await window.api.getArtists()
    set({ artists })
  },

  loadPlaylists: async () => {
    const playlists = await window.api.getPlaylists()
    set({ playlists })
  },

  loadStats: async () => {
    const stats = await window.api.getStats()
    set({ stats })
  },

  loadAll: async () => {
    set({ isLoading: true })
    await Promise.all([
      get().loadTracks(),
      get().loadAlbums(),
      get().loadArtists(),
      get().loadPlaylists(),
      get().loadStats()
    ])
    set({ isLoading: false })
  },

  createPlaylist: async (name) => {
    await window.api.createPlaylist(name)
    await get().loadPlaylists()
  },

  deletePlaylist: async (id) => {
    await window.api.deletePlaylist(id)
    set((s) => ({ playlists: s.playlists.filter((p) => p.id !== id) }))
  },

  updateTrackFavorite: (id, isFav) => {
    set((s) => ({
      tracks: s.tracks.map((t) => t.id === id ? { ...t, isFavorite: isFav ? 1 : 0 } : t)
    }))
  }
}))
