import Store from 'electron-store';
import {
  SELECTED_FOLDER_STORE_NAME,
  THEME_STORE_NAME,
  SIDEBAR_WIDTH_STORE_NAME,
  ZOOM_LEVEL_STORE_NAME,
  StoreData,
} from '../types/store';

// @ts-ignore
const store = new Store<StoreData>();

export const getStore = () => store;

export const getSelectedFolder = () => {
  // @ts-ignore
  return store.get(SELECTED_FOLDER_STORE_NAME);
};

export const setSelectedFolder = (
  data: StoreData[typeof SELECTED_FOLDER_STORE_NAME],
) => {
  // @ts-ignore
  store.set(SELECTED_FOLDER_STORE_NAME, data);
};

export const getTheme = () => {
  // @ts-ignore
  return store.get(THEME_STORE_NAME) || 'dark';
};

export const setTheme = (theme: string) => {
  // @ts-ignore
  store.set(THEME_STORE_NAME, theme);
};

export const getSidebarWidth = () => {
  // @ts-ignore
  return store.get(SIDEBAR_WIDTH_STORE_NAME) || 260;
};

export const setSidebarWidth = (width: number) => {
  // @ts-ignore
  store.set(SIDEBAR_WIDTH_STORE_NAME, width);
};

export const getZoomLevel = () => {
  // @ts-ignore
  return store.get(ZOOM_LEVEL_STORE_NAME) || 1;
};

export const setZoomLevel = (level: number) => {
  // @ts-ignore
  store.set(ZOOM_LEVEL_STORE_NAME, level);
};
