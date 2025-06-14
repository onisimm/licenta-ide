import { memo, useState, useCallback, useEffect } from 'react';
import { Typography } from '@mui/material';
import { useThemeToggle } from '../../theme/themeProvider';
import { getAvailableThemes } from '../../constants/colors';
import { SettingsContainer, SettingsPanel, SectionTitle } from './styles';
import { ThemeSelector } from './ThemeSelector';
import { ZoomSelector } from './ZoomSelector';
import { AboutPanel } from './AboutPanel';
import { ThemeOption } from './types';

export const SettingsSection = memo(() => {
  const { toggleTheme, currentTheme, setThemeByName } = useThemeToggle();
  const [zoom, setZoom] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeZoom = async () => {
      try {
        if (window.electron?.getZoomLevel) {
          const stored = await window.electron.getZoomLevel();
          setZoom(stored);
          if (window.electron?.setZoomLevel) {
            window.electron.setZoomLevel(stored);
          }
        } else {
          const saved = localStorage.getItem('zoom-level');
          const savedZoom = saved ? parseFloat(saved) : 1;
          setZoom(savedZoom);
        }
      } catch (error) {
        try {
          const saved = localStorage.getItem('zoom-level');
          const savedZoom = saved ? parseFloat(saved) : 1;
          setZoom(savedZoom);
        } catch {
          setZoom(1);
        }
      }
      setIsInitialized(true);
    };
    initializeZoom();
  }, []);

  const handleZoomChange = useCallback(async (newZoom: number) => {
    setZoom(newZoom);
    try {
      if (window.electron?.setZoomLevel) {
        await window.electron.setZoomLevel(newZoom);
      } else {
        localStorage.setItem('zoom-level', newZoom.toString());
      }
    } catch {
      try {
        localStorage.setItem('zoom-level', newZoom.toString());
      } catch {}
    }
  }, []);

  const handleResetZoom = useCallback(async () => {
    const defaultZoom = 1;
    setZoom(defaultZoom);
    try {
      if (window.electron?.setZoomLevel) {
        await window.electron.setZoomLevel(defaultZoom);
      } else {
        localStorage.setItem('zoom-level', defaultZoom.toString());
      }
    } catch {
      try {
        localStorage.setItem('zoom-level', defaultZoom.toString());
      } catch {}
    }
  }, []);

  const handleThemeChange = useCallback(
    (selectedTheme: string) => {
      setThemeByName(selectedTheme);
    },
    [setThemeByName],
  );

  const availableThemes: ThemeOption[] = getAvailableThemes();

  const zoomOptions = [
    { value: 0.5, label: '50%' },
    { value: 0.6, label: '60%' },
    { value: 0.7, label: '70%' },
    { value: 0.8, label: '80%' },
    { value: 0.9, label: '90%' },
    { value: 1.0, label: '100%' },
    { value: 1.1, label: '110%' },
    { value: 1.25, label: '125%' },
    { value: 1.5, label: '150%' },
    { value: 1.75, label: '175%' },
    { value: 2.0, label: '200%' },
  ];

  return (
    <SettingsContainer>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Settings
      </Typography>
      <SettingsPanel elevation={1}>
        <SectionTitle>Appearance</SectionTitle>
        <ThemeSelector
          currentTheme={currentTheme}
          availableThemes={availableThemes}
          onThemeChange={handleThemeChange}
        />
        <ZoomSelector
          zoom={zoom}
          zoomOptions={zoomOptions}
          onZoomChange={handleZoomChange}
          onResetZoom={handleResetZoom}
        />
      </SettingsPanel>
      <AboutPanel
        availableThemes={availableThemes}
        currentTheme={currentTheme}
        zoom={zoom}
      />
    </SettingsContainer>
  );
});

export default SettingsSection;
