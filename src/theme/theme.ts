import { createTheme } from '@mui/material';

import { lightPalette, darkPalette } from './palette';
import components from './components';

// Extend MUI's Palette interface to include custom colors
declare module '@mui/material/styles' {
  interface Palette {
    sidebar: {
      text: string;
      icon: string;
      iconActive: string;
    };
    border: {
      main: string;
    };
    easy: {
      blue: string;
    };
  }

  interface PaletteOptions {
    sidebar?: {
      text?: string;
      icon?: string;
      iconActive?: string;
    };
    border?: {
      main?: string;
    };
    easy?: {
      blue?: string;
    };
  }
}

// ===========================|| THEMES ||=========================== //

export const lightTheme = createTheme({
  typography: {
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`,
  },
  palette: lightPalette,
  components: components,
});

// Create the Dark Theme
export const darkTheme = createTheme({
  typography: {
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`,
  },
  palette: darkPalette,
  components: components,
});
