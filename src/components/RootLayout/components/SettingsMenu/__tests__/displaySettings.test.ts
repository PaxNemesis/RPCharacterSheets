import { describe, expect, it, vi } from 'vitest';
import { DISPLAY_SETTINGS_KEY } from '../SettingsMenu.constants';
import { applyDisplaySettings, readDisplaySettings, saveDisplaySettings } from '../utils/displaySettings';

describe('readDisplaySettings', () => {
  it('uses the defaults when nothing is saved', () => {
    expect(readDisplaySettings()).toEqual({ theme: 'auto', scale: 1 });
  });

  it('reads back what was saved', () => {
    saveDisplaySettings({ theme: 'dark', scale: 1.15 });
    expect(readDisplaySettings()).toEqual({ theme: 'dark', scale: 1.15 });
  });

  it('replaces unknown or broken values with the defaults', () => {
    localStorage.setItem(DISPLAY_SETTINGS_KEY, JSON.stringify({ theme: 'neon', scale: 40 }));
    expect(readDisplaySettings()).toEqual({ theme: 'auto', scale: 1 });
    localStorage.setItem(DISPLAY_SETTINGS_KEY, 'not json');
    expect(readDisplaySettings()).toEqual({ theme: 'auto', scale: 1 });
  });
});

describe('applyDisplaySettings', () => {
  const root = document.documentElement;

  it('sets the chosen theme and the zoom', () => {
    applyDisplaySettings({ theme: 'dark', scale: 1.3 });
    expect(root.dataset.theme).toBe('dark');
    expect(root.style.getPropertyValue('--ui-scale')).toBe('1.3');
  });

  it('follows the system on auto', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('dark') }));
    applyDisplaySettings({ theme: 'auto', scale: 1 });
    expect(root.dataset.theme).toBe('dark');
    vi.unstubAllGlobals();
    applyDisplaySettings({ theme: 'auto', scale: 1 });
    expect(root.dataset.theme).toBe('light');
  });
});
