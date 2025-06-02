import { memo, useCallback } from 'react';
import { Box, styled, CircularProgress, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../shared/hooks';
import { setFolderStructure } from '../shared/rdx-slice';
import { IFolderStructure } from '../shared/types';
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
  const dispatch = useAppDispatch();
  const folderStructure = useAppSelector(state => state.main.folderStructure);
  const selectedFile = useAppSelector(state => state.main.selectedFile);
  const isLoadingFile = useAppSelector(state => state.main.isLoadingFile);

  const handleOpenFolder = useCallback(async () => {
    const folder: IFolderStructure = await window.electron.openFolder();
    dispatch(setFolderStructure(folder));
  }, [dispatch]);

  const handleFileChange = useCallback((value: string | undefined) => {
    // TODO: Implement file change handling (auto-save, dirty state, etc.)
    console.log('File content changed:', value?.length, 'characters');
  }, []);

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
          {/* Temporarily disable Monaco Editor to isolate the error */}
          <Box
            sx={{
              p: 2,
              height: '100%',
              overflow: 'auto',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              backgroundColor: '#0d1117',
              color: '#fafafa',
            }}>
            <Typography variant="h6" gutterBottom>
              {selectedFile.name} ({selectedFile.language})
            </Typography>
            <Typography
              component="pre"
              sx={{
                fontFamily: 'monospace',
                fontSize: '13px',
                lineHeight: 1.6,
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
              }}>
              {selectedFile.content}
            </Typography>
          </Box>
          {/* 
          <CodeEditor
            value={selectedFile.content}
            language={selectedFile.language}
            fileName={selectedFile.name}
            onChange={handleFileChange}
            readOnly={false}
          />
          */}
        </ErrorBoundary>
      </ContentContainer>
    );
  }

  // Show default state when no folder or no file selected
  const hasFolder = folderStructure && Object.keys(folderStructure).length > 0;

  return (
    <ContentContainer>
      <DefaultSection>
        {!hasFolder ? (
          <>
            <NoFileSelectedText>No directory opened</NoFileSelectedText>
            <DefaultSectionButton onClick={handleOpenFolder}>
              Open Directory
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
