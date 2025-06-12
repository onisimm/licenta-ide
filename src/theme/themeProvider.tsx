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
  isInitialized: false,
});

// Get initial theme from electron store or default to dark
const getInitialTheme = async (): Promise<string> => {
  if (typeof window === 'undefined') return 'dark'; // Default to dark for SSR

  try {
    // Try to get theme from electron store first
    if (window.electron?.getTheme) {
      const stored = await window.electron.getTheme();
      if (stored) {
        return stored;
      }
    }

    // Fallback to localStorage for development/backwards compatibility
    const localStored = localStorage.getItem('theme');
    if (localStored !== null) {
      // Migrate to electron store if available
      if (window.electron?.setTheme) {
        await window.electron.setTheme(localStored);
        localStorage.removeItem('theme'); // Clean up old storage
      }
      return localStored;
    }

    // If no stored preference, check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  } catch (error) {
    console.warn('Failed to read theme from electron store:', error);

    // Fallback to localStorage
    try {
      const stored = localStorage.getItem('theme');
      return stored || 'dark';
    } catch (localError) {
      console.warn('Failed to read theme from localStorage:', error);
      return 'dark'; // Default to dark
    }
  }
};

// Custom Theme Provider
export const CustomThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentTheme, setCurrentTheme] = useState<string>('dark');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    const initializeTheme = async () => {
      const initialTheme = await getInitialTheme();
      setCurrentTheme(initialTheme);
      setIsInitialized(true);
    };

    initializeTheme();
  }, []);

  // Persist theme preference to electron store
  useEffect(() => {
    if (!isInitialized) return; // Don't save during initialization

    const saveTheme = async () => {
      try {
        if (window.electron?.setTheme) {
          await window.electron.setTheme(currentTheme);
        } else {
          // Fallback to localStorage
          localStorage.setItem('theme', currentTheme);
        }
      } catch (error) {
        console.warn(
          'Failed to save theme to electron store, using localStorage:',
          error,
        );
        try {
          localStorage.setItem('theme', currentTheme);
        } catch (localError) {
          console.warn('Failed to save theme to localStorage:', localError);
        }
      }
    };

    saveTheme();
  }, [currentTheme, isInitialized]);

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
        isInitialized,
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
