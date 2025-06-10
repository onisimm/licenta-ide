// Central color constants for theming
// This file consolidates all colors used throughout the application

export interface ColorScheme {
  // Base UI colors
  primary: {
    main: string;
    light: string;
    dark: string;
  };
  secondary: {
    main: string;
    light: string;
    dark: string;
  };
  background: {
    default: string;
    paper: string;
    elevated: string;
  };
  text: {
    primary: string;
    secondary: string;
    disabled: string;
    hint: string;
  };
  border: {
    main: string;
    light: string;
    dark: string;
  };

  // Action states
  action: {
    hover: string;
    selected: string;
    disabled: string;
    focus: string;
  };

  // Status colors
  status: {
    error: string;
    warning: string;
    success: string;
    info: string;
  };

  // Component specific colors
  sidebar: {
    background: string;
    text: string;
    icon: string;
    iconActive: string;
    border: string;
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

  // File type colors (for icons)
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
}

// Light theme colors
export const lightColors: ColorScheme = {
  primary: {
    main: '#004d96',
    light: '#005cb3',
    dark: '#003d78',
  },
  secondary: {
    main: '#0078d4',
    light: '#0085eb',
    dark: '#0066b3',
  },
  background: {
    default: '#ffffff',
    paper: '#f5f5f5',
    elevated: '#ffffff',
  },
  text: {
    primary: '#212121',
    secondary: '#616161',
    disabled: '#9e9e9e',
    hint: '#8e8e8e',
  },
  border: {
    main: '#e0e0e0',
    light: '#f0f0f0',
    dark: '#d0d0d0',
  },
  action: {
    hover: 'rgba(0, 0, 0, 0.04)',
    selected: 'rgba(0, 120, 212, 0.12)',
    disabled: 'rgba(0, 0, 0, 0.26)',
    focus: 'rgba(0, 120, 212, 0.12)',
  },
  status: {
    error: '#d32f2f',
    warning: '#ed6c02',
    success: '#2e7d32',
    info: '#0288d1',
  },
  sidebar: {
    background: '#f5f5f5',
    text: '#333333',
    icon: '#757575',
    iconActive: '#212121',
    border: '#e0e0e0',
  },
  editor: {
    background: '#ffffff',
    foreground: '#212121',
    lineHighlight: '#f5f5f5',
    selection: '#add6ff',
    inactiveSelection: '#e4e4e4',
    cursor: '#212121',
    whitespace: '#cccccc',
  },
  fileTree: {
    gitIgnored: '#9e9e9e',
    fileIcon: '#696969',
    folderIcon: '#4169E1',
  },
  fileTypes: {
    folder: '#4169E1',
    folderOpen: '#4169E1',
    typescript: '#007acc',
    javascript: '#f7df1e',
    css: '#1572B6',
    html: '#e14e1d',
    json: '#42a5f5',
    markdown: '#084c61',
    python: '#3776ab',
    java: '#f89820',
    cpp: '#00599c',
    csharp: '#9b4f96',
    php: '#777bb3',
    rust: '#ce422b',
    go: '#00add8',
    swift: '#ff7043',
    dart: '#0098fb',
    default: '#8e8e8e',
  },
};

// Dark theme colors
export const darkColors: ColorScheme = {
  primary: {
    main: '#004d96',
    light: '#005cb3',
    dark: '#003d78',
  },
  secondary: {
    main: '#0078d4',
    light: '#0085eb',
    dark: '#0066b3',
  },
  background: {
    default: '#0d1117',
    paper: '#222222',
    elevated: '#2d2d2d',
  },
  text: {
    primary: '#fafafa',
    secondary: '#cccccc',
    disabled: '#666666',
    hint: '#8e8e8e',
  },
  border: {
    main: '#2b2b2b',
    light: '#3b3b3b',
    dark: '#1b1b1b',
  },
  action: {
    hover: 'rgba(255, 255, 255, 0.08)',
    selected: 'rgba(0, 120, 212, 0.16)',
    disabled: 'rgba(255, 255, 255, 0.3)',
    focus: 'rgba(0, 120, 212, 0.16)',
  },
  status: {
    error: '#f44336',
    warning: '#ff9800',
    success: '#4caf50',
    info: '#2196f3',
  },
  sidebar: {
    background: '#222222',
    text: '#cccccc',
    icon: '#fafafa',
    iconActive: '#ff82a1',
    border: '#2b2b2b',
  },
  editor: {
    background: '#0d1117',
    foreground: '#fafafa',
    lineHighlight: '#1c2333',
    selection: '#264f78',
    inactiveSelection: '#3a3d41',
    cursor: '#fafafa',
    whitespace: '#3c4043',
  },
  fileTree: {
    gitIgnored: '#6e6e6e',
    fileIcon: '#fafafa',
    folderIcon: '#4169E1',
  },
  fileTypes: {
    folder: '#4169E1',
    folderOpen: '#4169E1',
    typescript: '#007acc',
    javascript: '#f7df1e',
    css: '#1572B6',
    html: '#e14e1d',
    json: '#42a5f5',
    markdown: '#084c61',
    python: '#3776ab',
    java: '#f89820',
    cpp: '#00599c',
    csharp: '#9b4f96',
    php: '#777bb3',
    rust: '#ce422b',
    go: '#00add8',
    swift: '#ff7043',
    dart: '#0098fb',
    default: '#8e8e8e',
  },
};

// Helper function to get current color scheme
export const getColorScheme = (isDark: boolean): ColorScheme => {
  return isDark ? darkColors : lightColors;
};

// Helper function to create alpha variants of colors
export const withAlpha = (color: string, alpha: number): string => {
  // Convert hex to rgba
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Semantic color mapping for easy access
export const semanticColors = {
  transparent: 'transparent',
  inherit: 'inherit',
} as const;
