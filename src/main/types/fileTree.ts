export interface FileTreeNode {
  id: string;
  name: string;
  parentPath: string;
  path: string;
  isDirectory: boolean;
  children: FileTreeNode[];
  childrenLoaded: boolean;
  isLoading: boolean;
  isExpanded: boolean;
  level: number;
}

export interface BackgroundLoadProgress {
  totalDirectories: number;
  loadedDirectories: number;
  currentPath: string;
  isComplete: boolean;
}
