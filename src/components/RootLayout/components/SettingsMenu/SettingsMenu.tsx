import { Dropdown } from '@/components/Dropdown';
import { SegmentedControl } from './components';
import { useDisplaySettings } from './hooks/useDisplaySettings';
import { SCALE_OPTIONS, THEME_OPTIONS } from './SettingsMenu.constants';
import './SettingsMenu.styles.css';

/** Display settings for the whole site: light or dark theme, and text size. */
export function SettingsMenu() {
  const { theme, setTheme, scale, setScale } = useDisplaySettings();

  return (
    <Dropdown icon="settings" label="Settings" iconOnly buttonClassName="root-layout-bar-item">
      {() => (
        <div className="settings-menu-container">
          <SegmentedControl label="Theme" options={THEME_OPTIONS} value={theme} onChange={setTheme} />
          <SegmentedControl label="Text size" options={SCALE_OPTIONS} value={scale} onChange={setScale} />
        </div>
      )}
    </Dropdown>
  );
}
