import React, { useEffect, useState } from 'react'
import { Track } from '../../../../shared/types'
import styles from './TagEditorModal.module.css'

interface Props {
  track: Track
  onClose: () => void
  onSaved: (updated: Track) => void
}

interface FormState {
  title: string
  artist: string
  album: string
  albumArtist: string
  genre: string
  year: string
  trackNumber: string
  discNumber: string
}

function toForm(t: Track): FormState {
  return {
    title:       t.title       ?? '',
    artist:      t.artist      ?? '',
    album:       t.album       ?? '',
    albumArtist: t.albumArtist ?? '',
    genre:       t.genre       ?? '',
    year:        t.year        != null ? String(t.year)        : '',
    trackNumber: t.trackNumber != null ? String(t.trackNumber) : '',
    discNumber:  t.discNumber  != null ? String(t.discNumber)  : '',
  }
}

export default function TagEditorModal({ track, onClose, onSaved }: Props): React.ReactElement {
  const [form, setForm] = useState<FormState>(toForm(track))
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setForm(toForm(track))
  }, [track.id])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSave = async () => {
    setSaving(true)
    const updated = await window.api.updateTrack(track.id, {
      title:       form.title       || null,
      artist:      form.artist      || null,
      album:       form.album       || null,
      albumArtist: form.albumArtist || null,
      genre:       form.genre       || null,
      year:        form.year        ? Number(form.year)        : null,
      trackNumber: form.trackNumber ? Number(form.trackNumber) : null,
      discNumber:  form.discNumber  ? Number(form.discNumber)  : null,
    } as Parameters<typeof window.api.updateTrack>[1])
    setSaving(false)
    if (updated) onSaved(updated)
    onClose()
  }

  return (
    <div className={styles.backdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Chỉnh sửa thông tin</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className={styles.fileName}>{track.fileName}</div>

        <div className={styles.grid}>
          <Field label="Tiêu đề" value={form.title} onChange={set('title')} />
          <Field label="Nghệ sĩ" value={form.artist} onChange={set('artist')} />
          <Field label="Album" value={form.album} onChange={set('album')} />
          <Field label="Album Artist" value={form.albumArtist} onChange={set('albumArtist')} />
          <Field label="Thể loại" value={form.genre} onChange={set('genre')} />
          <Field label="Năm" value={form.year} onChange={set('year')} type="number" />
          <Field label="Track #" value={form.trackNumber} onChange={set('trackNumber')} type="number" />
          <Field label="Disc #" value={form.discNumber} onChange={set('discNumber')} type="number" />
        </div>

        <div className={styles.footer}>
          <button className={styles.btnCancel} onClick={onClose}>Hủy</button>
          <button className={styles.btnSave} onClick={handleSave} disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({
  label, value, onChange, type = 'text'
}: {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
}): React.ReactElement {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <input
        className={styles.input}
        type={type}
        value={value}
        onChange={onChange}
        min={type === 'number' ? 0 : undefined}
      />
    </div>
  )
}
