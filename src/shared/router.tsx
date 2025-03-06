import { createHashRouter, Navigate } from 'react-router-dom';
import MainComponent from '../screens/main';
import { EmptySection, ExplorerSection } from '../sidebar-routes/explorer';

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
        element: <EmptySection />,
      },
      {
        path: 'source',
        element: <EmptySection />,
      },
      {
        path: 'extension',
        element: <EmptySection />,
      },
      {
        path: 'profile',
        element: <EmptySection />,
      },
      {
        path: 'settings',
        element: <EmptySection />,
      },
    ],
  },
]);
