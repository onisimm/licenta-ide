import { Box, SxProps, Theme } from '@mui/material';

import FilesIcon from '../icons/files';
import SearchIcon from '../icons/search';
import SourceIcon from '../icons/source';
import { ExtensionIcon } from '../icons/extension';
import palette from '../../theme/palette';

function IconList() {
  const activeColor = palette.grey[300];

  return (
    <Box sx={styles.iconList}>
      <FilesIcon color={activeColor} />
      <SearchIcon color={activeColor} />
      <SourceIcon color={activeColor} />
      <ExtensionIcon color={activeColor} />
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
    gap: '18px',
  },
};

export default IconList;
