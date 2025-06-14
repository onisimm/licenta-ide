import { AIProvider } from '../../services/ai-api-service';

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  role: 'user' | 'assistant' | 'system';
  modelName?: string;
}

export interface ConversationSummary {
  id: string;
  content: string;
  timestamp: Date;
  messageCount: number;
}

export interface DocumentContext {
  name: string;
  content: string;
  path: string;
}

export interface CodeProps {
  node?: any;
  inline?: any;
  className?: any;
  children?: any;
}

export interface ChatHeaderProps {
  providerDisplayName: string;
  currentModel: string;
  onModelClick: (event: React.MouseEvent<HTMLElement>) => void;
  onResetChat: () => void;
  onGoToProfile: () => void;
  getCurrentModelName: () => string;
}

export interface ModelMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onModelSelect: (modelId: string) => void;
  currentModel: string;
  models: Record<string, { id: string; name: string; description: string }>;
}

export interface DocumentContextProps {
  documents: DocumentContext[];
  onRemoveContext: (path: string) => void;
}

export interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export interface MessageBubbleProps {
  message: Message;
}

export interface FileSelectionProps {
  folderPath: string | null;
  documentContext: DocumentContext[];
  onRemoveContext: (path: string) => void;
  onFileSelect: (file: { path: string; name: string }) => Promise<void>;
}

export interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onSendMessage: () => void;
}

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  };
}
