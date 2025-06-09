import { IconListName, IconType } from '../types/icon';
import FilesIcon from '../icons/files';
import SearchIcon from '../icons/search';
import GitIcon from '../icons/source';
import { ProfileIcon } from '../icons/user';
import SettingsIcon from '../icons/settings';
import ChatSparklesIcon from '../icons/chat-sparkles';

export const topIcons: IconType[] = [
  { name: IconListName.files, icon: <FilesIcon />, description: 'Files' },
  { name: IconListName.search, icon: <SearchIcon />, description: 'Search' },
  { name: IconListName.source, icon: <GitIcon />, description: 'Git' },
  {
    name: IconListName.aichat,
    icon: <ChatSparklesIcon />,
    description: 'AI Chat',
  },
];

export const bottomIcons: IconType[] = [
  { name: IconListName.profile, icon: <ProfileIcon />, description: 'Profile' },
  {
    name: IconListName.settings,
    icon: <SettingsIcon />,
    description: 'Settings',
  },
];
