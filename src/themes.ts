export interface Theme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  dim: string;
  bg: string;
}

export const THEMES: Record<string, Theme> = {
  dark: { name: 'Dark Classic', primary: 'cyan', secondary: 'magenta', accent: 'blue', success: 'green', warning: 'yellow', error: 'red', dim: 'gray', bg: '#444444' },
  sunset: { name: 'Sunset', primary: 'orange', secondary: 'magenta', accent: 'yellow', success: 'green', warning: 'red', error: 'red', dim: 'gray', bg: '#3d2b2b' },
  ocean: { name: 'Deep Ocean', primary: 'blue', secondary: 'cyan', accent: 'white', success: 'green', warning: 'yellow', error: 'red', dim: 'gray', bg: '#1a2b3c' },
  forest: { name: 'Forest', primary: 'green', secondary: 'yellow', accent: 'white', success: 'cyan', warning: 'yellow', error: 'red', dim: 'gray', bg: '#1b2b1b' },
  mono: { name: 'Monochrome', primary: 'white', secondary: 'white', accent: 'gray', success: 'white', warning: 'white', error: 'white', dim: 'gray', bg: '#333333' },
};

export const THEME_NAMES = Object.keys(THEMES);
export type ThemeName = keyof typeof THEMES;
