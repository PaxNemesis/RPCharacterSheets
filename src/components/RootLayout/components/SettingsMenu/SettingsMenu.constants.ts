import type { IconName } from '@/components/Icon';

/** The browser storage key. The script in index.html reads it too, to apply the settings before the first paint. */
export const DISPLAY_SETTINGS_KEY = 'rpcs-display-settings';

export type Theme = 'light' | 'auto' | 'dark';

export type DisplaySettings = {
  theme: Theme;
  /** How much the whole page is zoomed, 1 being normal. */
  scale: number;
};

export const DEFAULT_DISPLAY_SETTINGS: DisplaySettings = { theme: 'auto', scale: 1 };

export const THEME_OPTIONS: readonly { value: Theme; label: string; icon: IconName }[] = [
  { value: 'light', label: 'Light', icon: 'light_mode' },
  { value: 'auto', label: 'Auto', icon: 'brightness_auto' },
  { value: 'dark', label: 'Dark', icon: 'dark_mode' },
];

export const SCALE_OPTIONS: readonly { value: number; label: string }[] = [
  { value: 0.85, label: '85%' },
  { value: 1, label: '100%' },
  { value: 1.15, label: '115%' },
  { value: 1.3, label: '130%' },
];
