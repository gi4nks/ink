import React from 'react';
import { Box, Text } from 'ink';
import type { Theme } from '../themes.js';
import { layout } from '../layout.js';

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

export const AppHeader: React.FC<AppHeaderProps> = ({
  appName,
  version,
  theme,
  cwd,
  leftExtra,
  rightContent,
  subLines,
  message,
}) => (
  <Box flexDirection="column" width="100%" backgroundColor={theme.bg}>
    {/* Main title row */}
    <Box
      flexDirection="row"
      width="100%"
      justifyContent="space-between"
      paddingX={layout.paddingX}
    >
      <Box>
        <Text color={theme.primary} bold>{appName}</Text>
        <Text dimColor> v{version}</Text>
        {cwd !== undefined && (
          <>
            <Text color={theme.dim}> in</Text>
            <Text color={theme.accent}> {cwd}</Text>
          </>
        )}
        {leftExtra}
      </Box>
      {rightContent && <Box>{rightContent}</Box>}
    </Box>

    {/* Optional sub-lines */}
    {subLines?.map((line, i) => (
      <Box key={i} width="100%" paddingX={layout.paddingX}>
        {line}
      </Box>
    ))}

    {/* Optional message row */}
    {message && (
      <Box paddingX={layout.paddingX}>
        <Text color={theme.accent}>{message}</Text>
      </Box>
    )}
  </Box>
);
