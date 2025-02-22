import { Box, SxProps, Theme } from '@mui/material';
import { FilesIcon } from '../icons/files';

function IconList() {
  return (
    <Box sx={styles.iconList}>
      <FilesIcon />
    </Box>
  );
}

const styles: Record<string, SxProps<Theme>> = {
  iconList: {
    paddingTop: '10px',
    width: '40px',
    height: '100%',
    backgroundColor: 'primary.dark',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
};

export default IconList;
