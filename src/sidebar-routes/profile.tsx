import { memo, useState, useCallback, useEffect } from 'react';
import {
  Box,
  styled,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Save,
  Delete,
  Check,
} from '@mui/icons-material';
import { BaseAIService, AIProvider } from '../services/ai-api-service';

const ProfileContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const ProfilePanel = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 600,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const FieldContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const ButtonGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

const ProviderHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

interface ProviderStatus {
  hasKey: boolean;
  isValid?: boolean;
}

export const ProfileSection = memo(() => {
  const [selectedProvider, setSelectedProvider] =
    useState<AIProvider>('openai');
  const [apiKeys, setApiKeys] = useState<Record<AIProvider, string>>({
    openai: '',
  });
  const [showApiKeys, setShowApiKeys] = useState<Record<AIProvider, boolean>>({
    openai: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [providerStatus, setProviderStatus] = useState<
    Record<AIProvider, ProviderStatus>
  >({
    openai: { hasKey: false },
  });

  // Load API keys and provider on mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        // Load provider selection
        const savedProvider = BaseAIService.getProvider();
        setSelectedProvider(savedProvider);

        // Load API keys and check status
        const providers: AIProvider[] = ['openai'];
        const newApiKeys = { ...apiKeys };
        const newStatus = { ...providerStatus };

        providers.forEach(provider => {
          const stored = BaseAIService.getApiKey(provider);
          if (stored) {
            newApiKeys[provider] = stored;
            newStatus[provider] = { hasKey: true, isValid: true };
          }
        });

        setApiKeys(newApiKeys);
        setProviderStatus(newStatus);
      } catch (error) {
        console.warn('Failed to load settings:', error);
      }
    };

    loadSettings();
  }, []);

  const getProviderInfo = (provider: AIProvider) => {
    switch (provider) {
      case 'openai':
        return {
          name: 'OpenAI',
          keyFormat: 'sk-...',
          getKeyUrl: 'https://platform.openai.com/api-keys',
          keyLength: 20,
        };
      default:
        return null;
    }
  };

  const validateApiKeyFormat = (provider: AIProvider, key: string): boolean => {
    const info = getProviderInfo(provider);
    if (!info) return false;

    switch (provider) {
      case 'openai':
        return key.startsWith('sk-') && key.length >= info.keyLength;
      default:
        return false;
    }
  };

  const handleSaveApiKey = useCallback(
    async (provider: AIProvider) => {
      const apiKey = apiKeys[provider];

      if (!apiKey.trim()) {
        setMessage({ type: 'error', text: 'Please enter an API key' });
        return;
      }

      if (!validateApiKeyFormat(provider, apiKey)) {
        const info = getProviderInfo(provider);
        setMessage({
          type: 'error',
          text: `Invalid API key format. ${info?.name} API keys start with "${info?.keyFormat}"`,
        });
        return;
      }

      setIsLoading(true);
      try {
        const isValid = await BaseAIService.validateApiKey(provider, apiKey);

        if (isValid) {
          localStorage.setItem(`${provider}-api-key`, apiKey);
          setProviderStatus(prev => ({
            ...prev,
            [provider]: { hasKey: true, isValid: true },
          }));
          setMessage({
            type: 'success',
            text: `${
              getProviderInfo(provider)?.name
            } API key saved successfully!`,
          });
        } else {
          setProviderStatus(prev => ({
            ...prev,
            [provider]: { hasKey: true, isValid: false },
          }));
          setMessage({
            type: 'error',
            text: `Invalid ${
              getProviderInfo(provider)?.name
            } API key. Please check your key and try again.`,
          });
        }
      } catch (error) {
        setMessage({
          type: 'error',
          text: 'Failed to validate API key. Please check your internet connection.',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [apiKeys],
  );

  const handleDeleteApiKey = useCallback(async (provider: AIProvider) => {
    try {
      localStorage.removeItem(`${provider}-api-key`);
      setApiKeys(prev => ({ ...prev, [provider]: '' }));
      setProviderStatus(prev => ({ ...prev, [provider]: { hasKey: false } }));
      setMessage({
        type: 'success',
        text: `${
          getProviderInfo(provider)?.name
        } API key deleted successfully!`,
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete API key' });
    }
  }, []);

  const handleProviderChange = useCallback((provider: AIProvider) => {
    setSelectedProvider(provider);
    BaseAIService.setProvider(provider);
    setMessage({
      type: 'success',
      text: `Switched to ${getProviderInfo(provider)?.name}`,
    });
  }, []);

  const toggleShowApiKey = useCallback((provider: AIProvider) => {
    setShowApiKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
  }, []);

  const clearMessage = useCallback(() => {
    setMessage(null);
  }, []);

  const renderProviderField = (
    provider: AIProvider,
    renderBudgetMessage: boolean = false,
  ) => {
    const info = getProviderInfo(provider);
    const status = providerStatus[provider];

    if (!info) return null;

    return (
      <FieldContainer key={provider}>
        <ProviderHeader>
          <Typography variant="body2" color="text.secondary">
            {info.name} API Key
          </Typography>
          {status.hasKey && (
            <Chip
              size="small"
              label={status.isValid ? 'Active' : 'Invalid'}
              color={status.isValid ? 'success' : 'error'}
              icon={status.isValid ? <Check /> : undefined}
            />
          )}
        </ProviderHeader>

        <TextField
          type={showApiKeys[provider] ? 'text' : 'password'}
          value={apiKeys[provider]}
          onChange={e =>
            setApiKeys(prev => ({ ...prev, [provider]: e.target.value }))
          }
          placeholder={`Enter your ${info.name} API key (${info.keyFormat})`}
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => toggleShowApiKey(provider)}
                  edge="end"
                  size="small">
                  {showApiKeys[provider] ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Typography variant="caption" color="text.secondary">
          Get your API key from{' '}
          <a
            href={info.getKeyUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'inherit' }}>
            {info.name} Platform
          </a>
        </Typography>

        {renderBudgetMessage && (
          <Typography variant="caption" color="text.secondary">
            Make sure you have enough credits to use the API.
          </Typography>
        )}

        <ButtonGroup>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={() => handleSaveApiKey(provider)}
            disabled={isLoading || !apiKeys[provider].trim()}
            size="small">
            {isLoading ? 'Validating...' : 'Save & Validate'}
          </Button>
          {apiKeys[provider] && (
            <Button
              variant="outlined"
              startIcon={<Delete />}
              onClick={() => handleDeleteApiKey(provider)}
              color="error"
              size="small">
              Delete
            </Button>
          )}
        </ButtonGroup>
      </FieldContainer>
    );
  };

  return (
    <ProfileContainer>
      <Typography variant="h6" sx={{ mb: 1 }}>
        AI Configuration
      </Typography>

      <ProfilePanel elevation={1}>
        <SectionTitle>AI Provider Selection</SectionTitle>

        {message && (
          <Alert severity={message.type} onClose={clearMessage} sx={{ mb: 1 }}>
            {message.text}
          </Alert>
        )}

        <FieldContainer>
          <Typography variant="body2" color="text.secondary">
            Active AI Provider
          </Typography>
          <FormControl size="small" fullWidth>
            <InputLabel>Select AI Provider</InputLabel>
            <Select
              value={selectedProvider}
              onChange={e => handleProviderChange(e.target.value as AIProvider)}
              label="Select AI Provider">
              <MenuItem value="openai">
                OpenAI{' '}
                {providerStatus.openai.hasKey &&
                  providerStatus.openai.isValid &&
                  '✓'}
              </MenuItem>
            </Select>
          </FormControl>
          <Typography variant="caption" color="text.secondary">
            Choose your preferred AI provider for the chat feature
          </Typography>
        </FieldContainer>
      </ProfilePanel>

      <ProfilePanel elevation={1}>
        <SectionTitle>API Keys Configuration</SectionTitle>

        {renderProviderField('openai', true)}
      </ProfilePanel>

      <ProfilePanel elevation={1}>
        <SectionTitle>About</SectionTitle>
        <Typography variant="body2" color="text.secondary">
          Configure your AI provider and API keys to enable AI chat
          functionality. API keys are stored securely on your device and never
          shared.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          The AI chat can help you with code questions, documentation, and
          analysis of your project files using your chosen AI provider.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          <strong>OpenAI:</strong> Requires paid account, excellent for complex
          reasoning
        </Typography>
      </ProfilePanel>
    </ProfileContainer>
  );
});
