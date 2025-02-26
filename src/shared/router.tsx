import { createBrowserRouter } from 'react-router-dom';
import MainComponent from '../app/screens/main';

export default createBrowserRouter([
  {
    path: '/main_window',
    element: <MainComponent />,
  },
]);
