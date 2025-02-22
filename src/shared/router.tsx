import { createBrowserRouter } from 'react-router-dom';
import MainComponent from '../components/main';

export default createBrowserRouter([
  {
    path: '/main_window',
    element: <MainComponent />,
  },
]);
