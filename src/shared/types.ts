export interface IFolderStructure {
  name: string;
  root: string;
  tree: TFolderTree[];
}

export type TFolderTree = {
  name: string;
  parentPath: string;
  path: string;
  children?: TFolderTree[];
  isDirectory: boolean;
  isLoading?: boolean;
  childrenLoaded?: boolean;
  isGitIgnored?: boolean;
};

export interface ISelectedFile {
  path: string;
  name: string;
  content: string;
  language: string;
}

// New interface for tab functionality
export interface IOpenFile extends ISelectedFile {
  hasUnsavedChanges?: boolean;
  originalContent?: string; // Store original content to track changes
}

export interface IMainState {
  folderStructure: IFolderStructure;
  selectedFile: ISelectedFile | null; // Keep for backward compatibility
  isLoadingFile: boolean;
  // New tab-related state
  openFiles: IOpenFile[];
  activeFileIndex: number; // Index of currently active file
}
