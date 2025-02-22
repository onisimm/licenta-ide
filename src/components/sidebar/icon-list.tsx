import { Box, SxProps, Theme } from '@mui/material';

import FilesIcon from '../icons/files';
import SearchIcon from '../icons/search';
import SourceIcon from '../icons/source';
import { ExtensionIcon } from '../icons/extension';
import palette from '../../theme/palette';
import { UserIcon } from '../icons/user';
import SettingsIcon from '../icons/settings';

function IconList() {
  const activeColor = palette.grey[300];

  return (
    <Box sx={styles.iconList}>
      {/* Top icons */}
      <Box sx={styles.iconSet}>
        <FilesIcon color={activeColor} />
        <SearchIcon color={activeColor} />
        <SourceIcon color={activeColor} />
        <ExtensionIcon color={activeColor} />
      </Box>

      {/* Bottom icons */}
      <Box sx={styles.iconSet}>
        <UserIcon />
        <SettingsIcon />
      </Box>
    </Box>
  );
}

const styles: Record<string, SxProps<Theme>> = {
  iconList: {
    paddingTop: '10px',
    paddingBottom: '10px',
    width: '50px',
    height: '100%',
    backgroundColor: 'primary.dark',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  iconSet: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    alignItems: 'center',
  },
};

export default IconList;
