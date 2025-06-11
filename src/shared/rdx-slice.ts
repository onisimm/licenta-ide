import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  IFolderStructure,
  IMainState,
  TFolderTree,
  ISelectedFile,
  IOpenFile,
} from './types';

// Search-related interfaces (moved from search-section.tsx)
interface SearchMatch {
  lineNumber: number;
  lineContent: string;
  matchCount: number;
}

interface SearchFileResult {
  filePath: string;
  fileName: string;
  matches: SearchMatch[];
  totalMatches: number;
}

interface SearchResults {
  query: string;
  totalMatches: number;
  fileCount: number;
  filesSearched?: number;
  filesSkipped?: number;
  searchDuration?: number;
  results: SearchFileResult[];
}

interface SearchState {
  query: string;
  results: SearchResults | null;
  isSearching: boolean;
  error: string | null;
  expandedFiles: string[]; // Array instead of Set for serialization
}

interface SidebarState {
  explorerExpanded: boolean; // Root folder expansion state
  lastClickedItem: TFolderTree | null; // Track last clicked item for context operations
  collapseTimestamp: number; // Timestamp when collapse all was triggered
}

// App state for application-level settings
interface AppState {
  title: string;
}

// Updated main state interface
interface IMainStateWithPersistence extends IMainState {
  searchState: SearchState;
  sidebarState: SidebarState;
  appState: AppState;
}

// Define the initial state using that type
const initialState: IMainStateWithPersistence = {
  folderStructure: {} as IFolderStructure,
  selectedFile: null, // Keep for backward compatibility
  isLoadingFile: false,
  // New tab-related state
  openFiles: [],
  activeFileIndex: -1, // -1 means no file is active
  searchState: {
    query: '',
    results: null,
    isSearching: false,
    error: null,
    expandedFiles: [],
  },
  sidebarState: {
    explorerExpanded: true,
    lastClickedItem: null,
    collapseTimestamp: 0,
  },
  appState: {
    title: 'SEditor',
  },
};

// Helper function to update tree items recursively
const updateTreeItemRecursively = (
  items: TFolderTree[],
  targetPath: string,
  updates: Partial<TFolderTree>,
): TFolderTree[] => {
  return items.map(item => {
    if (item.path === targetPath) {
      return { ...item, ...updates };
    }
    if (item.children) {
      return {
        ...item,
        children: updateTreeItemRecursively(item.children, targetPath, updates),
      };
    }
    return item;
  });
};

export const mainSlice = createSlice({
  name: 'main',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setFolderStructure: (state, action: PayloadAction<IFolderStructure>) => {
      state.folderStructure = action.payload;
      // Clear selected file when folder changes but keep tabs
      state.selectedFile = null;
    },
    updateTreeItem: (
      state,
      action: PayloadAction<{ path: string; updates: Partial<TFolderTree> }>,
    ) => {
      const { path, updates } = action.payload;
      if (state.folderStructure.tree) {
        state.folderStructure.tree = updateTreeItemRecursively(
          state.folderStructure.tree,
          path,
          updates,
        );
      }
    },
    setLoadingFile: (state, action: PayloadAction<boolean>) => {
      state.isLoadingFile = action.payload;
    },
    setSelectedFile: (state, action: PayloadAction<ISelectedFile>) => {
      state.selectedFile = action.payload;
      state.isLoadingFile = false;
    },
    updateSelectedFileContent: (state, action: PayloadAction<string>) => {
      if (state.selectedFile) {
        state.selectedFile.content = action.payload;
      }
    },
    clearSelectedFile: state => {
      state.selectedFile = null;
      state.isLoadingFile = false;
    },
    clearFolderStructure: state => {
      state.folderStructure = {} as IFolderStructure;
      state.selectedFile = null;
      state.isLoadingFile = false;
      // Clear tabs when folder is closed
      state.openFiles = [];
      state.activeFileIndex = -1;
    },

    // New tab-related actions
    openFileInTab: (state, action: PayloadAction<ISelectedFile>) => {
      const fileToOpen = action.payload;

      // Check if file is already open
      const existingIndex = state.openFiles.findIndex(
        f => f.path === fileToOpen.path,
      );

      if (existingIndex >= 0) {
        // File already open, just switch to it
        state.activeFileIndex = existingIndex;
        state.selectedFile = state.openFiles[existingIndex];
      } else {
        // Add new file to tabs
        const newOpenFile: IOpenFile = {
          ...fileToOpen,
          hasUnsavedChanges: false,
          originalContent: fileToOpen.content,
        };

        state.openFiles.push(newOpenFile);
        state.activeFileIndex = state.openFiles.length - 1;
        state.selectedFile = newOpenFile;
      }

      state.isLoadingFile = false;
    },

    switchToTab: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index >= 0 && index < state.openFiles.length) {
        state.activeFileIndex = index;
        state.selectedFile = state.openFiles[index];
      }
    },

    closeTab: (state, action: PayloadAction<number>) => {
      const indexToClose = action.payload;

      if (indexToClose >= 0 && indexToClose < state.openFiles.length) {
        // Remove the file from open files
        state.openFiles.splice(indexToClose, 1);

        // Adjust active index
        if (state.openFiles.length === 0) {
          // No files left
          state.activeFileIndex = -1;
          state.selectedFile = null;
        } else if (indexToClose <= state.activeFileIndex) {
          // If we closed the active tab or a tab before it
          if (indexToClose === state.activeFileIndex) {
            // Closed the active tab - switch to the next tab, or previous if it was the last
            const newActiveIndex = Math.min(
              indexToClose,
              state.openFiles.length - 1,
            );
            state.activeFileIndex = newActiveIndex;
            state.selectedFile = state.openFiles[newActiveIndex];
          } else {
            // Closed a tab before the active one - just adjust the index
            state.activeFileIndex = state.activeFileIndex - 1;
          }
        }
        // If we closed a tab after the active one, no adjustment needed
      }
    },

    updateActiveFileContent: (state, action: PayloadAction<string>) => {
      const newContent = action.payload;

      // Update the active file in both places
      if (state.selectedFile && state.activeFileIndex >= 0) {
        state.selectedFile.content = newContent;

        const activeFile = state.openFiles[state.activeFileIndex];
        if (activeFile) {
          activeFile.content = newContent;
          // Mark as having unsaved changes if content differs from original
          activeFile.hasUnsavedChanges =
            newContent !== activeFile.originalContent;
        }
      }
    },

    markTabAsSaved: (state, action: PayloadAction<number>) => {
      const tabIndex = action.payload;
      if (tabIndex >= 0 && tabIndex < state.openFiles.length) {
        const file = state.openFiles[tabIndex];
        file.hasUnsavedChanges = false;
        file.originalContent = file.content; // Update the original content
      }
    },

    closeAllTabs: state => {
      state.openFiles = [];
      state.activeFileIndex = -1;
      state.selectedFile = null;
    },

    // Search state actions
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchState.query = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<SearchResults | null>) => {
      state.searchState.results = action.payload;
    },
    setSearchLoading: (state, action: PayloadAction<boolean>) => {
      state.searchState.isSearching = action.payload;
    },
    setSearchError: (state, action: PayloadAction<string | null>) => {
      state.searchState.error = action.payload;
    },
    setSearchExpandedFiles: (state, action: PayloadAction<string[]>) => {
      state.searchState.expandedFiles = action.payload;
    },
    toggleSearchFileExpansion: (state, action: PayloadAction<string>) => {
      const filePath = action.payload;
      const expandedFiles = state.searchState.expandedFiles;
      const index = expandedFiles.indexOf(filePath);

      if (index >= 0) {
        // Remove if exists
        state.searchState.expandedFiles = expandedFiles.filter(
          path => path !== filePath,
        );
      } else {
        // Add if doesn't exist
        state.searchState.expandedFiles.push(filePath);
      }
    },
    clearSearchState: state => {
      state.searchState = {
        query: '',
        results: null,
        isSearching: false,
        error: null,
        expandedFiles: [],
      };
    },
    // Sidebar state actions
    setExplorerExpanded: (state, action: PayloadAction<boolean>) => {
      state.sidebarState.explorerExpanded = action.payload;
    },
    setLastClickedItem: (state, action: PayloadAction<TFolderTree | null>) => {
      state.sidebarState.lastClickedItem = action.payload;
    },
    addTreeItem: (
      state,
      action: PayloadAction<{ parentPath: string; newItem: TFolderTree }>,
    ) => {
      const { parentPath, newItem } = action.payload;

      if (parentPath === state.folderStructure.root) {
        // Add to root
        state.folderStructure.tree.push(newItem);
        // Sort items - directories first, then alphabetically
        state.folderStructure.tree.sort((a, b) => {
          if (a.isDirectory && !b.isDirectory) return -1;
          if (!a.isDirectory && b.isDirectory) return 1;
          return a.name.localeCompare(b.name);
        });
      } else {
        // Add to specific parent folder
        const addToParent = (items: TFolderTree[]): TFolderTree[] => {
          return items.map(item => {
            if (item.path === parentPath && item.isDirectory) {
              const updatedChildren = [...(item.children || []), newItem];
              // Sort children - directories first, then alphabetically
              updatedChildren.sort((a, b) => {
                if (a.isDirectory && !b.isDirectory) return -1;
                if (!a.isDirectory && b.isDirectory) return 1;
                return a.name.localeCompare(b.name);
              });
              return {
                ...item,
                children: updatedChildren,
                childrenLoaded: true,
              };
            }
            if (item.children) {
              return {
                ...item,
                children: addToParent(item.children),
              };
            }
            return item;
          });
        };

        state.folderStructure.tree = addToParent(state.folderStructure.tree);
      }
    },
    collapseAllFolders: state => {
      const collapseRecursively = (items: TFolderTree[]): TFolderTree[] => {
        return items.map(item => ({
          ...item,
          children: item.children
            ? collapseRecursively(item.children)
            : undefined,
        }));
      };

      if (state.folderStructure.tree) {
        state.folderStructure.tree = collapseRecursively(
          state.folderStructure.tree,
        );
      }
      // Keep root folder expanded - only collapse tree items
      // Set timestamp to notify FileTree component
      state.sidebarState.collapseTimestamp = Date.now();
    },
    removeTreeItem: (state, action: PayloadAction<string>) => {
      const itemPath = action.payload;

      // Recursive function to remove item from tree
      const removeFromTree = (items: TFolderTree[]): TFolderTree[] => {
        return items.filter(item => {
          if (item.path === itemPath) {
            return false; // Remove this item
          }
          if (item.children) {
            item.children = removeFromTree(item.children);
          }
          return true; // Keep this item
        });
      };

      if (state.folderStructure.tree) {
        state.folderStructure.tree = removeFromTree(state.folderStructure.tree);
      }
    },
    renameTreeItem: (
      state,
      action: PayloadAction<{
        oldPath: string;
        newPath: string;
        newName: string;
      }>,
    ) => {
      const { oldPath, newPath, newName } = action.payload;

      // Recursive function to rename item and update all its children's paths
      const renameInTree = (items: TFolderTree[]): TFolderTree[] => {
        return items.map(item => {
          if (item.path === oldPath) {
            // Update the item itself
            return {
              ...item,
              name: newName,
              path: newPath,
              children: item.children
                ? updateChildrenPaths(item.children, oldPath, newPath)
                : undefined,
            };
          }
          if (item.children) {
            return {
              ...item,
              children: renameInTree(item.children),
            };
          }
          return item;
        });
      };

      // Helper function to update all children paths when a parent is renamed
      const updateChildrenPaths = (
        children: TFolderTree[],
        oldParentPath: string,
        newParentPath: string,
      ): TFolderTree[] => {
        return children.map(child => {
          const newChildPath = child.path.replace(oldParentPath, newParentPath);
          return {
            ...child,
            path: newChildPath,
            parentPath: newParentPath,
            children: child.children
              ? updateChildrenPaths(child.children, child.path, newChildPath)
              : undefined,
          };
        });
      };

      if (state.folderStructure.tree) {
        state.folderStructure.tree = renameInTree(state.folderStructure.tree);
      }
    },
    // App state actions
    setAppTitle: (state, action: PayloadAction<string>) => {
      state.appState.title = action.payload;
    },
  },
});

export const {
  setFolderStructure,
  updateTreeItem,
  setLoadingFile,
  setSelectedFile,
  updateSelectedFileContent,
  clearSelectedFile,
  clearFolderStructure,
  // New tab actions
  openFileInTab,
  switchToTab,
  closeTab,
  updateActiveFileContent,
  markTabAsSaved,
  closeAllTabs,
  // Search actions
  setSearchQuery,
  setSearchResults,
  setSearchLoading,
  setSearchError,
  setSearchExpandedFiles,
  toggleSearchFileExpansion,
  clearSearchState,
  setExplorerExpanded,
  setLastClickedItem,
  addTreeItem,
  collapseAllFolders,
  removeTreeItem,
  renameTreeItem,
  setAppTitle,
} = mainSlice.actions;

// Export types for use in components
export type {
  SearchMatch,
  SearchFileResult,
  SearchResults,
  SearchState,
  SidebarState,
  AppState,
};

export default mainSlice.reducer;
