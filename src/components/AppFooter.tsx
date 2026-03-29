import React from 'react';
import { Box, Text, useStdout } from 'ink';
import type { Theme } from '../themes.js';
import { symbols } from '../symbols.js';
import { layout } from '../layout.js';

export interface HintItem {
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

function hintWidth(h: HintEntry): number {
  return h === '|' ? 3 : h.key.length + 1 + h.description.length + 2;
}

export const AppFooter: React.FC<AppFooterProps> = ({
  theme,
  hints,
  position,
  toast,
  topRow,
  statusContent,
}) => {
  const { stdout } = useStdout();
  const available = (stdout?.columns ?? 80) - layout.paddingX * 2;

  // Fit hints into available width
  let used = 0;
  const visible: HintEntry[] = [];
  for (const hint of hints) {
    const w = hintWidth(hint);
    if (used + w > available) break;
    visible.push(hint);
    used += w;
  }
  // Strip trailing separator
  while (visible.length > 0 && visible[visible.length - 1] === '|') visible.pop();

  return (
    <Box flexDirection="column" width="100%" backgroundColor={theme.bg}>
      {topRow && (
        <Box paddingX={layout.paddingX}>
          {topRow}
        </Box>
      )}
      <Box
        flexDirection="row"
        width="100%"
        justifyContent="space-between"
        paddingX={layout.paddingX}
      >
        {/* Hints */}
        <Box flexShrink={1}>
          <Text wrap="truncate">
            {visible.map((hint, i) =>
              hint === '|'
                ? <Text key={i} dimColor> {symbols.separator} </Text>
                : (
                  <Text key={i}>
                    <Text color={theme.warning} bold>{hint.key}</Text>
                    <Text dimColor>{' '}{hint.description}{'  '}</Text>
                  </Text>
                )
            )}
          </Text>
        </Box>

        {/* Right side */}
        <Box marginLeft={1} flexShrink={0} flexDirection="row">
          {toast && (
            <Box marginRight={2}>
              <Text color={theme.success}>[{toast}]</Text>
            </Box>
          )}
          {statusContent}
          {position !== undefined && (
            <Text color={theme.primary} bold={position !== '0/0'} dimColor={position === '0/0'}>
              {position}
            </Text>
          )}
        </Box>
      </Box>
    </Box>
  );
};
