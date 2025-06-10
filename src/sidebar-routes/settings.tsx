import { memo, useState, useCallback } from 'react';
import {
  Box,
  styled,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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

  const handleThemeChange = useCallback(
    (event: any) => {
      const selectedTheme = event.target.value;
      setThemeByName(selectedTheme);
    },
    [setThemeByName],
  );

  const availableThemes = getAvailableThemes();

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
          A modern code editor with {availableThemes.length} unique themes to
          personalize your coding experience. The title automatically updates to
          show the current folder when one is open.
        </Typography>
      </SettingsPanel>
    </SettingsContainer>
  );
});

export default SettingsSection;
