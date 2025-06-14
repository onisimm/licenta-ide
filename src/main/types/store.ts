export const SELECTED_FOLDER_STORE_NAME = 'selected-folder';
export const THEME_STORE_NAME = 'app-theme';
export const SIDEBAR_WIDTH_STORE_NAME = 'sidebar-width';
export const ZOOM_LEVEL_STORE_NAME = 'zoom-level';

export interface StoreData {
  [SELECTED_FOLDER_STORE_NAME]?: {
    name: string;
    root: string;
    tree: any[];
    backgroundLoading: boolean;
    backgroundLoadingFailed?: boolean;
  };
  [THEME_STORE_NAME]?: string;
  [SIDEBAR_WIDTH_STORE_NAME]?: number;
  [ZOOM_LEVEL_STORE_NAME]?: number;
}
