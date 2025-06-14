import { Menu, MenuItem, Box, Typography } from '@mui/material';
import { ModelMenuProps } from './types';

export const ModelMenu = ({
  anchorEl,
  onClose,
  onModelSelect,
  currentModel,
  models,
}: ModelMenuProps) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      PaperProps={{
        sx: { maxHeight: 300, width: 250 },
      }}>
      {Object.values(models).map(model => (
        <MenuItem
          key={model.id}
          onClick={() => onModelSelect(model.id)}
          selected={model.id === currentModel}
          sx={{ whiteSpace: 'normal', py: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
              {model.name}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ wordBreak: 'break-word' }}>
              {model.description}
            </Typography>
          </Box>
        </MenuItem>
      ))}
    </Menu>
  );
};
