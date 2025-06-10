import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { getThemeByName } from './theme';
import { CssBaseline } from '@mui/material';
import { isDarkTheme } from '../constants/colors';

// Create a context for theme switching
const ThemeContext = createContext({
  toggleTheme: () => {},
  isDarkMode: false,
  setTheme: (isDark: boolean) => {},
  currentTheme: 'dark',
  setThemeByName: (themeName: string) => {},
});

// Get initial theme from localStorage or default to dark
const getInitialTheme = (): string => {
  if (typeof window === 'undefined') return 'dark'; // Default to dark for SSR

  try {
    const stored = localStorage.getItem('theme');
    if (stored !== null) {
      return stored;
    }

    // If no stored preference, check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error);
    return 'dark'; // Default to dark
  }
};

// Custom Theme Provider
export const CustomThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentTheme, setCurrentTheme] = useState<string>(getInitialTheme);

  // Persist theme preference to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('theme', currentTheme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }, [currentTheme]);

  const toggleTheme = () => {
    setCurrentTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (isDark: boolean) => {
    setCurrentTheme(isDark ? 'dark' : 'light');
  };

  const setThemeByName = (themeName: string) => {
    setCurrentTheme(themeName);
  };

  const isDarkMode = isDarkTheme(currentTheme);

  // Use the correct theme based on currentTheme
  const theme = useMemo(() => getThemeByName(currentTheme), [currentTheme]);

  return (
    <ThemeContext.Provider
      value={{
        toggleTheme,
        isDarkMode,
        setTheme,
        currentTheme,
        setThemeByName,
      }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

// Hook to use the theme context in components
export const useThemeToggle = () => useContext(ThemeContext);
