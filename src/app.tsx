import { memo, useCallback, useLayoutEffect, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

import router from './shared/router';
import { useAppDispatch } from './shared/hooks';
import { IFolderStructure } from './shared/types';
import { setFolderStructure } from './shared/rdx-slice';
import { logError } from './shared/utils';

const App = memo((props: any) => {
  // Add global error handling
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Global unhandled promise rejection:', event.reason);
      logError('Global Promise Rejection', event.reason);

      // Prevent the error from bubbling to webpack overlay
      event.preventDefault();

      // Show meaningful error message instead of [object Event]
      if (event.reason) {
        console.warn('Preventing webpack overlay error:', event.reason);
      }
    };

    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error || event.message);
      logError('Global Error', event.error || event.message);

      // Prevent the error from bubbling to webpack overlay
      event.preventDefault();
    };

    // Catch unhandled errors at the window level
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener(
        'unhandledrejection',
        handleUnhandledRejection,
      );
      window.removeEventListener('error', handleError);
    };
  }, []);

  // const dispatch = useAppDispatch();

  // const get_folder = useCallback(async () => {
  //   const folder: IFolderStructure = await window.electron.openFolder();
  //   dispatch(setFolderStructure(folder));
  // }, []);

  // useLayoutEffect(() => {
  //   get_folder();
  // });

  return <RouterProvider router={router} />;
});

export default App;
