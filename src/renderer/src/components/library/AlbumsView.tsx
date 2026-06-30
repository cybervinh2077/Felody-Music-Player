import React, { useState } from 'react'
import { Album, Track } from '../../../../shared/types'
import { useLibraryStore } from '../../store/libraryStore'
import { usePlayerStore } from '../../store/playerStore'
import TrackList from './TrackList'
import styles from './View.module.css'

export default function AlbumsView(): React.ReactElement {
  const { albums } = useLibraryStore()
  const { setCurrentTrack, setIsPlaying } = usePlayerStore()
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
  const [albumTracks, setAlbumTracks] = useState<Track[]>([])

  const openAlbum = async (album: Album) => {
    setSelectedAlbum(album)
    const tracks = await window.api.getAlbumTracks(album.album, album.albumArtist)
    setAlbumTracks(tracks)
  }

  const playTrack = (track: Track, index: number) => {
    setCurrentTrack(track, albumTracks, index)
    setIsPlaying(true)
  }

  if (selectedAlbum) {
    return (
      <div className={styles.view}>
        <div className={styles.header}>
          <button onClick={() => setSelectedAlbum(null)} style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            ← Tất cả album
          </button>
          <h1 className={styles.title}>{selectedAlbum.album}</h1>
          <span className={styles.count}>{albumTracks.length} bài</span>
        </div>
        <TrackList tracks={albumTracks} onPlay={playTrack} />
      </div>
    )
  }

  return (
    <div className={styles.view}>
      <div className={styles.header}>
        <h1 className={styles.title}>Album</h1>
        <span className={styles.count}>{albums.length} album</span>
      </div>
      <div className={styles.grid}>
        {albums.map((album) => (
          <div key={`${album.album}-${album.albumArtist}`} className={styles.card} onClick={() => openAlbum(album)}>
            <div className={styles.cardArt}>
              {album.artworkPath
                ? <img src={`file:///${album.artworkPath.replace(/\\/g, '/')}`} alt="" />
                : <svg className={styles.cardArtEmpty} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
              }
            </div>
            <div className={styles.cardInfo}>
              <div className={styles.cardTitle}>{album.album}</div>
              <div className={styles.cardSub}>{album.albumArtist || 'Various'} · {album.trackCount} bài</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
