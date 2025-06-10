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
  const { currentTheme, setThemeByName } = useThemeToggle();
  const [zoomLevel, setZoomLevel] = useState(() => {
    const saved = localStorage.getItem('zoom-level');
    return saved ? parseFloat(saved) : 1.0;
  });

  const handleThemeChange = useCallback(
    (event: any) => {
      const selectedTheme = event.target.value;
      setThemeByName(selectedTheme);
    },
    [setThemeByName],
  );

  const handleZoomChange = useCallback((event: any) => {
    const zoom = parseFloat(event.target.value);
    setZoomLevel(zoom);
    localStorage.setItem('zoom-level', zoom.toString());

    // Apply zoom using Electron's API if available
    if (window.electron?.setZoomLevel) {
      window.electron.setZoomLevel(zoom);
    }
  }, []);

  const handleResetZoom = useCallback(() => {
    const defaultZoom = 1.0;
    setZoomLevel(defaultZoom);
    localStorage.setItem('zoom-level', defaultZoom.toString());

    if (window.electron?.setZoomLevel) {
      window.electron.setZoomLevel(defaultZoom);
    }
  }, []);

  // Apply saved zoom level on component mount
  useEffect(() => {
    if (window.electron?.setZoomLevel) {
      window.electron.setZoomLevel(zoomLevel);
    }
  }, []);

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
              value={zoomLevel}
              onChange={handleZoomChange}
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
              Current: {Math.round(zoomLevel * 100)}%
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
          Zoom Level: <strong>{Math.round(zoomLevel * 100)}%</strong>
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
