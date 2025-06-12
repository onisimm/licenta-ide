import { memo, useState, useCallback, useEffect } from 'react';
import {
  Box,
  styled,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from '@mui/material';
import { useThemeToggle } from '../theme/themeProvider';
import { getAvailableThemes } from '../constants/colors';

const SettingsContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const SettingsPanel = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 600,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const FieldContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

export const SettingsSection = memo(() => {
  const { toggleTheme, currentTheme, setThemeByName } = useThemeToggle();
  const [zoom, setZoom] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize zoom level on mount
  useEffect(() => {
    const initializeZoom = async () => {
      try {
        if (window.electron?.getZoomLevel) {
          const stored = await window.electron.getZoomLevel();
          setZoom(stored);
          // Apply the zoom level
          if (window.electron?.setZoomLevel) {
            window.electron.setZoomLevel(stored);
          }
        } else {
          // Fallback to localStorage
          const saved = localStorage.getItem('zoom-level');
          const savedZoom = saved ? parseFloat(saved) : 1;
          setZoom(savedZoom);
        }
      } catch (error) {
        console.warn(
          'Failed to get zoom level from electron store, using localStorage:',
          error,
        );
        try {
          const saved = localStorage.getItem('zoom-level');
          const savedZoom = saved ? parseFloat(saved) : 1;
          setZoom(savedZoom);
        } catch (localError) {
          console.warn(
            'Failed to get zoom level from localStorage:',
            localError,
          );
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
        // Fallback to localStorage
        localStorage.setItem('zoom-level', newZoom.toString());
      }
    } catch (error) {
      console.warn(
        'Failed to save zoom level to electron store, using localStorage:',
        error,
      );
      try {
        localStorage.setItem('zoom-level', newZoom.toString());
      } catch (localError) {
        console.warn('Failed to save zoom level to localStorage:', localError);
      }
    }
  }, []);

  const handleResetZoom = useCallback(async () => {
    const defaultZoom = 1;
    setZoom(defaultZoom);

    try {
      if (window.electron?.setZoomLevel) {
        await window.electron.setZoomLevel(defaultZoom);
      } else {
        // Fallback to localStorage
        localStorage.setItem('zoom-level', defaultZoom.toString());
      }
    } catch (error) {
      console.warn(
        'Failed to save zoom level to electron store, using localStorage:',
        error,
      );
      try {
        localStorage.setItem('zoom-level', defaultZoom.toString());
      } catch (localError) {
        console.warn('Failed to save zoom level to localStorage:', localError);
      }
    }
  }, []);

  const handleThemeChange = useCallback(
    (event: any) => {
      const selectedTheme = event.target.value;
      setThemeByName(selectedTheme);
    },
    [setThemeByName],
  );

  const availableThemes = getAvailableThemes();

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
        <FieldContainer>
          <Typography variant="body2" color="text.secondary">
            Theme
          </Typography>
          <FormControl size="small" fullWidth>
            <InputLabel id="theme-select-label">Select Theme</InputLabel>
            <Select
              labelId="theme-select-label"
              value={currentTheme}
              onChange={handleThemeChange}
              label="Select Theme">
              {availableThemes.map(theme => (
                <MenuItem key={theme.value} value={theme.value}>
                  {theme.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="caption" color="text.secondary">
            Choose from {availableThemes.length} available themes
          </Typography>
        </FieldContainer>

        <FieldContainer>
          <Typography variant="body2" color="text.secondary">
            Zoom Level
          </Typography>
          <FormControl size="small" fullWidth>
            <InputLabel id="zoom-select-label">Select Zoom Level</InputLabel>
            <Select
              labelId="zoom-select-label"
              value={zoom.toString()}
              onChange={event =>
                handleZoomChange(parseFloat(event.target.value))
              }
              label="Select Zoom Level">
              {zoomOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 1,
            }}>
            <Typography variant="caption" color="text.secondary">
              Current: {Math.round(zoom * 100)}%
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={handleResetZoom}
              color="secondary">
              Reset to 100%
            </Button>
          </Box>
        </FieldContainer>
      </SettingsPanel>

      <SettingsPanel elevation={1}>
        <SectionTitle>About</SectionTitle>
        <Typography variant="body2" color="text.secondary">
          Application: <strong>SEditor</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Current Theme:{' '}
          <strong>
            {availableThemes.find(t => t.value === currentTheme)?.label ||
              currentTheme}
          </strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Zoom Level: <strong>{Math.round(zoom * 100)}%</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          A modern code editor with {availableThemes.length} unique themes to
          personalize your coding experience. The title automatically updates to
          show the current folder when one is open.
        </Typography>
      </SettingsPanel>
    </SettingsContainer>
  );
});

export default SettingsSection;
