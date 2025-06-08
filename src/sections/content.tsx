import { memo, useCallback, useEffect } from 'react';
import { Box, styled, CircularProgress, Typography } from '@mui/material';
import { useAppSelector, useProjectOperations } from '../shared/hooks';
import { CodeEditor } from '../components/code-editor';
import { ErrorBoundary } from '../components/error-boundary';

const ContentContainer = styled(Box)(({ theme }) => ({
  gridArea: 'main',
  backgroundColor: theme.palette.background.default,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}));

const DefaultSection = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const DefaultSectionButton = styled('button')(({ theme }) => ({
  outline: 'none',
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.text.primary,
  fontSize: '90%',
  padding: theme.spacing(0.75, 1.5),
  borderRadius: theme.shape.borderRadius,
  border: `.3px solid ${theme.palette.primary.main}`,
  cursor: 'pointer',
  boxShadow: theme.shadows[1],

  transition: 'background-color .2s',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
  },
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const LoadingText = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  color: theme.palette.text.secondary,
}));

const NoFileSelectedText = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  color: theme.palette.text.secondary,
  textAlign: 'center',
}));

const ContentSection = memo(() => {
  const isLoadingFile = useAppSelector(state => state.main.isLoadingFile);

  // Project operations hook - centralized file/folder operations
  const { openFileOrFolder, closeFolder, hasFolder, selectedFile } =
    useProjectOperations();

  // Handle open file/folder using the centralized hook
  const handleOpenFolder = useCallback(async () => {
    try {
      await openFileOrFolder();
    } catch (error) {
      console.error('Error opening file or folder:', error);
    }
  }, [openFileOrFolder]);

  // Menu event listeners
  useEffect(() => {
    const unsubscribeCloseFolder = window.electron.onMenuCloseFolder?.(() => {
      // Use shared hook without editor content getter (for menu-triggered close)
      closeFolder();
    });

    return () => {
      unsubscribeCloseFolder?.();
    };
  }, [closeFolder]);

  // Show loading state when file is being loaded
  if (isLoadingFile) {
    return (
      <ContentContainer>
        <LoadingContainer>
          <CircularProgress size={32} />
          <LoadingText>Loading file...</LoadingText>
        </LoadingContainer>
      </ContentContainer>
    );
  }

  // Show Monaco Editor when file is selected
  if (selectedFile) {
    return (
      <ContentContainer>
        <ErrorBoundary>
          <CodeEditor
            value={selectedFile.content}
            language={selectedFile.language}
            fileName={selectedFile.name}
            readOnly={false}
          />
        </ErrorBoundary>
      </ContentContainer>
    );
  }

  // Show default state when no folder or no file selected
  return (
    <ContentContainer>
      <DefaultSection>
        {!hasFolder ? (
          <>
            <NoFileSelectedText>No file or directory opened</NoFileSelectedText>
            <DefaultSectionButton onClick={handleOpenFolder}>
              Open File or Directory
            </DefaultSectionButton>
          </>
        ) : (
          <NoFileSelectedText>
            Select a file from the explorer to start editing
          </NoFileSelectedText>
        )}
      </DefaultSection>
    </ContentContainer>
  );
});

export default ContentSection;
