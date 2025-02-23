import { memo } from 'react';
import { Box, styled } from '@mui/material';
import IconList from '../sidebar/icon-list';

const SidebarContainer = styled(Box)(({ theme }) => ({
  gridArea: 'sidebar',
  backgroundColor: theme.palette.background.paper,
  overflow: 'hidden',
  display: 'flex',
  flexWrap: 'nowrap',
}));

const ExplorerList = styled(Box)(({ theme }) => ({
  height: '100%',
  flex: 1,
  color: theme.palette.text.primary,
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.border.main}`,
}));

const SidebarSection = memo(() => {
  return (
    <SidebarContainer>
      <ExplorerList>Explorer List</ExplorerList>
      <IconList />
    </SidebarContainer>
  );
});

export default SidebarSection;
