import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  IFolderStructure,
  IMainState,
  TFolderTree,
  ISelectedFile,
} from './types';

// Define the initial state using that type
const initialState: IMainState = {
  folderStructure: {} as IFolderStructure,
  selectedFile: null,
  isLoadingFile: false,
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
} = mainSlice.actions;

export default mainSlice.reducer;
