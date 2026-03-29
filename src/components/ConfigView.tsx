import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { THEME_NAMES, THEMES } from '../themes.js';
import { AIProviderSelector } from './AIProviderSelector.js';
import { SectionHeader } from './SectionHeader.js';
import { symbols } from '../symbols.js';
import type { Theme, ThemeName } from '../themes.js';
import type { AIConfig } from '../ai.js';

export interface ConfigField {
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

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[part];
    return undefined;
  }, obj);
}

function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): Record<string, unknown> {
  const parts = path.split('.');
  const last = parts.pop()!;
  const result = { ...obj };
  let target: Record<string, unknown> = result;
  for (const part of parts) {
    target[part] = { ...(target[part] as Record<string, unknown> ?? {}) };
    target = target[part] as Record<string, unknown>;
  }
  target[last] = value;
  return result;
}

export const ConfigView: React.FC<ConfigViewProps> = ({
  title = 'Configuration',
  fields,
  values,
  aiConfig,
  theme,
  themeName,
  isActive = true,
  onSave,
  onCancel,
  appName,
}) => {
  const [cursor, setCursor] = useState(0);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [draftValues, setDraftValues] = useState(values);
  const [draftTheme, setDraftTheme] = useState<ThemeName>(themeName);
  const [draftAI, setDraftAI] = useState<AIConfig | undefined>(aiConfig);
  const [showAISelector, setShowAISelector] = useState(false);
  const [message, setMessage] = useState('');

  // Build full field list including theme and AI sections
  const allFields: ConfigField[] = [
    ...fields,
    { label: 'UI Theme', key: '__theme__', type: 'string', suggestions: THEME_NAMES },
    ...(aiConfig ? [{ label: 'AI Settings', key: '__ai__', type: 'string' as const }] : []),
  ];

  useInput((input, key) => {
    if (!isActive || showAISelector) return;

    if (editing) {
      const field = allFields[cursor];
      if (field.suggestions) {
        const currentIndex = field.suggestions.indexOf(editValue);
        if (key.rightArrow) {
          setEditValue(field.suggestions[(currentIndex + 1) % field.suggestions.length]);
          return;
        }
        if (key.leftArrow) {
          setEditValue(field.suggestions[(currentIndex - 1 + field.suggestions.length) % field.suggestions.length]);
          return;
        }
      }
      if (key.return) {
        if (field.key === '__theme__') {
          setDraftTheme(editValue as ThemeName);
        } else {
          let val: unknown = editValue;
          if (field.type === 'number') val = parseInt(editValue, 10) || 0;
          setDraftValues((v) => setNestedValue(v, field.key, val));
        }
        setEditing(false);
        return;
      }
      if (key.escape) { setEditing(false); return; }
      if (key.backspace || key.delete) { setEditValue((v) => v.slice(0, -1)); return; }
      if (input.length > 0 && !key.ctrl && !key.meta && !key.tab) {
        setEditValue((v) => v + input);
      }
      return;
    }

    if (input === 'j' || key.downArrow) setCursor((c) => (c + 1) % allFields.length);
    else if (input === 'k' || key.upArrow) setCursor((c) => (c - 1 + allFields.length) % allFields.length);
    else if (key.return || input === ' ') {
      const field = allFields[cursor];
      if (field.key === '__ai__') {
        setShowAISelector(true);
      } else if (field.type === 'boolean') {
        const current = getNestedValue(draftValues, field.key);
        setDraftValues((v) => setNestedValue(v, field.key, !current));
      } else {
        const currentVal = field.key === '__theme__'
          ? draftTheme
          : String(getNestedValue(draftValues, field.key) ?? '');
        setEditValue(currentVal);
        setEditing(true);
      }
    } else if (input === 's') {
      onSave(draftValues, draftAI, draftTheme);
      setMessage('Saved!');
      setTimeout(() => setMessage(''), 2000);
    } else if (key.escape || input === 'q') {
      onCancel();
    }
  }, { isActive: isActive && !showAISelector });

  if (showAISelector && draftAI) {
    return (
      <Box flexDirection="column" paddingX={2} paddingY={1}>
        <Box marginBottom={1}>
          <SectionHeader title="AI Settings" theme={theme} />
        </Box>
        <AIProviderSelector
          value={draftAI}
          onChange={setDraftAI}
          onSave={() => setShowAISelector(false)}
          onCancel={() => setShowAISelector(false)}
          theme={theme}
          isActive={showAISelector}
        />
      </Box>
    );
  }

  const renderFieldValue = (field: ConfigField, idx: number) => {
    const isSelected = cursor === idx;
    if (field.key === '__theme__') {
      const t = THEMES[draftTheme];
      return editing && isSelected
        ? <Text color={theme.primary}>[{editValue}]</Text>
        : <Text color={theme.primary}>{t?.name ?? draftTheme}</Text>;
    }
    if (field.key === '__ai__') {
      return <Text color={theme.accent}>{draftAI ? `${draftAI.provider} / ${draftAI.model}` : '(not configured)'}</Text>;
    }
    const val = getNestedValue(draftValues, field.key);
    if (field.type === 'boolean') {
      return <Text color={val ? theme.success : theme.error}>{val ? `${symbols.selected} Enabled` : `${symbols.unselected} Disabled`}</Text>;
    }
    const str = String(val ?? '');
    const isPassword = field.type === 'password';
    if (editing && isSelected) {
      return (
        <Box>
          <Text color="white" backgroundColor={theme.secondary as string}> {isPassword ? '••••••••' : editValue} </Text>
          <Text color={theme.primary}>{symbols.textCursor}</Text>
        </Box>
      );
    }
    return <Text color={theme.warning}>{isPassword && str ? '••••••••' : (str || '(empty)')}</Text>;
  };

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1} flexGrow={1}>
      <Box marginBottom={1} justifyContent="space-between">
        <Text bold color={theme.primary}>⚙ {appName ? `${appName} — ` : ''}{title}</Text>
        <Text color={theme.success}>{message}</Text>
      </Box>

      {allFields.map((f, i) => (
        <Box key={f.key} flexDirection="column" marginBottom={0}>
          <Box>
            <Text color={theme.primary}>{i === cursor ? `${symbols.cursor} ` : '  '}</Text>
            <Box width={30}>
              <Text bold={i === cursor} color={i === cursor ? 'white' : theme.dim}>
                {f.label}
              </Text>
            </Box>
            <Box flexGrow={1}>
              {renderFieldValue(f, i)}
            </Box>
          </Box>
          {editing && i === cursor && f.suggestions && (
            <Box marginLeft={34}>
              <Text dimColor>←/→ cycle: </Text>
              {f.suggestions.map((s) => (
                <Text key={s} color={s === editValue ? theme.primary : theme.dim} bold={s === editValue}>
                  {s === editValue ? `[${s}]` : s}{' '}
                </Text>
              ))}
            </Box>
          )}
        </Box>
      ))}

      <Box marginTop={1} borderStyle="single" borderColor={theme.dim} paddingX={1}>
        <Text dimColor>
          {editing
            ? 'Enter: Save · Esc: Cancel'
            : `j/k: Navigate · Enter/Space: Edit/Toggle · s: Save · Esc/q: Back`}
        </Text>
      </Box>
    </Box>
  );
};
