import { app, BrowserWindow, nativeTheme } from 'electron'
import path from 'path'
import { getDb, closeDb } from './db/database'
import { getSettings } from './services/settings'
import { registerHandlers } from './ipc/handlers'
import { registerWindowControls } from './ipc/window-controls'

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    show: false,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#0f0f0f',
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false  // Allow file:// media/images from localhost renderer
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow!.show()
  })

  if (isDev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  app.setAppUserModelId('com.felody.app')

  // Apply theme
  try {
    const settings = getSettings()
    nativeTheme.themeSource = settings.theme === 'system' ? 'system' : settings.theme
  } catch { /* DB not ready yet, use default */ }

  // Init DB
  getDb()

  // Register all IPC handlers
  registerHandlers(() => mainWindow)
  registerWindowControls(() => mainWindow)

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  closeDb()
  if (process.platform !== 'darwin') app.quit()
})
