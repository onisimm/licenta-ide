import { Box, CircularProgress, Typography, Paper } from '@mui/material';
import { SmartToy, Person } from '@mui/icons-material';
import { MessageListProps } from './types';
import { MessageBubble } from './MessageBubble';
import { EmptyState } from './EmptyState';

export const MessageList = ({
  messages,
  isLoading,
  messagesEndRef,
}: MessageListProps) => {
  return (
    <Box
      sx={{
        flex: 1,
        padding: 1,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}>
      {messages.length === 0 ? (
        <EmptyState
          title="Welcome to AI Chat!"
          description="Ask questions about your code, get help with documentation, or discuss your project."
          icon={<SmartToy sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />}
        />
      ) : (
        messages.map(message => (
          <MessageBubble key={message.id} message={message} />
        ))
      )}

      {isLoading && (
        <Paper
          elevation={1}
          sx={{
            padding: theme => theme.spacing(1, 1.5),
            maxWidth: '85%',
            alignSelf: 'flex-start',
            backgroundColor: 'background.paper',
            color: 'text.primary',
            marginRight: 'auto',
            position: 'relative',
          }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              marginBottom: 0.5,
              fontSize: '12px',
              opacity: 0.8,
            }}>
            <SmartToy sx={{ fontSize: 16 }} />
            <Typography variant="caption">AI</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={16} />
            <Typography variant="body2" color="text.secondary">
              Thinking...
            </Typography>
          </Box>
        </Paper>
      )}

      <div ref={messagesEndRef} />
    </Box>
  );
};
