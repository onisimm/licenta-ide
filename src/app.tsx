import { memo, useCallback, useLayoutEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

import router from './shared/router';
import { useAppDispatch } from './shared/hooks';
import { IFolderStructure } from './shared/types';
import { setFolderStructure } from './shared/rdx-slice';

const App = memo((props: any) => {
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
