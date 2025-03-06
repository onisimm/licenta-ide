// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { ipcRenderer, contextBridge } from 'electron';

const renderer = {
  openFolder: () => {
    const folder = ipcRenderer.invoke('open-folder');
    return folder;
  },
  getFolder: () => {
    const folder = ipcRenderer.invoke('get-folder');
    return folder;
  },
};

contextBridge.exposeInMainWorld('electron', renderer);

export type ERenderer = typeof renderer;
