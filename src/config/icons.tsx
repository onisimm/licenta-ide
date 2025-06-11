import { IconListName, IconType } from '../types/icon';
import FilesIcon from '../icons/files';
import SearchIcon from '../icons/search';
import GitIcon from '../icons/source';
import { ProfileIcon } from '../icons/user';
import SettingsIcon from '../icons/settings';
import ChatSparklesIcon from '../icons/chat-sparkles';

// Helper function to get platform-specific shortcut prefix
const getShortcutPrefix = (): string => {
  const isMac =
    navigator.userAgent.includes('Macintosh') ||
    navigator.platform.includes('Mac');
  return isMac ? 'Cmd+Shift+' : 'Ctrl+Shift+';
};

export const topIcons: IconType[] = [
  {
    name: IconListName.files,
    icon: <FilesIcon />,
    description: `Files (${getShortcutPrefix()}E)`,
  },
  {
    name: IconListName.search,
    icon: <SearchIcon />,
    description: `Search (${getShortcutPrefix()}S)`,
  },
  {
    name: IconListName.source,
    icon: <GitIcon />,
    description: `Git (${getShortcutPrefix()}G)`,
  },
  {
    name: IconListName.aichat,
    icon: <ChatSparklesIcon />,
    description: `AI Chat (${getShortcutPrefix()}A)`,
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
