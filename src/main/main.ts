import { app, BrowserWindow, Menu } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;

app.on('ready', () => {
  const projectRoot = app.getAppPath();

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: __dirname + '/preload.js',
    },
  });

  mainWindow.loadFile(path.join(projectRoot, '/src/index.html'));

  // build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // insert menu
  Menu.setApplicationMenu(mainMenu);
});

const handleOpenFile = () => {};

const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open File',
        accelerator: process.platform == 'darwin' ? 'Command + O' : 'Ctrl + O',
        click() {
          handleOpenFile();
        },
      },
      {
        label: 'Exit',
        click() {
          app.quit();
        },
      },
    ],
  },
];
