export interface OpenAIResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message: string;
    code?: string;
  };
}

// Add more providers here
// example: 'openai' | 'gemini'
export type AIProvider = 'openai';

export interface AIModel {
  id: string;
  name: string;
  description: string;
  maxTokens: number;
  temperature: number;
}

export const OPENAI_MODELS: Record<string, AIModel> = {
  'gpt-3.5-turbo': {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Fast and efficient for most tasks',
    maxTokens: 2000,
    temperature: 0.7,
  },
  'gpt-4': {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Most capable model, best for complex tasks',
    maxTokens: 4000,
    temperature: 0.7,
  },
  'gpt-4o-mini': {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    description: 'Fast, affordable small model for focused tasks',
    maxTokens: 2000,
    temperature: 0.7,
  },
  'gpt-4.1-mini': {
    id: 'gpt-4.1-mini',
    name: 'GPT-4.1 Mini',
    description: 'Balanced for intelligence, speed, and cost',
    maxTokens: 2000,
    temperature: 0.7,
  },
  'gpt-4.1': {
    id: 'gpt-4.1',
    name: 'GPT-4.1',
    description: 'Flagship GPT model for complex tasks',
    maxTokens: 4000,
    temperature: 0.7,
  },
};

// Factory function to create the appropriate AI service
export const createAIService = (): BaseAIService | null => {
  const provider = BaseAIService.getProvider();
  const apiKey = BaseAIService.getApiKey(provider);
  const model = BaseAIService.getModel(provider);

  if (!apiKey) return null;

  switch (provider) {
    case 'openai':
      return new OpenAIService(apiKey, model);
    default:
      return null;
  }
};

// Base class for all AI services
export abstract class BaseAIService {
  protected apiKey: string;
  protected model: string;

  constructor(apiKey: string, model: string = 'gpt-3.5-turbo') {
    this.apiKey = apiKey;
    this.model = model;
  }

  abstract generateContent(prompt: string, context?: string): Promise<string>;
  abstract streamContent(
    prompt: string,
    context?: string,
    onChunk?: (chunk: string) => void,
  ): Promise<string>;

  static getApiKey(provider: AIProvider): string | null {
    return localStorage.getItem(`${provider}-api-key`);
  }

  static getProvider(): AIProvider {
    return (localStorage.getItem('ai-provider') as AIProvider) || 'openai';
  }

  static setProvider(provider: AIProvider): void {
    localStorage.setItem('ai-provider', provider);
  }

  static getModel(provider: AIProvider): string {
    return localStorage.getItem(`${provider}-model`) || 'gpt-3.5-turbo';
  }

  static setModel(provider: AIProvider, model: string): void {
    localStorage.setItem(`${provider}-model`, model);
  }

  public static async validateApiKey(
    provider: AIProvider,
    apiKey: string,
  ): Promise<boolean> {
    try {
      if (provider === 'openai') {
        return await OpenAIService.validateApiKey(apiKey);
      }
      return false;
    } catch (error) {
      console.error(`${provider} API key validation error:`, error);
      return false;
    }
  }
}

export class OpenAIService extends BaseAIService {
  public static async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4.1-nano-2025-04-14',
            messages: [{ role: 'user', content: 'Hello' }],
            max_tokens: 5,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenAI API validation error:', errorData);
        return false;
      }

      return true;
    } catch (error) {
      console.error('OpenAI API validation error:', error);
      return false;
    }
  }

  async generateContent(prompt: string, context?: string): Promise<string> {
    const fullPrompt = context
      ? `Context:\n${context}\n\nQuestion: ${prompt}`
      : prompt;

    const modelConfig =
      OPENAI_MODELS[this.model] || OPENAI_MODELS['gpt-3.5-turbo'];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: 'user', content: fullPrompt }],
        max_tokens: modelConfig.maxTokens,
        temperature: modelConfig.temperature,
      }),
    });

    if (!response.ok) {
      const errorData: OpenAIResponse = await response.json();
      throw new Error(errorData.error?.message || 'OpenAI API request failed');
    }

    const data: OpenAIResponse = await response.json();
    return data.choices?.[0]?.message?.content || 'No response received';
  }

  async streamContent(
    prompt: string,
    context?: string,
    onChunk?: (chunk: string) => void,
  ): Promise<string> {
    // For now, just use the regular generateContent method
    // In the future, this could be enhanced to support streaming
    const result = await this.generateContent(prompt, context);
    onChunk?.(result);
    return result;
  }
}
