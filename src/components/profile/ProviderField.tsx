import React from 'react';
import {
  Typography,
  TextField,
  Button,
  Chip,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Save,
  Delete,
  Check,
} from '@mui/icons-material';
import { FieldContainer, ButtonGroup, ProviderHeader } from './styles';
import { ProviderInfo, ProviderStatus } from './types';

type AIProvider = 'openai' | 'anthropic';

interface ProviderFieldProps {
  provider: AIProvider;
  info: ProviderInfo;
  status: ProviderStatus;
  apiKey: string;
  showApiKey: boolean;
  isLoading: boolean;
  onApiKeyChange: (value: string) => void;
  onToggleShowApiKey: () => void;
  onSaveApiKey: () => void;
  onDeleteApiKey: () => void;
  renderBudgetMessage?: boolean;
  availableModels?: string[];
}

export const ProviderField: React.FC<ProviderFieldProps> = ({
  provider,
  info,
  status,
  apiKey,
  showApiKey,
  isLoading,
  onApiKeyChange,
  onToggleShowApiKey,
  onSaveApiKey,
  onDeleteApiKey,
  renderBudgetMessage = false,
  availableModels = [],
}) => (
  <FieldContainer>
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
      type={showApiKey ? 'text' : 'password'}
      value={apiKey}
      onChange={e => onApiKeyChange(e.target.value)}
      placeholder={`Enter your ${info.name} API key (${info.keyFormat})`}
      size="small"
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={onToggleShowApiKey} edge="end" size="small">
              {showApiKey ? <VisibilityOff /> : <Visibility />}
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

    {availableModels.length > 0 && (
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
        {status.hasKey && status.isValid
          ? `You are now able to use inside AI-Chat one of the following models: ${availableModels.join(
              ', ',
            )}`
          : `With a valid key, you will be able to use one of the following models: ${availableModels.join(
              ', ',
            )}`}
      </Typography>
    )}

    <ButtonGroup>
      <Button
        variant="contained"
        startIcon={<Save />}
        onClick={onSaveApiKey}
        disabled={isLoading || !apiKey.trim()}
        size="small">
        {isLoading ? 'Validating...' : 'Save & Validate'}
      </Button>
      {apiKey && (
        <Button
          variant="outlined"
          startIcon={<Delete />}
          onClick={onDeleteApiKey}
          color="error"
          size="small">
          Delete
        </Button>
      )}
    </ButtonGroup>
  </FieldContainer>
);
