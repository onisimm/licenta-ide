import React from 'react';
import { Typography, Paper } from '@mui/material';
import { ErrorStateProps } from './types';

export const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <Paper
      sx={{
        p: 2,
        mb: 2,
        bgcolor: 'error.light',
        color: 'error.contrastText',
      }}>
      <Typography variant="body2">Search Error: {error}</Typography>
    </Paper>
  );
};
