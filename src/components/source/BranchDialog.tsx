import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  TextField,
  Typography,
  Box,
  Chip,
  Alert,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from '@mui/material';
import {
  Check as CheckIcon,
  CloudDownload as RemoteIcon,
} from '@mui/icons-material';
import { GitBranch, BranchDialogState } from './types';

interface BranchDialogProps {
  dialogState: BranchDialogState;
  onClose: () => void;
  onSwitchBranch: (branchName: string) => Promise<void>;
  onCreateBranch: (branchName: string, switchToBranch: boolean) => Promise<any>;
  onDeleteBranch: (branchName: string, force: boolean) => Promise<void>;
}

export const BranchDialog: React.FC<BranchDialogProps> = ({
  dialogState,
  onClose,
  onSwitchBranch,
  onCreateBranch,
  onDeleteBranch,
}) => {
  const [newBranchName, setNewBranchName] = useState('');
  const [switchToBranch, setSwitchToBranch] = useState(true);
  const [forceDelete, setForceDelete] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (dialogState.open) {
      setNewBranchName('');
      setSwitchToBranch(true);
      setForceDelete(false);
      setSelectedBranch('');
      setError('');
      setIsLoading(false);
    }
  }, [dialogState.open, dialogState.type]);

  const handleClose = () => {
    setError('');
    onClose();
  };

  const getDialogTitle = () => {
    switch (dialogState.type) {
      case 'switch':
        return 'Switch Branch';
      case 'create':
        return 'Create New Branch';
      case 'delete':
        return 'Delete Branch';
      default:
        return 'Branch Operations';
    }
  };

  const handleSwitchBranch = async () => {
    if (!selectedBranch) return;

    setIsLoading(true);
    setError('');

    try {
      await onSwitchBranch(selectedBranch);
      handleClose();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to switch branch',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBranch = async () => {
    if (!newBranchName.trim()) {
      setError('Branch name cannot be empty');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await onCreateBranch(newBranchName.trim(), switchToBranch);

      // Check if the operation failed with a structured error
      if (result && !result.success && result.error) {
        if (result.error.type === 'branch_already_exists') {
          setError(`${result.error.message}. ${result.error.suggestion}`);
        } else {
          setError(result.error.message || 'Failed to create branch');
        }
        return;
      }

      handleClose();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to create branch',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBranch = async () => {
    if (!selectedBranch) return;

    setIsLoading(true);
    setError('');

    try {
      await onDeleteBranch(selectedBranch, forceDelete);
      handleClose();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to delete branch',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getActionButtons = () => {
    const commonProps = {
      disabled: isLoading,
    };

    switch (dialogState.type) {
      case 'switch':
        return (
          <>
            <Button onClick={handleClose} {...commonProps}>
              Cancel
            </Button>
            <Button
              onClick={handleSwitchBranch}
              variant="contained"
              disabled={!selectedBranch || isLoading}
              startIcon={
                isLoading ? <CircularProgress size={16} /> : undefined
              }>
              Switch
            </Button>
          </>
        );
      case 'create':
        return (
          <>
            <Button onClick={handleClose} {...commonProps}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateBranch}
              variant="contained"
              disabled={!newBranchName.trim() || isLoading}
              startIcon={
                isLoading ? <CircularProgress size={16} /> : undefined
              }>
              Create
            </Button>
          </>
        );
      case 'delete':
        return (
          <>
            <Button onClick={handleClose} {...commonProps}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteBranch}
              variant="contained"
              color="error"
              disabled={!selectedBranch || isLoading}
              startIcon={
                isLoading ? <CircularProgress size={16} /> : undefined
              }>
              Delete
            </Button>
          </>
        );
      default:
        return (
          <Button onClick={handleClose} {...commonProps}>
            Close
          </Button>
        );
    }
  };

  const renderSwitchContent = () => (
    <>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Select a branch to switch to:
      </Typography>
      <List sx={{ maxHeight: 300, overflow: 'auto' }}>
        {dialogState.branches
          ?.filter(branch => branch.canCheckout)
          .map(branch => (
            <ListItem key={branch.name} disablePadding>
              <ListItemButton
                selected={selectedBranch === branch.name}
                onClick={() => setSelectedBranch(branch.name)}>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">{branch.name}</Typography>
                      {branch.isRemote && (
                        <Chip
                          icon={<RemoteIcon />}
                          label="Remote"
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  }
                />
                {selectedBranch === branch.name && (
                  <CheckIcon color="primary" />
                )}
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </>
  );

  const renderCreateContent = () => (
    <>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Create a new branch from the current branch:
      </Typography>
      <TextField
        fullWidth
        label="Branch Name"
        value={newBranchName}
        onChange={e => setNewBranchName(e.target.value)}
        placeholder="feature/new-feature"
        sx={{ mb: 2 }}
        autoFocus
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={switchToBranch}
            onChange={e => setSwitchToBranch(e.target.checked)}
          />
        }
        label="Switch to new branch after creating"
      />
    </>
  );

  const renderDeleteContent = () => (
    <>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Select a branch to delete:
      </Typography>
      <List sx={{ maxHeight: 300, overflow: 'auto', mb: 2 }}>
        {dialogState.branches
          ?.filter(branch => !branch.isCurrent && !branch.isRemote)
          .map(branch => (
            <ListItem key={branch.name} disablePadding>
              <ListItemButton
                selected={selectedBranch === branch.name}
                onClick={() => setSelectedBranch(branch.name)}>
                <ListItemText primary={branch.name} />
                {selectedBranch === branch.name && (
                  <CheckIcon color="primary" />
                )}
              </ListItemButton>
            </ListItem>
          ))}
      </List>
      {selectedBranch && (
        <>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This will permanently delete the branch "{selectedBranch}". This
            action cannot be undone.
          </Alert>
          <FormControlLabel
            control={
              <Checkbox
                checked={forceDelete}
                onChange={e => setForceDelete(e.target.checked)}
              />
            }
            label="Force delete (ignore unmerged changes)"
          />
        </>
      )}
    </>
  );

  const renderContent = () => {
    switch (dialogState.type) {
      case 'switch':
        return renderSwitchContent();
      case 'create':
        return renderCreateContent();
      case 'delete':
        return renderDeleteContent();
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={dialogState.open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth>
      <DialogTitle>{getDialogTitle()}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {renderContent()}
      </DialogContent>
      <DialogActions>{getActionButtons()}</DialogActions>
    </Dialog>
  );
};
