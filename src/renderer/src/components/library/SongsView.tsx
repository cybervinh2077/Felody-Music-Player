import React, { useEffect, useState } from 'react'
import { Track } from '../../../../shared/types'
import { useLibraryStore } from '../../store/libraryStore'
import { usePlayerStore } from '../../store/playerStore'
import TrackList from './TrackList'
import styles from './View.module.css'

type Filter = 'all' | 'favorites' | 'recently-added' | 'most-played' | 'recently-played'

interface Props {
  filter?: Filter
}

const TITLES: Record<Filter, string> = {
  all: 'Bài hát',
  favorites: 'Yêu thích',
  'recently-added': 'Mới thêm',
  'most-played': 'Nghe nhiều nhất',
  'recently-played': 'Nghe gần đây'
}

export default function SongsView({ filter = 'all' }: Props): React.ReactElement {
  const { tracks } = useLibraryStore()
  const { setCurrentTrack } = usePlayerStore()
  const [displayTracks, setDisplayTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const load = async () => {
      switch (filter) {
        case 'favorites':
          setDisplayTracks(await window.api.getFavorites())
          break
        case 'recently-added':
          setDisplayTracks(await window.api.getRecentlyAdded())
          break
        case 'most-played':
          setDisplayTracks(await window.api.getMostPlayed())
          break
        case 'recently-played':
          setDisplayTracks(await window.api.getRecentlyPlayed())
          break
        default:
          setDisplayTracks(tracks)
      }
      setLoading(false)
    }
    load()
  }, [filter, tracks])

  const playTrack = (track: Track, index: number) => {
    setCurrentTrack(track, displayTracks, index)
    usePlayerStore.getState().setIsPlaying(true)
  }

  return (
    <div className={styles.view}>
      <div className={styles.header}>
        <h1 className={styles.title}>{TITLES[filter]}</h1>
        <span className={styles.count}>{displayTracks.length} bài hát</span>
      </div>
      {loading
        ? <div className={styles.loading}>Đang tải...</div>
        : <TrackList tracks={displayTracks} onPlay={playTrack} />
      }
    </div>
  )
}
