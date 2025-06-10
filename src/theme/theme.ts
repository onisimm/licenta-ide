import { createTheme } from '@mui/material';

import {
  lightPalette,
  darkPalette,
  oceanPalette,
  forestPalette,
  sunsetPalette,
  purplePalette,
  midnightPalette,
  rosePalette,
  amberPalette,
  monochromePalette,
  getPaletteByTheme,
} from './palette';
import components from './components';
import { ColorScheme } from '../constants/colors';

// Extend MUI's Palette interface to include custom colors
declare module '@mui/material/styles' {
  interface Palette {
    sidebar: {
      background: string;
      text: string;
      icon: string;
      iconActive: string;
      border: string;
    };
    border: {
      main: string;
      light: string;
      dark: string;
    };
    editor: {
      background: string;
      foreground: string;
      lineHighlight: string;
      selection: string;
      inactiveSelection: string;
      cursor: string;
      whitespace: string;
    };
    fileTree: {
      gitIgnored: string;
      fileIcon: string;
      folderIcon: string;
    };
    fileTypes: {
      folder: string;
      folderOpen: string;
      typescript: string;
      javascript: string;
      css: string;
      html: string;
      json: string;
      markdown: string;
      python: string;
      java: string;
      cpp: string;
      csharp: string;
      php: string;
      rust: string;
      go: string;
      swift: string;
      dart: string;
      default: string;
    };
    easy: {
      blue: string;
    };
  }

  interface PaletteOptions {
    sidebar?: {
      background?: string;
      text?: string;
      icon?: string;
      iconActive?: string;
      border?: string;
    };
    border?: {
      main?: string;
      light?: string;
      dark?: string;
    };
    editor?: {
      background?: string;
      foreground?: string;
      lineHighlight?: string;
      selection?: string;
      inactiveSelection?: string;
      cursor?: string;
      whitespace?: string;
    };
    fileTree?: {
      gitIgnored?: string;
      fileIcon?: string;
      folderIcon?: string;
    };
    fileTypes?: {
      folder?: string;
      folderOpen?: string;
      typescript?: string;
      javascript?: string;
      css?: string;
      html?: string;
      json?: string;
      markdown?: string;
      python?: string;
      java?: string;
      cpp?: string;
      csharp?: string;
      php?: string;
      rust?: string;
      go?: string;
      swift?: string;
      dart?: string;
      default?: string;
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

export const darkTheme = createTheme(generalTheme, {
  palette: darkPalette,
});

export const oceanTheme = createTheme(generalTheme, {
  palette: oceanPalette,
});

export const forestTheme = createTheme(generalTheme, {
  palette: forestPalette,
});

export const sunsetTheme = createTheme(generalTheme, {
  palette: sunsetPalette,
});

export const purpleTheme = createTheme(generalTheme, {
  palette: purplePalette,
});

export const midnightTheme = createTheme(generalTheme, {
  palette: midnightPalette,
});

export const roseTheme = createTheme(generalTheme, {
  palette: rosePalette,
});

export const amberTheme = createTheme(generalTheme, {
  palette: amberPalette,
});

export const monochromeTheme = createTheme(generalTheme, {
  palette: monochromePalette,
});

// Helper function to get theme by name
export const getThemeByName = (themeName: string) => {
  switch (themeName) {
    case 'light':
      return lightTheme;
    case 'dark':
      return darkTheme;
    case 'ocean':
      return oceanTheme;
    case 'forest':
      return forestTheme;
    case 'sunset':
      return sunsetTheme;
    case 'purple':
      return purpleTheme;
    case 'midnight':
      return midnightTheme;
    case 'rose':
      return roseTheme;
    case 'amber':
      return amberTheme;
    case 'monochrome':
      return monochromeTheme;
    default:
      return darkTheme;
  }
};
