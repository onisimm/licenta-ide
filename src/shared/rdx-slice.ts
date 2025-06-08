import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  IFolderStructure,
  IMainState,
  TFolderTree,
  ISelectedFile,
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
}

// Updated main state interface
interface IMainStateWithPersistence extends IMainState {
  searchState: SearchState;
  sidebarState: SidebarState;
}

// Define the initial state using that type
const initialState: IMainStateWithPersistence = {
  folderStructure: {} as IFolderStructure,
  selectedFile: null,
  isLoadingFile: false,
  searchState: {
    query: '',
    results: null,
    isSearching: false,
    error: null,
    expandedFiles: [],
  },
  sidebarState: {
    explorerExpanded: true,
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
      // Clear selected file when folder changes
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
  setSearchQuery,
  setSearchResults,
  setSearchLoading,
  setSearchError,
  setSearchExpandedFiles,
  toggleSearchFileExpansion,
  clearSearchState,
  setExplorerExpanded,
} = mainSlice.actions;

// Export types for use in components
export type {
  SearchMatch,
  SearchFileResult,
  SearchResults,
  SearchState,
  SidebarState,
};

export default mainSlice.reducer;
