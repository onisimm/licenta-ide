export interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  error?: {
    message: string;
    code?: number;
  };
}

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

export type AIProvider = 'gemini' | 'openai';

export interface AIServiceConfig {
  provider: AIProvider;
  apiKey: string;
}

export class AIService {
  private provider: AIProvider;
  private apiKey: string;

  constructor(config: AIServiceConfig) {
    this.provider = config.provider;
    this.apiKey = config.apiKey;
  }

  static getApiKey(provider: AIProvider): string | null {
    return localStorage.getItem(`${provider}-api-key`);
  }

  static getProvider(): AIProvider {
    return (localStorage.getItem('ai-provider') as AIProvider) || 'gemini';
  }

  static setProvider(provider: AIProvider): void {
    localStorage.setItem('ai-provider', provider);
  }

  static async validateApiKey(
    provider: AIProvider,
    apiKey: string,
  ): Promise<boolean> {
    try {
      if (provider === 'gemini') {
        return await this.validateGeminiKey(apiKey);
      } else if (provider === 'openai') {
        return await this.validateOpenAIKey(apiKey);
      }
      return false;
    } catch (error) {
      console.error(`${provider} API key validation error:`, error);
      return false;
    }
  }

  private static async validateGeminiKey(apiKey: string): Promise<boolean> {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: 'Hello' }],
            },
          ],
        }),
      },
    );
    return response.ok;
  }

  private static async validateOpenAIKey(apiKey: string): Promise<boolean> {
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

    if (this.provider === 'gemini') {
      return await this.generateGeminiContent(fullPrompt);
    } else if (this.provider === 'openai') {
      return await this.generateOpenAIContent(fullPrompt);
    }

    throw new Error('Unsupported AI provider');
  }

  private async generateGeminiContent(prompt: string): Promise<string> {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      const errorData: GeminiResponse = await response.json();
      throw new Error(errorData.error?.message || 'Gemini API request failed');
    }

    const data: GeminiResponse = await response.json();
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received'
    );
  }

  private async generateOpenAIContent(prompt: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
        temperature: 0.7,
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
    // In the future, this could be enhanced to support streaming for both providers
    const result = await this.generateContent(prompt, context);
    onChunk?.(result);
    return result;
  }
}

export const createAIService = (): AIService | null => {
  const provider = AIService.getProvider();
  const apiKey = AIService.getApiKey(provider);

  if (!apiKey) return null;

  return new AIService({ provider, apiKey });
};

// Legacy exports for backward compatibility
export class GeminiService extends AIService {
  constructor(apiKey: string) {
    super({ provider: 'gemini', apiKey });
  }

  static getApiKey(): string | null {
    return AIService.getApiKey('gemini');
  }

  static async validateApiKey(apiKey: string): Promise<boolean> {
    return AIService.validateApiKey('gemini', apiKey);
  }
}

export const createGeminiService = (): GeminiService | null => {
  const apiKey = GeminiService.getApiKey();
  return apiKey ? new GeminiService(apiKey) : null;
};
