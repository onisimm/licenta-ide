// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { ipcRenderer, contextBridge } from 'electron';

// Helper function to normalize errors in the preload context
const normalizeError = (error: unknown): Error => {
  if (error instanceof Error) {
    return error;
  }

  if (error && typeof error === 'object' && 'type' in error) {
    // This might be an Event object
    const event = error as any;
    return new Error(`IPC Event error: ${event.type || 'Unknown event'}`);
  }

  if (typeof error === 'string') {
    return new Error(error);
  }

  if (error && typeof error === 'object') {
    const errorObj = error as any;
    const message = errorObj.message || errorObj.error || errorObj.toString();
    return new Error(`IPC error: ${message}`);
  }

  return new Error('Unknown IPC error occurred');
};

const renderer = {
  openFolder: async () => {
    try {
      const folder = await ipcRenderer.invoke('open-folder');
      return folder;
    } catch (error) {
      console.error('Error in openFolder preload:', error);
      throw normalizeError(error);
    }
  },
  openFileOrFolder: async () => {
    try {
      const result = await ipcRenderer.invoke('open-file-or-folder');
      return result;
    } catch (error) {
      console.error('Error in openFileOrFolder preload:', error);
      throw normalizeError(error);
    }
  },
  getFolder: async () => {
    try {
      const folder = await ipcRenderer.invoke('get-folder');
      return folder;
    } catch (error) {
      console.error('Error in getFolder preload:', error);
      throw normalizeError(error);
    }
  },
  loadDirectoryChildren: async (dirPath: string) => {
    try {
      const result = await ipcRenderer.invoke(
        'load-directory-children',
        dirPath,
      );
      return result;
    } catch (error) {
      console.error('Error in loadDirectoryChildren preload:', error);
      throw normalizeError(error);
    }
  },
  readFile: async (filePath: string) => {
    try {
      const result = await ipcRenderer.invoke('read-file', filePath);

      // Additional validation to ensure we have proper file data
      if (!result || typeof result !== 'object') {
        throw new Error('Invalid file data received from main process');
      }

      if (!result.path || !result.name || typeof result.content !== 'string') {
        throw new Error('Malformed file data structure');
      }

      return result;
    } catch (error) {
      console.error('Error in readFile preload:', error);
      throw normalizeError(error);
    }
  },
  saveFile: async (filePath: string, content: string) => {
    try {
      const result = await ipcRenderer.invoke('save-file', filePath, content);
      return result;
    } catch (error) {
      console.error('Error in saveFile preload:', error);
      throw normalizeError(error);
    }
  },
  // Menu event listeners
  onMenuSaveFile: (callback: () => void) => {
    const listener = () => callback();
    ipcRenderer.on('menu-save-file', listener);
    return () => ipcRenderer.removeListener('menu-save-file', listener);
  },
  onMenuOpenFile: (callback: () => void) => {
    const listener = () => callback();
    ipcRenderer.on('menu-open-file', listener);
    return () => ipcRenderer.removeListener('menu-open-file', listener);
  },
  onMenuCloseFile: (callback: () => void) => {
    const listener = () => callback();
    ipcRenderer.on('menu-close-file', listener);
    return () => ipcRenderer.removeListener('menu-close-file', listener);
  },
  onMenuCloseFolder: (callback: () => void) => {
    const listener = () => callback();
    ipcRenderer.on('menu-close-folder', listener);
    return () => ipcRenderer.removeListener('menu-close-folder', listener);
  },
  searchInFolder: async (folderPath: string, searchQuery: string) => {
    try {
      const result = await ipcRenderer.invoke(
        'search-in-folder',
        folderPath,
        searchQuery,
      );
      return result;
    } catch (error) {
      console.error('Error in searchInFolder preload:', error);
      throw normalizeError(error);
    }
  },
};

contextBridge.exposeInMainWorld('electron', renderer);

export type ERenderer = typeof renderer;
