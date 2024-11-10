import { app, BrowserWindow } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;

app.on('ready', () => {
  const projectRoot = app.getAppPath();

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: __dirname + '/preload.js', // Ensure `preload.js` is compiled
    },
  });

  mainWindow.loadFile(path.join(projectRoot, '/src/index.html')); // Point to src
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
