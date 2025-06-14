import { Box, TextField, Button } from '@mui/material';
import { Send } from '@mui/icons-material';
import { ChatInputProps } from './types';

export const ChatInput = ({
  input,
  isLoading,
  onInputChange,
  onKeyPress,
  onSendMessage,
}: ChatInputProps) => {
  return (
    <Box
      sx={{
        padding: theme => theme.spacing(1, 2),
        borderTop: theme => `1px solid ${theme.palette.divider}`,
        display: 'flex',
        gap: 1,
        alignItems: 'flex-end',
        backgroundColor: 'background.paper',
      }}>
      <TextField
        multiline
        maxRows={4}
        value={input}
        onChange={onInputChange}
        onKeyPress={onKeyPress}
        placeholder="Ask about your code, documentation, or project..."
        variant="outlined"
        size="small"
        fullWidth
        disabled={isLoading}
      />
      <Button
        variant="contained"
        onClick={onSendMessage}
        disabled={!input.trim() || isLoading}
        sx={{ minWidth: 'auto', px: 2 }}>
        <Send sx={{ fontSize: 18 }} />
      </Button>
    </Box>
  );
};
