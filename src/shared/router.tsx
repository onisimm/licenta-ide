import { createBrowserRouter } from 'react-router-dom';
import MainComponent from '../app/screens/main';
import { ExplorerSection } from '../app/sections/explorer';

export default createBrowserRouter([
  {
    path: '/main_window',
    element: <MainComponent />,
    children: [
      {
        path: '/main_window/explorer',
        element: <ExplorerSection />,
      },
    ],
  },
]);
