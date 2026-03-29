import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { AI_PROVIDERS, AI_MODELS, AI_PROVIDER_ICONS, fetchOllamaModels } from '../ai.js';
import { symbols } from '../symbols.js';
import type { Theme } from '../themes.js';
import type { AIConfig, AIProvider } from '../ai.js';

interface AIProviderSelectorProps {
  value: AIConfig;
  onChange: (config: AIConfig) => void;
  onSave: () => void;
  onCancel: () => void;
  theme: Theme;
  isActive?: boolean;
}

type Row = 'provider' | 'model' | 'ollamaurl' | 'apikey';

export const AIProviderSelector: React.FC<AIProviderSelectorProps> = ({
  value,
  onChange,
  onSave,
  onCancel,
  theme,
  isActive = true,
}) => {
  const [activeRowIdx, setActiveRowIdx] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [draftProvider, setDraftProvider] = useState<AIProvider>(value.provider);
  const [draftModel, setDraftModel] = useState(value.model);
  const [draftOllamaUrl, setDraftOllamaUrl] = useState(value.ollamaUrl ?? 'http://localhost:11434');
  const [committedOllamaUrl, setCommittedOllamaUrl] = useState(value.ollamaUrl ?? 'http://localhost:11434');
  const [draftApiKey, setDraftApiKey] = useState(value.apiKey ?? '');
  const [ollamaModels, setOllamaModels] = useState<string[]>(AI_MODELS.Ollama as string[]);
  const [ollamaLoading, setOllamaLoading] = useState(false);

  const rows: Row[] = draftProvider === 'Ollama'
    ? ['provider', 'model', 'ollamaurl', 'apikey']
    : ['provider', 'model', 'apikey'];

  const activeRow = rows[Math.min(activeRowIdx, rows.length - 1)];

  useEffect(() => {
    if (draftProvider !== 'Ollama') return;
    let cancelled = false;
    setOllamaLoading(true);
    fetchOllamaModels(committedOllamaUrl)
      .then((names) => {
        if (cancelled) return;
        setOllamaModels(names.length > 0 ? names : AI_MODELS.Ollama as string[]);
        if (names.length > 0 && !names.includes(draftModel)) setDraftModel(names[0]);
      })
      .catch(() => { /* keep static list */ })
      .finally(() => { if (!cancelled) setOllamaLoading(false); });
    return () => { cancelled = true; };
  }, [draftProvider, committedOllamaUrl]);

  useInput((char, key) => {
    if (!isActive) return;

    if (isEditing) {
      if (key.return) {
        if (activeRow === 'ollamaurl') setCommittedOllamaUrl(draftOllamaUrl);
        setIsEditing(false);
        onChange({ provider: draftProvider, model: draftModel, ollamaUrl: draftOllamaUrl, apiKey: draftApiKey });
      } else if (key.escape) {
        if (activeRow === 'ollamaurl') setDraftOllamaUrl(committedOllamaUrl);
        setIsEditing(false);
      } else if (key.backspace || key.delete) {
        if (activeRow === 'apikey') setDraftApiKey((k) => k.slice(0, -1));
        if (activeRow === 'ollamaurl') setDraftOllamaUrl((u) => u.slice(0, -1));
      } else if (char && !key.ctrl && !key.meta) {
        if (activeRow === 'apikey') setDraftApiKey((k) => k + char);
        if (activeRow === 'ollamaurl') setDraftOllamaUrl((u) => u + char);
      }
      return;
    }

    if (key.upArrow) setActiveRowIdx((i) => Math.max(0, i - 1));
    if (key.downArrow) setActiveRowIdx((i) => Math.min(rows.length - 1, i + 1));

    if (key.rightArrow || key.leftArrow) {
      const dir = key.rightArrow ? 1 : -1;
      if (activeRow === 'provider') {
        const idx = AI_PROVIDERS.indexOf(draftProvider);
        const next = AI_PROVIDERS[(idx + dir + AI_PROVIDERS.length) % AI_PROVIDERS.length];
        setDraftProvider(next);
        setActiveRowIdx((i) => Math.min(i, (next === 'Ollama' ? 4 : 3) - 1));
        const nextModels = next === 'Ollama' ? ollamaModels : (AI_MODELS[next] as string[]);
        setDraftModel(nextModels[0] ?? '');
        setDraftApiKey('');
      } else if (activeRow === 'model') {
        const models = draftProvider === 'Ollama' ? ollamaModels : (AI_MODELS[draftProvider] as string[]);
        const idx = models.indexOf(draftModel);
        setDraftModel(models[(idx + dir + models.length) % models.length]);
      }
    }

    if (key.return) {
      if (activeRow === 'apikey' || activeRow === 'ollamaurl') {
        setIsEditing(true);
      } else {
        onChange({ provider: draftProvider, model: draftModel, ollamaUrl: draftOllamaUrl, apiKey: draftApiKey });
        onSave();
      }
    }

    if (key.escape) onCancel();
  }, { isActive });

  const renderRow = (row: Row, label: string, displayValue: string, isInteractive: boolean) => {
    const isSelected = activeRow === row;
    const color = isSelected ? theme.primary : theme.dim;
    return (
      <Box key={row} marginBottom={0}>
        <Text color={color}>{isSelected ? `${symbols.cursor} ` : '  '}</Text>
        <Box width={16}><Text color={color} bold={isSelected}>{label}: </Text></Box>
        <Box flexGrow={1}>
          {isEditing && isSelected ? (
            <Box>
              <Text color="white" backgroundColor={theme.secondary as string}> {displayValue} </Text>
              <Text color={theme.primary}>{symbols.textCursor}</Text>
            </Box>
          ) : (
            <Text color={isSelected ? theme.accent : theme.dim}>
              {isInteractive && isSelected ? `< ${displayValue} >` : displayValue}
            </Text>
          )}
        </Box>
      </Box>
    );
  };

  const modelDisplay = ollamaLoading && draftProvider === 'Ollama'
    ? `${draftModel} (loading...)`
    : draftModel;

  const providerDisplay = `${AI_PROVIDER_ICONS[draftProvider]} ${draftProvider}`;

  return (
    <Box flexDirection="column">
      {renderRow('provider', 'AI Provider', providerDisplay, true)}
      {renderRow('model', 'Model', modelDisplay, true)}
      {draftProvider === 'Ollama' && renderRow('ollamaurl', 'Ollama URL', draftOllamaUrl, false)}
      {renderRow('apikey', 'API Key',
        activeRow === 'apikey' && isEditing ? draftApiKey : (draftApiKey ? '••••••••••••' : '(none)'),
        false
      )}
      <Box marginTop={1}>
        <Text dimColor italic>
          {isEditing
            ? 'Enter: Confirm · Esc: Cancel'
            : '↑↓ Navigate · ←/→ Change · Enter Save/Edit · Esc Back'}
        </Text>
      </Box>
    </Box>
  );
};
