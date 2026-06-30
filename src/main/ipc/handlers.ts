import { ipcMain, dialog, shell, BrowserWindow, nativeImage } from 'electron'
import fs from 'fs'
import { IPC } from '../../shared/ipc-channels'
import { getSettings, setSettings } from '../services/settings'
import {
  getSources, addSource, removeSource, toggleSource,
  getTracks, getAlbums, getAlbumTracks, getArtists, getArtistTracks,
  searchTracks, getFavorites, getRecentlyAdded, getMostPlayed, getRecentlyPlayed,
  toggleFavorite, incrementPlayCount, getStats,
  getPlaylists, createPlaylist, deletePlaylist, renamePlaylist,
  getPlaylistTracks, addTrackToPlaylist, removeTrackFromPlaylist,
  getSession, saveSession
} from '../services/library'
import { scanSources, stopScan } from '../services/scanner'
import { AppSettings } from '../../shared/types'

export function registerHandlers(getMainWindow: () => BrowserWindow | null): void {

  // Settings
  ipcMain.handle(IPC.SETTINGS_GET, () => getSettings())
  ipcMain.handle(IPC.SETTINGS_SET, (_, partial: Partial<AppSettings>) => {
    setSettings(partial)
    return getSettings()
  })

  // Sources
  ipcMain.handle(IPC.SOURCES_LIST, () => getSources())
  ipcMain.handle(IPC.SOURCES_ADD, (_, folderPath: string) => addSource(folderPath))
  ipcMain.handle(IPC.SOURCES_REMOVE, (_, id: number) => removeSource(id))
  ipcMain.handle(IPC.SOURCES_TOGGLE, (_, id: number, enabled: boolean) => toggleSource(id, enabled))
  ipcMain.handle(IPC.SOURCES_SELECT_DIR, async () => {
    const win = getMainWindow()
    const result = await dialog.showOpenDialog(win!, {
      properties: ['openDirectory', 'multiSelections'],
      title: 'Chọn thư mục nhạc'
    })
    return result.canceled ? null : result.filePaths
  })

  // Scanner
  ipcMain.handle(IPC.SCANNER_START, () => {
    const win = getMainWindow()
    scanSources(win)
    return true
  })
  ipcMain.handle(IPC.SCANNER_STOP, () => {
    stopScan()
    return true
  })

  // Library
  ipcMain.handle(IPC.LIBRARY_GET_TRACKS, (_, limit?: number, offset?: number) =>
    getTracks(limit, offset)
  )
  ipcMain.handle(IPC.LIBRARY_GET_ALBUMS, () => getAlbums())
  ipcMain.handle(IPC.LIBRARY_GET_ARTISTS, () => getArtists())
  ipcMain.handle(IPC.LIBRARY_GET_FOLDERS, () => {
    // Return grouped by folder
    const sources = getSources()
    return sources
  })
  ipcMain.handle(IPC.LIBRARY_SEARCH, (_, query: string) => searchTracks(query))
  ipcMain.handle(IPC.LIBRARY_GET_STATS, () => getStats())
  ipcMain.handle(IPC.LIBRARY_TOGGLE_FAVORITE, (_, id: number) => toggleFavorite(id))
  ipcMain.handle(IPC.LIBRARY_INCREMENT_PLAY, (_, id: number) => incrementPlayCount(id))

  // Playlists
  ipcMain.handle(IPC.PLAYLIST_LIST, () => getPlaylists())
  ipcMain.handle(IPC.PLAYLIST_CREATE, (_, name: string) => createPlaylist(name))
  ipcMain.handle(IPC.PLAYLIST_DELETE, (_, id: number) => deletePlaylist(id))
  ipcMain.handle(IPC.PLAYLIST_RENAME, (_, id: number, name: string) => renamePlaylist(id, name))
  ipcMain.handle(IPC.PLAYLIST_GET_TRACKS, (_, playlistId: number) => getPlaylistTracks(playlistId))
  ipcMain.handle(IPC.PLAYLIST_ADD_TRACK, (_, playlistId: number, trackId: number) =>
    addTrackToPlaylist(playlistId, trackId)
  )
  ipcMain.handle(IPC.PLAYLIST_REMOVE_TRACK, (_, playlistId: number, trackId: number) =>
    removeTrackFromPlaylist(playlistId, trackId)
  )

  // Session
  ipcMain.handle(IPC.SESSION_GET, () => getSession())
  ipcMain.handle(IPC.SESSION_SAVE, (_, session) => saveSession(session))

  // File ops
  ipcMain.handle(IPC.FILE_GET_ARTWORK, (_, artworkPath: string) => {
    if (!artworkPath || !fs.existsSync(artworkPath)) return null
    const img = nativeImage.createFromPath(artworkPath)
    return img.toDataURL()
  })
  ipcMain.handle(IPC.FILE_OPEN_FOLDER, (_, filePath: string) => {
    shell.showItemInFolder(filePath)
  })

  // Extra library views via settings-like mechanism
  ipcMain.handle('library:get-favorites', () => getFavorites())
  ipcMain.handle('library:get-recently-added', (_, limit?: number) => getRecentlyAdded(limit))
  ipcMain.handle('library:get-most-played', (_, limit?: number) => getMostPlayed(limit))
  ipcMain.handle('library:get-recently-played', (_, limit?: number) => getRecentlyPlayed(limit))
  ipcMain.handle('library:get-album-tracks', (_, album: string, albumArtist: string | null) =>
    getAlbumTracks(album, albumArtist)
  )
  ipcMain.handle('library:get-artist-tracks', (_, artist: string) => getArtistTracks(artist))
}
