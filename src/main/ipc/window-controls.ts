import { ipcMain, BrowserWindow } from 'electron'

export function registerWindowControls(getWin: () => BrowserWindow | null): void {
  ipcMain.handle('window:minimize', () => getWin()?.minimize())
  ipcMain.handle('window:maximize', () => {
    const win = getWin()
    if (!win) return
    win.isMaximized() ? win.unmaximize() : win.maximize()
  })
  ipcMain.handle('window:close', () => getWin()?.close())
}
