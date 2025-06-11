import { memo, useCallback, useEffect } from 'react';
import { Box, styled, CircularProgress, Typography } from '@mui/material';
import { useAppSelector, useProjectOperations } from '../shared/hooks';
import { CodeEditor } from '../components/code-editor';
import { TabBar } from '../components/tab-bar';
import { ErrorBoundary } from '../components/error-boundary';
import { DefaultButton } from '../components/buttons';

const ContentContainer = styled(Box)(({ theme }) => ({
  gridArea: 'main',
  backgroundColor: theme.palette.background.default,
  overflow: 'hidden',
  minWidth: '260px',
  display: 'flex',
  flexDirection: 'column',
}));

const DefaultOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  gap: theme.spacing(2),
  zIndex: 1,
}));

const LoadingOverlay = styled(Box)(({ theme }) => ({
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
  zIndex: 2,
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

const EditorContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  flex: 1,
  overflow: 'hidden',
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

  // Use active file for Monaco editor, fallback to selectedFile for compatibility
  const currentFile = activeFile || selectedFile;

  // Files should always be editable unless there's a specific reason not to
  const shouldBeReadOnly = false;

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
    const unsubscribeCloseFolder = window.electron?.onMenuCloseFolder?.(() => {
      // Use shared hook without editor content getter (for menu-triggered close)
      closeFolder();
    });

    return () => {
      unsubscribeCloseFolder?.();
    };
  }, [closeFolder]);

  // Always render Monaco Editor, but show overlays when needed
  return (
    <ContentContainer>
      {/* Show TabBar when files are open */}
      {openFiles.length > 0 && <TabBar />}

      <EditorContainer>
        {/* Monaco Editor - Always mounted for best performance */}
        <ErrorBoundary>
          <CodeEditor
            value={currentFile?.content || ''}
            language={currentFile?.language || 'plaintext'}
            fileName={currentFile?.name || 'untitled'}
            readOnly={shouldBeReadOnly}
          />
        </ErrorBoundary>

        {/* Loading overlay */}
        {isLoadingFile && (
          <LoadingOverlay>
            <CircularProgress size={32} />
            <LoadingText>Loading file...</LoadingText>
          </LoadingOverlay>
        )}

        {/* Default state overlay - show when no file is selected and not loading */}
        {!currentFile && !isLoadingFile && (
          <DefaultOverlay>
            {!hasFolder ? (
              <>
                <NoFileSelectedText>
                  No file or directory opened
                </NoFileSelectedText>
                <DefaultButton onClick={handleOpenFolder}>
                  Open File or Directory
                </DefaultButton>
              </>
            ) : (
              <NoFileSelectedText>
                Select a file from the explorer to start editing
              </NoFileSelectedText>
            )}
          </DefaultOverlay>
        )}
      </EditorContainer>
    </ContentContainer>
  );
});

export default ContentSection;
