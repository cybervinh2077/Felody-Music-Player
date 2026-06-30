import { create } from 'zustand'
import { AppSettings } from '../../../shared/types'

interface SettingsState {
  settings: AppSettings | null
  isLoaded: boolean
  load: () => Promise<void>
  update: (partial: Partial<AppSettings>) => Promise<void>
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  isLoaded: false,

  load: async () => {
    const settings = await window.api.getSettings()
    set({ settings, isLoaded: true })
    // Apply theme
    document.documentElement.dataset.theme =
      settings.theme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        : settings.theme
  },

  update: async (partial) => {
    const updated = await window.api.setSettings(partial)
    set({ settings: updated })
    if (partial.theme) {
      document.documentElement.dataset.theme =
        partial.theme === 'system'
          ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
          : partial.theme
    }
  }
}))
