import { Box, styled } from '@mui/material';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SmartToy, Settings } from '@mui/icons-material';
import {
  createAIService,
  BaseAIService,
  AIProvider,
  OPENAI_MODELS,
  ChatMessage,
} from '../../services/ai-api-service';
import { addChatMessage, clearChatMessages } from '../../shared/rdx-slice';
import { RootState } from '../../shared/store';
import { useProjectOperations } from '../../shared/hooks';
import { ChatHeader } from './ChatHeader';
import { ModelMenu } from './ModelMenu';
import { DocumentContext } from './DocumentContext';
import { MessageList } from './MessageList';
import { FileSelection } from './FileSelection';
import { ChatInput } from './ChatInput';
import { EmptyState } from './EmptyState';
import { Message, DocumentContext as DocumentContextType } from './types';

const ChatContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}));

export const AiChat = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const messages = useSelector(
    (state: RootState) => state.main.chatState.messages,
  );
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiService, setAiService] = useState<any>(null);
  const [currentProvider, setCurrentProvider] = useState<AIProvider>('openai');
  const [documentContext, setDocumentContext] = useState<DocumentContextType[]>(
    [],
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [modelMenuAnchor, setModelMenuAnchor] = useState<null | HTMLElement>(
    null,
  );
  const [currentModel, setCurrentModel] = useState(() => {
    const savedModel = BaseAIService.getModel(currentProvider);
    return OPENAI_MODELS[savedModel] ? savedModel : 'gpt-3.5-turbo';
  });
  const { folderPath } = useProjectOperations();
  const [conversationSummaries, setConversationSummaries] = useState<
    Array<{
      id: string;
      content: string;
      timestamp: Date;
      messageCount: number;
    }>
  >([]);
  const MESSAGES_BEFORE_SUMMARY = 10;

  useEffect(() => {
    const checkAIService = () => {
      const service = createAIService();
      const provider = BaseAIService.getProvider();
      setAiService(service);
      setCurrentProvider(provider);
    };

    checkAIService();
    const interval = setInterval(checkAIService, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleGoToProfile = useCallback(() => {
    navigate('/main_window/profile');
  }, [navigate]);

  const addMessage = useCallback(
    (content: string, isUser: boolean) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        content,
        isUser,
        timestamp: new Date(),
        role: isUser ? 'user' : 'assistant',
        modelName: isUser ? undefined : OPENAI_MODELS[currentModel]?.name,
      };
      dispatch(addChatMessage(newMessage));
    },
    [dispatch, currentModel],
  );

  const handleResetChat = useCallback(() => {
    dispatch(clearChatMessages());
    setConversationSummaries([]);
  }, [dispatch]);

  const generateSummary = useCallback(async (messages: Message[]) => {
    const service = createAIService();
    if (!service) {
      throw new Error('No AI service available');
    }

    const summaryPrompt = `Please provide a concise summary of the following conversation, focusing on the key points and decisions made:

${messages
  .map(msg => `${msg.isUser ? 'User' : 'AI'}: ${msg.content}`)
  .join('\n')}

Summary:`;

    try {
      const summary = await service.generateContent(summaryPrompt);
      return {
        id: Date.now().toString(),
        content: summary,
        timestamp: new Date(),
        messageCount: messages.length,
      };
    } catch (error) {
      console.error('Error generating summary:', error);
      return null;
    }
  }, []);

  const callAIAPI = useCallback(
    async (prompt: string, context?: string) => {
      const service = createAIService();
      if (!service) {
        throw new Error(
          'No AI service available. Please configure an API key in the profile section.',
        );
      }

      const recentMessages = messages.slice(-MESSAGES_BEFORE_SUMMARY);
      const conversationHistory: ChatMessage[] = recentMessages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content,
      }));

      if (conversationSummaries.length > 0) {
        const summaryContext = conversationSummaries
          .map(
            summary =>
              `Previous conversation summary (${summary.messageCount} messages):\n${summary.content}`,
          )
          .join('\n\n');

        conversationHistory.unshift({
          role: 'system',
          content: `Here are summaries of previous conversations for context:\n\n${summaryContext}`,
        });
      }

      if (context) {
        conversationHistory.unshift({
          role: 'system',
          content: `You are a coding assistant embedded in an IDE. The following is relevant context from the user's project files. Use this to help answer questions, write code, or provide explanations based on the codebase:\n\n${context}`,
        });
      }

      return await service.generateContent(
        prompt,
        undefined,
        conversationHistory,
      );
    },
    [messages, conversationSummaries],
  );

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    addMessage(userMessage, true);
    setIsLoading(true);

    try {
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

      if (messages.length + 2 >= MESSAGES_BEFORE_SUMMARY) {
        const messagesToSummarize = messages.slice(-MESSAGES_BEFORE_SUMMARY);
        const summary = await generateSummary(messagesToSummarize);
        if (summary) {
          setConversationSummaries(prev => [...prev, summary]);
        }
      }
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
  }, [
    input,
    isLoading,
    addMessage,
    callAIAPI,
    documentContext,
    messages,
    generateSummary,
  ]);

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
    },
    [],
  );

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

  if (!aiService) {
    return (
      <ChatContainer>
        <ChatHeader
          providerDisplayName="OpenAI"
          currentModel={currentModel}
          onModelClick={handleModelClick}
          onResetChat={handleResetChat}
          onGoToProfile={handleGoToProfile}
          getCurrentModelName={getCurrentModelName}
        />
        <EmptyState
          title="AI Chat Setup Required"
          description="To use AI chat, you need to configure an API key for OpenAI in the profile section."
          icon={<SmartToy sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />}
          action={{
            label: 'Go to Profile',
            icon: <Settings />,
            onClick: handleGoToProfile,
          }}
        />
      </ChatContainer>
    );
  }


  return (
    <ChatContainer>
      <ChatHeader
        providerDisplayName="OpenAI"
        currentModel={currentModel}
        onModelClick={handleModelClick}
        onResetChat={handleResetChat}
        onGoToProfile={handleGoToProfile}
        getCurrentModelName={getCurrentModelName}
      />

      <ModelMenu
        anchorEl={modelMenuAnchor}
        onClose={handleModelClose}
        onModelSelect={handleModelSelect}
        currentModel={currentModel}
        models={OPENAI_MODELS}
      />

      <DocumentContext
        documents={documentContext}
        onRemoveContext={handleRemoveContext}
      />

      <MessageList
        messages={messages}
        isLoading={isLoading}
        messagesEndRef={messagesEndRef}
      />

      <FileSelection
        folderPath={folderPath}
        documentContext={documentContext}
        onRemoveContext={handleRemoveContext}
        onFileSelect={handleFileSelect}
      />

      <ChatInput
        input={input}
        isLoading={isLoading}
        onInputChange={e => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        onSendMessage={handleSendMessage}
      />
    </ChatContainer>
  );
};
