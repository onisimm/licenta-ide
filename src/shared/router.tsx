import { createHashRouter, Navigate } from 'react-router-dom';
import MainComponent from '../app/screens/main';
import { ExplorerSection } from '../app/sidebar-routes/explorer';

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
        element: <ExplorerSection />,
      },
      {
        path: 'source',
        element: <ExplorerSection />,
      },
      {
        path: 'extension',
        element: <ExplorerSection />,
      },
      {
        path: 'profile',
        element: <ExplorerSection />,
      },
      {
        path: 'settings',
        element: <ExplorerSection />,
      },
    ],
  },
]);
