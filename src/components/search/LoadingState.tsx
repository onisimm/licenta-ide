import React from 'react';
import { Typography, CircularProgress } from '@mui/material';
import { LoadingContainer } from './styles';
import { LoadingStateProps } from './types';

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Searching...',
}) => {
  return (
    <LoadingContainer>
      <CircularProgress size={20} />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </LoadingContainer>
  );
};
