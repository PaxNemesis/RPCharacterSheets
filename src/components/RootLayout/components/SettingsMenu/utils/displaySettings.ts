import {
  DEFAULT_DISPLAY_SETTINGS,
  DISPLAY_SETTINGS_KEY,
  SCALE_OPTIONS,
  THEME_OPTIONS,
  type DisplaySettings,
} from '../SettingsMenu.constants';

/** The saved settings, with anything missing, unknown or unreadable replaced by the default. */
export function readDisplaySettings(): DisplaySettings {
  let saved: Record<string, unknown> = {};
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(DISPLAY_SETTINGS_KEY) ?? '{}');
    if (parsed && typeof parsed === 'object') saved = parsed as Record<string, unknown>;
  } catch {
    // Storage blocked or the value isn't JSON: use the defaults.
  }
  const theme = THEME_OPTIONS.find((option) => option.value === saved.theme)?.value;
  const scale = SCALE_OPTIONS.find((option) => option.value === saved.scale)?.value;
  return {
    theme: theme ?? DEFAULT_DISPLAY_SETTINGS.theme,
    scale: scale ?? DEFAULT_DISPLAY_SETTINGS.scale,
  };
}

export function saveDisplaySettings(settings: DisplaySettings) {
  try {
    localStorage.setItem(DISPLAY_SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Storage blocked: the settings last until the page is closed.
  }
}

export const systemPrefersDark = () => window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;

/** Sets the resolved theme, light or dark, and the zoom on the page. */
export function applyDisplaySettings({ theme, scale }: DisplaySettings) {
  const dark = theme === 'dark' || (theme === 'auto' && systemPrefersDark());
  const root = document.documentElement;
  root.dataset.theme = dark ? 'dark' : 'light';
  root.style.setProperty('--ui-scale', String(scale));
}
