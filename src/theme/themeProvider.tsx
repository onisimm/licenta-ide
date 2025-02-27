import React, { createContext, useContext, useMemo, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './theme';
import { CssBaseline } from '@mui/material';

// Create a context for theme switching
const ThemeContext = createContext({
  toggleTheme: () => {},
  isDarkMode: false,
});

// Custom Theme Provider
export const CustomThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Use the correct theme based on isDarkMode
  const theme = useMemo(
    () => (isDarkMode ? darkTheme : lightTheme),
    [isDarkMode],
  );

  return (
    <ThemeContext.Provider value={{ toggleTheme, isDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

// Hook to use the theme context in components
export const useThemeToggle = () => useContext(ThemeContext);
