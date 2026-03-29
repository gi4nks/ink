import React from 'react';
import { Box, Text } from 'ink';
import { symbols } from '../symbols.js';
import type { Theme } from '../themes.js';

interface KeyHintItem {
  key: string;
  description: string;
}

interface KeyHintProps {
  hints: KeyHintItem[];
  theme: Theme;
  position?: string; // e.g. "5/120"
}

export const KeyHint: React.FC<KeyHintProps> = ({ hints, theme, position }) => (
  <Box flexDirection="row" justifyContent="space-between" width="100%" paddingX={1}>
    <Box>
      {hints.map((h, i) => (
        <React.Fragment key={h.key}>
          {i > 0 && <Text color={theme.dim}> {symbols.separator} </Text>}
          <Text color={theme.warning} bold>{h.key}</Text>
          <Text color={theme.dim}> {h.description}</Text>
        </React.Fragment>
      ))}
    </Box>
    {position && (
      <Text color={theme.primary} bold>{position}</Text>
    )}
  </Box>
);
