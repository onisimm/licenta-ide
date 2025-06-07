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

export interface IMainState {
  folderStructure: IFolderStructure;
  selectedFile: ISelectedFile | null;
  isLoadingFile: boolean;
}
