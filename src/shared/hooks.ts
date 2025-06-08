import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import type { RootState, AppDispatch } from './store';
import {
  clearFolderStructure,
  setFolderStructure,
  setSelectedFile,
  clearSelectedFile,
  updateSelectedFileContent,
} from './rdx-slice';
import { logError } from './utils';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

// Comprehensive hook for all file and folder operations
export const useProjectOperations = () => {
  const dispatch = useAppDispatch();
  const folderStructure = useAppSelector(state => state.main.folderStructure);
  const selectedFile = useAppSelector(state => state.main.selectedFile);

  // Open file or folder operation
  const openFileOrFolder = useCallback(async () => {
    try {
      const result = await window.electron.openFileOrFolder();

      if (!result) {
        return null; // User cancelled or error occurred
      }

      if (result.type === 'folder') {
        // Handle folder selection - update folder structure and clear any selected file
        dispatch(setFolderStructure(result.folder));
        console.log('Folder opened:', result.folder.name);
        return { type: 'folder', data: result.folder };
      } else if (result.type === 'file') {
        // Handle file selection - set the selected file but don't change folder structure
        dispatch(setSelectedFile(result.file));
        console.log('File opened:', result.file.name);
        return { type: 'file', data: result.file };
      }

      return null;
    } catch (error) {
      console.error('Error opening file or folder:', error);
      logError('Open File/Folder', error);
      throw error;
    }
  }, [dispatch]);

  // Save file operation
  const saveFile = useCallback(
    async (editorContentGetter: () => string | undefined) => {
      if (!selectedFile || !selectedFile.path) {
        console.warn('No file selected to save');
        throw new Error('No file selected to save');
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
          selectedFile.path,
          'with content length:',
          currentContent.length,
        );

        const result = await window.electron.saveFile(
          selectedFile.path,
          currentContent,
        );

        if (result.success) {
          console.log('File saved successfully:', result.path);

          // Verify the save by reading the file back
          try {
            const verifyResult = await window.electron.readFile(
              selectedFile.path,
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

          // Update Redux state with the saved content to keep it in sync
          dispatch(updateSelectedFileContent(currentContent));
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
    [selectedFile, dispatch],
  );

  // Close file operation
  const closeFile = useCallback(
    (editorContentGetter: () => string | undefined) => {
      if (!selectedFile) {
        console.warn('No file selected to close');
        return;
      }

      // Check if file has unsaved changes
      const currentContent = editorContentGetter();
      const hasUnsavedChanges = currentContent !== selectedFile.content;

      if (hasUnsavedChanges) {
        // Ask user if they want to save before closing
        const shouldSave = window.confirm(
          `The file "${selectedFile.name}" has unsaved changes. Do you want to save before closing?`,
        );

        if (shouldSave) {
          // Save first, then close
          saveFile(editorContentGetter)
            .then(() => {
              dispatch(clearSelectedFile());
              console.log('File saved and closed:', selectedFile.name);
            })
            .catch(error => {
              console.error('Error saving before close:', error);
              // Ask if they want to close without saving
              const forceClose = window.confirm(
                'Failed to save the file. Do you want to close without saving?',
              );
              if (forceClose) {
                dispatch(clearSelectedFile());
                console.log('File closed without saving:', selectedFile.name);
              }
            });
        } else {
          // Ask for confirmation to close without saving
          const confirmClose = window.confirm(
            'Are you sure you want to close without saving your changes?',
          );
          if (confirmClose) {
            dispatch(clearSelectedFile());
            console.log('File closed without saving:', selectedFile.name);
          }
        }
      } else {
        // No unsaved changes, close directly
        dispatch(clearSelectedFile());
        console.log('File closed:', selectedFile.name);
      }
    },
    [selectedFile, dispatch, saveFile],
  );

  // Close folder operation
  const closeFolder = useCallback(
    (editorContentGetter?: () => string | undefined) => {
      const hasFolder =
        folderStructure && Object.keys(folderStructure).length > 0;

      if (!hasFolder) {
        console.warn('No folder to close');
        return;
      }

      // Check if file has unsaved changes before closing folder
      let hasUnsavedChanges = false;

      if (selectedFile && editorContentGetter) {
        const currentContent = editorContentGetter();
        hasUnsavedChanges = currentContent !== selectedFile.content;
      }

      if (hasUnsavedChanges) {
        const shouldContinue = window.confirm(
          `The file "${selectedFile?.name}" has unsaved changes. Closing the folder "${folderStructure.name}" will close all files. Do you want to continue?`,
        );

        if (!shouldContinue) {
          return; // User cancelled
        }
      } else if (selectedFile) {
        // No unsaved changes but file is open
        const shouldContinue = window.confirm(
          `Closing the folder "${folderStructure.name}" will close all open files. Do you want to continue?`,
        );

        if (!shouldContinue) {
          return; // User cancelled
        }
      }

      // Clear the entire folder structure
      dispatch(clearFolderStructure());
      console.log('Folder closed:', folderStructure.name);
    },
    [folderStructure, selectedFile, dispatch],
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

  // Open file at specific line
  const openFileAtLine = useCallback(
    async (filePath: string, lineNumber: number) => {
      try {
        console.log('Opening file at line:', filePath, 'line:', lineNumber);

        // Read the file first
        const fileData = await window.electron.readFile(filePath);

        if (fileData) {
          // Set the selected file in Redux
          dispatch(setSelectedFile(fileData));
          console.log(
            'File opened at line:',
            fileData.name,
            'line:',
            lineNumber,
          );

          // Return line number for the editor to scroll to
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

  return {
    // Operations
    openFileOrFolder,
    saveFile,
    closeFile,
    closeFolder,
    searchInFolder,
    openFileAtLine,

    // State information
    hasFolder: folderStructure && Object.keys(folderStructure).length > 0,
    folderName: folderStructure?.name,
    folderPath: folderStructure?.root,
    selectedFile,
    hasSelectedFile: !!selectedFile,

    // Utility functions
    hasUnsavedChanges: (editorContentGetter: () => string | undefined) => {
      if (!selectedFile) return false;
      const currentContent = editorContentGetter();
      return currentContent !== selectedFile.content;
    },
  };
};
