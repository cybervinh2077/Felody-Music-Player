export interface Track {
  id: number
  path: string
  fileName: string
  format: string
  durationMs: number
  bitrate: number | null
  sampleRate: number | null
  channels: number | null
  title: string | null
  artist: string | null
  album: string | null
  albumArtist: string | null
  genre: string | null
  year: number | null
  trackNumber: number | null
  discNumber: number | null
  artworkPath: string | null
  lyricsPath: string | null
  dateAdded: string
  lastPlayedAt: string | null
  playCount: number
  isFavorite: number
  hash: string | null
  scanStatus: 'ok' | 'error' | 'missing'
}

export interface FolderSource {
  id: number
  path: string
  displayName: string
  isEnabled: number
  watchForChanges: number
  lastScanAt: string | null
}

export interface Playlist {
  id: number
  name: string
  createdAt: string
  updatedAt: string
  coverArtPath: string | null
  trackCount?: number
}

export interface PlaylistItem {
  id: number
  playlistId: number
  trackId: number
  position: number
  track?: Track
}

export interface PlaybackSession {
  id: number
  currentTrackId: number | null
  currentPositionMs: number
  repeatMode: 'none' | 'one' | 'all'
  shuffleEnabled: number
  volume: number
  updatedAt: string
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  defaultView: 'library' | 'now-playing'
  resumeLastSession: boolean
  rememberQueue: boolean
  rememberPosition: boolean
  autoPlayOnStart: boolean
  crossfadeEnabled: boolean
  crossfadeDuration: number
  gaplessPlayback: boolean
  eqEnabled: boolean
  eqPreset: string
  scanMode: 'quick' | 'full'
  skipDuplicates: boolean
  skipShortFiles: boolean
  shortFileDurationMs: number
  setupCompleted: boolean
}

export interface ScanProgress {
  total: number
  scanned: number
  valid: number
  errors: number
  currentFile: string
  isComplete: boolean
}

export interface Album {
  album: string
  albumArtist: string | null
  year: number | null
  artworkPath: string | null
  trackCount: number
}

export interface Artist {
  artist: string
  albumCount: number
  trackCount: number
}

export interface LibraryStats {
  totalTracks: number
  totalAlbums: number
  totalArtists: number
  totalDurationMs: number
}
