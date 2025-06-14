export interface ProviderStatus {
  hasKey: boolean;
  isValid?: boolean;
}

export interface Message {
  type: 'success' | 'error';
  text: string;
}

export interface ProviderInfo {
  name: string;
  keyFormat: string;
  getKeyUrl: string;
  keyLength: number;
}
