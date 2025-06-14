import { ipcMain, BrowserWindow } from 'electron';
import { getTheme, setTheme } from '../utils/storeUtils';

export const registerWindowHandlers = (mainWindow: BrowserWindow) => {
  ipcMain.handle('get-theme', async () => {
    return getTheme();
  });

  ipcMain.handle('set-theme', async (event, theme: string) => {
    try {
      console.log('🎨 Setting theme:', theme);

      if (!theme || typeof theme !== 'string') {
        throw new Error('Invalid theme provided');
      }

      setTheme(theme);

      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('theme-changed', theme);
      }

      console.log('✅ Theme set successfully:', theme);
      return { success: true, theme };
    } catch (error) {
      console.error('❌ Error setting theme:', error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
          ? error
          : 'Unknown error setting theme';

      throw new Error(`Failed to set theme: ${errorMessage}`);
    }
  });

  ipcMain.handle('get-sidebar-width', async () => {
    return mainWindow?.webContents.getZoomFactor() || 1;
  });

  ipcMain.handle('set-sidebar-width', async (event, width: number) => {
    try {
      console.log('📏 Setting sidebar width:', width);

      if (typeof width !== 'number' || width < 0) {
        throw new Error('Invalid sidebar width provided');
      }

      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.setZoomFactor(width);
      }

      console.log('✅ Sidebar width set successfully:', width);
      return { success: true, width };
    } catch (error) {
      console.error('❌ Error setting sidebar width:', error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
          ? error
          : 'Unknown error setting sidebar width';

      throw new Error(`Failed to set sidebar width: ${errorMessage}`);
    }
  });

  ipcMain.handle('get-zoom-level', async () => {
    return mainWindow?.webContents.getZoomFactor() || 1;
  });

  ipcMain.handle('set-zoom-level', async (event, level: number) => {
    try {
      console.log('🔍 Setting zoom level:', level);

      if (typeof level !== 'number' || level < 0.5 || level > 2) {
        throw new Error('Invalid zoom level provided');
      }

      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.setZoomFactor(level);
      }

      console.log('✅ Zoom level set successfully:', level);
      return { success: true, level };
    } catch (error) {
      console.error('❌ Error setting zoom level:', error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
          ? error
          : 'Unknown error setting zoom level';

      throw new Error(`Failed to set zoom level: ${errorMessage}`);
    }
  });

  ipcMain.handle('minimize-window', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.minimize();
    }
  });

  ipcMain.handle('maximize-window', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    }
  });

  ipcMain.handle('close-window', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.close();
    }
  });
};
