import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './theme';
import { CssBaseline } from '@mui/material';

// Create a context for theme switching
const ThemeContext = createContext({
  toggleTheme: () => {},
  isDarkMode: false,
  setTheme: (isDark: boolean) => {},
});

// Get initial theme from localStorage or default to dark
const getInitialTheme = (): boolean => {
  if (typeof window === 'undefined') return true; // Default to dark for SSR

  try {
    const stored = localStorage.getItem('theme');
    if (stored !== null) {
      return stored === 'dark';
    }

    // If no stored preference, check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error);
    return true; // Default to dark
  }
};

// Custom Theme Provider
export const CustomThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialTheme);

  // Persist theme preference to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const setTheme = (isDark: boolean) => {
    setIsDarkMode(isDark);
  };

  // Use the correct theme based on isDarkMode
  const theme = useMemo(
    () => (isDarkMode ? darkTheme : lightTheme),
    [isDarkMode],
  );

  return (
    <ThemeContext.Provider value={{ toggleTheme, isDarkMode, setTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

// Hook to use the theme context in components
export const useThemeToggle = () => useContext(ThemeContext);
