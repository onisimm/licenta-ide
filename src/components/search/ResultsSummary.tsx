import React from 'react';
import { Typography } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { ResultsSummary as StyledResultsSummary } from './styles';
import { ResultsSummaryProps } from './types';

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  totalLines,
  totalFiles,
  hasMore,
  displayedLines,
  filesSearched,
  filesSkipped,
  searchDuration,
}) => {
  return (
    <StyledResultsSummary>
      <SearchIcon sx={{ color: 'primary.main' }} />
      <Typography variant="body2" fontWeight="medium">
        {totalLines} result{totalLines !== 1 ? 's' : ''} found in {totalFiles}{' '}
        file
        {totalFiles !== 1 ? 's' : ''}
        {hasMore && (
          <Typography
            component="span"
            variant="body2"
            color="primary.main"
            sx={{ ml: 1 }}>
            (showing first {displayedLines} of {totalLines} lines)
          </Typography>
        )}
        {filesSearched && (
          <Typography
            component="span"
            variant="caption"
            color="text.secondary"
            sx={{ ml: 1 }}>
            ({filesSearched} searched
            {filesSkipped ? `, ${filesSkipped} skipped` : ''}
            {searchDuration ? ` in ${searchDuration}ms` : ''})
          </Typography>
        )}
      </Typography>
    </StyledResultsSummary>
  );
};
