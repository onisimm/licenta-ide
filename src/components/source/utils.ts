import { GitFileStatus } from './types';

export const getStatusColor = (status: string, staged: boolean) => {
  if (staged) return 'success';

  switch (status) {
    case 'modified':
      return 'warning';
    case 'added':
      return 'success';
    case 'deleted':
      return 'error';
    case 'untracked':
      return 'info';
    case 'renamed':
      return 'secondary';
    default:
      return 'default';
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'modified':
      return 'M';
    case 'added':
      return 'A';
    case 'deleted':
      return 'D';
    case 'untracked':
      return 'U';
    case 'renamed':
      return 'R';
    default:
      return '?';
  }
};
