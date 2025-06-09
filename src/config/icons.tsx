import { IconListName, IconType } from '../types/icon';
import FilesIcon from '../icons/files';
import SearchIcon from '../icons/search';
import GitIcon from '../icons/source';
import { ExtensionIcon } from '../icons/extension';
import { ProfileIcon } from '../icons/user';
import SettingsIcon from '../icons/settings';

export const topIcons: IconType[] = [
  { name: IconListName.files, icon: <FilesIcon />, description: 'Files' },
  { name: IconListName.search, icon: <SearchIcon />, description: 'Search' },
  { name: IconListName.source, icon: <GitIcon />, description: 'Source' },
];

export const bottomIcons: IconType[] = [
  { name: IconListName.profile, icon: <ProfileIcon />, description: 'Profile' },
  {
    name: IconListName.settings,
    icon: <SettingsIcon />,
    description: 'Settings',
  },
];
