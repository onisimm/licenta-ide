import React from 'react';
import { Typography } from '@mui/material';
import { SettingsPanel, SectionTitle } from './styles';
import { ThemeOption } from './types';

interface AboutPanelProps {
  availableThemes: ThemeOption[];
  currentTheme: string;
  zoom: number;
}

export const AboutPanel: React.FC<AboutPanelProps> = ({
  availableThemes,
  currentTheme,
  zoom,
}) => (
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
);
