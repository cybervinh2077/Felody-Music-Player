import fs from 'fs'
import path from 'path'
import { BrowserWindow } from 'electron'
import { getDb } from '../db/database'
import { getSources, updateSourceScanTime } from './library'
import { IPC } from '../../shared/ipc-channels'
import { ScanProgress } from '../../shared/types'

let parseFile: ((path: string, opts?: Record<string, unknown>) => Promise<any>) | null = null

async function getParser() {
  if (!parseFile) {
    const mm = await import('music-metadata')
    parseFile = mm.parseFile
  }
  return parseFile!
}

const SUPPORTED_FORMATS = new Set([
  '.mp3', '.wav', '.flac', '.aac', '.m4a', '.ogg', '.opus',
  '.ape', '.wv', '.wma', '.aiff', '.aif', '.alac'
])

let scanning = false
let stopRequested = false

export function isScanning(): boolean {
  return scanning
}

export function stopScan(): void {
  stopRequested = true
}

export async function scanSources(win: BrowserWindow | null): Promise<void> {
  if (scanning) return
  scanning = true
  stopRequested = false

  const allSources = getSources()
  const sources = allSources.filter((s) => s.isEnabled)
  console.log(`[scanner] sources total=${allSources.length} enabled=${sources.length}`, sources.map(s => s.path))

  const progress: ScanProgress = { total: 0, scanned: 0, valid: 0, errors: 0, currentFile: '', isComplete: false }

  try {
    // Count files first
    for (const source of sources) {
      if (!fs.existsSync(source.path)) {
        console.log(`[scanner] source path does not exist: ${source.path}`)
        continue
      }
      const n = countFiles(source.path)
      console.log(`[scanner] countFiles("${source.path}") = ${n}`)
      progress.total += n
    }

    emit(win, progress)

    const db = getDb()
    const upsert = db.prepare(`
      INSERT INTO tracks (path, file_name, format, duration_ms, bitrate, sample_rate, channels,
        title, artist, album, album_artist, genre, year, track_number, disc_number,
        artwork_path, scan_status)
      VALUES (@path, @fileName, @format, @durationMs, @bitrate, @sampleRate, @channels,
        @title, @artist, @album, @albumArtist, @genre, @year, @trackNumber, @discNumber,
        @artworkPath, @scanStatus)
      ON CONFLICT(path) DO UPDATE SET
        file_name = excluded.file_name,
        format = excluded.format,
        duration_ms = excluded.duration_ms,
        bitrate = excluded.bitrate,
        sample_rate = excluded.sample_rate,
        channels = excluded.channels,
        title = excluded.title,
        artist = excluded.artist,
        album = excluded.album,
        album_artist = excluded.album_artist,
        genre = excluded.genre,
        year = excluded.year,
        track_number = excluded.track_number,
        disc_number = excluded.disc_number,
        scan_status = excluded.scan_status
    `)

    for (const source of sources) {
      if (stopRequested || !fs.existsSync(source.path)) continue
      console.log(`[scanner] scanning dir: ${source.path}`)
      await scanDir(source.path, upsert, win, progress)
      updateSourceScanTime(source.id)
    }
  } finally {
    progress.isComplete = true
    emit(win, progress)
    scanning = false
  }
}

async function scanDir(
  dir: string,
  upsert: ReturnType<typeof getDb>['prepare'],
  win: BrowserWindow | null,
  progress: ScanProgress
): Promise<void> {
  let entries: fs.Dirent[]
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch (err) {
    console.log(`[scanner] readdirSync failed: ${dir}`, err)
    return
  }

  for (const entry of entries) {
    if (stopRequested) break
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      await scanDir(fullPath, upsert, win, progress)
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase()
      if (!SUPPORTED_FORMATS.has(ext)) continue

      progress.scanned++
      progress.currentFile = entry.name
      emit(win, progress)

      try {
        const parse = await getParser()
        const meta = await parse(fullPath, { duration: true, skipCovers: false })
        const common = meta.common
        const native = meta.format

        const artworkPath = await extractArtwork(fullPath, common.picture?.[0])

        upsert.run({
          path: fullPath,
          fileName: entry.name,
          format: ext.slice(1).toUpperCase(),
          durationMs: Math.round((native.duration ?? 0) * 1000),
          bitrate: native.bitrate ? Math.round(native.bitrate) : null,
          sampleRate: native.sampleRate ?? null,
          channels: native.numberOfChannels ?? null,
          title: common.title ?? null,
          artist: common.artist ?? null,
          album: common.album ?? null,
          albumArtist: common.albumartist ?? null,
          genre: common.genre?.[0] ?? null,
          year: common.year ?? null,
          trackNumber: common.track?.no ?? null,
          discNumber: common.disk?.no ?? null,
          artworkPath,
          scanStatus: 'ok'
        })
        progress.valid++
      } catch (err) {
        console.log(`[scanner] parse error: ${fullPath}`, err)
        progress.errors++
        try {
          upsert.run({
            path: fullPath,
            fileName: entry.name,
            format: path.extname(entry.name).slice(1).toUpperCase(),
            durationMs: 0,
            bitrate: null, sampleRate: null, channels: null,
            title: null, artist: null, album: null, albumArtist: null,
            genre: null, year: null, trackNumber: null, discNumber: null,
            artworkPath: null, scanStatus: 'error'
          })
        } catch { /* ignore */ }
      }

      if (progress.scanned % 10 === 0) emit(win, progress)
    }
  }
}

async function extractArtwork(
  trackPath: string,
  picture: { data: Buffer; format: string } | undefined
): Promise<string | null> {
  if (!picture) return null
  try {
    const { app } = await import('electron')
    const cacheDir = path.join(app.getPath('userData'), 'artwork')
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true })

    const hash = Buffer.from(trackPath).toString('base64url').slice(0, 16)
    const ext = picture.format.includes('png') ? '.png' : '.jpg'
    const artPath = path.join(cacheDir, `${hash}${ext}`)

    if (!fs.existsSync(artPath)) {
      fs.writeFileSync(artPath, picture.data)
    }
    return artPath
  } catch {
    return null
  }
}

function countFiles(dir: string): number {
  let count = 0
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const e of entries) {
      if (e.isDirectory()) count += countFiles(path.join(dir, e.name))
      else if (e.isFile() && SUPPORTED_FORMATS.has(path.extname(e.name).toLowerCase())) count++
    }
  } catch { /* skip */ }
  return count
}

function emit(win: BrowserWindow | null, progress: ScanProgress): void {
  win?.webContents.send(IPC.SCANNER_PROGRESS, { ...progress })
}
