import { app, BrowserWindow } from 'electron';
import path from 'path';
import { registerFileHandlers } from './handlers/fileHandlers';
import { registerFolderHandlers } from './handlers/folderHandlers';
import { registerGitHandlers } from './handlers/gitHandlers';
import { registerWindowHandlers } from './handlers/windowHandlers';

let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.whenReady().then(() => {
  createWindow();

  if (mainWindow) {
    registerFileHandlers();
    registerFolderHandlers(mainWindow);
    registerGitHandlers();
    registerWindowHandlers(mainWindow);
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
