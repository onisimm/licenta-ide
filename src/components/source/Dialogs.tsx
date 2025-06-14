import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { Undo as UndoIcon } from '@mui/icons-material';
import { DialogState } from './types';

interface DialogsProps {
  restoreDialog: DialogState;
  deleteDialog: DialogState;
  pullDialog: DialogState;
  onRestoreDialogClose: () => void;
  onRestoreFileConfirm: () => void;
  onDeleteDialogClose: () => void;
  onDeleteFileConfirm: () => void;
  onPullDialogClose: () => void;
  onPullStrategy: (strategy: string) => void;
}

export const Dialogs: React.FC<DialogsProps> = ({
  restoreDialog,
  deleteDialog,
  pullDialog,
  onRestoreDialogClose,
  onRestoreFileConfirm,
  onDeleteDialogClose,
  onDeleteFileConfirm,
  onPullDialogClose,
  onPullStrategy,
}) => {
  return (
    <>
      {/* Restore Confirmation Dialog */}
      <Dialog
        open={restoreDialog.open}
        onClose={onRestoreDialogClose}
        aria-labelledby="restore-dialog-title"
        aria-describedby="restore-dialog-description">
        <DialogTitle id="restore-dialog-title">Discard Changes?</DialogTitle>
        <DialogContent>
          <DialogContentText id="restore-dialog-description">
            Are you sure you want to discard all changes to{' '}
            <strong>{restoreDialog.filePath}</strong>?
            <br />
            <br />
            This will permanently delete your changes and restore the file to
            its last committed state. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onRestoreDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={onRestoreFileConfirm}
            color="warning"
            variant="contained"
            startIcon={<UndoIcon />}>
            Discard Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete File Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={onDeleteDialogClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description">
        <DialogTitle id="delete-dialog-title">Delete File?</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete{' '}
            <strong>{deleteDialog.filePath}</strong>?
            <br />
            <br />
            This will permanently delete the file from your file system. This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onDeleteDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={onDeleteFileConfirm}
            color="error"
            variant="contained"
            startIcon={<UndoIcon />}>
            Delete File
          </Button>
        </DialogActions>
      </Dialog>

      {/* Pull Strategy Dialog */}
      <Dialog
        open={pullDialog.open}
        onClose={onPullDialogClose}
        aria-labelledby="pull-dialog-title"
        maxWidth="md"
        fullWidth>
        <DialogTitle id="pull-dialog-title">
          Resolve Divergent Branches
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{pullDialog.errorInfo?.message}</DialogContentText>
          <DialogContentText sx={{ mt: 1, mb: 2 }}>
            {pullDialog.errorInfo?.details}
          </DialogContentText>

          {pullDialog.errorInfo?.options?.map((option: any) => (
            <Box
              key={option.id}
              sx={{
                mb: 2,
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
              onClick={() => onPullStrategy(option.id)}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                {option.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {option.description}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                fontFamily="monospace">
                {option.command}
              </Typography>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={onPullDialogClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
