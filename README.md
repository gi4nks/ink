# @gi4nks/ink

Shared Ink/React design system for gi4nks CLI tools.

Provides standardized themes, unicode symbols, layout constants, and React components for building consistent Terminal User Interfaces (TUI) with [Ink](https://github.com/vadimdemedes/ink).

## Installation

This package is hosted on **GitHub Packages**. Configure `.npmrc` in your project root:

```
@gi4nks:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

Then install:

```bash
npm install @gi4nks/ink
```

## Usage

### Themes

```tsx
import { THEMES } from '@gi4nks/ink';
import type { Theme, ThemeName } from '@gi4nks/ink';

const theme = THEMES['dark'];   // Theme object
const name: ThemeName = 'ocean'; // 'dark' | 'sunset' | 'ocean' | 'forest' | 'mono'
```

Every component accepts a `theme: Theme` prop — never hardcode colors.

### Symbols

```tsx
import { symbols } from '@gi4nks/ink';

// symbols.cursor      → '❯'
// symbols.selected    → '●'
// symbols.checkmark   → '✓'
// symbols.cross       → '✗'
// symbols.ai          → '✦'
// symbols.spinner     → ['⠋','⠙','⠹', ...]
// symbols.separator   → '│'
```

### SectionHeader

```tsx
import { SectionHeader, THEMES } from '@gi4nks/ink';

<SectionHeader title="STATUS" theme={THEMES.dark} />
// renders: ── STATUS ──

<SectionHeader title="ERRORS" theme={THEMES.dark} count={3} />
// renders: ── ERRORS (3) ──
```

### Spinner

```tsx
import { Spinner, THEMES } from '@gi4nks/ink';

<Spinner theme={THEMES.dark} label="Loading..." />
```

### KeyHint

```tsx
import { KeyHint, THEMES } from '@gi4nks/ink';

<KeyHint
  theme={THEMES.dark}
  hints={[
    { key: '↑↓', description: 'navigate' },
    { key: 'Enter', description: 'confirm' },
    { key: 'q', description: 'quit' },
  ]}
  position="5/120"
/>
// renders: ↑↓ navigate │ Enter confirm │ q quit          5/120
```

### ConfigView

Generic config view with built-in AI provider selector and theme switcher.

```tsx
import { ConfigView, THEMES } from '@gi4nks/ink';
import type { AIConfig, ThemeName } from '@gi4nks/ink';

<ConfigView
  appName="myapp"
  title="Configuration"
  fields={[
    { label: 'Max History', key: 'maxHistory', type: 'number' },
    { label: 'Auto Save',   key: 'autoSave',   type: 'boolean' },
    { label: 'Username',    key: 'username',    type: 'string' },
    { label: 'API Token',   key: 'token',       type: 'password' },
  ]}
  values={{ maxHistory: 100, autoSave: true, username: 'gi4nks', token: '' }}
  aiConfig={{ provider: 'Gemini', model: 'gemini-2.0-flash' }}
  theme={THEMES.dark}
  themeName="dark"
  isActive={true}
  onSave={(values, aiConfig, themeName) => { /* persist */ }}
  onCancel={() => { /* close */ }}
/>
```

### AIProviderSelector

```tsx
import { AIProviderSelector, THEMES } from '@gi4nks/ink';
import type { AIConfig } from '@gi4nks/ink';

<AIProviderSelector
  value={{ provider: 'Gemini', model: 'gemini-2.0-flash' }}
  onChange={(config: AIConfig) => { /* update state */ }}
  onSave={() => { /* close */ }}
  onCancel={() => { /* close */ }}
  theme={THEMES.dark}
  isActive={true}
/>
```

## Themes

| Key | Name | Primary | Secondary | Accent | Success | Warning | Error |
|-----|------|---------|-----------|--------|---------|---------|-------|
| `dark` | Dark Classic | cyan | magenta | blue | green | yellow | red |
| `sunset` | Sunset | orange | magenta | yellow | green | red | red |
| `ocean` | Deep Ocean | blue | cyan | white | green | yellow | red |
| `forest` | Forest | green | yellow | white | cyan | yellow | red |
| `mono` | Monochrome | white | white | gray | white | white | white |

All themes also define `dim` (gray) and `bg` (hex background color).

## AI Providers

| Provider | Icon | Color | Models |
|----------|------|-------|--------|
| Gemini | `◆` | blue | `gemini-2.5-pro`, `gemini-2.0-flash`, `gemini-1.5-pro` |
| OpenAI | `◎` | green | `gpt-4o`, `gpt-4o-mini`, `o3-mini` |
| Anthropic | `◇` | yellow | `claude-opus-4-6`, `claude-sonnet-4-6`, `claude-haiku-4-5` |
| Ollama | `○` | cyan | dynamic (fetched from local instance) |

## Release

Releases are automated via `semantic-release` on every push to `main`. Use [Conventional Commits](https://www.conventionalcommits.org/):

| Commit prefix | Release type |
|---------------|-------------|
| `feat:` | minor |
| `fix:`, `perf:` | patch |
| `BREAKING CHANGE:` in footer | major |
| `chore:`, `docs:`, `refactor:` | no release |

## Development

```bash
npm run dev    # build with watch mode (tsup --watch)
npm run build  # production build → dist/ (CJS + ESM + .d.ts)
npm run lint   # eslint
npm test       # vitest
```
