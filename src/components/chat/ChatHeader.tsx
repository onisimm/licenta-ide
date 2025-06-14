import { Box, Typography, Button, IconButton, Tooltip } from '@mui/material';
import { Settings, Refresh, ExpandMore } from '@mui/icons-material';
import { ChatHeaderProps } from './types';

export const ChatHeader = ({
  providerDisplayName,
  currentModel,
  onModelClick,
  onResetChat,
  onGoToProfile,
  getCurrentModelName,
}: ChatHeaderProps) => {
  return (
    <Box
      sx={{
        padding: theme => theme.spacing(1, 2),
        borderBottom: theme => `1px solid ${theme.palette.divider}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'background.paper',
      }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ fontSize: '16px' }}>
          Ask AI
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Using {providerDisplayName}
          </Typography>
          <Tooltip title="Select Model">
            <Button
              size="small"
              endIcon={<ExpandMore />}
              onClick={onModelClick}
              sx={{
                minWidth: 'auto',
                p: 0.5,
                color: 'text.secondary',
                '&:hover': { color: 'text.primary' },
              }}>
              {getCurrentModelName()}
            </Button>
          </Tooltip>
        </Box>
      </Box>
      <Box>
        <IconButton
          size="small"
          onClick={onResetChat}
          title="Reset Chat"
          sx={{ mr: 1, color: 'text.secondary' }}>
          <Refresh />
        </IconButton>
        <IconButton
          size="small"
          onClick={onGoToProfile}
          title="Settings"
          sx={{ color: 'text.secondary' }}>
          <Settings />
        </IconButton>
      </Box>
    </Box>
  );
};
