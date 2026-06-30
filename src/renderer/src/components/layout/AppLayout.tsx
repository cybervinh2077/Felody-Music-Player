import React, { useEffect, useState, useCallback } from 'react'
import { useLibraryStore } from '../../store/libraryStore'
import { ScanProgress } from '../../../../shared/types'
import Sidebar from './Sidebar'
import TitleBar from './TitleBar'
import PlayerBar from '../player/PlayerBar'
import SongsView from '../library/SongsView'
import AlbumsView from '../library/AlbumsView'
import ArtistsView from '../library/ArtistsView'
import FoldersView from '../library/FoldersView'
import PlaylistsView from '../library/PlaylistsView'
import SearchView from '../library/SearchView'
import NowPlayingView from '../player/NowPlayingView'
import SettingsView from '../settings/SettingsView'
import styles from './AppLayout.module.css'
import AudioEngine from '../player/AudioEngine'

export type View =
  | 'songs' | 'albums' | 'artists' | 'folders' | 'playlists'
  | 'favorites' | 'recently-added' | 'most-played' | 'recently-played'
  | 'search' | 'now-playing' | 'settings'

export default function AppLayout(): React.ReactElement {
  const [view, setView] = useState<View>('songs')
  const { loadAll } = useLibraryStore()
  const [scanning, setScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState<ScanProgress | null>(null)

  const startScan = useCallback(async () => {
    setScanning(true)
    setScanProgress(null)
    await window.api.startScan()
  }, [])

  useEffect(() => {
    const run = async () => {
      await loadAll()

      // Auto-rescan if library is empty but sources exist
      const tracks = await window.api.getTracks(1)
      if (tracks.length === 0) {
        const sources = await window.api.getSources()
        if (sources.length > 0) {
          startScan()
        }
      }
    }
    run()
  }, [])

  useEffect(() => {
    const unsub = window.api.onScanProgress((p) => {
      setScanProgress(p)
      if (p.isComplete) {
        setScanning(false)
        // Reload library after scan finishes
        loadAll()
      }
    })
    return unsub
  }, [])

  const renderView = () => {
    switch (view) {
      case 'songs':           return <SongsView />
      case 'albums':          return <AlbumsView />
      case 'artists':         return <ArtistsView />
      case 'folders':         return <FoldersView />
      case 'playlists':       return <PlaylistsView />
      case 'favorites':       return <SongsView filter="favorites" />
      case 'recently-added':  return <SongsView filter="recently-added" />
      case 'most-played':     return <SongsView filter="most-played" />
      case 'recently-played': return <SongsView filter="recently-played" />
      case 'search':          return <SearchView />
      case 'now-playing':     return <NowPlayingView />
      case 'settings':        return <SettingsView onReScan={() => { loadAll(); startScan() }} />
      default:                return <SongsView />
    }
  }

  return (
    <div className={styles.layout}>
      <TitleBar />
      {scanning && scanProgress && (
        <div className={styles.scanBar}>
          <div
            className={styles.scanFill}
            style={{ width: scanProgress.total ? `${(scanProgress.scanned / scanProgress.total) * 100}%` : '30%' }}
          />
          <span className={styles.scanText}>
            {scanProgress.isComplete
              ? `Hoàn tất — ${scanProgress.valid} bài hát`
              : `Đang quét... ${scanProgress.scanned}${scanProgress.total ? `/${scanProgress.total}` : ''} · ${scanProgress.valid} tìm thấy`
            }
            {scanProgress.errors > 0 && ` · ${scanProgress.errors} lỗi`}
          </span>
        </div>
      )}
      <div className={styles.body}>
        <Sidebar currentView={view} onNavigate={setView} />
        <main className={styles.main}>
          {renderView()}
        </main>
      </div>
      <PlayerBar onOpenNowPlaying={() => setView('now-playing')} />
      <AudioEngine />
    </div>
  )
}
