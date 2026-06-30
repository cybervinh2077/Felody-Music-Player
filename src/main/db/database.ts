import Database from 'better-sqlite3'
import { app } from 'electron'
import path from 'path'
import fs from 'fs'

let db: Database.Database

export function getDb(): Database.Database {
  if (!db) {
    const userDataPath = app.getPath('userData')
    const dbPath = path.join(userDataPath, 'felody.db')
    db = new Database(dbPath)
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')
    initSchema(db)
  }
  return db
}

function initSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS folder_sources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT NOT NULL UNIQUE,
      display_name TEXT NOT NULL,
      is_enabled INTEGER NOT NULL DEFAULT 1,
      watch_for_changes INTEGER NOT NULL DEFAULT 1,
      last_scan_at TEXT
    );

    CREATE TABLE IF NOT EXISTS tracks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT NOT NULL UNIQUE,
      file_name TEXT NOT NULL,
      format TEXT NOT NULL,
      duration_ms INTEGER NOT NULL DEFAULT 0,
      bitrate INTEGER,
      sample_rate INTEGER,
      channels INTEGER,
      title TEXT,
      artist TEXT,
      album TEXT,
      album_artist TEXT,
      genre TEXT,
      year INTEGER,
      track_number INTEGER,
      disc_number INTEGER,
      artwork_path TEXT,
      lyrics_path TEXT,
      date_added TEXT NOT NULL DEFAULT (datetime('now')),
      last_played_at TEXT,
      play_count INTEGER NOT NULL DEFAULT 0,
      is_favorite INTEGER NOT NULL DEFAULT 0,
      hash TEXT,
      scan_status TEXT NOT NULL DEFAULT 'ok'
    );

    CREATE INDEX IF NOT EXISTS idx_tracks_artist ON tracks(artist);
    CREATE INDEX IF NOT EXISTS idx_tracks_album ON tracks(album);
    CREATE INDEX IF NOT EXISTS idx_tracks_genre ON tracks(genre);
    CREATE INDEX IF NOT EXISTS idx_tracks_title ON tracks(title);

    CREATE TABLE IF NOT EXISTS playlists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      cover_art_path TEXT
    );

    CREATE TABLE IF NOT EXISTS playlist_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      playlist_id INTEGER NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
      track_id INTEGER NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
      position INTEGER NOT NULL,
      UNIQUE(playlist_id, track_id)
    );

    CREATE TABLE IF NOT EXISTS playback_sessions (
      id INTEGER PRIMARY KEY DEFAULT 1,
      current_track_id INTEGER REFERENCES tracks(id),
      current_position_ms INTEGER NOT NULL DEFAULT 0,
      repeat_mode TEXT NOT NULL DEFAULT 'none',
      shuffle_enabled INTEGER NOT NULL DEFAULT 0,
      volume REAL NOT NULL DEFAULT 1.0,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    INSERT OR IGNORE INTO playback_sessions (id) VALUES (1);

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `)
}

export function closeDb(): void {
  if (db) {
    db.close()
  }
}

function snakeToCamel(s: string): string {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
}

export function mapRow<T>(row: Record<string, unknown>): T {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(row)) out[snakeToCamel(k)] = v
  return out as T
}

export function mapRows<T>(rows: Record<string, unknown>[]): T[] {
  return rows.map((r) => mapRow<T>(r))
}
