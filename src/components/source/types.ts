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
  hasUpstream: boolean;
}

export interface GitBranch {
  name: string;
  fullName: string;
  isCurrent: boolean;
  isRemote: boolean;
  canCheckout: boolean;
}

export interface DialogState {
  open: boolean;
  filePath?: string;
  errorInfo?: any;
}

export interface BranchDialogState {
  open: boolean;
  type: 'switch' | 'create' | 'delete' | null;
  branches?: GitBranch[];
  selectedBranch?: string;
}

export interface ExpandedSections {
  changes: boolean;
  staged: boolean;
}
