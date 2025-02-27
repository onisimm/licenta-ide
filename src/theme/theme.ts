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

  interface Theme {
    size: (multiplier: number) => string;
  }

  interface ThemeOptions {
    size?: (multiplier: number) => string;
  }
}

// ===========================|| THEMES ||=========================== //

const generalTheme = createTheme({
  typography: {
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`,
  },
  components: components,
  size: (multiplier: number) => `${multiplier * 8}px`,
});

export const lightTheme = createTheme(generalTheme, {
  palette: lightPalette,
});

// Create the Dark Theme
export const darkTheme = createTheme(generalTheme, {
  palette: darkPalette,
});
