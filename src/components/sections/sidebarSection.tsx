import { memo } from 'react';
import { Box, SxProps, Theme } from '@mui/material';

const SidebarSection = memo((props: any) => {
  return (
    <Box sx={styles.sidebarContainer}>
      <Box
        sx={[styles.sidebarComponent, styles.explorerList] as SxProps<Theme>}>
        Explorer List
      </Box>

      <Box sx={[styles.sidebarComponent, styles.iconList] as SxProps<Theme>}>
        Icon List
      </Box>
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
  sidebarComponent: {
    height: '100%',
  },
  iconList: {
    width: '40px',
    backgroundColor: 'primary.dark',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  explorerList: {
    flex: 1,
  },
};

export default SidebarSection;
