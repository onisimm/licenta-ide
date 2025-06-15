import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from 'react';
import { Paper, Typography } from '@mui/material';
import { debounce } from 'lodash';
import { useAppDispatch, useAppSelector } from '../../shared/hooks';
import {
  setSearchQuery,
  setSearchResults,
  setSearchLoading,
  setSearchError,
  setSearchExpandedFiles,
  toggleSearchFileExpansion,
} from '../../shared/rdx-slice';
import { SearchContainer, ResultsContainer, NoResultsText } from './styles';
import { SearchProps } from './types';
import { NoFolderMessage } from './NoFolderMessage';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { SearchHeader } from './SearchHeader';
import { ResultsSummary } from './ResultsSummary';
import { FileResult } from './FileResult';
import { LoadMore } from './LoadMore';

export const Search: React.FC<SearchProps> = ({
  hasFolder,
  folderName,
  searchInFolder,
  openFileAtLine,
}) => {
  const [currentSearchId, setCurrentSearchId] = useState<number>(0);
  const [displayLimit, setDisplayLimit] = useState<number>(100);

  const dispatch = useAppDispatch();
  const searchState = useAppSelector(state => state.main.searchState);
  const {
    query: searchQuery,
    results: searchResults,
    isSearching,
    error: searchError,
    expandedFiles,
  } = searchState;

  const expandedFilesSet = useMemo(
    () => new Set(expandedFiles),
    [expandedFiles],
  );

  const latestSearchIdRef = useRef(0);
  const previousResultsRef = useRef<Set<string>>(new Set());
  const expandedFilesRef = useRef<string[]>([]);

  // Keep expandedFilesRef in sync with Redux state
  useEffect(() => {
    expandedFilesRef.current = expandedFiles;
  }, [expandedFiles]);

  useEffect(() => {
    if (searchResults) {
      setDisplayLimit(100);
    }
  }, [searchResults]);

  const { displayedResults, hasMore, totalLines, totalFiles, displayedLines } =
    useMemo(() => {
      if (!searchResults) {
        return {
          displayedResults: [],
          hasMore: false,
          totalLines: 0,
          totalFiles: 0,
          displayedLines: 0,
        };
      }

      let lineCount = 0;
      const displayed = [];
      let hasMoreResults = false;

      for (const fileResult of searchResults.results) {
        const remainingLimit = displayLimit - lineCount;

        if (remainingLimit <= 0) {
          hasMoreResults = true;
          break;
        }

        if (fileResult.matches.length <= remainingLimit) {
          displayed.push(fileResult);
          lineCount += fileResult.matches.length;
        } else {
          const truncatedFileResult = {
            ...fileResult,
            matches: fileResult.matches.slice(0, remainingLimit),
            totalMatches: remainingLimit,
          };
          displayed.push(truncatedFileResult);
          lineCount += remainingLimit;
          hasMoreResults = true;
          break;
        }
      }

      const totalMatchLines = searchResults.results.reduce(
        (sum, file) => sum + file.matches.length,
        0,
      );

      return {
        displayedResults: displayed,
        hasMore: hasMoreResults,
        totalLines: totalMatchLines,
        totalFiles: searchResults.results.length,
        displayedLines: lineCount,
      };
    }, [searchResults, displayLimit]);

  const handleLoadMore = useCallback(() => {
    setDisplayLimit(prev => prev + 100);
  }, []);

  const toggleFileExpansion = useCallback(
    (filePath: string) => {
      dispatch(toggleSearchFileExpansion(filePath));
    },
    [dispatch],
  );

  useEffect(() => {
    if (searchResults && displayedResults.length > 0) {
      const currentPaths = new Set(
        displayedResults.map(result => result.filePath),
      );

      // For new search results, expand all files by default
      // Only add files that aren't already tracked (completely new results)
      const newFilePaths = Array.from(currentPaths).filter(
        path => !previousResultsRef.current.has(path),
      );

      if (newFilePaths.length > 0) {
        // Auto-expand only the new files from this search
        dispatch(
          setSearchExpandedFiles([
            ...expandedFilesRef.current,
            ...newFilePaths,
          ]),
        );
      }

      previousResultsRef.current = currentPaths;
    }
  }, [searchResults, displayedResults, dispatch]);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (query: string, searchId: number) => {
        if (!query.trim()) {
          dispatch(setSearchResults(null));
          dispatch(setSearchError(null));
          dispatch(setSearchLoading(false));
          return;
        }

        if (searchId !== latestSearchIdRef.current) {
          return;
        }

        try {
          dispatch(setSearchLoading(true));
          dispatch(setSearchError(null));

          const results = await searchInFolder(query);

          if (searchId !== latestSearchIdRef.current) {
            return;
          }

          dispatch(setSearchResults(results));
        } catch (error) {
          if (searchId === latestSearchIdRef.current) {
            dispatch(
              setSearchError(
                error instanceof Error ? error.message : 'Search failed',
              ),
            );
            dispatch(setSearchResults(null));
          }
        } finally {
          if (searchId === latestSearchIdRef.current) {
            dispatch(setSearchLoading(false));
          }
        }
      }, 400),
    [searchInFolder, dispatch],
  );

  const cancelAndStartNewSearch = useCallback(
    (query: string) => {
      debouncedSearch.cancel();

      const newSearchId = Date.now() + Math.random();
      setCurrentSearchId(newSearchId);
      latestSearchIdRef.current = newSearchId;

      // Reset expanded files state for new search
      dispatch(setSearchExpandedFiles([]));
      previousResultsRef.current = new Set();

      if (!query.trim()) {
        dispatch(setSearchResults(null));
        dispatch(setSearchError(null));
        dispatch(setSearchLoading(false));
        return;
      }

      debouncedSearch(query, newSearchId);
    },
    [debouncedSearch, dispatch],
  );

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const query = event.target.value;
      dispatch(setSearchQuery(query));
      cancelAndStartNewSearch(query);
    },
    [cancelAndStartNewSearch, dispatch],
  );

  const handleLineClick = useCallback(
    async (filePath: string, lineNumber: number) => {
      try {
        const result = await openFileAtLine(filePath, lineNumber);

        if (result) {
          setTimeout(() => {
            window.postMessage(
              {
                type: 'SCROLL_TO_LINE',
                lineNumber: result.lineNumber,
              },
              '*',
            );
          }, 150);
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

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  if (!hasFolder) {
    return <NoFolderMessage />;
  }

  return (
    <SearchContainer>
      <SearchHeader
        folderName={folderName}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      {isSearching && <LoadingState />}

      {searchError && <ErrorState error={searchError} />}

      {searchResults && !isSearching && (
        <ResultsContainer>
          <ResultsSummary
            totalLines={totalLines}
            totalFiles={totalFiles}
            hasMore={hasMore}
            displayedLines={displayedLines}
            filesSearched={searchResults.filesSearched}
            filesSkipped={searchResults.filesSkipped}
            searchDuration={searchResults.searchDuration}
          />

          {displayedResults.map(fileResult => (
            <FileResult
              key={fileResult.filePath}
              fileResult={fileResult}
              isExpanded={expandedFilesSet.has(fileResult.filePath)}
              onToggleExpansion={() => toggleFileExpansion(fileResult.filePath)}
              onLineClick={lineNumber =>
                handleLineClick(fileResult.filePath, lineNumber)
              }
              searchQuery={searchResults.query}
            />
          ))}

          {displayedResults.length === 0 && (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <NoResultsText>
                No results found for "{searchResults.query}"
              </NoResultsText>
            </Paper>
          )}

          {hasMore && (
            <LoadMore
              onLoadMore={handleLoadMore}
              isSearching={isSearching}
              remainingLines={totalLines - displayedLines}
              displayLimit={100}
            />
          )}
        </ResultsContainer>
      )}
    </SearchContainer>
  );
};
