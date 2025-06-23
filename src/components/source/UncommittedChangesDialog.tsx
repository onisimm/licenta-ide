import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Alert,
  CircularProgress,
  Box,
} from '@mui/material';
import {
  Save as StashIcon,
  DeleteForever as DiscardIcon,
  Cancel as CancelIcon,
  Check as CheckIcon,
} from '@mui/icons-material';

interface UncommittedChangesDialogProps {
  open: boolean;
  targetBranch: string;
  onClose: () => void;
  onStashAndSwitch: (stashMessage?: string) => Promise<void>;
  onForceSwitch: () => Promise<void>;
}

export const UncommittedChangesDialog: React.FC<
  UncommittedChangesDialogProps
> = ({ open, targetBranch, onClose, onStashAndSwitch, onForceSwitch }) => {
  const [selectedOption, setSelectedOption] = useState<
    'stash' | 'force' | null
  >(null);
  const [stashMessage, setStashMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleClose = () => {
    setSelectedOption(null);
    setStashMessage('');
    setError('');
    setIsLoading(false);
    onClose();
  };

  const handleConfirm = async () => {
    if (!selectedOption) return;

    setIsLoading(true);
    setError('');

    try {
      if (selectedOption === 'stash') {
        await onStashAndSwitch(stashMessage.trim() || undefined);
      } else if (selectedOption === 'force') {
        await onForceSwitch();
      }
      handleClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const options = [
    {
      id: 'stash' as const,
      title: 'Stash Changes',
      description: 'Save changes temporarily and switch branch',
      icon: <StashIcon />,
      color: 'primary' as const,
      recommended: true,
    },
    {
      id: 'force' as const,
      title: 'Discard Changes',
      description: 'Permanently discard all changes and switch branch',
      icon: <DiscardIcon />,
      color: 'error' as const,
      recommended: false,
    },
  ];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6">Uncommitted Changes</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Alert severity="warning" sx={{ mb: 3 }}>
          You have uncommitted changes that prevent switching to{' '}
          <strong>{targetBranch}</strong>. Choose how to handle them:
        </Alert>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <List>
          {options.map(option => (
            <ListItem key={option.id} disablePadding>
              <ListItemButton
                selected={selectedOption === option.id}
                onClick={() => setSelectedOption(option.id)}
                sx={{
                  border: 1,
                  borderColor:
                    selectedOption === option.id
                      ? `${option.color}.main`
                      : 'divider',
                  borderRadius: 1,
                  mb: 1,
                  '&:hover': {
                    borderColor: `${option.color}.main`,
                  },
                }}>
                <ListItemIcon sx={{ color: `${option.color}.main` }}>
                  {option.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2">
                        {option.title}
                      </Typography>
                      {option.recommended && (
                        <Typography
                          variant="caption"
                          sx={{
                            bgcolor: 'success.main',
                            color: 'success.contrastText',
                            px: 1,
                            py: 0.25,
                            borderRadius: 1,
                            fontSize: '0.7rem',
                          }}>
                          RECOMMENDED
                        </Typography>
                      )}
                    </Box>
                  }
                  secondary={option.description}
                />
                {selectedOption === option.id && (
                  <CheckIcon color={option.color} sx={{ ml: 1 }} />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {selectedOption === 'stash' && (
          <TextField
            fullWidth
            label="Stash Message (Optional)"
            placeholder="Work in progress on feature"
            value={stashMessage}
            onChange={e => setStashMessage(e.target.value)}
            sx={{ mt: 2 }}
            helperText="A descriptive message for your stashed changes"
          />
        )}

        {selectedOption === 'force' && (
          <Alert severity="error" sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Warning: This action cannot be undone!
            </Typography>
            <Typography variant="body2">
              All uncommitted changes will be permanently lost. Make sure you
              don't need these changes before proceeding.
            </Typography>
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={!selectedOption || isLoading}
          color={selectedOption === 'force' ? 'error' : 'primary'}
          startIcon={isLoading ? <CircularProgress size={16} /> : undefined}>
          {isLoading
            ? 'Processing...'
            : selectedOption === 'stash'
            ? 'Stash & Switch'
            : selectedOption === 'force'
            ? 'Discard & Switch'
            : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
