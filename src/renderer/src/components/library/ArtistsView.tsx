import React, { useState } from 'react'
import { Artist, Track } from '../../../../shared/types'
import { useLibraryStore } from '../../store/libraryStore'
import { usePlayerStore } from '../../store/playerStore'
import TrackList from './TrackList'
import styles from './View.module.css'

export default function ArtistsView(): React.ReactElement {
  const { artists } = useLibraryStore()
  const { setCurrentTrack, setIsPlaying } = usePlayerStore()
  const [selected, setSelected] = useState<Artist | null>(null)
  const [artistTracks, setArtistTracks] = useState<Track[]>([])

  const openArtist = async (artist: Artist) => {
    setSelected(artist)
    const tracks = await window.api.getArtistTracks(artist.artist)
    setArtistTracks(tracks)
  }

  const playTrack = (track: Track, index: number) => {
    setCurrentTrack(track, artistTracks, index)
    setIsPlaying(true)
  }

  if (selected) {
    return (
      <div className={styles.view}>
        <div className={styles.header}>
          <button onClick={() => setSelected(null)} style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            ← Tất cả nghệ sĩ
          </button>
          <h1 className={styles.title}>{selected.artist}</h1>
          <span className={styles.count}>{selected.albumCount} album · {artistTracks.length} bài</span>
        </div>
        <TrackList tracks={artistTracks} onPlay={playTrack} />
      </div>
    )
  }

  return (
    <div className={styles.view}>
      <div className={styles.header}>
        <h1 className={styles.title}>Nghệ sĩ</h1>
        <span className={styles.count}>{artists.length} nghệ sĩ</span>
      </div>
      <div className={styles.grid}>
        {artists.map((artist) => (
          <div key={artist.artist} className={styles.card} onClick={() => openArtist(artist)}>
            <div className={styles.cardArt} style={{ borderRadius: '50%', overflow: 'hidden' }}>🎤</div>
            <div className={styles.cardInfo}>
              <div className={styles.cardTitle}>{artist.artist}</div>
              <div className={styles.cardSub}>{artist.albumCount} album · {artist.trackCount} bài</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
