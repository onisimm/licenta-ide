import { memo } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './shared/router';

const App = memo((props: any) => {
  return <RouterProvider router={router} />;
});

export default App;
