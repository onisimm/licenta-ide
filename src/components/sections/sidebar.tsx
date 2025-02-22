import { memo } from 'react';
import { Box, SxProps, Theme } from '@mui/material';
import IconList from '../sidebar/icon-list';

const SidebarSection = memo((props: any) => {
  return (
    <Box sx={styles.sidebarContainer}>
      <Box sx={styles.explorerList}>Explorer List</Box>

      <IconList />
    </Box>
  );
});

const styles: Record<string, SxProps<Theme>> = {
  sidebarContainer: {
    gridArea: 'sidebar',
    backgroundColor: 'primary.light',
    overflow: 'hidden',
    display: 'flex', // flex direction Row by default
    flexWrap: 'nowrap',
  },
  explorerList: {
    height: '100%',
    flex: 1,
  },
};

export default SidebarSection;
