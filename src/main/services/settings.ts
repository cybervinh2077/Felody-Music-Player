import { getDb } from '../db/database'
import { AppSettings } from '../../shared/types'

const DEFAULTS: AppSettings = {
  theme: 'system',
  defaultView: 'library',
  resumeLastSession: true,
  rememberQueue: true,
  rememberPosition: true,
  autoPlayOnStart: false,
  crossfadeEnabled: false,
  crossfadeDuration: 3,
  gaplessPlayback: true,
  eqEnabled: false,
  eqPreset: 'flat',
  scanMode: 'full',
  skipDuplicates: true,
  skipShortFiles: true,
  shortFileDurationMs: 5000,
  setupCompleted: false
}

export function getSettings(): AppSettings {
  const db = getDb()
  const rows = db.prepare('SELECT key, value FROM settings').all() as { key: string; value: string }[]
  const map: Record<string, unknown> = {}
  for (const row of rows) {
    try {
      map[row.key] = JSON.parse(row.value)
    } catch {
      map[row.key] = row.value
    }
  }
  return { ...DEFAULTS, ...map } as AppSettings
}

export function setSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]): void {
  const db = getDb()
  db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(
    key,
    JSON.stringify(value)
  )
}

export function setSettings(partial: Partial<AppSettings>): void {
  const db = getDb()
  const upsert = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)')
  const tx = db.transaction((entries: [string, unknown][]) => {
    for (const [k, v] of entries) {
      upsert.run(k, JSON.stringify(v))
    }
  })
  tx(Object.entries(partial))
}
