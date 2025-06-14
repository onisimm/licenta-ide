import React from 'react';
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { ThemeOption } from './types';
import { FieldContainer } from './styles';

interface ThemeSelectorProps {
  currentTheme: string;
  availableThemes: ThemeOption[];
  onThemeChange: (theme: string) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  availableThemes,
  onThemeChange,
}) => (
  <FieldContainer>
    <Typography variant="body2" color="text.secondary">
      Theme
    </Typography>
    <FormControl size="small" fullWidth>
      <InputLabel id="theme-select-label">Select Theme</InputLabel>
      <Select
        labelId="theme-select-label"
        value={currentTheme}
        onChange={e => onThemeChange(e.target.value as string)}
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
);
