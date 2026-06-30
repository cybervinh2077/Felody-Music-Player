import React, { useEffect, useState } from 'react'
import { useSettingsStore } from './store/settingsStore'
import SetupWizard from './components/setup/SetupWizard'
import AppLayout from './components/layout/AppLayout'

export default function App(): React.ReactElement {
  const { settings, isLoaded, load } = useSettingsStore()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    load().then(() => setReady(true))
  }, [])

  if (!ready || !isLoaded) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#0f0f0f' }}>
        <div style={{ color: '#666', fontSize: 13 }}>Đang tải...</div>
      </div>
    )
  }

  if (!settings?.setupCompleted) {
    return <SetupWizard />
  }

  return <AppLayout />
}
