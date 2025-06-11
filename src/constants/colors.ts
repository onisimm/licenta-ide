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
    iconActive: '#ff82a1',
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

// Ocean theme - Blue/Teal inspired
export const oceanColors: ColorScheme = {
  primary: {
    main: '#0077be',
    light: '#0095d9',
    dark: '#005a94',
  },
  secondary: {
    main: '#00acc1',
    light: '#1cbccf',
    dark: '#008394',
  },
  background: {
    default: '#0a1628',
    paper: '#1e3a5f',
    elevated: '#2c4f73',
  },
  text: {
    primary: '#e8f4f8',
    secondary: '#b3d9e8',
    disabled: '#6b8fa3',
    hint: '#5a7a8f',
  },
  border: {
    main: '#2c4f73',
    light: '#3c5f83',
    dark: '#1c3f63',
  },
  action: {
    hover: 'rgba(0, 172, 193, 0.08)',
    selected: 'rgba(0, 172, 193, 0.16)',
    disabled: 'rgba(255, 255, 255, 0.26)',
    focus: 'rgba(0, 172, 193, 0.16)',
  },
  status: {
    error: '#ff5722',
    warning: '#ff9800',
    success: '#4caf50',
    info: '#00bcd4',
  },
  sidebar: {
    background: '#0f1b2e',
    text: '#b3d9e8',
    icon: '#6b8fa3',
    iconActive: '#155159',
    border: '#2c4f73',
  },
  editor: {
    background: '#0a1628',
    foreground: '#e8f4f8',
    lineHighlight: '#1e3a5f',
    selection: '#004d7a',
    inactiveSelection: '#1c3f63',
    cursor: '#00acc1',
    whitespace: '#3c5f83',
  },
  fileTree: {
    gitIgnored: '#547283',
    fileIcon: '#b3d9e8',
    folderIcon: '#00acc1',
  },
  fileTypes: {
    folder: '#00acc1',
    folderOpen: '#1cbccf',
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
    default: '#b3d9e8',
  },
};

// Forest theme - Green inspired
export const forestColors: ColorScheme = {
  primary: {
    main: '#2e7d32',
    light: '#4caf50',
    dark: '#1b5e20',
  },
  secondary: {
    main: '#66bb6a',
    light: '#81c784',
    dark: '#4caf50',
  },
  background: {
    default: '#0d1b0d',
    paper: '#1a2e1a',
    elevated: '#264726',
  },
  text: {
    primary: '#e8f5e8',
    secondary: '#c8e6c9',
    disabled: '#7ba07b',
    hint: '#6a956a',
  },
  border: {
    main: '#2e4b2e',
    light: '#3e5b3e',
    dark: '#1e3b1e',
  },
  action: {
    hover: 'rgba(102, 187, 106, 0.08)',
    selected: 'rgba(102, 187, 106, 0.16)',
    disabled: 'rgba(255, 255, 255, 0.26)',
    focus: 'rgba(102, 187, 106, 0.16)',
  },
  status: {
    error: '#f44336',
    warning: '#ff9800',
    success: '#4caf50',
    info: '#2196f3',
  },
  sidebar: {
    background: '#0a140a',
    text: '#c8e6c9',
    icon: '#7ba07b',
    iconActive: '#315233',
    border: '#2e4b2e',
  },
  editor: {
    background: '#0d1b0d',
    foreground: '#e8f5e8',
    lineHighlight: '#1a2e1a',
    selection: '#2e5d2e',
    inactiveSelection: '#1e3b1e',
    cursor: '#66bb6a',
    whitespace: '#3e5b3e',
  },
  fileTree: {
    gitIgnored: '#7ba07b',
    fileIcon: '#c8e6c9',
    folderIcon: '#66bb6a',
  },
  fileTypes: {
    folder: '#66bb6a',
    folderOpen: '#81c784',
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
    default: '#c8e6c9',
  },
};

// Sunset theme - Orange/Red inspired
export const sunsetColors: ColorScheme = {
  primary: {
    main: '#ff5722',
    light: '#ff7043',
    dark: '#d84315',
  },
  secondary: {
    main: '#ff9800',
    light: '#ffb74d',
    dark: '#f57c00',
  },
  background: {
    default: '#1a0d0a',
    paper: '#2d1b17',
    elevated: '#3d2b27',
  },
  text: {
    primary: '#fff8f6',
    secondary: '#ffccbc',
    disabled: '#bf8a6b',
    hint: '#a67c52',
  },
  border: {
    main: '#4d3329',
    light: '#5d4339',
    dark: '#3d2319',
  },
  action: {
    hover: 'rgba(255, 152, 0, 0.08)',
    selected: 'rgba(255, 152, 0, 0.16)',
    disabled: 'rgba(255, 255, 255, 0.26)',
    focus: 'rgba(255, 152, 0, 0.16)',
  },
  status: {
    error: '#d32f2f',
    warning: '#ed6c02',
    success: '#2e7d32',
    info: '#0288d1',
  },
  sidebar: {
    background: '#150a08',
    text: '#ffccbc',
    icon: '#bf8a6b',
    iconActive: '#ff9800',
    border: '#4d3329',
  },
  editor: {
    background: '#1a0d0a',
    foreground: '#fff8f6',
    lineHighlight: '#2d1b17',
    selection: '#5d3d2a',
    inactiveSelection: '#3d2319',
    cursor: '#ff9800',
    whitespace: '#5d4339',
  },
  fileTree: {
    gitIgnored: '#bf8a6b',
    fileIcon: '#ffccbc',
    folderIcon: '#ff9800',
  },
  fileTypes: {
    folder: '#ff9800',
    folderOpen: '#ffb74d',
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
    default: '#ffccbc',
  },
};

// Purple theme - Royal purple inspired
export const purpleColors: ColorScheme = {
  primary: {
    main: '#7b1fa2',
    light: '#9c27b0',
    dark: '#4a148c',
  },
  secondary: {
    main: '#ab47bc',
    light: '#ba68c8',
    dark: '#8e24aa',
  },
  background: {
    default: '#120a14',
    paper: '#1e121f',
    elevated: '#2a1a2c',
  },
  text: {
    primary: '#f8f4f9',
    secondary: '#e1bee7',
    disabled: '#9c7ba0',
    hint: '#8a6d8e',
  },
  border: {
    main: '#3d2840',
    light: '#4d3850',
    dark: '#2d1830',
  },
  action: {
    hover: 'rgba(171, 71, 188, 0.08)',
    selected: 'rgba(171, 71, 188, 0.16)',
    disabled: 'rgba(255, 255, 255, 0.26)',
    focus: 'rgba(171, 71, 188, 0.16)',
  },
  status: {
    error: '#f44336',
    warning: '#ff9800',
    success: '#4caf50',
    info: '#2196f3',
  },
  sidebar: {
    background: '#0f0a10',
    text: '#e1bee7',
    icon: '#9c7ba0',
    iconActive: '#4b1f53',
    border: '#3d2840',
  },
  editor: {
    background: '#120a14',
    foreground: '#f8f4f9',
    lineHighlight: '#1e121f',
    selection: '#4d2a52',
    inactiveSelection: '#2d1830',
    cursor: '#ab47bc',
    whitespace: '#4d3850',
  },
  fileTree: {
    gitIgnored: '#755a78',
    fileIcon: '#e1bee7',
    folderIcon: '#ab47bc',
  },
  fileTypes: {
    folder: '#ab47bc',
    folderOpen: '#ba68c8',
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
    default: '#e1bee7',
  },
};

// Midnight theme - Deep blue/black
export const midnightColors: ColorScheme = {
  primary: {
    main: '#1a237e',
    light: '#3f51b5',
    dark: '#000051',
  },
  secondary: {
    main: '#303f9f',
    light: '#5c6bc0',
    dark: '#1a237e',
  },
  background: {
    default: '#0a0a14',
    paper: '#12121f',
    elevated: '#1a1a2a',
  },
  text: {
    primary: '#f0f0ff',
    secondary: '#c5cae9',
    disabled: '#7986cb',
    hint: '#6670b8',
  },
  border: {
    main: '#2a2a3d',
    light: '#3a3a4d',
    dark: '#1a1a2d',
  },
  action: {
    hover: 'rgba(48, 63, 159, 0.08)',
    selected: 'rgba(48, 63, 159, 0.16)',
    disabled: 'rgba(255, 255, 255, 0.26)',
    focus: 'rgba(48, 63, 159, 0.16)',
  },
  status: {
    error: '#f44336',
    warning: '#ff9800',
    success: '#4caf50',
    info: '#2196f3',
  },
  sidebar: {
    background: '#080810',
    text: '#c5cae9',
    icon: '#7986cb',
    iconActive: '#7888ef',
    border: '#2a2a3d',
  },
  editor: {
    background: '#0a0a14',
    foreground: '#f0f0ff',
    lineHighlight: '#12121f',
    selection: '#2a2a4d',
    inactiveSelection: '#1a1a2d',
    cursor: '#303f9f',
    whitespace: '#3a3a4d',
  },
  fileTree: {
    gitIgnored: '#3c4368',
    fileIcon: '#c5cae9',
    folderIcon: '#303f9f',
  },
  fileTypes: {
    folder: '#303f9f',
    folderOpen: '#5c6bc0',
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
    default: '#c5cae9',
  },
};

// Rose theme - Pink/Rose inspired
export const roseColors: ColorScheme = {
  primary: {
    main: '#c2185b',
    light: '#e91e63',
    dark: '#8e0038',
  },
  secondary: {
    main: '#f06292',
    light: '#f48fb1',
    dark: '#e91e63',
  },
  background: {
    default: '#1a0a12',
    paper: '#2a1520',
    elevated: '#3a2030',
  },
  text: {
    primary: '#fdf2f8',
    secondary: '#f8bbd9',
    disabled: '#c895b3',
    hint: '#b87ba0',
  },
  border: {
    main: '#4d2a3d',
    light: '#5d3a4d',
    dark: '#3d1a2d',
  },
  action: {
    hover: 'rgba(240, 98, 146, 0.08)',
    selected: 'rgba(240, 98, 146, 0.16)',
    disabled: 'rgba(255, 255, 255, 0.26)',
    focus: 'rgba(240, 98, 146, 0.16)',
  },
  status: {
    error: '#d32f2f',
    warning: '#ed6c02',
    success: '#2e7d32',
    info: '#0288d1',
  },
  sidebar: {
    background: '#150a0f',
    text: '#f8bbd9',
    icon: '#c895b3',
    iconActive: '#f06292',
    border: '#4d2a3d',
  },
  editor: {
    background: '#1a0a12',
    foreground: '#fdf2f8',
    lineHighlight: '#2a1520',
    selection: '#5d2a42',
    inactiveSelection: '#3d1a2d',
    cursor: '#f06292',
    whitespace: '#5d3a4d',
  },
  fileTree: {
    gitIgnored: '#735366',
    fileIcon: '#f8bbd9',
    folderIcon: '#f06292',
  },
  fileTypes: {
    folder: '#f06292',
    folderOpen: '#f48fb1',
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
    default: '#f8bbd9',
  },
};

// Amber theme - Golden/Yellow inspired
export const amberColors: ColorScheme = {
  primary: {
    main: '#ff6f00',
    light: '#ff8f00',
    dark: '#e65100',
  },
  secondary: {
    main: '#ffb300',
    light: '#ffc947',
    dark: '#ff8f00',
  },
  background: {
    default: '#1a1400',
    paper: '#2d2400',
    elevated: '#403600',
  },
  text: {
    primary: '#fffbf0',
    secondary: '#ffecb3',
    disabled: '#c4a000',
    hint: '#b39000',
  },
  border: {
    main: '#4d4000',
    light: '#5d5000',
    dark: '#3d3000',
  },
  action: {
    hover: 'rgba(255, 179, 0, 0.08)',
    selected: 'rgba(255, 179, 0, 0.16)',
    disabled: 'rgba(255, 255, 255, 0.26)',
    focus: 'rgba(255, 179, 0, 0.16)',
  },
  status: {
    error: '#f44336',
    warning: '#ff9800',
    success: '#4caf50',
    info: '#2196f3',
  },
  sidebar: {
    background: '#151200',
    text: '#ffecb3',
    icon: '#c4a000',
    iconActive: '#ffb300',
    border: '#4d4000',
  },
  editor: {
    background: '#1a1400',
    foreground: '#fffbf0',
    lineHighlight: '#2d2400',
    selection: '#5d4a00',
    inactiveSelection: '#3d3000',
    cursor: '#ffb300',
    whitespace: '#5d5000',
  },
  fileTree: {
    gitIgnored: '#68613f',
    fileIcon: '#ffecb3',
    folderIcon: '#ffb300',
  },
  fileTypes: {
    folder: '#ffb300',
    folderOpen: '#ffc947',
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
    default: '#ffecb3',
  },
};

// Monochrome theme - Black/White/Grey
export const monochromeColors: ColorScheme = {
  primary: {
    main: '#424242',
    light: '#616161',
    dark: '#212121',
  },
  secondary: {
    main: '#757575',
    light: '#9e9e9e',
    dark: '#424242',
  },
  background: {
    default: '#0a0a0a',
    paper: '#1a1a1a',
    elevated: '#2a2a2a',
  },
  text: {
    primary: '#f5f5f5',
    secondary: '#e0e0e0',
    disabled: '#9e9e9e',
    hint: '#757575',
  },
  border: {
    main: '#424242',
    light: '#616161',
    dark: '#212121',
  },
  action: {
    hover: 'rgba(117, 117, 117, 0.08)',
    selected: 'rgba(117, 117, 117, 0.16)',
    disabled: 'rgba(255, 255, 255, 0.26)',
    focus: 'rgba(117, 117, 117, 0.16)',
  },
  status: {
    error: '#f44336',
    warning: '#ff9800',
    success: '#4caf50',
    info: '#2196f3',
  },
  sidebar: {
    background: '#0f0f0f',
    text: '#e0e0e0',
    icon: '#9e9e9e',
    iconActive: '#f5f5f5',
    border: '#424242',
  },
  editor: {
    background: '#0a0a0a',
    foreground: '#f5f5f5',
    lineHighlight: '#1a1a1a',
    selection: '#424242',
    inactiveSelection: '#212121',
    cursor: '#f5f5f5',
    whitespace: '#616161',
  },
  fileTree: {
    gitIgnored: '#616161',
    fileIcon: '#e0e0e0',
    folderIcon: '#757575',
  },
  fileTypes: {
    folder: '#757575',
    folderOpen: '#9e9e9e',
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
    default: '#e0e0e0',
  },
};

// Helper function to get color scheme by name
export const getColorSchemeByName = (name: string): ColorScheme => {
  switch (name) {
    case 'light':
      return lightColors;
    case 'dark':
      return darkColors;
    case 'ocean':
      return oceanColors;
    case 'forest':
      return forestColors;
    case 'sunset':
      return sunsetColors;
    case 'purple':
      return purpleColors;
    case 'midnight':
      return midnightColors;
    case 'rose':
      return roseColors;
    case 'amber':
      return amberColors;
    case 'monochrome':
      return monochromeColors;
    default:
      return darkColors;
  }
};

// Get all available theme names
export const getAvailableThemes = () => [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'ocean', label: 'Ocean' },
  { value: 'forest', label: 'Forest' },
  { value: 'sunset', label: 'Sunset' },
  { value: 'purple', label: 'Purple' },
  { value: 'midnight', label: 'Midnight' },
  { value: 'rose', label: 'Rose' },
  { value: 'amber', label: 'Amber' },
  { value: 'monochrome', label: 'Monochrome' },
];

// Helper function to determine if a theme is dark
export const isDarkTheme = (themeName: string): boolean => {
  return themeName !== 'light';
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
