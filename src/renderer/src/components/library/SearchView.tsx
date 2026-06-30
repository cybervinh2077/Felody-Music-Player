import React, { useState, useCallback } from 'react'
import { Track } from '../../../../shared/types'
import { usePlayerStore } from '../../store/playerStore'
import TrackList from './TrackList'
import styles from './View.module.css'

function useDebounce<T>(fn: (v: T) => void, delay: number) {
  const timer = React.useRef<ReturnType<typeof setTimeout>>()
  return useCallback((v: T) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => fn(v), delay)
  }, [fn, delay])
}

export default function SearchView(): React.ReactElement {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Track[]>([])
  const [searching, setSearching] = useState(false)
  const { setCurrentTrack, setIsPlaying } = usePlayerStore()

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return }
    setSearching(true)
    const tracks = await window.api.search(q)
    setResults(tracks)
    setSearching(false)
  }, [])

  const debouncedSearch = useDebounce(doSearch, 250)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setQuery(v)
    debouncedSearch(v)
  }

  const playTrack = (track: Track, index: number) => {
    setCurrentTrack(track, results, index)
    setIsPlaying(true)
  }

  return (
    <div className={styles.view}>
      <div className={styles.header}>
        <h1 className={styles.title}>Tìm kiếm</h1>
      </div>

      <div style={{ marginBottom: 20 }}>
        <input
          autoFocus
          placeholder="Tìm theo tiêu đề, nghệ sĩ, album, tên file..."
          value={query}
          onChange={handleChange}
          style={{
            width: '100%', maxWidth: 500,
            padding: '10px 16px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 100,
            color: 'var(--text-primary)',
            fontSize: 14,
            outline: 'none',
            transition: 'border-color 0.15s'
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--border-focus)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
        />
      </div>

      {searching ? (
        <div className={styles.loading}>Đang tìm...</div>
      ) : query && results.length === 0 ? (
        <div className={styles.loading}>Không tìm thấy kết quả cho "{query}"</div>
      ) : results.length > 0 ? (
        <>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
            {results.length} kết quả
          </div>
          <TrackList tracks={results} onPlay={playTrack} />
        </>
      ) : (
        <div className={styles.loading} style={{ flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 32 }}>🔍</div>
          <div>Nhập từ khóa để tìm kiếm</div>
        </div>
      )}
    </div>
  )
}
