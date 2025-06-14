import React from 'react';
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Button,
} from '@mui/material';
import { FieldContainer } from './styles';

interface ZoomOption {
  value: number;
  label: string;
}

interface ZoomSelectorProps {
  zoom: number;
  zoomOptions: ZoomOption[];
  onZoomChange: (zoom: number) => void;
  onResetZoom: () => void;
}

export const ZoomSelector: React.FC<ZoomSelectorProps> = ({
  zoom,
  zoomOptions,
  onZoomChange,
  onResetZoom,
}) => (
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
          onZoomChange(parseFloat(event.target.value as string))
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
        onClick={onResetZoom}
        color="secondary">
        Reset to 100%
      </Button>
    </Box>
  </FieldContainer>
);
