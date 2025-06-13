import { memo, useState, useCallback, useEffect, useRef } from 'react';
import {
  Box,
  styled,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Tooltip,
  Popper,
  Grow,
  ClickAwayListener,
  InputAdornment,
} from '@mui/material';
import {
  Send,
  Person,
  SmartToy,
  Settings,
  AttachFile,
  Refresh,
  ExpandMore,
  Add,
  Search,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  createAIService,
  BaseAIService,
  AIProvider,
  OPENAI_MODELS,
  ChatMessage,
} from '../services/ai-api-service';
import { addChatMessage, clearChatMessages } from '../shared/rdx-slice';
import { RootState } from '../shared/store';
import { QuickFileOpener } from '../components/quick-file-opener';
import { getFileIcon } from '../icons/file-types';
import { useProjectOperations } from '../shared/hooks';

const ChatContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.paper,
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(1),
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const MessageBubble = styled(Paper)<{ isUser?: boolean }>(
  ({ theme, isUser }) => ({
    padding: theme.spacing(1, 1.5),
    maxWidth: '85%',
    alignSelf: isUser ? 'flex-end' : 'flex-start',
    backgroundColor: isUser
      ? theme.palette.primary.main
      : theme.palette.background.paper,
    color: isUser
      ? theme.palette.primary.contrastText
      : theme.palette.text.primary,
    marginLeft: isUser ? 'auto' : 0,
    marginRight: isUser ? 0 : 'auto',
    position: 'relative',
  }),
);

const MessageHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  marginBottom: theme.spacing(0.5),
  fontSize: '12px',
  opacity: 0.8,
}));

const MessageContent = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  lineHeight: 1.4,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
}));

const InputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'flex-end',
  backgroundColor: theme.palette.background.paper,
}));

const ContextChips = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.5),
  flexWrap: 'wrap',
  marginBottom: theme.spacing(1),
}));

const EmptyState = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const FileSelectionContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const SelectedFilesContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(0.5),
  marginBottom: theme.spacing(1),
}));

const FileSearchContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
}));

const FileSearchDropdown = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  bottom: '100%',
  left: 0,
  right: 0,
  marginBottom: theme.spacing(1),
  maxHeight: '250px',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: theme.shadows[4],
  width: '300px',
}));

const FileSearchResults = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(0.5),
}));

const FileSearchItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1),
  cursor: 'pointer',
  borderRadius: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const FileIcon = styled(Box)(({ theme }) => ({
  width: 16,
  height: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(0.5),
  flexShrink: 0,
  color: theme.palette.fileTree.fileIcon,
}));

const FileInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  overflow: 'hidden',
}));

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  role: 'user' | 'assistant' | 'system';
}

interface DocumentContext {
  name: string;
  content: string;
  path: string;
}

export const AiChatSection = memo(() => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const messages = useSelector(
    (state: RootState) => state.main.chatState.messages,
  );
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiService, setAiService] = useState<any>(null);
  const [currentProvider, setCurrentProvider] = useState<AIProvider>('openai');
  const [documentContext, setDocumentContext] = useState<DocumentContext[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [modelMenuAnchor, setModelMenuAnchor] = useState<null | HTMLElement>(
    null,
  );
  const [currentModel, setCurrentModel] = useState(() => {
    const savedModel = BaseAIService.getModel(currentProvider);
    return OPENAI_MODELS[savedModel] ? savedModel : 'gpt-3.5-turbo';
  });
  const [showQuickFileOpener, setShowQuickFileOpener] = useState(false);
  const [showFileSearch, setShowFileSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<
    Array<{ name: string; path: string; relativePath: string }>
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchAnchorRef = useRef<HTMLDivElement>(null);
  const { folderPath } = useProjectOperations();

  // Check for AI service availability on mount
  useEffect(() => {
    const checkAIService = () => {
      const service = createAIService();
      const provider = BaseAIService.getProvider();
      setAiService(service);
      setCurrentProvider(provider);
    };

    checkAIService();

    // Check periodically in case user configures it in profile
    const interval = setInterval(checkAIService, 2000);
    return () => clearInterval(interval);
  }, []);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleGoToProfile = useCallback(() => {
    navigate('/main_window/profile');
  }, [navigate]);

  const addMessage = useCallback(
    (content: string, isUser: boolean) => {
      const newMessage = {
        id: Date.now().toString(),
        content,
        isUser,
        timestamp: new Date(),
        role: isUser ? 'user' : 'assistant',
      };
      dispatch(addChatMessage(newMessage));
    },
    [dispatch],
  );

  const handleResetChat = useCallback(() => {
    dispatch(clearChatMessages());
  }, [dispatch]);

  const callAIAPI = useCallback(
    async (prompt: string, context?: string) => {
      const service = createAIService();
      if (!service) {
        throw new Error(
          'No AI service available. Please configure an API key in the profile section.',
        );
      }

      // Prepare conversation history
      const conversationHistory: ChatMessage[] = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content,
      }));

      return await service.generateContent(
        prompt,
        context,
        conversationHistory,
      );
    },
    [messages],
  );

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    addMessage(userMessage, true);
    setIsLoading(true);

    try {
      // Prepare context from documents
      const context =
        documentContext.length > 0
          ? documentContext
              .map(
                doc =>
                  `File: ${doc.name}\nPath: ${
                    doc.path
                  }\nContent:\n${doc.content.slice(0, 2000)}${
                    doc.content.length > 2000 ? '...' : ''
                  }`,
              )
              .join('\n\n---\n\n')
          : undefined;

      const response = await callAIAPI(userMessage, context);
      addMessage(response, false);
    } catch (error) {
      console.error('Chat error:', error);
      addMessage(
        `Error: ${
          error instanceof Error
            ? error.message
            : 'Failed to get response from AI'
        }`,
        false,
      );
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, addMessage, callAIAPI, documentContext]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage],
  );

  const handleRemoveContext = useCallback((path: string) => {
    setDocumentContext(prev => prev.filter(doc => doc.path !== path));
  }, []);

  const handleAddCurrentFile = useCallback(async () => {
    // This would integrate with your existing file system
    // For now, just show how it would work
    console.log(
      'Add current file to context - would need integration with file system',
    );
  }, []);

  const providerDisplayName = 'OpenAI';

  const handleModelClick = (event: React.MouseEvent<HTMLElement>) => {
    setModelMenuAnchor(event.currentTarget);
  };

  const handleModelClose = () => {
    setModelMenuAnchor(null);
  };

  const handleModelSelect = (modelId: string) => {
    BaseAIService.setModel(currentProvider, modelId);
    setCurrentModel(modelId);
    handleModelClose();
  };

  const getCurrentModelName = () => {
    const model = OPENAI_MODELS[currentModel];
    return model ? model.name : 'GPT-3.5 Turbo';
  };

  const handleAddFile = useCallback(() => {
    setShowQuickFileOpener(true);
  }, []);

  const handleFileSelected = useCallback(
    async (file: { path: string; name: string; relativePath: string }) => {
      try {
        const fileData = await window.electron.readFile(file.path);
        if (fileData) {
          setDocumentContext(prev => [
            ...prev,
            {
              name: file.name,
              path: file.path,
              content: fileData.content,
            },
          ]);
        }
      } catch (error) {
        console.error('Error reading selected file:', error);
      }
      setShowQuickFileOpener(false);
    },
    [],
  );

  // Load and filter files
  const loadAndFilterFiles = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const result = await window.electron.getAllFilesForQuickOpen();
      if (result.files) {
        const filtered = result.files
          .filter(
            (file: { name: string; path: string; relativePath: string }) =>
              file.name.toLowerCase().includes(query.toLowerCase()) ||
              file.relativePath.toLowerCase().includes(query.toLowerCase()),
          )
          .slice(0, 10); // Show top 10 matches
        setSearchResults(filtered);
      }
    } catch (error) {
      console.error('Error searching files:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Handle search input changes
  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const query = event.target.value;
      setSearchQuery(query);
      loadAndFilterFiles(query);
    },
    [loadAndFilterFiles],
  );

  // Handle file selection
  const handleFileSelect = useCallback(
    async (file: { path: string; name: string }) => {
      try {
        const fileData = await window.electron.readFile(file.path);
        if (fileData) {
          setDocumentContext(prev => [
            ...prev,
            {
              name: file.name,
              path: file.path,
              content: fileData.content,
            },
          ]);
        }
      } catch (error) {
        console.error('Error reading selected file:', error);
      }
      setShowFileSearch(false);
      setSearchQuery('');
    },
    [],
  );

  // Handle click away
  const handleClickAway = useCallback(() => {
    setShowFileSearch(false);
    setSearchQuery('');
  }, []);

  // If no AI service, show setup message
  if (!aiService) {
    return (
      <ChatContainer>
        <ChatHeader>
          <Typography variant="h6" sx={{ fontSize: '16px' }}>
            Ask AI
          </Typography>
        </ChatHeader>
        <EmptyState>
          <SmartToy sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            AI Chat Setup Required
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, maxWidth: 300 }}>
            To use AI chat, you need to configure an API key for OpenAI in the
            profile section.
          </Typography>
          <Button
            variant="contained"
            startIcon={<Settings />}
            onClick={handleGoToProfile}>
            Go to Profile
          </Button>
        </EmptyState>
      </ChatContainer>
    );
  }

  return (
    <ChatContainer>
      <ChatHeader>
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
                onClick={handleModelClick}
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
            onClick={handleResetChat}
            title="Reset Chat"
            sx={{ mr: 1, color: 'text.secondary' }}>
            <Refresh />
          </IconButton>
          <IconButton
            size="small"
            onClick={handleGoToProfile}
            title="Settings"
            sx={{ color: 'text.secondary' }}>
            <Settings />
          </IconButton>
        </Box>
      </ChatHeader>

      <Menu
        anchorEl={modelMenuAnchor}
        open={Boolean(modelMenuAnchor)}
        onClose={handleModelClose}
        PaperProps={{
          sx: { maxHeight: 300, width: 250 },
        }}>
        {Object.values(OPENAI_MODELS).map(model => (
          <MenuItem
            key={model.id}
            onClick={() => handleModelSelect(model.id)}
            selected={model.id === currentModel}
            sx={{ whiteSpace: 'normal', py: 1 }}>
            <Box
              sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
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

      {documentContext.length > 0 && (
        <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mb: 0.5, display: 'block' }}>
            Document Context:
          </Typography>
          <ContextChips>
            {documentContext.map(doc => (
              <Chip
                key={doc.path}
                label={doc.name}
                size="small"
                onDelete={() => handleRemoveContext(doc.path)}
                variant="outlined"
              />
            ))}
          </ContextChips>
        </Box>
      )}

      <MessagesContainer>
        {messages.length === 0 ? (
          <EmptyState>
            <SmartToy sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
            <Typography variant="body1" sx={{ mb: 1 }}>
              Welcome to AI Chat!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ask questions about your code, get help with documentation, or
              discuss your project.
            </Typography>
          </EmptyState>
        ) : (
          messages.map(message => (
            <MessageBubble
              key={message.id}
              isUser={message.isUser}
              elevation={1}>
              <MessageHeader>
                {message.isUser ? (
                  <Person sx={{ fontSize: 16 }} />
                ) : (
                  <SmartToy sx={{ fontSize: 16 }} />
                )}
                <Typography variant="caption">
                  {message.isUser ? 'You' : 'AI'}
                </Typography>
                <Typography variant="caption" sx={{ ml: 'auto', opacity: 0.6 }}>
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </MessageHeader>
              <MessageContent>{message.content}</MessageContent>
            </MessageBubble>
          ))
        )}

        {isLoading && (
          <MessageBubble elevation={1}>
            <MessageHeader>
              <SmartToy sx={{ fontSize: 16 }} />
              <Typography variant="caption">AI</Typography>
            </MessageHeader>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={16} />
              <Typography variant="body2" color="text.secondary">
                Thinking...
              </Typography>
            </Box>
          </MessageBubble>
        )}

        <div ref={messagesEndRef} />
      </MessagesContainer>

      <FileSelectionContainer>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Selected Files:
          </Typography>
          {folderPath ? (
            <FileSearchContainer ref={searchAnchorRef}>
              <Button
                size="small"
                startIcon={<Add sx={{ fontSize: 16 }} />}
                onClick={() => setShowFileSearch(!showFileSearch)}
                variant="text"
                sx={{
                  ml: 'auto',
                  color: 'text.secondary',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    color: 'text.primary',
                  },
                  px: 1,
                  py: 0.5,
                  minWidth: 'auto',
                  borderRadius: 1,
                }}>
                Add File
              </Button>
              <Popper
                open={showFileSearch}
                anchorEl={searchAnchorRef.current}
                placement="top"
                transition
                style={{ width: searchAnchorRef.current?.offsetWidth }}>
                {({ TransitionProps }) => (
                  <Grow {...TransitionProps}>
                    <FileSearchDropdown>
                      <ClickAwayListener onClickAway={handleClickAway}>
                        <Box sx={{ p: 1 }}>
                          <TextField
                            fullWidth
                            size="small"
                            placeholder="Search files..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Search fontSize="small" />
                                </InputAdornment>
                              ),
                            }}
                            autoFocus
                          />
                          <FileSearchResults>
                            {isSearching ? (
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  p: 1,
                                }}>
                                <CircularProgress size={16} />
                              </Box>
                            ) : searchResults.length > 0 ? (
                              searchResults.map(file => (
                                <FileSearchItem
                                  key={file.path}
                                  onClick={() => handleFileSelect(file)}>
                                  <FileIcon>
                                    {getFileIcon(file.name, false)}
                                  </FileIcon>
                                  <FileInfo>
                                    <Typography variant="body2" noWrap>
                                      {file.name}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      noWrap>
                                      {file.relativePath}
                                    </Typography>
                                  </FileInfo>
                                </FileSearchItem>
                              ))
                            ) : searchQuery ? (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ p: 1, textAlign: 'center' }}>
                                No files found
                              </Typography>
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ p: 1, textAlign: 'center' }}>
                                Start typing to search files...
                              </Typography>
                            )}
                          </FileSearchResults>
                        </Box>
                      </ClickAwayListener>
                    </FileSearchDropdown>
                  </Grow>
                )}
              </Popper>
            </FileSearchContainer>
          ) : (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ ml: 'auto' }}>
              Open a project in order to add files as context
            </Typography>
          )}
        </Box>
        <SelectedFilesContainer>
          {documentContext.map(doc => (
            <Chip
              key={doc.path}
              label={doc.name}
              size="small"
              onDelete={() => handleRemoveContext(doc.path)}
              variant="outlined"
            />
          ))}
        </SelectedFilesContainer>
      </FileSelectionContainer>

      <InputContainer>
        <TextField
          multiline
          maxRows={4}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about your code, documentation, or project..."
          variant="outlined"
          size="small"
          fullWidth
          disabled={isLoading}
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          disabled={!input.trim() || isLoading}
          sx={{ minWidth: 'auto', px: 2 }}>
          <Send sx={{ fontSize: 18 }} />
        </Button>
      </InputContainer>

      {showQuickFileOpener && (
        <QuickFileOpener
          open={showQuickFileOpener}
          onClose={() => setShowQuickFileOpener(false)}
          onFileSelect={handleFileSelected}
        />
      )}
    </ChatContainer>
  );
});
