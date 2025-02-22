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
};
