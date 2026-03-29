import React, { useState, useEffect } from 'react';
import { Text } from 'ink';
import { symbols } from '../symbols.js';
import type { Theme } from '../themes.js';

interface SpinnerProps {
  theme: Theme;
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ theme, label }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((f) => (f + 1) % symbols.spinner.length);
    }, symbols.spinnerInterval);
    return () => clearInterval(timer);
  }, []);

  return (
    <Text color={theme.primary}>
      {symbols.spinner[frame]}{label ? ` ${label}` : ''}
    </Text>
  );
};
