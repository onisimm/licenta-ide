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

  // File operations
  saveFile: async (filePath: string, content: string) => {
    try {
      const result = await ipcRenderer.invoke('save-file', filePath, content);
      return result;
    } catch (error) {
      console.error('Error in saveFile preload:', error);
      throw normalizeError(error);
    }
  },
  createFile: async (filePath: string, content: string = '') => {
    try {
      const result = await ipcRenderer.invoke('create-file', filePath, content);
      return result;
    } catch (error) {
      console.error('Error in createFile preload:', error);
      throw normalizeError(error);
    }
  },
  createFolder: async (folderPath: string) => {
    try {
      const result = await ipcRenderer.invoke('create-folder', folderPath);
      return result;
    } catch (error) {
      console.error('Error in createFolder preload:', error);
      throw normalizeError(error);
    }
  },

  refreshFolder: async () => {
    try {
      const result = await ipcRenderer.invoke('refresh-folder');
      return result;
    } catch (error) {
      console.error('Error in refreshFolder preload:', error);
      throw normalizeError(error);
    }
  },

  deleteFile: async (filePath: string) => {
    try {
      const result = await ipcRenderer.invoke('delete-file', filePath);
      return result;
    } catch (error) {
      console.error('Error in deleteFile preload:', error);
      throw normalizeError(error);
    }
  },
  deleteFolder: async (folderPath: string) => {
    try {
      const result = await ipcRenderer.invoke('delete-folder', folderPath);
      return result;
    } catch (error) {
      console.error('Error in deleteFolder preload:', error);
      throw normalizeError(error);
    }
  },

  renameFile: async (oldPath: string, newPath: string) => {
    try {
      const result = await ipcRenderer.invoke('rename-file', oldPath, newPath);
      return result;
    } catch (error) {
      console.error('Error in renameFile preload:', error);
      throw normalizeError(error);
    }
  },
  renameFolder: async (oldPath: string, newPath: string) => {
    try {
      const result = await ipcRenderer.invoke(
        'rename-folder',
        oldPath,
        newPath,
      );
      return result;
    } catch (error) {
      console.error('Error in renameFolder preload:', error);
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

  // Terminal operations
  openTerminal: async (folderPath?: string) => {
    try {
      const result = await ipcRenderer.invoke('open-terminal', folderPath);
      return result;
    } catch (error) {
      console.error('Error in openTerminal preload:', error);
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
  onMenuOpenTerminal: (callback: () => void) => {
    const listener = () => callback();
    ipcRenderer.on('menu-open-terminal', listener);
    return () => ipcRenderer.removeListener('menu-open-terminal', listener);
  },
  onMenuFocusExplorer: (callback: () => void) => {
    const listener = () => callback();
    ipcRenderer.on('menu-focus-explorer', listener);
    return () => ipcRenderer.removeListener('menu-focus-explorer', listener);
  },
  onMenuFocusSearch: (callback: () => void) => {
    const listener = () => callback();
    ipcRenderer.on('menu-focus-search', listener);
    return () => ipcRenderer.removeListener('menu-focus-search', listener);
  },
  onMenuFocusGit: (callback: () => void) => {
    const listener = () => callback();
    ipcRenderer.on('menu-focus-git', listener);
    return () => ipcRenderer.removeListener('menu-focus-git', listener);
  },
  onMenuFocusAIChat: (callback: () => void) => {
    const listener = () => callback();
    ipcRenderer.on('menu-focus-aichat', listener);
    return () => ipcRenderer.removeListener('menu-focus-aichat', listener);
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
  getZoomLevel: async () => {
    try {
      const result = await ipcRenderer.invoke('get-zoom-level');
      return result;
    } catch (error) {
      console.error('Error in getZoomLevel preload:', error);
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

  // Settings persistence methods
  getTheme: async () => {
    try {
      const result = await ipcRenderer.invoke('get-theme');
      return result;
    } catch (error) {
      console.error('Error in getTheme preload:', error);
      throw normalizeError(error);
    }
  },
  setTheme: async (theme: string) => {
    try {
      const result = await ipcRenderer.invoke('set-theme', theme);
      return result;
    } catch (error) {
      console.error('Error in setTheme preload:', error);
      throw normalizeError(error);
    }
  },
  getSidebarWidth: async () => {
    try {
      const result = await ipcRenderer.invoke('get-sidebar-width');
      return result;
    } catch (error) {
      console.error('Error in getSidebarWidth preload:', error);
      throw normalizeError(error);
    }
  },
  setSidebarWidth: async (width: number) => {
    try {
      const result = await ipcRenderer.invoke('set-sidebar-width', width);
      return result;
    } catch (error) {
      console.error('Error in setSidebarWidth preload:', error);
      throw normalizeError(error);
    }
  },

  // Git diff operations
  gitGetFileDiff: async (folderPath: string, filePath: string) => {
    try {
      const result = await ipcRenderer.invoke(
        'git-get-file-diff',
        folderPath,
        filePath,
      );
      return result;
    } catch (error) {
      console.error('Error in gitGetFileDiff preload:', error);
      throw normalizeError(error);
    }
  },
  gitGetStagedDiff: async (folderPath: string, filePath: string) => {
    try {
      const result = await ipcRenderer.invoke(
        'git-get-staged-diff',
        folderPath,
        filePath,
      );
      return result;
    } catch (error) {
      console.error('Error in gitGetStagedDiff preload:', error);
      throw normalizeError(error);
    }
  },

  // Git branch operations
  gitListBranches: async (folderPath: string) => {
    try {
      const result = await ipcRenderer.invoke('git-list-branches', folderPath);
      return result;
    } catch (error) {
      console.error('Error in gitListBranches preload:', error);
      throw normalizeError(error);
    }
  },
  gitSwitchBranch: async (
    folderPath: string,
    branchName: string,
    force?: boolean,
  ) => {
    try {
      const result = await ipcRenderer.invoke(
        'git-switch-branch',
        folderPath,
        branchName,
        force,
      );
      return result;
    } catch (error) {
      console.error('Error in gitSwitchBranch preload:', error);
      throw normalizeError(error);
    }
  },
  gitCreateBranch: async (
    folderPath: string,
    branchName: string,
    switchToBranch: boolean = true,
  ) => {
    try {
      const result = await ipcRenderer.invoke(
        'git-create-branch',
        folderPath,
        branchName,
        switchToBranch,
      );
      return result;
    } catch (error) {
      console.error('Error in gitCreateBranch preload:', error);
      throw normalizeError(error);
    }
  },
  gitDeleteBranch: async (
    folderPath: string,
    branchName: string,
    force: boolean = false,
  ) => {
    try {
      const result = await ipcRenderer.invoke(
        'git-delete-branch',
        folderPath,
        branchName,
        force,
      );
      return result;
    } catch (error) {
      console.error('Error in gitDeleteBranch preload:', error);
      throw normalizeError(error);
    }
  },
  gitStashChanges: async (folderPath: string, message?: string) => {
    try {
      const result = await ipcRenderer.invoke(
        'git-stash-changes',
        folderPath,
        message,
      );
      return result;
    } catch (error) {
      console.error('Error in gitStashChanges preload:', error);
      throw normalizeError(error);
    }
  },
  gitStashAndSwitch: async (
    folderPath: string,
    branchName: string,
    stashMessage?: string,
  ) => {
    try {
      const result = await ipcRenderer.invoke(
        'git-stash-and-switch',
        folderPath,
        branchName,
        stashMessage,
      );
      return result;
    } catch (error) {
      console.error('Error in gitStashAndSwitch preload:', error);
      throw normalizeError(error);
    }
  },
};

contextBridge.exposeInMainWorld('electron', renderer);

export type ERenderer = typeof renderer;
