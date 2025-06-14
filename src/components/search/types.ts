import {
  SearchResults,
  SearchFileResult,
  SearchMatch,
} from '../../shared/rdx-slice';

export interface SearchProps {
  hasFolder: boolean;
  folderName: string;
  searchInFolder: (query: string) => Promise<SearchResults>;
  openFileAtLine: (
    filePath: string,
    lineNumber: number,
  ) => Promise<{ file: { name: string }; lineNumber: number } | null>;
}

export interface SearchHeaderProps {
  folderName: string;
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface SearchResultsProps {
  searchResults: SearchResults | null;
  isSearching: boolean;
  searchError: string | null;
  expandedFiles: string[];
  onToggleFileExpansion: (filePath: string) => void;
  onLineClick: (filePath: string, lineNumber: number) => void;
  displayLimit: number;
  onLoadMore: () => void;
  hasMore: boolean;
  totalLines: number;
  displayedLines: number;
}

export interface FileResultProps {
  fileResult: SearchFileResult;
  isExpanded: boolean;
  onToggleExpansion: () => void;
  onLineClick: (lineNumber: number) => void;
  searchQuery: string;
}

export interface LineResultProps {
  match: SearchMatch;
  searchQuery: string;
  onClick: () => void;
}

export interface NoFolderMessageProps {
  message?: string;
}

export interface LoadingStateProps {
  message?: string;
}

export interface ErrorStateProps {
  error: string;
}

export interface ResultsSummaryProps {
  totalLines: number;
  totalFiles: number;
  hasMore: boolean;
  displayedLines: number;
  filesSearched?: number;
  filesSkipped?: number;
  searchDuration?: number;
}

export interface LoadMoreProps {
  onLoadMore: () => void;
  isSearching: boolean;
  remainingLines: number;
  displayLimit: number;
}
