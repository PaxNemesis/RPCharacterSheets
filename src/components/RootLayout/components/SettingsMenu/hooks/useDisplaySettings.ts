import { useEffect, useState } from 'react';
import type { DisplaySettings, Theme } from '../SettingsMenu.constants';
import { applyDisplaySettings, readDisplaySettings, saveDisplaySettings } from '../utils/displaySettings';

/** The theme and text size, saved to the browser and applied to the page. Auto follows the system live. */
export function useDisplaySettings() {
  const [settings, setSettings] = useState<DisplaySettings>(readDisplaySettings);

  useEffect(() => {
    applyDisplaySettings(settings);
    saveDisplaySettings(settings);
    if (settings.theme !== 'auto' || !window.matchMedia) return;
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyDisplaySettings(settings);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [settings]);

  return {
    ...settings,
    setTheme: (theme: Theme) => setSettings((current) => ({ ...current, theme })),
    setScale: (scale: number) => setSettings((current) => ({ ...current, scale })),
  };
}
