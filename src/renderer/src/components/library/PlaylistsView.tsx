import React, { useState } from 'react'
import { Playlist, Track } from '../../../../shared/types'
import { useLibraryStore } from '../../store/libraryStore'
import { usePlayerStore } from '../../store/playerStore'
import TrackList from './TrackList'
import styles from './View.module.css'

export default function PlaylistsView(): React.ReactElement {
  const { playlists, createPlaylist, deletePlaylist } = useLibraryStore()
  const { setCurrentTrack, setIsPlaying } = usePlayerStore()
  const [selected, setSelected] = useState<Playlist | null>(null)
  const [playlistTracks, setPlaylistTracks] = useState<Track[]>([])
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)

  const openPlaylist = async (pl: Playlist) => {
    setSelected(pl)
    const tracks = await window.api.getPlaylistTracks(pl.id)
    setPlaylistTracks(tracks)
  }

  const playTrack = (track: Track, index: number) => {
    setCurrentTrack(track, playlistTracks, index)
    setIsPlaying(true)
  }

  const handleCreate = async () => {
    if (!newName.trim()) return
    await createPlaylist(newName.trim())
    setNewName('')
    setCreating(false)
  }

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Xóa playlist này?')) {
      await deletePlaylist(id)
      if (selected?.id === id) setSelected(null)
    }
  }

  if (selected) {
    return (
      <div className={styles.view}>
        <div className={styles.header}>
          <button onClick={() => setSelected(null)} style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            ← Tất cả playlist
          </button>
          <h1 className={styles.title}>{selected.name}</h1>
          <span className={styles.count}>{playlistTracks.length} bài</span>
        </div>
        <TrackList tracks={playlistTracks} onPlay={playTrack} />
      </div>
    )
  }

  return (
    <div className={styles.view}>
      <div className={styles.header}>
        <h1 className={styles.title}>Playlist</h1>
        <span className={styles.count}>{playlists.length} playlist</span>
        <button
          onClick={() => setCreating(true)}
          style={{
            marginLeft: 'auto', padding: '6px 14px', background: 'var(--accent)',
            color: '#000', borderRadius: 100, fontSize: 13, fontWeight: 600
          }}
        >
          + Tạo playlist
        </button>
      </div>

      {creating && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <input
            autoFocus
            placeholder="Tên playlist..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            style={{
              flex: 1, padding: '8px 12px', background: 'var(--bg-elevated)',
              border: '1px solid var(--border-light)', borderRadius: 4,
              color: 'var(--text-primary)'
            }}
          />
          <button onClick={handleCreate} style={{ padding: '8px 14px', background: 'var(--accent)', color: '#000', borderRadius: 8, fontWeight: 600 }}>Tạo</button>
          <button onClick={() => setCreating(false)} style={{ padding: '8px 14px', color: 'var(--text-muted)' }}>Hủy</button>
        </div>
      )}

      <div style={{ overflow: 'auto', flex: 1 }}>
        {playlists.length === 0 ? (
          <div className={styles.loading}>Chưa có playlist nào. Tạo playlist đầu tiên!</div>
        ) : (
          playlists.map((pl) => (
            <div
              key={pl.id}
              onClick={() => openPlaylist(pl)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px', borderRadius: 8, cursor: 'pointer',
                transition: 'background 0.1s', position: 'relative'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '')}
            >
              <div style={{
                width: 44, height: 44, background: 'var(--bg-elevated)',
                borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.35 }}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500 }}>{pl.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{pl.trackCount || 0} bài</div>
              </div>
              <button
                onClick={(e) => handleDelete(pl.id, e)}
                style={{ color: 'var(--text-muted)', fontSize: 16, padding: '4px 8px' }}
              ><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg></button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
