import { PaletteOptions } from '@mui/material/styles';
import { lightColors, darkColors, withAlpha } from '../constants/colors';

export const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: lightColors.primary.main,
    light: lightColors.primary.light,
    dark: lightColors.primary.dark,
  },
  secondary: {
    main: lightColors.secondary.main,
    light: lightColors.secondary.light,
    dark: lightColors.secondary.dark,
  },
  background: {
    default: lightColors.background.default,
    paper: lightColors.background.paper,
  },
  text: {
    primary: lightColors.text.primary,
    secondary: lightColors.text.secondary,
    disabled: lightColors.text.disabled,
  },
  divider: lightColors.border.main,
  action: {
    hover: lightColors.action.hover,
    selected: lightColors.action.selected,
    disabled: lightColors.action.disabled,
    focus: lightColors.action.focus,
  },
  error: {
    main: lightColors.status.error,
    light: withAlpha(lightColors.status.error, 0.1),
    contrastText: '#ffffff',
  },
  warning: {
    main: lightColors.status.warning,
    light: withAlpha(lightColors.status.warning, 0.1),
    contrastText: '#ffffff',
  },
  success: {
    main: lightColors.status.success,
    light: withAlpha(lightColors.status.success, 0.1),
    contrastText: '#ffffff',
  },
  info: {
    main: lightColors.status.info,
    light: withAlpha(lightColors.status.info, 0.1),
    contrastText: '#ffffff',
  },
  // Custom color categories
  sidebar: {
    background: lightColors.sidebar.background,
    text: lightColors.sidebar.text,
    icon: lightColors.sidebar.icon,
    iconActive: lightColors.sidebar.iconActive,
    border: lightColors.sidebar.border,
  },
  border: {
    main: lightColors.border.main,
    light: lightColors.border.light,
    dark: lightColors.border.dark,
  },
  editor: {
    background: lightColors.editor.background,
    foreground: lightColors.editor.foreground,
    lineHighlight: lightColors.editor.lineHighlight,
    selection: lightColors.editor.selection,
    inactiveSelection: lightColors.editor.inactiveSelection,
    cursor: lightColors.editor.cursor,
    whitespace: lightColors.editor.whitespace,
  },
  fileTree: {
    gitIgnored: lightColors.fileTree.gitIgnored,
    fileIcon: lightColors.fileTree.fileIcon,
    folderIcon: lightColors.fileTree.folderIcon,
  },
  fileTypes: lightColors.fileTypes,
  // Keep existing custom colors for compatibility
  easy: {
    blue: lightColors.secondary.main,
  },
};

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: darkColors.primary.main,
    light: darkColors.primary.light,
    dark: darkColors.primary.dark,
  },
  secondary: {
    main: darkColors.secondary.main,
    light: darkColors.secondary.light,
    dark: darkColors.secondary.dark,
  },
  background: {
    default: darkColors.background.default,
    paper: darkColors.background.paper,
  },
  text: {
    primary: darkColors.text.primary,
    secondary: darkColors.text.secondary,
    disabled: darkColors.text.disabled,
  },
  divider: darkColors.border.main,
  action: {
    hover: darkColors.action.hover,
    selected: darkColors.action.selected,
    disabled: darkColors.action.disabled,
    focus: darkColors.action.focus,
  },
  error: {
    main: darkColors.status.error,
    light: withAlpha(darkColors.status.error, 0.1),
    contrastText: '#000000',
  },
  warning: {
    main: darkColors.status.warning,
    light: withAlpha(darkColors.status.warning, 0.1),
    contrastText: '#000000',
  },
  success: {
    main: darkColors.status.success,
    light: withAlpha(darkColors.status.success, 0.1),
    contrastText: '#000000',
  },
  info: {
    main: darkColors.status.info,
    light: withAlpha(darkColors.status.info, 0.1),
    contrastText: '#000000',
  },
  // Custom color categories
  sidebar: {
    background: darkColors.sidebar.background,
    text: darkColors.sidebar.text,
    icon: darkColors.sidebar.icon,
    iconActive: darkColors.sidebar.iconActive,
    border: darkColors.sidebar.border,
  },
  border: {
    main: darkColors.border.main,
    light: darkColors.border.light,
    dark: darkColors.border.dark,
  },
  editor: {
    background: darkColors.editor.background,
    foreground: darkColors.editor.foreground,
    lineHighlight: darkColors.editor.lineHighlight,
    selection: darkColors.editor.selection,
    inactiveSelection: darkColors.editor.inactiveSelection,
    cursor: darkColors.editor.cursor,
    whitespace: darkColors.editor.whitespace,
  },
  fileTree: {
    gitIgnored: darkColors.fileTree.gitIgnored,
    fileIcon: darkColors.fileTree.fileIcon,
    folderIcon: darkColors.fileTree.folderIcon,
  },
  fileTypes: darkColors.fileTypes,
  // Keep existing custom colors for compatibility
  easy: {
    blue: darkColors.secondary.main,
  },
};
