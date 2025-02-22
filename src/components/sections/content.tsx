import { memo } from 'react';
import { Box, SxProps, Theme, Typography } from '@mui/material';

const ContentSection = memo((props: any) => {
  return (
    <Box sx={styles.contentSection}>
      <Typography variant="h4">Body</Typography>
    </Box>
  );
});

const styles: Record<string, SxProps<Theme>> = {
  contentSection: {
    gridArea: 'main',
    backgroundColor: 'grey.200',
    overflow: 'hidden',
  },
};

export default ContentSection;
