import { createHashRouter, Navigate } from 'react-router-dom';
import MainComponent from '../screens/main';
import { EmptySection, ExplorerSection } from '../sidebar-routes/explorer';
import { SearchSection } from '../sidebar-routes/search';
import { SourceSection } from '../sidebar-routes/source';
import { SettingsSection } from '../sidebar-routes/settings';

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
        element: <EmptySection />,
      },
      {
        path: 'profile',
        element: <EmptySection />,
      },
      {
        path: 'settings',
        element: <SettingsSection />,
      },
    ],
  },
]);
