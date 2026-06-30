import React, { useEffect, useState } from 'react'
import { useLibraryStore } from '../../store/libraryStore'
import { usePlayerStore } from '../../store/playerStore'
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

  useEffect(() => {
    loadAll()
  }, [])

  const renderView = () => {
    switch (view) {
      case 'songs': return <SongsView />
      case 'albums': return <AlbumsView />
      case 'artists': return <ArtistsView />
      case 'folders': return <FoldersView />
      case 'playlists': return <PlaylistsView />
      case 'favorites': return <SongsView filter="favorites" />
      case 'recently-added': return <SongsView filter="recently-added" />
      case 'most-played': return <SongsView filter="most-played" />
      case 'recently-played': return <SongsView filter="recently-played" />
      case 'search': return <SearchView />
      case 'now-playing': return <NowPlayingView />
      case 'settings': return <SettingsView onReScan={loadAll} />
      default: return <SongsView />
    }
  }

  return (
    <div className={styles.layout}>
      <TitleBar />
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
