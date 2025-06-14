import React from 'react';
import { CircularProgress } from '@mui/material';
import { LoadMoreContainer, LoadMoreButton } from './styles';
import { LoadMoreProps } from './types';

export const LoadMore: React.FC<LoadMoreProps> = ({
  onLoadMore,
  isSearching,
  remainingLines,
  displayLimit,
}) => {
  return (
    <LoadMoreContainer>
      <LoadMoreButton
        variant="outlined"
        onClick={onLoadMore}
        disabled={isSearching}>
        {isSearching ? (
          <>
            <CircularProgress size={16} sx={{ mr: 1 }} />
            Loading...
          </>
        ) : (
          `Load ${
            remainingLines > displayLimit ? displayLimit : remainingLines
          } more lines (${remainingLines} remaining)`
        )}
      </LoadMoreButton>
    </LoadMoreContainer>
  );
};
