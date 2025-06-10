import { createTheme } from '@mui/material';

import { lightPalette, darkPalette } from './palette';
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

// Create the Dark Theme
export const darkTheme = createTheme(generalTheme, {
  palette: darkPalette,
});
