import React from 'react'
import { View } from './AppLayout'
import { useLibraryStore } from '../../store/libraryStore'
import styles from './Sidebar.module.css'

interface NavItem {
  id: View
  label: string
  group: string
}

const NAV: NavItem[] = [
  { id: 'songs',           label: 'Bài hát',        group: 'Thư viện' },
  { id: 'albums',          label: 'Album',           group: 'Thư viện' },
  { id: 'artists',         label: 'Nghệ sĩ',         group: 'Thư viện' },
  { id: 'folders',         label: 'Thư mục',         group: 'Thư viện' },
  { id: 'playlists',       label: 'Playlist',        group: 'Thư viện' },
  { id: 'favorites',       label: 'Yêu thích',       group: 'Bộ sưu tập' },
  { id: 'recently-added',  label: 'Mới thêm',        group: 'Bộ sưu tập' },
  { id: 'most-played',     label: 'Nghe nhiều nhất', group: 'Bộ sưu tập' },
  { id: 'recently-played', label: 'Nghe gần đây',    group: 'Bộ sưu tập' },
  { id: 'search',          label: 'Tìm kiếm',        group: 'Khác' },
  { id: 'settings',        label: 'Cài đặt',         group: 'Khác' },
]

const GROUPS = ['Thư viện', 'Bộ sưu tập', 'Khác']

interface Props {
  currentView: View
  onNavigate: (view: View) => void
}

export default function Sidebar({ currentView, onNavigate }: Props): React.ReactElement {
  const { stats } = useLibraryStore()

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoText}>Felody</div>
        {stats && (
          <div className={styles.stats}>
            {stats.totalTracks.toLocaleString()} bài · {stats.totalAlbums} album
          </div>
        )}
      </div>

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
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  )
}
