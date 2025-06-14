import fs from 'fs';
import path from 'path';
import { ipcMain, dialog } from 'electron';
import { BrowserWindow } from 'electron';
import { getSelectedFolder, setSelectedFolder } from '../utils/storeUtils';
import {
  buildSingleLevelTreeAsync,
  buildInitialFileTreeAsync,
  loadCompleteTreeBackground,
} from '../utils/fileTreeUtils';

export const registerFolderHandlers = (mainWindow: BrowserWindow) => {
  ipcMain.handle('get-folder', async () => {
    return getSelectedFolder();
  });

  ipcMain.handle('open-folder', async () => {
    try {
      if (!mainWindow) {
        console.error('No main window available');
        return null;
      }

      const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory'],
        title: 'Select Directory',
      });

      console.log('Dialog result:', result);

      if (
        result.canceled ||
        !result.filePaths ||
        result.filePaths.length === 0
      ) {
        console.log('Dialog was cancelled or no paths selected');
        return null;
      }

      const selectedPath = result.filePaths[0];
      console.log('Selected path:', selectedPath);

      console.log('⚡ Loading first level (ultra-fast)...');
      const startTime = Date.now();
      const singleLevelTree = await buildSingleLevelTreeAsync(selectedPath);
      const singleLevelTime = Date.now() - startTime;
      console.log(`🚀 First level loaded in ${singleLevelTime}ms`);

      const initialStructure = {
        name: path.basename(selectedPath),
        root: selectedPath,
        tree: singleLevelTree,
        backgroundLoading: true,
      };

      setSelectedFolder(initialStructure);

      setImmediate(async () => {
        try {
          console.log('📁 Loading 2 levels (async)...');
          const twoLevelStart = Date.now();
          const twoLevelTree = await buildInitialFileTreeAsync(
            selectedPath,
            2,
            0,
          );
          const twoLevelTime = Date.now() - twoLevelStart;
          console.log(`✅ Two levels loaded in ${twoLevelTime}ms`);

          const updatedStructure = {
            name: path.basename(selectedPath),
            root: selectedPath,
            tree: twoLevelTree,
            backgroundLoading: true,
          };

          setSelectedFolder(updatedStructure);

          if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('tree-initial-update', {
              rootPath: selectedPath,
              tree: twoLevelTree,
            });
          }

          console.log('🚀 Starting complete background loading...');
          const completeTree = await loadCompleteTreeBackground(
            selectedPath,
            progress => {
              if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send('tree-loading-progress', {
                  rootPath: selectedPath,
                  progress,
                });
              }
            },
          );

          const completeStructure = {
            name: path.basename(selectedPath),
            root: selectedPath,
            tree: completeTree,
            backgroundLoading: false,
          };

          setSelectedFolder(completeStructure);

          if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('tree-loading-complete', {
              rootPath: selectedPath,
              tree: completeTree,
            });
          }

          console.log('🎉 Background tree loading completed and stored');
        } catch (error) {
          console.error('❌ Background tree loading failed:', error);

          if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('tree-loading-error', {
              rootPath: selectedPath,
              error: error instanceof Error ? error.message : 'Unknown error',
            });
          }

          const errorStructure = {
            name: path.basename(selectedPath),
            root: selectedPath,
            tree: singleLevelTree,
            backgroundLoading: false,
            backgroundLoadingFailed: true,
          };

          setSelectedFolder(errorStructure);
        }
      });

      return initialStructure;
    } catch (error) {
      console.error('Error in open-folder handler:', error);
      return null;
    }
  });

  ipcMain.handle('create-folder', async (event, folderPath: string) => {
    try {
      console.log('📁 Creating new folder:', folderPath);

      if (!folderPath || typeof folderPath !== 'string') {
        throw new Error('Invalid folder path provided');
      }

      if (fs.existsSync(folderPath)) {
        throw new Error('Folder already exists');
      }

      await fs.promises.mkdir(folderPath, { recursive: true });

      console.log('✅ Folder created successfully:', folderPath);
      return { success: true, path: folderPath };
    } catch (error) {
      console.error('❌ Error creating folder:', folderPath, error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
          ? error
          : 'Unknown error creating folder';

      throw new Error(`Failed to create folder: ${errorMessage}`);
    }
  });

  ipcMain.handle('delete-folder', async (event, folderPath: string) => {
    try {
      console.log('🗑️ Deleting folder:', folderPath);

      if (!folderPath || typeof folderPath !== 'string') {
        throw new Error('Invalid folder path provided');
      }

      if (!fs.existsSync(folderPath)) {
        throw new Error('Folder does not exist');
      }

      const stats = await fs.promises.stat(folderPath);
      if (!stats.isDirectory()) {
        throw new Error('Path is not a directory');
      }

      await fs.promises.rm(folderPath, { recursive: true, force: true });

      console.log('✅ Folder deleted successfully:', folderPath);
      return { success: true, path: folderPath };
    } catch (error) {
      console.error('❌ Error deleting folder:', folderPath, error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
          ? error
          : 'Unknown error deleting folder';

      throw new Error(`Failed to delete folder: ${errorMessage}`);
    }
  });

  ipcMain.handle(
    'rename-folder',
    async (event, oldPath: string, newPath: string) => {
      try {
        console.log('✏️ Renaming folder:', oldPath, '->', newPath);

        if (!oldPath || typeof oldPath !== 'string') {
          throw new Error('Invalid old folder path provided');
        }
        if (!newPath || typeof newPath !== 'string') {
          throw new Error('Invalid new folder path provided');
        }

        if (!fs.existsSync(oldPath)) {
          throw new Error('Folder does not exist');
        }

        if (fs.existsSync(newPath)) {
          throw new Error('A file or folder with that name already exists');
        }

        const stats = await fs.promises.stat(oldPath);
        if (!stats.isDirectory()) {
          throw new Error('Path is not a directory');
        }

        await fs.promises.rename(oldPath, newPath);

        console.log('✅ Folder renamed successfully:', oldPath, '->', newPath);
        return { success: true, oldPath, newPath };
      } catch (error) {
        console.error('❌ Error renaming folder:', oldPath, error);

        const errorMessage =
          error instanceof Error
            ? error.message
            : typeof error === 'string'
            ? error
            : 'Unknown error renaming folder';

        throw new Error(`Failed to rename folder: ${errorMessage}`);
      }
    },
  );

  ipcMain.handle('refresh-folder', async () => {
    try {
      console.log('🔄 Refreshing current folder structure...');

      const currentFolder = getSelectedFolder();

      if (!currentFolder || !currentFolder.root) {
        throw new Error('No folder currently open');
      }

      const folderPath = currentFolder.root;
      console.log('📁 Refreshing folder:', folderPath);

      const singleLevelTree = await buildSingleLevelTreeAsync(folderPath);

      const refreshedStructure = {
        name: path.basename(folderPath),
        root: folderPath,
        tree: singleLevelTree,
        backgroundLoading: false,
      };

      setSelectedFolder(refreshedStructure);

      const twoLevelTree = await buildInitialFileTreeAsync(folderPath, 2, 0);

      refreshedStructure.tree = twoLevelTree;

      setSelectedFolder(refreshedStructure);

      console.log('✅ Folder refreshed successfully');
      return refreshedStructure;
    } catch (error) {
      console.error('❌ Error refreshing folder:', error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
          ? error
          : 'Unknown error refreshing folder';

      throw new Error(`Failed to refresh folder: ${errorMessage}`);
    }
  });
};
