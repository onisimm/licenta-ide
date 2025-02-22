import { memo } from 'react';
import { Box, SxProps, Theme } from '@mui/material';

import ContentSection from './sections/content';
import SidebarSection from './sections/sidebar';

const MainComponent = memo((props: any) => {
  return (
    // Main container
    <Box sx={styles.mainContainer}>
      {/* Header */}
      <Box sx={styles.headerContainer}></Box>

      {/* Body */}
      <Box sx={styles.bodyContainer}>
        <ContentSection />
        <SidebarSection />
      </Box>

      {/* Footer */}
      <Box sx={styles.footerContainer}></Box>
    </Box>
  );
});

const styles: Record<string, SxProps<Theme>> = {
  mainContainer: {
    display: 'grid',
    gridTemplateRows: '35px 1fr 20px',
    height: '100vh',
    padding: '0px',
    margin: '0px',
  },

  headerContainer: {
    backgroundColor: 'primary.main',
    WebkitAppRegion: 'drag', // make window draggable by clicking on the header
  },

  bodyContainer: {
    display: 'grid',
    gridTemplateAreas: '"main sidebar"',
    gridTemplateColumns: '1fr 260px',
    overflow: 'hidden',
  },

  footerContainer: {
    backgroundColor: 'primary.main',
  },
};

export default MainComponent;
