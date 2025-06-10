import { PaletteOptions } from '@mui/material/styles';
import {
  lightColors,
  darkColors,
  oceanColors,
  forestColors,
  sunsetColors,
  purpleColors,
  midnightColors,
  roseColors,
  amberColors,
  monochromeColors,
  cyberpunkColors,
  withAlpha,
  getColorSchemeByName,
  ColorScheme,
} from '../constants/colors';

// Helper function to create palette from color scheme
const createPaletteFromColorScheme = (
  colors: ColorScheme,
  mode: 'light' | 'dark',
): PaletteOptions => ({
  mode,
  primary: {
    main: colors.primary.main,
    light: colors.primary.light,
    dark: colors.primary.dark,
  },
  secondary: {
    main: colors.secondary.main,
    light: colors.secondary.light,
    dark: colors.secondary.dark,
  },
  background: {
    default: colors.background.default,
    paper: colors.background.paper,
  },
  text: {
    primary: colors.text.primary,
    secondary: colors.text.secondary,
    disabled: colors.text.disabled,
  },
  divider: colors.border.main,
  action: {
    hover: colors.action.hover,
    selected: colors.action.selected,
    disabled: colors.action.disabled,
    focus: colors.action.focus,
  },
  error: {
    main: colors.status.error,
    light: withAlpha(colors.status.error, 0.1),
    contrastText: mode === 'light' ? '#ffffff' : '#000000',
  },
  warning: {
    main: colors.status.warning,
    light: withAlpha(colors.status.warning, 0.1),
    contrastText: mode === 'light' ? '#ffffff' : '#000000',
  },
  success: {
    main: colors.status.success,
    light: withAlpha(colors.status.success, 0.1),
    contrastText: mode === 'light' ? '#ffffff' : '#000000',
  },
  info: {
    main: colors.status.info,
    light: withAlpha(colors.status.info, 0.1),
    contrastText: mode === 'light' ? '#ffffff' : '#000000',
  },
  // Custom color categories
  sidebar: {
    background: colors.sidebar.background,
    text: colors.sidebar.text,
    icon: colors.sidebar.icon,
    iconActive: colors.sidebar.iconActive,
    border: colors.sidebar.border,
  },
  border: {
    main: colors.border.main,
    light: colors.border.light,
    dark: colors.border.dark,
  },
  editor: {
    background: colors.editor.background,
    foreground: colors.editor.foreground,
    lineHighlight: colors.editor.lineHighlight,
    selection: colors.editor.selection,
    inactiveSelection: colors.editor.inactiveSelection,
    cursor: colors.editor.cursor,
    whitespace: colors.editor.whitespace,
  },
  fileTree: {
    gitIgnored: colors.fileTree.gitIgnored,
    fileIcon: colors.fileTree.fileIcon,
    folderIcon: colors.fileTree.folderIcon,
  },
  fileTypes: colors.fileTypes,
  // Keep existing custom colors for compatibility
  easy: {
    blue: colors.secondary.main,
  },
});

export const lightPalette: PaletteOptions = createPaletteFromColorScheme(
  lightColors,
  'light',
);
export const darkPalette: PaletteOptions = createPaletteFromColorScheme(
  darkColors,
  'dark',
);
export const oceanPalette: PaletteOptions = createPaletteFromColorScheme(
  oceanColors,
  'dark',
);
export const forestPalette: PaletteOptions = createPaletteFromColorScheme(
  forestColors,
  'dark',
);
export const sunsetPalette: PaletteOptions = createPaletteFromColorScheme(
  sunsetColors,
  'dark',
);
export const purplePalette: PaletteOptions = createPaletteFromColorScheme(
  purpleColors,
  'dark',
);
export const midnightPalette: PaletteOptions = createPaletteFromColorScheme(
  midnightColors,
  'dark',
);
export const rosePalette: PaletteOptions = createPaletteFromColorScheme(
  roseColors,
  'dark',
);
export const amberPalette: PaletteOptions = createPaletteFromColorScheme(
  amberColors,
  'dark',
);
export const monochromePalette: PaletteOptions = createPaletteFromColorScheme(
  monochromeColors,
  'dark',
);
export const cyberpunkPalette: PaletteOptions = createPaletteFromColorScheme(
  cyberpunkColors,
  'dark',
);

// Helper function to get palette by theme name
export const getPaletteByTheme = (themeName: string): PaletteOptions => {
  switch (themeName) {
    case 'light':
      return lightPalette;
    case 'dark':
      return darkPalette;
    case 'ocean':
      return oceanPalette;
    case 'forest':
      return forestPalette;
    case 'sunset':
      return sunsetPalette;
    case 'purple':
      return purplePalette;
    case 'midnight':
      return midnightPalette;
    case 'rose':
      return rosePalette;
    case 'amber':
      return amberPalette;
    case 'monochrome':
      return monochromePalette;
    case 'cyberpunk':
      return cyberpunkPalette;
    default:
      return darkPalette;
  }
};
