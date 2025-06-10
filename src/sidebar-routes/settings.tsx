import { memo, useState, useCallback } from 'react';
import {
  Box,
  styled,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useAppTitle } from '../shared/hooks';
import { useThemeToggle } from '../theme/themeProvider';

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

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  justifyContent: 'flex-end',
}));

export const SettingsSection = memo(() => {
  const { title, updateTitle } = useAppTitle();
  const { toggleTheme, isDarkMode } = useThemeToggle();
  const [tempTitle, setTempTitle] = useState(title);

  const handleTitleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTempTitle(event.target.value);
    },
    [],
  );

  const handleThemeChange = useCallback(
    (event: any) => {
      const selectedTheme = event.target.value;
      const shouldBeDark = selectedTheme === 'dark';

      // Only toggle if the selection is different from current state
      if (shouldBeDark !== isDarkMode) {
        toggleTheme();
      }
    },
    [isDarkMode, toggleTheme],
  );

  const handleSave = useCallback(() => {
    updateTitle(tempTitle);
  }, [tempTitle, updateTitle]);

  const handleReset = useCallback(() => {
    setTempTitle(title);
  }, [title]);

  const handleResetToDefault = useCallback(() => {
    const defaultTitle = 'SEditor';
    setTempTitle(defaultTitle);
    updateTitle(defaultTitle);
  }, [updateTitle]);

  const hasChanges = tempTitle !== title;

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
              value={isDarkMode ? 'dark' : 'light'}
              onChange={handleThemeChange}
              label="Select Theme">
              <MenuItem value="light">Light</MenuItem>
              <MenuItem value="dark">Dark</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="caption" color="text.secondary">
            Choose between light and dark appearance
          </Typography>
        </FieldContainer>
      </SettingsPanel>

      <SettingsPanel elevation={1}>
        <SectionTitle>Application</SectionTitle>
        <FieldContainer>
          <Typography variant="body2" color="text.secondary">
            Application Title
          </Typography>
          <TextField
            size="small"
            value={tempTitle}
            onChange={handleTitleChange}
            placeholder="Enter application title"
            fullWidth
            variant="outlined"
            helperText="This title will appear in the header bar"
          />
          <ButtonContainer>
            <Button
              size="small"
              variant="outlined"
              onClick={handleResetToDefault}
              color="secondary">
              Reset to Default
            </Button>
            {hasChanges && (
              <>
                <Button size="small" variant="outlined" onClick={handleReset}>
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleSave}
                  color="primary">
                  Save
                </Button>
              </>
            )}
          </ButtonContainer>
        </FieldContainer>
      </SettingsPanel>

      <SettingsPanel elevation={1}>
        <SectionTitle>About</SectionTitle>
        <Typography variant="body2" color="text.secondary">
          Current Title: <strong>{title}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Current Theme: <strong>{isDarkMode ? 'Dark' : 'Light'}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This editor allows you to customize the application appearance and
          other settings.
        </Typography>
      </SettingsPanel>
    </SettingsContainer>
  );
});

export default SettingsSection;
