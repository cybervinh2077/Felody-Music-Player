import { getDb } from '../db/database'
import { Track, Album, Artist, Playlist, PlaylistItem, PlaybackSession, LibraryStats, FolderSource } from '../../shared/types'

// ── Folder Sources ──────────────────────────────────────────────────────────

export function getSources(): FolderSource[] {
  return getDb().prepare('SELECT * FROM folder_sources ORDER BY display_name').all() as FolderSource[]
}

export function addSource(folderPath: string): FolderSource {
  const db = getDb()
  const name = folderPath.split(/[\\/]/).pop() || folderPath
  db.prepare(
    'INSERT OR IGNORE INTO folder_sources (path, display_name) VALUES (?, ?)'
  ).run(folderPath, name)
  return db.prepare('SELECT * FROM folder_sources WHERE path = ?').get(folderPath) as FolderSource
}

export function removeSource(id: number): void {
  getDb().prepare('DELETE FROM folder_sources WHERE id = ?').run(id)
}

export function toggleSource(id: number, enabled: boolean): void {
  getDb().prepare('UPDATE folder_sources SET is_enabled = ? WHERE id = ?').run(enabled ? 1 : 0, id)
}

export function updateSourceScanTime(id: number): void {
  getDb().prepare("UPDATE folder_sources SET last_scan_at = datetime('now') WHERE id = ?").run(id)
}

// ── Tracks ──────────────────────────────────────────────────────────────────

export function getTracks(limit = 5000, offset = 0): Track[] {
  return getDb()
    .prepare('SELECT * FROM tracks WHERE scan_status != ? ORDER BY artist, album, track_number, title LIMIT ? OFFSET ?')
    .all('error', limit, offset) as Track[]
}

export function getTrackById(id: number): Track | null {
  return (getDb().prepare('SELECT * FROM tracks WHERE id = ?').get(id) as Track) || null
}

export function getAlbums(): Album[] {
  return getDb()
    .prepare(`
      SELECT album, album_artist, year, artwork_path, COUNT(*) as track_count
      FROM tracks
      WHERE album IS NOT NULL AND scan_status = 'ok'
      GROUP BY album, album_artist
      ORDER BY album
    `)
    .all() as Album[]
}

export function getAlbumTracks(album: string, albumArtist: string | null): Track[] {
  if (albumArtist) {
    return getDb()
      .prepare('SELECT * FROM tracks WHERE album = ? AND album_artist = ? ORDER BY disc_number, track_number')
      .all(album, albumArtist) as Track[]
  }
  return getDb()
    .prepare('SELECT * FROM tracks WHERE album = ? ORDER BY disc_number, track_number')
    .all(album) as Track[]
}

export function getArtists(): Artist[] {
  return getDb()
    .prepare(`
      SELECT artist, COUNT(DISTINCT album) as album_count, COUNT(*) as track_count
      FROM tracks
      WHERE artist IS NOT NULL AND scan_status = 'ok'
      GROUP BY artist
      ORDER BY artist
    `)
    .all() as Artist[]
}

export function getArtistTracks(artist: string): Track[] {
  return getDb()
    .prepare('SELECT * FROM tracks WHERE artist = ? ORDER BY album, track_number')
    .all(artist) as Track[]
}

export function searchTracks(query: string): Track[] {
  const q = `%${query}%`
  return getDb()
    .prepare(`
      SELECT * FROM tracks
      WHERE title LIKE ? OR artist LIKE ? OR album LIKE ? OR file_name LIKE ? OR path LIKE ?
      ORDER BY title
      LIMIT 200
    `)
    .all(q, q, q, q, q) as Track[]
}

export function getFavorites(): Track[] {
  return getDb()
    .prepare('SELECT * FROM tracks WHERE is_favorite = 1 ORDER BY title')
    .all() as Track[]
}

export function getRecentlyAdded(limit = 50): Track[] {
  return getDb()
    .prepare('SELECT * FROM tracks WHERE scan_status = ? ORDER BY date_added DESC LIMIT ?')
    .all('ok', limit) as Track[]
}

export function getMostPlayed(limit = 50): Track[] {
  return getDb()
    .prepare('SELECT * FROM tracks WHERE play_count > 0 ORDER BY play_count DESC LIMIT ?')
    .all(limit) as Track[]
}

export function getRecentlyPlayed(limit = 50): Track[] {
  return getDb()
    .prepare('SELECT * FROM tracks WHERE last_played_at IS NOT NULL ORDER BY last_played_at DESC LIMIT ?')
    .all(limit) as Track[]
}

export function toggleFavorite(id: number): boolean {
  const db = getDb()
  const track = db.prepare('SELECT is_favorite FROM tracks WHERE id = ?').get(id) as { is_favorite: number } | undefined
  if (!track) return false
  const newVal = track.is_favorite ? 0 : 1
  db.prepare('UPDATE tracks SET is_favorite = ? WHERE id = ?').run(newVal, id)
  return newVal === 1
}

export function incrementPlayCount(id: number): void {
  getDb()
    .prepare("UPDATE tracks SET play_count = play_count + 1, last_played_at = datetime('now') WHERE id = ?")
    .run(id)
}

export function getStats(): LibraryStats {
  const db = getDb()
  const row = db.prepare(`
    SELECT
      COUNT(*) as total_tracks,
      COUNT(DISTINCT album) as total_albums,
      COUNT(DISTINCT artist) as total_artists,
      SUM(duration_ms) as total_duration_ms
    FROM tracks WHERE scan_status = 'ok'
  `).get() as { total_tracks: number; total_albums: number; total_artists: number; total_duration_ms: number }
  return {
    totalTracks: row.total_tracks,
    totalAlbums: row.total_albums,
    totalArtists: row.total_artists,
    totalDurationMs: row.total_duration_ms || 0
  }
}

// ── Playlists ────────────────────────────────────────────────────────────────

export function getPlaylists(): Playlist[] {
  return getDb()
    .prepare(`
      SELECT p.*, COUNT(pi.id) as track_count
      FROM playlists p
      LEFT JOIN playlist_items pi ON pi.playlist_id = p.id
      GROUP BY p.id
      ORDER BY p.name
    `)
    .all() as Playlist[]
}

export function createPlaylist(name: string): Playlist {
  const db = getDb()
  const result = db.prepare('INSERT INTO playlists (name) VALUES (?)').run(name)
  return db.prepare('SELECT * FROM playlists WHERE id = ?').get(result.lastInsertRowid) as Playlist
}

export function deletePlaylist(id: number): void {
  getDb().prepare('DELETE FROM playlists WHERE id = ?').run(id)
}

export function renamePlaylist(id: number, name: string): void {
  getDb().prepare("UPDATE playlists SET name = ?, updated_at = datetime('now') WHERE id = ?").run(name, id)
}

export function getPlaylistTracks(playlistId: number): Track[] {
  return getDb()
    .prepare(`
      SELECT t.* FROM tracks t
      JOIN playlist_items pi ON pi.track_id = t.id
      WHERE pi.playlist_id = ?
      ORDER BY pi.position
    `)
    .all(playlistId) as Track[]
}

export function addTrackToPlaylist(playlistId: number, trackId: number): void {
  const db = getDb()
  const max = db.prepare('SELECT MAX(position) as m FROM playlist_items WHERE playlist_id = ?').get(playlistId) as { m: number | null }
  const pos = (max.m ?? -1) + 1
  db.prepare('INSERT OR IGNORE INTO playlist_items (playlist_id, track_id, position) VALUES (?, ?, ?)').run(playlistId, trackId, pos)
  db.prepare("UPDATE playlists SET updated_at = datetime('now') WHERE id = ?").run(playlistId)
}

export function removeTrackFromPlaylist(playlistId: number, trackId: number): void {
  getDb().prepare('DELETE FROM playlist_items WHERE playlist_id = ? AND track_id = ?').run(playlistId, trackId)
}

// ── Playback Session ─────────────────────────────────────────────────────────

export function getSession(): PlaybackSession {
  return getDb().prepare('SELECT * FROM playback_sessions WHERE id = 1').get() as PlaybackSession
}

export function saveSession(session: Partial<PlaybackSession>): void {
  const fields = Object.entries(session)
    .filter(([k]) => k !== 'id')
    .map(([k]) => `${camelToSnake(k)} = ?`)
    .join(', ')
  const values = Object.entries(session)
    .filter(([k]) => k !== 'id')
    .map(([, v]) => v)

  if (fields) {
    getDb()
      .prepare(`UPDATE playback_sessions SET ${fields}, updated_at = datetime('now') WHERE id = 1`)
      .run(...values)
  }
}

function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)
}
