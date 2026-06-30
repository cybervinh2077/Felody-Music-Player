import React from 'react'
import { View } from './AppLayout'
import { useLibraryStore } from '../../store/libraryStore'
import styles from './Sidebar.module.css'

interface NavItem {
  id: View
  label: string
  icon: string
  group?: string
}

const NAV: NavItem[] = [
  { id: 'songs', label: 'Bài hát', icon: '🎵', group: 'Thư viện' },
  { id: 'albums', label: 'Album', icon: '💿', group: 'Thư viện' },
  { id: 'artists', label: 'Nghệ sĩ', icon: '🎤', group: 'Thư viện' },
  { id: 'folders', label: 'Thư mục', icon: '📁', group: 'Thư viện' },
  { id: 'playlists', label: 'Playlist', icon: '📋', group: 'Thư viện' },
  { id: 'favorites', label: 'Yêu thích', icon: '❤️', group: 'Khám phá' },
  { id: 'recently-added', label: 'Mới thêm', icon: '🆕', group: 'Khám phá' },
  { id: 'most-played', label: 'Nghe nhiều nhất', icon: '🔥', group: 'Khám phá' },
  { id: 'recently-played', label: 'Nghe gần đây', icon: '🕐', group: 'Khám phá' },
  { id: 'search', label: 'Tìm kiếm', icon: '🔍', group: 'Khác' },
  { id: 'settings', label: 'Cài đặt', icon: '⚙️', group: 'Khác' },
]

const GROUPS = ['Thư viện', 'Khám phá', 'Khác']

interface Props {
  currentView: View
  onNavigate: (view: View) => void
}

export default function Sidebar({ currentView, onNavigate }: Props): React.ReactElement {
  const { stats } = useLibraryStore()

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="7" fill="#1db954" />
          <path d="M9 9L19 14L9 19V9Z" fill="#000" />
        </svg>
        <span className={styles.logoText}>Felody</span>
      </div>

      {stats && (
        <div className={styles.stats}>
          <span>{stats.totalTracks.toLocaleString()} bài</span>
          <span>·</span>
          <span>{stats.totalAlbums} album</span>
        </div>
      )}

      <nav className={styles.nav}>
        {GROUPS.map((group) => (
          <div key={group} className={styles.group}>
            <div className={styles.groupLabel}>{group}</div>
            {NAV.filter((n) => n.group === group).map((item) => (
              <button
                key={item.id}
                className={`${styles.navItem} ${currentView === item.id ? styles.active : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navLabel}>{item.label}</span>
              </button>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  )
}
