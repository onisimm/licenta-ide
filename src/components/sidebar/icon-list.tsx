import { Box, styled } from '@mui/material';
import FilesIcon from '../icons/files';
import SearchIcon from '../icons/search';
import SourceIcon from '../icons/source';
import { ExtensionIcon } from '../icons/extension';
import { UserIcon } from '../icons/user';
import SettingsIcon from '../icons/settings';

const IconListContainer = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  width: '50px',
  height: '100%',
  backgroundColor: theme.palette.secondary.main,
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

const IconSet = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '18px',
  alignItems: 'center',
});

function IconList() {
  return (
    <IconListContainer>
      {/* Top icons */}
      <IconSet>
        <FilesIcon />
        <SearchIcon />
        <SourceIcon />
        <ExtensionIcon />
      </IconSet>

      {/* Bottom icons */}
      <IconSet>
        <UserIcon />
        <SettingsIcon />
      </IconSet>
    </IconListContainer>
  );
}

export default IconList;
