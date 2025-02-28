// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { ipcRenderer, contextBridge } from 'electron';

const renderer = {
  openFolder: () => {
    const folder = ipcRenderer.invoke('get-folder');
    console.log('folder in openFolder: ', folder);
    return folder;
  },
};

contextBridge.exposeInMainWorld('electron', renderer);

export type ERenderer = typeof renderer;
