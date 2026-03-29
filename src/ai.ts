export type AIProvider = 'Gemini' | 'OpenAI' | 'Anthropic' | 'Ollama';

export const AI_PROVIDERS: AIProvider[] = ['Gemini', 'OpenAI', 'Anthropic', 'Ollama'];

export const AI_MODELS: Record<AIProvider, string[]> = {
  Gemini:    ['gemini-2.5-pro', 'gemini-2.0-flash', 'gemini-2.0-flash-exp', 'gemini-1.5-pro', 'gemini-1.5-flash'],
  OpenAI:    ['gpt-4o', 'gpt-4o-mini', 'o1-preview', 'o1-mini', 'o3-mini'],
  Anthropic: ['claude-opus-4-6', 'claude-sonnet-4-6', 'claude-haiku-4-5', 'claude-3-5-sonnet-latest', 'claude-3-5-haiku-latest'],
  Ollama:    ['llama3.1:latest', 'llama3.2', 'llama3.3', 'qwen2.5-coder', 'phi4', 'deepseek-r1:8b'],
};

export const AI_PROVIDER_COLORS: Record<AIProvider, string> = {
  Gemini:    'blue',
  OpenAI:    'green',
  Anthropic: 'yellow',
  Ollama:    'cyan',
};

export const AI_PROVIDER_ICONS: Record<AIProvider, string> = {
  Gemini:    '◆',
  OpenAI:    '◎',
  Anthropic: '◇',
  Ollama:    '○',
};

export interface AIConfig {
  provider: AIProvider;
  model: string;
  apiKey?: string;
  ollamaUrl?: string;
}

export const DEFAULT_AI_CONFIG: AIConfig = {
  provider: 'Gemini',
  model: 'gemini-2.0-flash',
  ollamaUrl: 'http://localhost:11434',
};

/** Fetch available models from a running Ollama instance */
export async function fetchOllamaModels(ollamaUrl: string): Promise<string[]> {
  let url = ollamaUrl;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'http://' + url;
  }
  const response = await fetch(`${url}/api/tags`);
  if (!response.ok) throw new Error(`Ollama error (${response.status})`);
  const data = await response.json() as { models?: Array<{ name: string }> };
  return (data.models ?? []).map((m) => m.name).filter(Boolean);
}
