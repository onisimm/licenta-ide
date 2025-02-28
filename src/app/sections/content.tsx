import { memo, useCallback } from 'react';
import { Box, styled } from '@mui/material';
import { useAppDispatch } from '../../shared/hooks';
import { setFolderStructure } from '../../shared/rdx-slice';

const ContentContainer = styled(Box)(({ theme }) => ({
  gridArea: 'main',
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(2),
  overflow: 'hidden',
}));

const DefaultSection = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
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

const ContentSection = memo(() => {
  const dispatch = useAppDispatch();

  const handleOpenFolder = useCallback(async () => {
    const folder = await window.electron.openFolder();
    dispatch(setFolderStructure(folder));
  }, []);

  return (
    <ContentContainer>
      <DefaultSection>
        <DefaultSectionButton onClick={handleOpenFolder}>
          Open Directory
        </DefaultSectionButton>
      </DefaultSection>
    </ContentContainer>
  );
});

export default ContentSection;
