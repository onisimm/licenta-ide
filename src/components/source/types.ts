export interface GitFileStatus {
  path: string;
  status: 'modified' | 'added' | 'deleted' | 'renamed' | 'untracked';
  staged: boolean;
}

export interface GitStatus {
  files: GitFileStatus[];
  branch: string;
  ahead: number;
  behind: number;
  isClean: boolean;
}

export interface GitBranchInfo {
  current: string;
  remote?: string;
  ahead: number;
  behind: number;
}

export interface DialogState {
  open: boolean;
  filePath?: string;
  errorInfo?: any;
}

export interface ExpandedSections {
  changes: boolean;
  staged: boolean;
}
