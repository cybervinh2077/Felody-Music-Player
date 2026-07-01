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
  const [dragDepth, setDragDepth] = useState(0)
  const isDragging = dragDepth > 0

  const startScan = useCallback(async () => {
    if (scanning) return
    setScanning(true)
    setScanProgress(null)
    await window.api.startScan()
  }, [scanning])

  // Single scan progress listener — AppLayout owns all scan state
  useEffect(() => {
    const unsub = window.api.onScanProgress((p) => {
      setScanProgress(p)
      if (p.isComplete) {
        setScanning(false)
        loadAll()
      }
    })
    return unsub
  }, [])

  useEffect(() => {
    const run = async () => {
      await loadAll()
      const tracks = await window.api.getTracks(1)
      if (tracks.length === 0) {
        const sources = await window.api.getSources()
        if (sources.length > 0) startScan()
      }
    }
    run()
  }, [])

  const openNowPlaying = useCallback(() => setView('now-playing'), [])

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragDepth((d) => d + 1)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragDepth((d) => d - 1)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setDragDepth(0)

    const paths: string[] = []
    for (let i = 0; i < e.dataTransfer.files.length; i++) {
      const file = e.dataTransfer.files[i] as File & { path: string }
      if (file.path) paths.push(file.path)
    }

    if (paths.length === 0) return
    const { sourcesAdded, filesImported } = await window.api.addPaths(paths)

    // Folders added → trigger full scan of those new sources
    if (sourcesAdded.length > 0) startScan()
    // Individual files imported → just reload library, no scan needed
    else if (filesImported > 0) loadAll()
  }, [startScan, loadAll])

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
      case 'settings':        return (
        <SettingsView
          scanning={scanning}
          scanProgress={scanProgress}
          onStartScan={startScan}
        />
      )
      default:                return <SongsView />
    }
  }

  return (
    <div
      className={styles.layout}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className={styles.dropOverlay}>
          <div className={styles.dropBox}>
            <svg className={styles.dropIcon} width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <div className={styles.dropTitle}>Thả vào đây để thêm nhạc</div>
            <div className={styles.dropSub}>Hỗ trợ thư mục hoặc file MP3, FLAC, WAV và các định dạng khác</div>
          </div>
        </div>
      )}
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
      {view !== 'now-playing' && <PlayerBar onOpenNowPlaying={openNowPlaying} />}
      <AudioEngine />
    </div>
  )
}
