import { createHashRouter, Navigate } from 'react-router-dom';
import MainComponent from '../screens/main';
import ExplorerSection from '../sidebar-routes/explorer';
import { SearchSection } from '../sidebar-routes/search';
import SourceSection from '../sidebar-routes/source';
import SettingsSection from '../sidebar-routes/settings';
import { AiChatSection } from '../sidebar-routes/ai-chat';
import ProfileSection from '../sidebar-routes/profile';

export default createHashRouter([
  {
    path: '/',
    element: <Navigate to="/main_window" replace />,
  },
  {
    path: '/main_window',
    element: <MainComponent />,
    children: [
      {
        path: '',
        element: <ExplorerSection />,
        index: true,
      },
      {
        path: 'files',
        element: <ExplorerSection />,
      },
      {
        path: 'search',
        element: <SearchSection />,
      },
      {
        path: 'source',
        element: <SourceSection />,
      },
      {
        path: 'aichat',
        element: <AiChatSection />,
      },
      {
        path: 'profile',
        element: <ProfileSection />,
      },
      {
        path: 'settings',
        element: <SettingsSection />,
      },
    ],
  },
]);
