import { contextBridge, ipcRenderer } from 'electron'
import { IPC } from '../shared/ipc-channels'
import { AppSettings, FolderSource, Track, Album, Artist, Playlist, PlaybackSession, ScanProgress, LibraryStats } from '../shared/types'

const api = {
  // Settings
  getSettings: (): Promise<AppSettings> => ipcRenderer.invoke(IPC.SETTINGS_GET),
  setSettings: (partial: Partial<AppSettings>): Promise<AppSettings> => ipcRenderer.invoke(IPC.SETTINGS_SET, partial),

  // Sources
  getSources: (): Promise<FolderSource[]> => ipcRenderer.invoke(IPC.SOURCES_LIST),
  addSource: (folderPath: string): Promise<FolderSource> => ipcRenderer.invoke(IPC.SOURCES_ADD, folderPath),
  removeSource: (id: number): Promise<void> => ipcRenderer.invoke(IPC.SOURCES_REMOVE, id),
  toggleSource: (id: number, enabled: boolean): Promise<void> => ipcRenderer.invoke(IPC.SOURCES_TOGGLE, id, enabled),
  selectDirectory: (): Promise<string[] | null> => ipcRenderer.invoke(IPC.SOURCES_SELECT_DIR),

  // Scanner
  startScan: (): Promise<boolean> => ipcRenderer.invoke(IPC.SCANNER_START),
  stopScan: (): Promise<boolean> => ipcRenderer.invoke(IPC.SCANNER_STOP),
  onScanProgress: (cb: (progress: ScanProgress) => void) => {
    const listener = (_: Electron.IpcRendererEvent, p: ScanProgress) => cb(p)
    ipcRenderer.on(IPC.SCANNER_PROGRESS, listener)
    return () => ipcRenderer.off(IPC.SCANNER_PROGRESS, listener)
  },

  // Library
  getTracks: (limit?: number, offset?: number): Promise<Track[]> => ipcRenderer.invoke(IPC.LIBRARY_GET_TRACKS, limit, offset),
  getAlbums: (): Promise<Album[]> => ipcRenderer.invoke(IPC.LIBRARY_GET_ALBUMS),
  getAlbumTracks: (album: string, albumArtist: string | null): Promise<Track[]> => ipcRenderer.invoke('library:get-album-tracks', album, albumArtist),
  getArtists: (): Promise<Artist[]> => ipcRenderer.invoke(IPC.LIBRARY_GET_ARTISTS),
  getArtistTracks: (artist: string): Promise<Track[]> => ipcRenderer.invoke('library:get-artist-tracks', artist),
  search: (query: string): Promise<Track[]> => ipcRenderer.invoke(IPC.LIBRARY_SEARCH, query),
  getStats: (): Promise<LibraryStats> => ipcRenderer.invoke(IPC.LIBRARY_GET_STATS),
  toggleFavorite: (id: number): Promise<boolean> => ipcRenderer.invoke(IPC.LIBRARY_TOGGLE_FAVORITE, id),
  incrementPlay: (id: number): Promise<void> => ipcRenderer.invoke(IPC.LIBRARY_INCREMENT_PLAY, id),
  getFavorites: (): Promise<Track[]> => ipcRenderer.invoke('library:get-favorites'),
  getRecentlyAdded: (limit?: number): Promise<Track[]> => ipcRenderer.invoke('library:get-recently-added', limit),
  getMostPlayed: (limit?: number): Promise<Track[]> => ipcRenderer.invoke('library:get-most-played', limit),
  getRecentlyPlayed: (limit?: number): Promise<Track[]> => ipcRenderer.invoke('library:get-recently-played', limit),

  // Playlists
  getPlaylists: (): Promise<Playlist[]> => ipcRenderer.invoke(IPC.PLAYLIST_LIST),
  createPlaylist: (name: string): Promise<Playlist> => ipcRenderer.invoke(IPC.PLAYLIST_CREATE, name),
  deletePlaylist: (id: number): Promise<void> => ipcRenderer.invoke(IPC.PLAYLIST_DELETE, id),
  renamePlaylist: (id: number, name: string): Promise<void> => ipcRenderer.invoke(IPC.PLAYLIST_RENAME, id, name),
  getPlaylistTracks: (playlistId: number): Promise<Track[]> => ipcRenderer.invoke(IPC.PLAYLIST_GET_TRACKS, playlistId),
  addToPlaylist: (playlistId: number, trackId: number): Promise<void> => ipcRenderer.invoke(IPC.PLAYLIST_ADD_TRACK, playlistId, trackId),
  removeFromPlaylist: (playlistId: number, trackId: number): Promise<void> => ipcRenderer.invoke(IPC.PLAYLIST_REMOVE_TRACK, playlistId, trackId),

  // Session
  getSession: (): Promise<PlaybackSession> => ipcRenderer.invoke(IPC.SESSION_GET),
  saveSession: (session: Partial<PlaybackSession>): Promise<void> => ipcRenderer.invoke(IPC.SESSION_SAVE, session),

  // Drag & drop
  addPaths: (paths: string[]): Promise<{ sourcesAdded: FolderSource[]; filesImported: number }> =>
    ipcRenderer.invoke(IPC.SOURCES_ADD_PATHS, paths),

  // Tag editor
  updateTrack: (id: number, fields: Partial<Pick<Track,
    'title'|'artist'|'album'|'albumArtist'|'genre'|'year'|'trackNumber'|'discNumber'
  >>): Promise<Track | null> => ipcRenderer.invoke(IPC.LIBRARY_UPDATE_TRACK, id, fields),

  // File ops
  getArtwork: (artworkPath: string): Promise<string | null> => ipcRenderer.invoke(IPC.FILE_GET_ARTWORK, artworkPath),
  openFolder: (filePath: string): Promise<void> => ipcRenderer.invoke(IPC.FILE_OPEN_FOLDER, filePath),

  // Window controls
  windowMinimize: (): Promise<void> => ipcRenderer.invoke('window:minimize'),
  windowMaximize: (): Promise<void> => ipcRenderer.invoke('window:maximize'),
  windowClose: (): Promise<void> => ipcRenderer.invoke('window:close'),
}

contextBridge.exposeInMainWorld('api', api)

export type FelodyAPI = typeof api
