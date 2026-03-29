import type { ThemeName } from './themes.js';
import type { AIConfig } from './ai.js';

export interface Gi4nksConfig {
  theme: ThemeName;
  ai: AIConfig;
}

export const DEFAULT_CONFIG: Gi4nksConfig = {
  theme: 'dark',
  ai: {
    provider: 'Gemini',
    model: 'gemini-2.0-flash',
    ollamaUrl: 'http://localhost:11434',
  },
};

/** Get the config directory for a gi4nks app */
export function getConfigDir(appName: string): string {
  const home = process.env.HOME || process.env.USERPROFILE || '';
  return `${home}/.config/gi4nks/${appName}`;
}

/** Get the config file path for a gi4nks app */
export function getConfigPath(appName: string): string {
  return `${getConfigDir(appName)}/config.yaml`;
}
