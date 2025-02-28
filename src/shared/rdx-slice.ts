import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { IFolderStructure, IMainState } from './types';

// Define the initial state using that type
const initialState: IMainState = {
  folderStructure: {} as IFolderStructure,
};

export const mainSlice = createSlice({
  name: 'main',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setFolderStructure: (state, action: PayloadAction<IFolderStructure>) => {
      state.folderStructure = action.payload;
    },
  },
});

export const { setFolderStructure } = mainSlice.actions;

export default mainSlice.reducer;
