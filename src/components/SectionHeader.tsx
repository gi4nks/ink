import React from 'react';
import { Text } from 'ink';
import type { Theme } from '../themes.js';

interface SectionHeaderProps {
  title: string;
  theme: Theme;
  count?: number;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, theme, count }) => (
  <Text color={theme.primary} bold>
    {'── '}{title}{count !== undefined ? ` (${count})` : ''}{' ──'}
  </Text>
);
