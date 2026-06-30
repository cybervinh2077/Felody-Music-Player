import React, { useState } from 'react'
import { useSettingsStore } from '../../store/settingsStore'
import WelcomeStep from './WelcomeStep'
import SourceStep from './SourceStep'
import ScanOptionsStep from './ScanOptionsStep'
import PlaybackSettingsStep from './PlaybackSettingsStep'
import AppearanceStep from './AppearanceStep'
import SummaryStep from './SummaryStep'
import styles from './SetupWizard.module.css'

export type SetupData = {
  folders: string[]
  scanMode: 'quick' | 'full'
  skipDuplicates: boolean
  skipShortFiles: boolean
  autoScan: boolean
  resumeLastSession: boolean
  rememberQueue: boolean
  rememberPosition: boolean
  gaplessPlayback: boolean
  crossfadeEnabled: boolean
  theme: 'light' | 'dark' | 'system'
  defaultView: 'library' | 'now-playing'
}

const INITIAL: SetupData = {
  folders: [],
  scanMode: 'full',
  skipDuplicates: true,
  skipShortFiles: true,
  autoScan: true,
  resumeLastSession: true,
  rememberQueue: true,
  rememberPosition: true,
  gaplessPlayback: true,
  crossfadeEnabled: false,
  theme: 'dark',
  defaultView: 'library'
}

const STEPS = ['Chào mừng', 'Nguồn nhạc', 'Tùy chọn quét', 'Phát nhạc', 'Giao diện', 'Hoàn tất']

export default function SetupWizard(): React.ReactElement {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<SetupData>(INITIAL)
  const { update } = useSettingsStore()

  const update_ = (partial: Partial<SetupData>) => setData((d) => ({ ...d, ...partial }))
  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1))
  const back = () => setStep((s) => Math.max(s - 1, 0))

  const finish = async () => {
    // Save all folders as sources
    for (const folder of data.folders) {
      await window.api.addSource(folder)
    }
    // Save settings
    await update({
      setupCompleted: true,
      scanMode: data.scanMode,
      skipDuplicates: data.skipDuplicates,
      skipShortFiles: data.skipShortFiles,
      resumeLastSession: data.resumeLastSession,
      rememberQueue: data.rememberQueue,
      rememberPosition: data.rememberPosition,
      gaplessPlayback: data.gaplessPlayback,
      crossfadeEnabled: data.crossfadeEnabled,
      theme: data.theme,
      defaultView: data.defaultView
    })
    // Kick off scan
    window.api.startScan()
  }

  const skip = async () => {
    await update({ setupCompleted: true })
  }

  const renderStep = () => {
    switch (step) {
      case 0: return <WelcomeStep onStart={next} onSkip={skip} />
      case 1: return <SourceStep data={data} onChange={update_} onNext={next} onBack={back} />
      case 2: return <ScanOptionsStep data={data} onChange={update_} onNext={next} onBack={back} />
      case 3: return <PlaybackSettingsStep data={data} onChange={update_} onNext={next} onBack={back} />
      case 4: return <AppearanceStep data={data} onChange={update_} onNext={next} onBack={back} />
      case 5: return <SummaryStep data={data} onFinish={finish} onBack={back} />
      default: return null
    }
  }

  if (step === 0) return <WelcomeStep onStart={next} onSkip={skip} />

  return (
    <div className={styles.wizard}>
      {/* Stepper */}
      <div className={styles.stepper}>
        {STEPS.slice(1).map((label, i) => (
          <React.Fragment key={i}>
            <div className={`${styles.stepDot} ${i + 1 <= step ? styles.active : ''} ${i + 1 === step ? styles.current : ''}`}>
              <span>{i + 1}</span>
            </div>
            {i < STEPS.length - 2 && <div className={`${styles.stepLine} ${i + 1 < step ? styles.active : ''}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className={styles.content}>
        {renderStep()}
      </div>
    </div>
  )
}
