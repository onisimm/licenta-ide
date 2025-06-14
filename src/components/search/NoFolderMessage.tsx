import React from 'react';
import { Typography } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { NoFolderMessage as StyledNoFolderMessage } from './styles';
import { NoFolderMessageProps } from './types';

export const NoFolderMessage: React.FC<NoFolderMessageProps> = ({
  message = 'Open a folder to search through its files',
}) => {
  return (
    <StyledNoFolderMessage>
      <SearchIcon sx={{ fontSize: 48, opacity: 0.5 }} />
      <Typography variant="h6" color="text.secondary">
        No Folder Opened
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center">
        {message}
      </Typography>
    </StyledNoFolderMessage>
  );
};
