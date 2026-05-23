import React from 'react';

interface Theme {
    name: string;
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    dim: string;
    bg: string;
    fg: string;
    border: string;
    selection: string;
    info: string;
}
declare const THEMES: Record<string, Theme>;
declare const THEME_NAMES: string[];
type ThemeName = keyof typeof THEMES;

declare const symbols: {
    readonly cursor: "❯";
    readonly selected: "●";
    readonly unselected: "○";
    readonly checkmark: "✓";
    readonly cross: "✗";
    readonly star: "★";
    readonly starEmpty: "☆";
    readonly warning: "⚠";
    readonly ai: "✦";
    readonly textCursor: "█";
    readonly separator: "│";
    readonly arrowUp: "↑";
    readonly arrowDown: "↓";
    readonly arrowLeft: "←";
    readonly arrowRight: "→";
    readonly bullet: "•";
    readonly spinner: readonly ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
    readonly spinnerInterval: 80;
};

declare const layout: {
    readonly paddingX: 1;
    readonly paddingY: 1;
    readonly sectionGap: 1;
    readonly columnGap: 2;
};

type AIProvider = 'Gemini' | 'OpenAI' | 'Anthropic' | 'Ollama';
declare const AI_PROVIDERS: AIProvider[];
declare const AI_MODELS: Record<AIProvider, string[]>;
declare const AI_PROVIDER_COLORS: Record<AIProvider, string>;
declare const AI_PROVIDER_ICONS: Record<AIProvider, string>;
interface AIConfig {
    provider: AIProvider;
    model: string;
    apiKey?: string;
    ollamaUrl?: string;
}
declare const DEFAULT_AI_CONFIG: AIConfig;
/** Fetch available models from a running Ollama instance */
declare function fetchOllamaModels(ollamaUrl: string): Promise<string[]>;

interface Gi4nksConfig {
    theme: ThemeName;
    ai: AIConfig;
}
declare const DEFAULT_CONFIG: Gi4nksConfig;
/** Get the config directory for a gi4nks app */
declare function getConfigDir(appName: string): string;
/** Get the config file path for a gi4nks app */
declare function getConfigPath(appName: string): string;

interface SectionHeaderProps {
    title: string;
    theme: Theme;
    count?: number;
}
declare const SectionHeader: React.FC<SectionHeaderProps>;

interface SpinnerProps {
    theme: Theme;
    label?: string;
}
declare const Spinner: React.FC<SpinnerProps>;

interface KeyHintItem {
    key: string;
    description: string;
}
interface KeyHintProps {
    hints: KeyHintItem[];
    theme: Theme;
    position?: string;
}
declare const KeyHint: React.FC<KeyHintProps>;

interface ConfigField {
    label: string;
    key: string;
    type: 'string' | 'boolean' | 'number' | 'password';
    suggestions?: string[];
}
interface ConfigViewProps {
    title?: string;
    fields: ConfigField[];
    values: Record<string, unknown>;
    aiConfig?: AIConfig;
    theme: Theme;
    themeName: ThemeName;
    isActive?: boolean;
    onSave: (values: Record<string, unknown>, aiConfig?: AIConfig, themeName?: ThemeName) => void;
    onCancel: () => void;
    appName?: string;
}
declare const ConfigView: React.FC<ConfigViewProps>;

interface AIProviderSelectorProps {
    value: AIConfig;
    onChange: (config: AIConfig) => void;
    onSave: () => void;
    onCancel: () => void;
    theme: Theme;
    isActive?: boolean;
}
declare const AIProviderSelector: React.FC<AIProviderSelectorProps>;

interface AppHeaderProps {
    /** Application name shown in theme.primary bold */
    appName: string;
    /** Semver string, displayed dim after the app name */
    version: string;
    theme: Theme;
    /** Current working directory (optional — pass already-shortened path) */
    cwd?: string;
    /** Extra nodes rendered after cwd on the left */
    leftExtra?: React.ReactNode;
    /** Content placed on the right side of the first row */
    rightContent?: React.ReactNode;
    /** Additional rows rendered below the main bar (still padded) */
    subLines?: React.ReactNode[];
    /** Highlighted message row at the bottom of the header (theme.accent) */
    message?: string;
}
declare const AppHeader: React.FC<AppHeaderProps>;

interface HintItem {
    key: string;
    description: string;
}
type HintEntry = HintItem | '|';
interface AppFooterProps {
    theme: Theme;
    /** Key-binding hints. Use '|' as a separator between groups. */
    hints: HintEntry[];
    /** Position indicator shown on the right (e.g. "3/42") */
    position?: string;
    /** Short-lived status message on the right (e.g. "Copied!") shown in theme.success */
    toast?: string;
    /** Optional row rendered above the hint bar (e.g. batch-selection count) */
    topRow?: React.ReactNode;
    /** Arbitrary content placed on the right side of the hint bar */
    statusContent?: React.ReactNode;
}
declare const AppFooter: React.FC<AppFooterProps>;

export { type AIConfig, type AIProvider, AIProviderSelector, AI_MODELS, AI_PROVIDERS, AI_PROVIDER_COLORS, AI_PROVIDER_ICONS, AppFooter, AppHeader, type ConfigField, ConfigView, DEFAULT_AI_CONFIG, DEFAULT_CONFIG, type Gi4nksConfig, type HintItem, KeyHint, SectionHeader, Spinner, THEMES, THEME_NAMES, type Theme, type ThemeName, fetchOllamaModels, getConfigDir, getConfigPath, layout, symbols };
