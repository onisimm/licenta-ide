import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import type { RootState, AppDispatch } from './store';
import {
  clearFolderStructure,
  setFolderStructure,
  setSelectedFile,
  clearSelectedFile,
  updateSelectedFileContent,
  setAppTitle,
  // New tab actions
  openFileInTab,
  openFileInTabWithOptions,
  switchToTab,
  closeTab,
  updateActiveFileContent,
  markTabAsSaved,
  closeAllTabs,
} from './rdx-slice';
import { logError } from './utils';
import { initializeGitIgnore } from './gitignore-utils';
import { markGitIgnoredFiles } from '../components/explorer/utils';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

// Hook for app title operations
export const useAppTitle = () => {
  const dispatch = useAppDispatch();
  const title = useAppSelector(state => state.main.appState.title);

  const updateTitle = useCallback(
    (newTitle: string) => {
      dispatch(setAppTitle(newTitle));
    },
    [dispatch],
  );

  return { title, updateTitle };
};

// Comprehensive hook for all file and folder operations
export const useProjectOperations = () => {
  const dispatch = useAppDispatch();
  const folderStructure = useAppSelector(state => state.main.folderStructure);
  const selectedFile = useAppSelector(state => state.main.selectedFile);
  const { openFiles, activeFileIndex } = useAppSelector(state => ({
    openFiles: state.main.openFiles,
    activeFileIndex: state.main.activeFileIndex,
  }));

  // Get the currently active file
  const activeFile =
    openFiles.length > 0 && activeFileIndex >= 0
      ? openFiles[activeFileIndex]
      : null;

  // Open file or folder operation
  const openFileOrFolder = useCallback(async () => {
    try {
      const result = await window.electron.openFileOrFolder();

      if (!result) {
        return null; // User cancelled or error occurred
      }

      if (result.type === 'folder') {
        // Handle folder selection with gitignore support
        try {
          const gitIgnoreChecker = await initializeGitIgnore(
            result.folder.root,
          );
          console.log(
            'GitIgnore patterns loaded:',
            gitIgnoreChecker.getPatterns(),
          );
          const updatedTree = markGitIgnoredFiles(
            result.folder.tree,
            gitIgnoreChecker,
          );
          dispatch(setFolderStructure({ ...result.folder, tree: updatedTree }));
          console.log('Folder opened with gitignore:', result.folder.name);
          return {
            type: 'folder',
            data: { ...result.folder, tree: updatedTree },
          };
        } catch (error) {
          console.warn('Failed to initialize gitignore:', error);
          dispatch(setFolderStructure(result.folder));
          console.log('Folder opened without gitignore:', result.folder.name);
          return { type: 'folder', data: result.folder };
        }
      } else if (result.type === 'file') {
        // Handle file selection - open in tab system
        dispatch(openFileInTab(result.file));
        console.log('File opened in tab:', result.file.name);
        return { type: 'file', data: result.file };
      }

      return null;
    } catch (error) {
      console.error('Error opening file or folder:', error);
      logError('Open File/Folder', error);
      throw error;
    }
  }, [dispatch]);

  // Open folder only operation (for Explorer)
  const openFolderOnly = useCallback(async () => {
    try {
      const folder = await window.electron.openFolder();
      if (folder && Object.keys(folder).length > 0) {
        try {
          const gitIgnoreChecker = await initializeGitIgnore(folder.root);
          console.log(
            'GitIgnore patterns loaded:',
            gitIgnoreChecker.getPatterns(),
          );
          const updatedTree = markGitIgnoredFiles(
            folder.tree,
            gitIgnoreChecker,
          );
          dispatch(setFolderStructure({ ...folder, tree: updatedTree }));
          return { type: 'folder', data: { ...folder, tree: updatedTree } };
        } catch (error) {
          console.warn('Failed to initialize gitignore:', error);
          dispatch(setFolderStructure(folder));
          return { type: 'folder', data: folder };
        }
      }
      return null;
    } catch (error) {
      console.error('Error opening folder:', error);
      logError('Open Folder', error);
      throw error;
    }
  }, [dispatch]);

  // Save file operation - updated for tabs
  const saveFile = useCallback(
    async (editorContentGetter: () => string | undefined) => {
      if (!activeFile || !activeFile.path) {
        console.warn('No active file to save');
        throw new Error('No active file to save');
      }

      // Get current content directly from Monaco editor
      const currentContent = editorContentGetter();
      if (currentContent === undefined) {
        console.warn('Could not get content from editor');
        throw new Error('Could not get content from editor');
      }

      try {
        console.log(
          'Saving file:',
          activeFile.path,
          'with content length:',
          currentContent.length,
        );

        const result = await window.electron.saveFile(
          activeFile.path,
          currentContent,
        );

        if (result.success) {
          console.log('File saved successfully:', result.path);

          // Verify the save by reading the file back
          try {
            const verifyResult = await window.electron.readFile(
              activeFile.path,
            );
            if (verifyResult.content === currentContent) {
              console.log(
                '✅ Save verified - file content matches what we saved',
              );
            } else {
              console.error(
                '❌ Save verification failed - file content does not match',
              );
              console.log(
                'Expected length:',
                currentContent.length,
                'Actual length:',
                verifyResult.content.length,
              );
            }
          } catch (verifyError) {
            console.warn('Could not verify save:', verifyError);
          }

          // Mark the tab as saved and update content
          dispatch(markTabAsSaved(activeFileIndex));
          dispatch(updateActiveFileContent(currentContent));
          return result;
        }

        throw new Error('Save operation failed');
      } catch (error) {
        console.error('Error saving file:', error);
        logError('File Save', error);

        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Error saving file: ${errorMessage}`);
      }
    },
    [activeFile, activeFileIndex, dispatch],
  );

  // Close file operation - updated for tabs
  const closeFile = useCallback(
    (editorContentGetter: () => string | undefined) => {
      if (!activeFile) {
        console.warn('No active file to close');
        return;
      }

      // Check if file has unsaved changes
      const currentContent = editorContentGetter();
      const hasUnsavedChanges =
        activeFile.hasUnsavedChanges ||
        currentContent !== activeFile.originalContent;

      if (hasUnsavedChanges) {
        // Ask user if they want to save before closing
        const shouldSave = window.confirm(
          `The file "${activeFile.name}" has unsaved changes. Do you want to save before closing?`,
        );

        if (shouldSave) {
          // Save first, then close
          saveFile(editorContentGetter)
            .then(() => {
              dispatch(closeTab(activeFileIndex));
              console.log('File saved and closed:', activeFile.name);
            })
            .catch(error => {
              console.error('Error saving before close:', error);
              // Ask if they want to close without saving
              const forceClose = window.confirm(
                'Failed to save the file. Do you want to close without saving?',
              );
              if (forceClose) {
                dispatch(closeTab(activeFileIndex));
                console.log('File closed without saving:', activeFile.name);
              }
            });
        } else {
          // Ask for confirmation to close without saving
          const confirmClose = window.confirm(
            'Are you sure you want to close without saving your changes?',
          );
          if (confirmClose) {
            dispatch(closeTab(activeFileIndex));
            console.log('File closed without saving:', activeFile.name);
          }
        }
      } else {
        // No unsaved changes, close directly
        dispatch(closeTab(activeFileIndex));
        console.log('File closed:', activeFile.name);
      }
    },
    [activeFile, activeFileIndex, dispatch, saveFile],
  );

  // Close folder operation - updated for tabs
  const closeFolder = useCallback(
    (editorContentGetter?: () => string | undefined) => {
      const hasFolder =
        folderStructure && Object.keys(folderStructure).length > 0;

      if (!hasFolder) {
        console.warn('No folder to close');
        return;
      }

      // Check if any files have unsaved changes
      const hasUnsavedChanges = openFiles.some(file => file.hasUnsavedChanges);

      if (hasUnsavedChanges) {
        const shouldContinue = window.confirm(
          `Some files have unsaved changes. Closing the folder "${folderStructure.name}" will close all files. Do you want to continue?`,
        );

        if (!shouldContinue) {
          return; // User cancelled
        }
      } else if (openFiles.length > 0) {
        // No unsaved changes but files are open
        const shouldContinue = window.confirm(
          `Closing the folder "${folderStructure.name}" will close all open files. Do you want to continue?`,
        );

        if (!shouldContinue) {
          return; // User cancelled
        }
      }

      // Clear the entire folder structure and all tabs
      dispatch(clearFolderStructure());
      console.log('Folder closed:', folderStructure.name);
    },
    [folderStructure, openFiles, dispatch],
  );

  // Search in folder operation
  const searchInFolder = useCallback(
    async (searchQuery: string) => {
      if (!folderStructure || !folderStructure.root) {
        throw new Error('No folder opened to search in');
      }

      if (!searchQuery.trim()) {
        throw new Error('Search query cannot be empty');
      }

      try {
        console.log(
          'Searching in folder:',
          folderStructure.root,
          'for:',
          searchQuery,
        );
        const results = await window.electron.searchInFolder(
          folderStructure.root,
          searchQuery,
        );
        return results;
      } catch (error) {
        console.error('Error searching in folder:', error);
        logError('Search in Folder', error);
        throw error;
      }
    },
    [folderStructure],
  );

  // Open file at specific line - ULTRA OPTIMIZED (updated for tabs)
  const openFileAtLine = useCallback(
    async (filePath: string, lineNumber: number) => {
      try {
        console.log('Opening file at line:', filePath, 'line:', lineNumber);

        // Read the file
        const fileData = await window.electron.readFile(filePath);

        if (fileData) {
          // Open file in tab system
          dispatch(openFileInTab(fileData));

          // Handle line positioning directly via a custom event
          // This avoids Redux state changes and re-renders
          setTimeout(() => {
            window.dispatchEvent(
              new CustomEvent('monaco-scroll-to-line', {
                detail: { lineNumber },
              }),
            );
          }, 0);

          console.log(
            'File opened at line:',
            fileData.name,
            'line:',
            lineNumber,
          );
          return { file: fileData, lineNumber };
        }

        throw new Error('Failed to read file');
      } catch (error) {
        console.error('Error opening file at line:', error);
        logError('Open File at Line', error);
        throw error;
      }
    },
    [dispatch],
  );

  // Open file at specific line with options (read-only support)
  const openFileAtLineWithOptions = useCallback(
    async (
      filePath: string,
      lineNumber: number,
      options: { readOnly?: boolean } = {},
    ) => {
      try {
        console.log(
          'Opening file at line with options:',
          filePath,
          'line:',
          lineNumber,
          'options:',
          options,
        );

        // Read the file
        const fileData = await window.electron.readFile(filePath);

        if (fileData) {
          // Open file in tab system with options
          dispatch(
            openFileInTabWithOptions({
              file: fileData,
              readOnly: options.readOnly,
            }),
          );

          // Handle line positioning directly via a custom event
          setTimeout(() => {
            window.dispatchEvent(
              new CustomEvent('monaco-scroll-to-line', {
                detail: { lineNumber },
              }),
            );
          }, 0);

          console.log(
            'File opened at line with options:',
            fileData.name,
            'line:',
            lineNumber,
            'readOnly:',
            options.readOnly,
          );
          return { file: fileData, lineNumber, readOnly: options.readOnly };
        }

        throw new Error('Failed to read file');
      } catch (error) {
        console.error('Error opening file at line with options:', error);
        logError('Open File at Line with Options', error);
        throw error;
      }
    },
    [dispatch],
  );

  return {
    // Operations
    openFileOrFolder,
    openFolderOnly,
    saveFile,
    closeFile,
    closeFolder,
    searchInFolder,
    openFileAtLine,
    openFileAtLineWithOptions,

    // State information
    hasFolder: folderStructure && Object.keys(folderStructure).length > 0,
    folderName: folderStructure?.name,
    folderPath: folderStructure?.root,
    folderStructure,
    selectedFile,
    hasSelectedFile: !!selectedFile,
    // New tab-related state
    openFiles,
    activeFileIndex,
    activeFile,
    hasOpenFiles: openFiles.length > 0,

    // Utility functions
    hasUnsavedChanges: (editorContentGetter: () => string | undefined) => {
      if (!activeFile) return false;
      const currentContent = editorContentGetter();
      return (
        activeFile.hasUnsavedChanges ||
        currentContent !== activeFile.originalContent
      );
    },
  };
};
