// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { ipcRenderer, contextBridge } from 'electron';

// Normalize errors to prevent serialization issues
const normalizeError = (error: any): Error => {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } as Error;
  }

  if (typeof error === 'string') {
    return new Error(error);
  }

  return new Error('Unknown error occurred');
};

const renderer = {
  openFolder: async () => {
    try {
      const result = await ipcRenderer.invoke('open-folder');
      return result;
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
      const result = await ipcRenderer.invoke('get-folder');
      return result;
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

  // Git operations
  getGitStatus: async (folderPath: string) => {
    try {
      const result = await ipcRenderer.invoke('get-git-status', folderPath);
      return result;
    } catch (error) {
      console.error('Error in getGitStatus preload:', error);
      throw normalizeError(error);
    }
  },
  getGitBranch: async (folderPath: string) => {
    try {
      const result = await ipcRenderer.invoke('get-git-branch', folderPath);
      return result;
    } catch (error) {
      console.error('Error in getGitBranch preload:', error);
      throw normalizeError(error);
    }
  },
  gitStageFile: async (folderPath: string, filePath: string) => {
    try {
      const result = await ipcRenderer.invoke(
        'git-stage-file',
        folderPath,
        filePath,
      );
      return result;
    } catch (error) {
      console.error('Error in gitStageFile preload:', error);
      throw normalizeError(error);
    }
  },
  gitUnstageFile: async (folderPath: string, filePath: string) => {
    try {
      const result = await ipcRenderer.invoke(
        'git-unstage-file',
        folderPath,
        filePath,
      );
      return result;
    } catch (error) {
      console.error('Error in gitUnstageFile preload:', error);
      throw normalizeError(error);
    }
  },
  gitStageAll: async (folderPath: string) => {
    try {
      const result = await ipcRenderer.invoke('git-stage-all', folderPath);
      return result;
    } catch (error) {
      console.error('Error in gitStageAll preload:', error);
      throw normalizeError(error);
    }
  },
  gitUnstageAll: async (folderPath: string) => {
    try {
      const result = await ipcRenderer.invoke('git-unstage-all', folderPath);
      return result;
    } catch (error) {
      console.error('Error in gitUnstageAll preload:', error);
      throw normalizeError(error);
    }
  },
  gitCommit: async (folderPath: string, message: string) => {
    try {
      const result = await ipcRenderer.invoke(
        'git-commit',
        folderPath,
        message,
      );
      return result;
    } catch (error) {
      console.error('Error in gitCommit preload:', error);
      throw normalizeError(error);
    }
  },
  gitPush: async (folderPath: string) => {
    try {
      const result = await ipcRenderer.invoke('git-push', folderPath);
      return result;
    } catch (error) {
      console.error('Error in gitPush preload:', error);
      throw normalizeError(error);
    }
  },
  gitPull: async (folderPath: string) => {
    try {
      const result = await ipcRenderer.invoke('git-pull', folderPath);
      return result;
    } catch (error) {
      console.error('Error in gitPull preload:', error);
      throw normalizeError(error);
    }
  },
  gitPullMerge: async (folderPath: string) => {
    try {
      const result = await ipcRenderer.invoke('git-pull-merge', folderPath);
      return result;
    } catch (error) {
      console.error('Error in gitPullMerge preload:', error);
      throw normalizeError(error);
    }
  },
  gitPullRebase: async (folderPath: string) => {
    try {
      const result = await ipcRenderer.invoke('git-pull-rebase', folderPath);
      return result;
    } catch (error) {
      console.error('Error in gitPullRebase preload:', error);
      throw normalizeError(error);
    }
  },
  gitResetToRemote: async (folderPath: string) => {
    try {
      const result = await ipcRenderer.invoke(
        'git-reset-to-remote',
        folderPath,
      );
      return result;
    } catch (error) {
      console.error('Error in gitResetToRemote preload:', error);
      throw normalizeError(error);
    }
  },
  gitRestoreFile: async (folderPath: string, filePath: string) => {
    try {
      const result = await ipcRenderer.invoke(
        'git-restore-file',
        folderPath,
        filePath,
      );
      return result;
    } catch (error) {
      console.error('Error in gitRestoreFile preload:', error);
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
  onMenuQuickOpenFile: (callback: () => void) => {
    const listener = () => callback();
    ipcRenderer.on('menu-quick-open-file', listener);
    return () => ipcRenderer.removeListener('menu-quick-open-file', listener);
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
  setZoomLevel: async (zoomLevel: number) => {
    try {
      const result = await ipcRenderer.invoke('set-zoom-level', zoomLevel);
      return result;
    } catch (error) {
      console.error('Error in setZoomLevel preload:', error);
      throw normalizeError(error);
    }
  },
  getAllFilesForQuickOpen: async () => {
    try {
      const result = await ipcRenderer.invoke('get-all-files-for-quick-open');
      return result;
    } catch (error) {
      console.error('Error in getAllFilesForQuickOpen preload:', error);
      throw normalizeError(error);
    }
  },

  // Tree loading events
  onTreeInitialUpdate: (callback: (data: any) => void) => {
    const listener = (_event: any, data: any) => callback(data);
    ipcRenderer.on('tree-initial-update', listener);
    return () => ipcRenderer.removeListener('tree-initial-update', listener);
  },
  onTreeLoadingProgress: (callback: (data: any) => void) => {
    const listener = (_event: any, data: any) => callback(data);
    ipcRenderer.on('tree-loading-progress', listener);
    return () => ipcRenderer.removeListener('tree-loading-progress', listener);
  },
  onTreeLoadingComplete: (callback: (data: any) => void) => {
    const listener = (_event: any, data: any) => callback(data);
    ipcRenderer.on('tree-loading-complete', listener);
    return () => ipcRenderer.removeListener('tree-loading-complete', listener);
  },
  onTreeLoadingError: (callback: (data: any) => void) => {
    const listener = (_event: any, data: any) => callback(data);
    ipcRenderer.on('tree-loading-error', listener);
    return () => ipcRenderer.removeListener('tree-loading-error', listener);
  },
};

contextBridge.exposeInMainWorld('electron', renderer);

export type ERenderer = typeof renderer;
