import { Box, Typography, Button } from '@mui/material';
import { EmptyStateProps } from './types';

export const EmptyState = ({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) => {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
        textAlign: 'center',
        color: 'text.secondary',
      }}>
      {icon}
      <Typography variant="h6" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, maxWidth: 300 }}>
        {description}
      </Typography>
      {action && (
        <Button
          variant="contained"
          startIcon={action.icon}
          onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </Box>
  );
};
