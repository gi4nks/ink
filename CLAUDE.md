# CLAUDE.md

Instructions for Claude Code when working in this repository.

## Package Overview

`@gi4nks/ink` is a shared design system for gi4nks CLI tools built with React + Ink (terminal UI framework). It provides themes, unicode symbols, layout constants, AI provider utilities, and reusable TUI components to ensure visual consistency across `@gi4nks/ph`, `@gi4nks/lens`, and `@gi4nks/tecla`.

## Architecture

```
src/
├── index.ts                    # Public API — all exports go through here
├── themes.ts                   # Theme interface (8 roles) + 5 presets
├── symbols.ts                  # All unicode symbols as named constants
├── layout.ts                   # Spacing/padding constants
├── ai.ts                       # AIProvider types, model catalog, fetchOllamaModels()
├── config.ts                   # Gi4nksConfig interface + ~/.config/gi4nks/ path helpers
└── components/
    ├── SectionHeader.tsx       # ── Title ── divider
    ├── Spinner.tsx             # Animated braille spinner
    ├── KeyHint.tsx             # Footer keybindings bar
    ├── AIProviderSelector.tsx  # Provider/model/apikey/ollamaUrl selector
    └── ConfigView.tsx          # Generic config view with AI selector + theme switcher
```

## Development Commands

```bash
npm run dev    # tsup --watch (rebuild on change)
npm run build  # production build → dist/ (CJS + ESM + .d.ts)
npm run lint   # eslint
npm test       # vitest --passWithNoTests
```

## Release Process

Releases are fully automated via `semantic-release` on push to `main`:

| Commit | Effect |
|--------|--------|
| `feat: ...` | minor release (1.x.0) |
| `fix: ...` | patch release (1.0.x) |
| `BREAKING CHANGE:` in footer | major release (x.0.0) |
| `chore:`, `docs:`, `refactor:` | no release |

The workflow (`.github/workflows/release.yml`) runs: lint → test → build → semantic-release → publishes to GitHub Packages.

## Key Conventions

- **ESM throughout**: use `.js` extensions on all imports, even in `.ts` source (e.g. `import { foo } from './bar.js'`)
- **peerDependencies**: `react` and `ink` are NOT bundled — consuming apps provide them
- **Theming**: every component receives `theme: Theme` as a prop — never hardcode color strings
- **Symbols**: always use the `symbols` object for unicode characters — never write `'❯'` or `'●'` inline
- **Layout**: use `layout` constants for padding/margin — never hardcode numeric values directly
- **No `as any` casts**: the Theme type has all 8 roles typed as `string`, Ink accepts `string` for color props

## Adding New Components

1. Create `src/components/MyComponent.tsx`
2. Accept `theme: Theme` as a required prop
3. Use `symbols` for any unicode characters
4. Use `layout` constants for spacing
5. Export from `src/index.ts`

```tsx
// src/components/MyComponent.tsx
import React from 'react';
import { Box, Text } from 'ink';
import type { Theme } from '../themes.js';
import { symbols } from '../symbols.js';
import { layout } from '../layout.js';

interface MyComponentProps {
  title: string;
  theme: Theme;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, theme }) => (
  <Box paddingX={layout.paddingX}>
    <Text color={theme.primary}>{symbols.cursor} {title}</Text>
  </Box>
);
```

Then in `src/index.ts`:
```ts
export { MyComponent } from './components/MyComponent.js';
```

## Adding New Themes

In `src/themes.ts`, add an entry to `THEMES`. All 8 roles are required:

```ts
export const THEMES: Record<string, Theme> = {
  // ...existing themes...
  mytheme: {
    name: 'My Theme',
    primary:   'cyan',
    secondary: 'magenta',
    accent:    'blue',
    success:   'green',
    warning:   'yellow',
    error:     'red',
    dim:       'gray',
    bg:        '#1a1a2e',
  },
};
```

`ThemeName` and `THEME_NAMES` update automatically.
