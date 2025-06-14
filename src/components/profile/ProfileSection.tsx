import React, { useState, useEffect } from 'react';
import {
  Typography,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { ProfileContainer, ProfilePanel, SectionTitle } from './styles';
import { ProviderField } from './ProviderField';
import { ProviderInfo, ProviderStatus, Message } from './types';
import { BaseAIService, OPENAI_MODELS } from '../../services/ai-api-service';

type AIProvider = 'openai';

const PROVIDER_INFO: Record<AIProvider, ProviderInfo> = {
  openai: {
    name: 'OpenAI',
    keyFormat: 'sk-...',
    getKeyUrl: 'https://platform.openai.com/api-keys',
    keyLength: 51,
  },
};

export const ProfileSection: React.FC = () => {
  const [selectedProvider, setSelectedProvider] =
    useState<AIProvider>('openai');
  const [apiKeys, setApiKeys] = useState<Record<AIProvider, string>>({
    openai: '',
  });
  const [showApiKeys, setShowApiKeys] = useState<Record<AIProvider, boolean>>({
    openai: false,
  });
  const [statuses, setStatuses] = useState<Record<AIProvider, ProviderStatus>>({
    openai: { hasKey: false },
  });
  const [loading, setLoading] = useState<Record<AIProvider, boolean>>({
    openai: false,
  });
  const [message, setMessage] = useState<Message | null>(null);

  useEffect(() => {
    // Load saved API keys from storage
    const loadApiKeys = async () => {
      try {
        const savedKeys = {
          openai: localStorage.getItem('openai-api-key') || '',
        };
        setApiKeys(savedKeys);

        // Update statuses based on saved keys
        const newStatuses = { ...statuses };
        Object.entries(savedKeys).forEach(([provider, key]) => {
          if (key) {
            newStatuses[provider as AIProvider] = {
              hasKey: true,
              isValid: true,
            };
          }
        });
        setStatuses(newStatuses);
      } catch (error) {
        console.error('Failed to load API keys:', error);
        setMessage({ type: 'error', text: 'Failed to load API keys' });
      }
    };

    loadApiKeys();
  }, []);

  const handleApiKeyChange = (provider: AIProvider, value: string) => {
    setApiKeys(prev => ({ ...prev, [provider]: value }));
  };

  const handleToggleShowApiKey = (provider: AIProvider) => {
    setShowApiKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  const handleSaveApiKey = async (provider: AIProvider) => {
    const key = apiKeys[provider];
    if (!key) return;

    setLoading(prev => ({ ...prev, [provider]: true }));
    try {
      const isValid = await BaseAIService.validateApiKey('openai', key);
      if (isValid) {
        localStorage.setItem(`${provider}-api-key`, key);
        setStatuses(prev => ({
          ...prev,
          [provider]: { hasKey: true, isValid: true },
        }));
        setMessage({
          type: 'success',
          text: `${PROVIDER_INFO[provider].name} API key saved successfully`,
        });
      } else {
        setStatuses(prev => ({
          ...prev,
          [provider]: { hasKey: true, isValid: false },
        }));
        setMessage({
          type: 'error',
          text: `Invalid ${PROVIDER_INFO[provider].name} API key`,
        });
      }
    } catch (error) {
      console.error(`Failed to validate ${provider} API key:`, error);
      setMessage({
        type: 'error',
        text: `Failed to validate ${PROVIDER_INFO[provider].name} API key`,
      });
    } finally {
      setLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  const handleDeleteApiKey = async (provider: AIProvider) => {
    try {
      localStorage.removeItem(`${provider}-api-key`);
      setApiKeys(prev => ({ ...prev, [provider]: '' }));
      setStatuses(prev => ({
        ...prev,
        [provider]: { hasKey: false },
      }));
      setMessage({
        type: 'success',
        text: `${PROVIDER_INFO[provider].name} API key deleted successfully`,
      });
    } catch (error) {
      console.error(`Failed to delete ${provider} API key:`, error);
      setMessage({
        type: 'error',
        text: `Failed to delete ${PROVIDER_INFO[provider].name} API key`,
      });
    }
  };

  const handleProviderChange = (provider: AIProvider) => {
    setSelectedProvider(provider);
    BaseAIService.setProvider(provider);
    setMessage({
      type: 'success',
      text: `Switched to ${PROVIDER_INFO[provider].name}`,
    });
  };

  const openaiModels = Object.values(OPENAI_MODELS).map(model => model.name);

  return (
    <ProfileContainer>
      <ProfilePanel>
        <SectionTitle>AI Provider Selection</SectionTitle>
        <FormControl size="small" fullWidth>
          <InputLabel>Select AI Provider</InputLabel>
          <Select
            value={selectedProvider}
            onChange={e => handleProviderChange(e.target.value as AIProvider)}
            label="Select AI Provider">
            <MenuItem value="openai">
              OpenAI {statuses.openai.hasKey && statuses.openai.isValid && '✓'}
            </MenuItem>
          </Select>
        </FormControl>
        <Typography variant="caption" color="text.secondary">
          Choose your preferred AI provider for the chat feature
        </Typography>
      </ProfilePanel>

      <ProfilePanel>
        <SectionTitle>API Keys</SectionTitle>
        {Object.entries(PROVIDER_INFO).map(([provider, info]) => (
          <ProviderField
            key={provider}
            provider={provider as AIProvider}
            info={info}
            status={statuses[provider as AIProvider]}
            apiKey={apiKeys[provider as AIProvider]}
            showApiKey={showApiKeys[provider as AIProvider]}
            isLoading={loading[provider as AIProvider]}
            onApiKeyChange={value =>
              handleApiKeyChange(provider as AIProvider, value)
            }
            onToggleShowApiKey={() =>
              handleToggleShowApiKey(provider as AIProvider)
            }
            onSaveApiKey={() => handleSaveApiKey(provider as AIProvider)}
            onDeleteApiKey={() => handleDeleteApiKey(provider as AIProvider)}
            renderBudgetMessage={provider === 'openai'}
            availableModels={provider === 'openai' ? openaiModels : []}
          />
        ))}
      </ProfilePanel>

      <Snackbar
        open={!!message}
        autoHideDuration={6000}
        onClose={() => setMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert
          onClose={() => setMessage(null)}
          severity={message?.type}
          sx={{ width: '100%' }}>
          {message?.text}
        </Alert>
      </Snackbar>
    </ProfileContainer>
  );
};
