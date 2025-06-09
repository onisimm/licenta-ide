import { memo, useCallback, useEffect } from 'react';
import { Box, styled, CircularProgress, Typography } from '@mui/material';
import { useAppSelector, useProjectOperations } from '../shared/hooks';
import { CodeEditor } from '../components/code-editor';
import { TabBar } from '../components/tab-bar';
import { ErrorBoundary } from '../components/error-boundary';

const ContentContainer = styled(Box)(({ theme }) => ({
  gridArea: 'main',
  backgroundColor: theme.palette.background.default,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}));

const EditorContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  overflow: 'hidden',
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

// Overlay for loading state when tabs are present
const LoadingOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: theme.spacing(2),
  zIndex: 1000,
}));

// Default overlay when no file is selected but tabs are present
const DefaultOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: theme.spacing(2),
  zIndex: 999,
}));

const ContentSection = memo(() => {
  const isLoadingFile = useAppSelector(state => state.main.isLoadingFile);
  const { openFiles, activeFileIndex } = useAppSelector(state => ({
    openFiles: state.main.openFiles,
    activeFileIndex: state.main.activeFileIndex,
  }));

  // Project operations hook - centralized file/folder operations
  const { openFileOrFolder, closeFolder, hasFolder, selectedFile } =
    useProjectOperations();

  // Get the active file from tabs
  const activeFile =
    openFiles.length > 0 && activeFileIndex >= 0
      ? openFiles[activeFileIndex]
      : null;

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

  // If we have tabs, always show the editor with tab bar
  if (openFiles.length > 0) {
    return (
      <ContentContainer>
        <EditorContainer>
          {/* Tab bar - always visible when there are open files */}
          <TabBar />

          {/* Monaco Editor - always mounted for best performance */}
          <Box sx={{ flex: 1, position: 'relative' }}>
            <ErrorBoundary>
              <CodeEditor
                value={activeFile?.content || ''}
                language={activeFile?.language || 'plaintext'}
                fileName={activeFile?.name || 'untitled'}
                readOnly={!activeFile}
              />
            </ErrorBoundary>

            {/* Loading overlay when file is being loaded */}
            {isLoadingFile && (
              <LoadingOverlay>
                <CircularProgress size={32} />
                <LoadingText>Loading file...</LoadingText>
              </LoadingOverlay>
            )}

            {/* Default overlay when no active file but tabs exist */}
            {!activeFile && !isLoadingFile && (
              <DefaultOverlay>
                <NoFileSelectedText>
                  Select a tab to view the file content
                </NoFileSelectedText>
              </DefaultOverlay>
            )}
          </Box>
        </EditorContainer>
      </ContentContainer>
    );
  }

  // Show loading state when file is being loaded (and no tabs)
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

  // Show default state when no folder or no file selected (and no tabs)
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
