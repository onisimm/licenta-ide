import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { ModalState } from './types';

interface InputModalProps {
  modalState: ModalState;
  onConfirm: () => void;
  onCancel: () => void;
  onValueChange: (value: string) => void;
}

export const InputModal: React.FC<InputModalProps> = ({
  modalState,
  onConfirm,
  onCancel,
  onValueChange,
}) => (
  <Dialog open={modalState.isOpen} onClose={onCancel} maxWidth="sm" fullWidth>
    <DialogTitle>
      {modalState.type === 'file' ? 'Create New File' : 'Create New Folder'}
    </DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        label={modalState.type === 'file' ? 'File name' : 'Folder name'}
        fullWidth
        variant="outlined"
        value={modalState.value}
        onChange={e => onValueChange(e.target.value)}
        onKeyPress={e => {
          if (e.key === 'Enter') {
            onConfirm();
          }
        }}
        onKeyDown={e => {
          if (e.key === 'Escape') {
            onCancel();
          }
        }}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel}>Cancel</Button>
      <Button
        onClick={onConfirm}
        variant="contained"
        disabled={!modalState.value.trim()}>
        Create
      </Button>
    </DialogActions>
  </Dialog>
);
