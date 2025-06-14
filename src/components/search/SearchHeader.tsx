import React from 'react';
import { Typography, TextField } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import {
  SearchHeader as StyledSearchHeader,
  SearchInputContainer,
} from './styles';
import { SearchHeaderProps } from './types';

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  folderName,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <StyledSearchHeader>
      <Typography variant="h6" gutterBottom>
        Search in {folderName}
      </Typography>

      <SearchInputContainer>
        <TextField
          fullWidth
          size="small"
          placeholder="Enter text..."
          value={searchQuery}
          onChange={onSearchChange}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            ),
          }}
        />
      </SearchInputContainer>
    </StyledSearchHeader>
  );
};
