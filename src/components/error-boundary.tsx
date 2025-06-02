import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, styled, Typography, Button } from '@mui/material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

const ErrorContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(4),
}));

const ErrorTitle = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  fontWeight: 600,
  color: theme.palette.error.main,
  marginBottom: theme.spacing(1),
}));

const ErrorMessage = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  color: theme.palette.text.secondary,
  textAlign: 'center',
  maxWidth: 600,
  lineHeight: 1.5,
}));

const ErrorDetails = styled('pre')(({ theme }) => ({
  fontSize: '12px',
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'auto',
  maxWidth: '100%',
  maxHeight: 200,
  marginTop: theme.spacing(2),
}));

const ReloadButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorTitle>Something went wrong</ErrorTitle>
          <ErrorMessage>
            An unexpected error occurred while rendering the Monaco Editor. This
            might be due to a corrupted file or unsupported content.
          </ErrorMessage>

          {this.state.error && (
            <ErrorDetails>
              {this.state.error.name}: {this.state.error.message}
              {this.state.error.stack && (
                <>
                  {'\n\nStack trace:\n'}
                  {this.state.error.stack}
                </>
              )}
            </ErrorDetails>
          )}

          <Box display="flex" gap={2}>
            <ReloadButton variant="outlined" onClick={this.handleReset}>
              Try Again
            </ReloadButton>
            <ReloadButton variant="contained" onClick={this.handleReload}>
              Reload Application
            </ReloadButton>
          </Box>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}
