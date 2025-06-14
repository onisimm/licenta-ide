import { Paper, Box, Typography } from '@mui/material';
import { Person, SmartToy } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { MessageBubbleProps, CodeProps } from './types';

const MessageHeader = ({
  message,
}: {
  message: MessageBubbleProps['message'];
}) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 0.5,
      marginBottom: 0.5,
      fontSize: '12px',
      opacity: 0.8,
    }}>
    {message.isUser ? (
      <Person sx={{ fontSize: 16 }} />
    ) : (
      <SmartToy sx={{ fontSize: 16 }} />
    )}
    <Typography variant="caption">
      {message.isUser ? 'You' : message.modelName || 'AI'}
    </Typography>
    <Typography variant="caption" sx={{ ml: 'auto', opacity: 0.6 }}>
      {message.timestamp.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}
    </Typography>
  </Box>
);

const MessageContent = ({
  message,
}: {
  message: MessageBubbleProps['message'];
}) => (
  <Box
    sx={{
      fontSize: '14px',
      lineHeight: 1.4,
      width: '100%',
      overflow: 'hidden',
      '& p': {
        margin: '0.5em 0',
        wordBreak: 'break-word',
      },
      '& pre': {
        margin: '0.5em 0',
        maxWidth: '100%',
        '& > div': {
          margin: 0,
          borderRadius: 0.5,
        },
      },
      '& code': {
        backgroundColor: 'background.default',
        padding: '0.2em 0.4em',
        borderRadius: 0.5,
        fontSize: '0.9em',
        wordBreak: 'break-word',
      },
      '& pre code': {
        backgroundColor: 'transparent',
        padding: 0,
      },
      '& ul, & ol': {
        margin: '0.5em 0',
        paddingLeft: 2,
        wordBreak: 'break-word',
      },
      '& li': {
        margin: '0.25em 0',
      },
      '& blockquote': {
        borderLeft: '4px solid',
        borderColor: 'divider',
        margin: '0.5em 0',
        padding: '0.5em 0 0.5em 1em',
        color: 'text.secondary',
        wordBreak: 'break-word',
      },
      '& table': {
        borderCollapse: 'collapse',
        width: '100%',
        margin: '0.5em 0',
        tableLayout: 'fixed',
      },
      '& th, & td': {
        border: '1px solid',
        borderColor: 'divider',
        padding: 0.5,
        wordBreak: 'break-word',
      },
      '& th': {
        backgroundColor: 'background.default',
      },
      '& img': {
        maxWidth: '100%',
        height: 'auto',
      },
      '& a': {
        wordBreak: 'break-all',
      },
    }}>
    {message.isUser ? (
      <Typography>{message.content}</Typography>
    ) : (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }: CodeProps) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const code = String(children).replace(/\n$/, '');

            return match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={language}
                PreTag="div">
                {code}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}>
        {message.content}
      </ReactMarkdown>
    )}
  </Box>
);

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  return (
    <Paper
      elevation={1}
      sx={{
        padding: theme => theme.spacing(1, 1.5),
        maxWidth: '85%',
        alignSelf: message.isUser ? 'flex-end' : 'flex-start',
        backgroundColor: message.isUser ? 'primary.main' : 'background.paper',
        color: message.isUser ? 'primary.contrastText' : 'text.primary',
        marginLeft: message.isUser ? 'auto' : 0,
        marginRight: message.isUser ? 0 : 'auto',
        position: 'relative',
      }}>
      <MessageHeader message={message} />
      <MessageContent message={message} />
    </Paper>
  );
};
