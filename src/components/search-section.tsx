import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from 'react';
import {
  Box,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Button,
  styled,
  alpha,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import {
  useProjectOperations,
  useAppDispatch,
  useAppSelector,
} from '../shared/hooks';
import { getFileIcon } from '../icons/file-types';
import { debounce } from 'lodash';
import {
  setSearchQuery,
  setSearchResults,
  setSearchLoading,
  setSearchError,
  setSearchExpandedFiles,
  toggleSearchFileExpansion,
  type SearchResults,
  type SearchFileResult,
  type SearchMatch,
} from '../shared/rdx-slice';

// Styled components matching file tree design
const SearchContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}));

const SearchHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const SearchInputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const ResultsContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  fontSize: '13px',
  fontFamily: '"Segoe UI", "Monaco", "Cascadia Code", monospace',
  color: theme.palette.text.primary,
  userSelect: 'none',
}));

const ResultsSummary = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  borderRadius: theme.shape.borderRadius,
}));

// File item container (matches file tree styling)
const FileItemContainer = styled(Box)<{ isHovered?: boolean }>(
  ({ theme, isHovered }) => ({
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0.5),
    paddingTop: theme.spacing(0.25),
    paddingBottom: theme.spacing(0.25),
    cursor: 'pointer',
    backgroundColor: isHovered ? theme.palette.action.hover : 'transparent',

    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  }),
);

// Add expand icon (matches file tree design)
const ExpandIcon = styled(Box)<{ isExpanded?: boolean }>(
  ({ theme, isExpanded }) => ({
    width: 12,
    height: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
    cursor: 'pointer',
    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
    transition: 'transform 0.15s ease-in-out',

    '&::before': {
      content: '"▶"',
      fontSize: '10px',
      color: theme.palette.text.secondary,
    },
  }),
);

// Line item container (indented like file tree children)
const LineItemContainer = styled(Box)<{ isHovered?: boolean }>(
  ({ theme, isHovered }) => ({
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1.5), // Indent like file tree children
    paddingRight: theme.spacing(0.5),
    paddingTop: theme.spacing(0.25),
    paddingBottom: theme.spacing(0.25),
    cursor: 'pointer',
    backgroundColor: isHovered ? theme.palette.action.hover : 'transparent',

    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  }),
);

const FileIcon = styled(Box)(({ theme }) => ({
  width: 16,
  height: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(0.75),
  flexShrink: 0,
}));

const FileName = styled(Typography)(({ theme }) => ({
  fontSize: '13px',
  fontWeight: 400,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  flex: 1,
  color: 'inherit',
}));

const LineNumber = styled(Typography)(({ theme }) => ({
  fontSize: '11px',
  fontWeight: 500,
  color: theme.palette.primary.main,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  padding: theme.spacing(0.25, 0.5),
  borderRadius: 3,
  minWidth: '30px',
  textAlign: 'center',
  marginRight: theme.spacing(1),
  flexShrink: 0,
}));

const LineContent = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  fontFamily: 'Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace',
  color: theme.palette.text.secondary,
  whiteSpace: 'pre',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  flex: 1,
}));

const MatchCount = styled(Typography)(({ theme }) => ({
  fontSize: '11px',
  color: theme.palette.text.secondary,
  marginLeft: theme.spacing(0.5),
  fontWeight: 400,
}));

const NoFolderMessage = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '50%',
  gap: theme.spacing(2),
  color: theme.palette.text.secondary,
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
}));

const NoResultsText = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  fontSize: '14px',
  fontStyle: 'italic',
}));

const FileResultItem = styled(Box, {
  shouldForwardProp: prop => prop !== 'isHovered',
})<{ isHovered: boolean }>(({ theme, isHovered }) => ({
  padding: theme.spacing(0.5, 1),
  cursor: 'pointer',
  borderRadius: theme.spacing(0.5),
  backgroundColor: isHovered ? theme.palette.action.hover : 'transparent',
  '&:active': {
    backgroundColor: theme.palette.action.hover,
  },
  transition: 'background-color 0.15s ease',
}));

const LineResultItem = styled(Box, {
  shouldForwardProp: prop => prop !== 'isHovered',
})<{ isHovered: boolean }>(({ theme, isHovered }) => ({
  padding: theme.spacing(0.25, 1, 0.25, 2),
  cursor: 'pointer',
  fontSize: '12px',
  backgroundColor: isHovered ? theme.palette.action.hover : 'transparent',
  '&:active': {
    backgroundColor: theme.palette.action.hover,
  },
  transition: 'background-color 0.15s ease',
}));

const HighlightedText = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  borderRadius: theme.spacing(0.25),
  padding: '1px 2px',
  fontWeight: 500,
}));

const PreviewText = styled('span')(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '12px',
}));

const LoadMoreContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  borderTop: `1px solid ${theme.palette.divider}`,
  marginTop: theme.spacing(1),
}));

const LoadMoreButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontSize: '13px',
  fontWeight: 500,
  borderRadius: theme.spacing(0.75),
  padding: theme.spacing(1, 3),
  borderColor: theme.palette.text.secondary,
  color: theme.palette.text.secondary,

  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    color: theme.palette.primary.main,
  },

  '&:disabled': {
    borderColor: theme.palette.action.disabled,
    color: theme.palette.action.disabled,
  },
}));

export const SearchSection: React.FC = () => {
  const [currentSearchId, setCurrentSearchId] = useState<number>(0);
  const [displayLimit, setDisplayLimit] = useState<number>(100); // Pagination state

  const { hasFolder, folderName, searchInFolder, openFileAtLine } =
    useProjectOperations();

  const dispatch = useAppDispatch();

  // Get search state from Redux
  const searchState = useAppSelector(state => state.main.searchState);
  const {
    query: searchQuery,
    results: searchResults,
    isSearching,
    error: searchError,
    expandedFiles,
  } = searchState;

  // Convert expandedFiles array to Set for easier manipulation
  const expandedFilesSet = useMemo(
    () => new Set(expandedFiles),
    [expandedFiles],
  );

  // Ref to track the latest search ID to ignore outdated results
  const latestSearchIdRef = useRef(0);

  // Reset display limit when new search results come in
  useEffect(() => {
    if (searchResults) {
      setDisplayLimit(100);
    }
  }, [searchResults]);

  // Get paginated results
  const { displayedResults, hasMore, totalFiles } = useMemo(() => {
    if (!searchResults) {
      return { displayedResults: [], hasMore: false, totalFiles: 0 };
    }

    const displayed = searchResults.results.slice(0, displayLimit);
    const hasMoreResults = searchResults.results.length > displayLimit;

    return {
      displayedResults: displayed,
      hasMore: hasMoreResults,
      totalFiles: searchResults.results.length,
    };
  }, [searchResults, displayLimit]);

  // Load more results
  const handleLoadMore = useCallback(() => {
    setDisplayLimit(prev => prev + 100);
  }, []);

  // Toggle file expansion
  const toggleFileExpansion = useCallback(
    (filePath: string) => {
      dispatch(toggleSearchFileExpansion(filePath));
    },
    [dispatch],
  );

  // When new search results come in, expand all files by default (only for displayed results)
  useEffect(() => {
    if (searchResults && displayedResults.length > 0) {
      const displayedFilePaths = displayedResults.map(
        result => result.filePath,
      );
      dispatch(setSearchExpandedFiles(displayedFilePaths));
    }
  }, [searchResults, displayedResults, dispatch]);

  // Debounced search function with cancellation support
  const debouncedSearch = useMemo(
    () =>
      debounce(async (query: string, searchId: number) => {
        if (!query.trim()) {
          dispatch(setSearchResults(null));
          dispatch(setSearchError(null));
          dispatch(setSearchLoading(false));
          return;
        }

        // Check if this search is still the latest one
        if (searchId !== latestSearchIdRef.current) {
          console.log(
            'Search cancelled - newer search initiated:',
            searchId,
            'vs',
            latestSearchIdRef.current,
          );
          return;
        }

        try {
          dispatch(setSearchLoading(true));
          dispatch(setSearchError(null));
          console.log(' Starting search:', searchId, 'query:', query);

          const results = await searchInFolder(query);

          // Double-check if this search is still relevant
          if (searchId !== latestSearchIdRef.current) {
            console.log(
              'Search result ignored - newer search initiated:',
              searchId,
              'vs',
              latestSearchIdRef.current,
            );
            return;
          }

          dispatch(setSearchResults(results));
          console.log('✅ Search completed:', searchId, 'results:', results);
        } catch (error) {
          // Only show error if this search is still the latest
          if (searchId === latestSearchIdRef.current) {
            console.error('❌ Search error:', searchId, error);
            dispatch(
              setSearchError(
                error instanceof Error ? error.message : 'Search failed',
              ),
            );
            dispatch(setSearchResults(null));
          } else {
            console.log(
              'Search error ignored - newer search initiated:',
              searchId,
            );
          }
        } finally {
          // Only update loading state if this is still the latest search
          if (searchId === latestSearchIdRef.current) {
            dispatch(setSearchLoading(false));
          }
        }
      }, 400), // 0.4s debounce
    [searchInFolder],
  );

  // Cancel previous search and start new one
  const cancelAndStartNewSearch = useCallback(
    (query: string) => {
      // Cancel any pending debounced search
      debouncedSearch.cancel();

      // Generate new search ID
      const newSearchId = Date.now() + Math.random();
      setCurrentSearchId(newSearchId);
      latestSearchIdRef.current = newSearchId;

      console.log('🔄 New search initiated:', newSearchId, 'query:', query);

      // If query is empty, clear results immediately
      if (!query.trim()) {
        dispatch(setSearchResults(null));
        dispatch(setSearchError(null));
        dispatch(setSearchLoading(false));
        dispatch(setSearchExpandedFiles([]));
        return;
      }

      // Start new search
      debouncedSearch(query, newSearchId);
    },
    [debouncedSearch],
  );

  // Handle search input changes
  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const query = event.target.value;
      dispatch(setSearchQuery(query));
      cancelAndStartNewSearch(query);
    },
    [cancelAndStartNewSearch, dispatch],
  );

  // Handle line click - open file at specific line
  const handleLineClick = useCallback(
    async (filePath: string, lineNumber: number) => {
      try {
        console.log('Opening file at line:', filePath, lineNumber);
        const result = await openFileAtLine(filePath, lineNumber);

        if (result) {
          console.log(
            'File opened successfully:',
            result.file.name,
            'at line',
            result.lineNumber,
          );

          // Add a small delay to ensure the Monaco Editor has time to update with the new content
          setTimeout(() => {
            // Scroll to line in editor
            window.postMessage(
              {
                type: 'SCROLL_TO_LINE',
                lineNumber: result.lineNumber,
              },
              '*',
            );
          }, 150); // 150ms delay should be enough for the editor to update
        }
      } catch (error) {
        console.error('Error opening file at line:', error);
        alert(
          `Error opening file: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`,
        );
      }
    },
    [openFileAtLine],
  );

  // Render highlighted matches in line content
  const renderHighlightedContent = useCallback(
    (lineContent: string, query: string) => {
      if (!query.trim()) return <span>{lineContent}</span>;

      try {
        const regex = new RegExp(
          query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
          'gi',
        );
        const parts = lineContent.split(regex);
        const matches = lineContent.match(regex) || [];

        return (
          <span>
            {parts.map((part, index) => (
              <React.Fragment key={index}>
                {part}
                {index < matches.length && (
                  <Box
                    component="span"
                    sx={{
                      backgroundColor: 'warning.main',
                      color: 'warning.contrastText',
                      padding: '1px 2px',
                      borderRadius: '2px',
                      fontWeight: 'bold',
                    }}>
                    {matches[index]}
                  </Box>
                )}
              </React.Fragment>
            ))}
          </span>
        );
      } catch {
        return <span>{lineContent}</span>;
      }
    },
    [],
  );

  // Clean up debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // No folder opened
  if (!hasFolder) {
    return (
      <SearchContainer>
        <NoFolderMessage>
          <SearchIcon sx={{ fontSize: 48, opacity: 0.5 }} />
          <Typography variant="h6" color="text.secondary">
            No Folder Opened
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Open a folder to search through its files
          </Typography>
        </NoFolderMessage>
      </SearchContainer>
    );
  }

  return (
    <SearchContainer>
      <SearchHeader>
        <Typography variant="h6" gutterBottom>
          Search in {folderName}
        </Typography>

        <SearchInputContainer>
          <TextField
            fullWidth
            size="small"
            placeholder="Enter text..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              ),
            }}
          />
        </SearchInputContainer>
      </SearchHeader>

      {/* Loading state */}
      {isSearching && (
        <LoadingContainer>
          <CircularProgress size={20} />
          <Typography variant="body2" color="text.secondary">
            Searching...
          </Typography>
        </LoadingContainer>
      )}

      {/* Search error */}
      {searchError && (
        <Paper
          sx={{
            p: 2,
            mb: 2,
            bgcolor: 'error.light',
            color: 'error.contrastText',
          }}>
          <Typography variant="body2">Search Error: {searchError}</Typography>
        </Paper>
      )}

      {/* Search results */}
      {searchResults && !isSearching && (
        <ResultsContainer>
          <ResultsSummary>
            <SearchIcon sx={{ color: 'primary.main' }} />
            <Typography variant="body2" fontWeight="medium">
              {searchResults.totalMatches} result
              {searchResults.totalMatches !== 1 ? 's' : ''} found in{' '}
              {searchResults.fileCount} file
              {searchResults.fileCount !== 1 ? 's' : ''}
              {displayedResults.length < totalFiles && (
                <Typography
                  component="span"
                  variant="body2"
                  color="primary.main"
                  sx={{ ml: 1 }}>
                  (showing {displayedResults.length} of {totalFiles} files)
                </Typography>
              )}
              {searchResults.filesSearched && (
                <Typography
                  component="span"
                  variant="caption"
                  color="text.secondary"
                  sx={{ ml: 1 }}>
                  ({searchResults.filesSearched} searched
                  {searchResults.filesSkipped
                    ? `, ${searchResults.filesSkipped} skipped`
                    : ''}
                  {searchResults.searchDuration
                    ? ` in ${searchResults.searchDuration}ms`
                    : ''}
                  )
                </Typography>
              )}
            </Typography>
          </ResultsSummary>

          {/* File tree-style results */}
          {displayedResults.map(fileResult => {
            const isExpanded = expandedFilesSet.has(fileResult.filePath);

            return (
              <Box key={fileResult.filePath}>
                {/* File header (like file tree item) */}
                <FileItemContainer
                  onClick={() => toggleFileExpansion(fileResult.filePath)}>
                  <ExpandIcon isExpanded={isExpanded} />
                  <FileIcon>
                    {getFileIcon(fileResult.fileName, false, false)}
                  </FileIcon>
                  <FileName>{fileResult.fileName}</FileName>
                  <MatchCount>
                    {fileResult.totalMatches} match
                    {fileResult.totalMatches !== 1 ? 'es' : ''}
                  </MatchCount>
                </FileItemContainer>

                {/* Matching lines (indented like file tree children) - only show when expanded */}
                {isExpanded &&
                  fileResult.matches.map((match, index) => (
                    <LineItemContainer
                      key={`${fileResult.filePath}-${match.lineNumber}-${index}`}
                      onClick={() =>
                        handleLineClick(fileResult.filePath, match.lineNumber)
                      }>
                      <LineNumber>{match.lineNumber}</LineNumber>
                      <LineContent>
                        {renderHighlightedContent(
                          match.lineContent.trim(),
                          searchResults.query,
                        )}
                      </LineContent>
                    </LineItemContainer>
                  ))}
              </Box>
            );
          })}

          {displayedResults.length === 0 && (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No results found for "{searchResults.query}"
              </Typography>
            </Paper>
          )}

          {hasMore && (
            <LoadMoreContainer>
              <LoadMoreButton
                variant="outlined"
                onClick={handleLoadMore}
                disabled={isSearching}>
                {isSearching ? (
                  <>
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                    Loading...
                  </>
                ) : (
                  `Load more (${
                    totalFiles - displayedResults.length
                  } remaining)`
                )}
              </LoadMoreButton>
            </LoadMoreContainer>
          )}
        </ResultsContainer>
      )}
    </SearchContainer>
  );
};
