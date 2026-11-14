import type { ReactNode } from 'react';
import { Dropdown } from '@/components/Dropdown';
import type { TabItem } from '../Tabs.types';

type TabProps = {
  item: TabItem;
  active: boolean;
  onSelect: (id: string) => void;
  onClose?: (id: string) => void;
  renderMenu?: (item: TabItem, close: () => void) => ReactNode;
};

/** One tab: its label, and its menu or close button. */
export function Tab({ item, active, onSelect, onClose, renderMenu }: TabProps) {
  return (
    <div className={active ? 'tabs-tab tabs-tab-active' : 'tabs-tab'}>
      <button type="button" role="tab" aria-selected={active} className="tabs-select" onClick={() => onSelect(item.id)}>
        {item.label}
      </button>
      {renderMenu && (
        <Dropdown icon="expand_more" label={`Options for ${item.label}`} iconOnly buttonClassName="tabs-menu">
          {(close) => renderMenu(item, close)}
        </Dropdown>
      )}
      {onClose && !renderMenu && (
        <button
          type="button"
          className="tabs-close"
          aria-label={`Close ${item.label}`}
          title="Close"
          onClick={() => onClose(item.id)}
        >
          ×
        </button>
      )}
    </div>
  );
}
