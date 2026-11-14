import { useRef, type ReactNode } from 'react';
import { Dropdown } from '@/components/Dropdown';
import { Tab } from './components';
import { useTabOverflow } from './hooks/useTabOverflow';
import type { TabItem } from './Tabs.types';
import './Tabs.styles.css';

type TabsProps = {
  items: TabItem[];
  activeId: string;
  onSelect: (id: string) => void;
  /** Shows a close button on each tab when given. */
  onClose?: (id: string) => void;
  /** Shows a menu button on each tab instead, with this content, given a function that closes the menu. */
  renderMenu?: (item: TabItem, close: () => void) => ReactNode;
  label: string;
  variant?: 'primary' | 'secondary';
  /** Content after the last tab, e.g. an add button. */
  trailing?: ReactNode;
};

/** A row of tabs. Tabs that don't fit go in a More menu at the end; the active tab always stays in the row. */
export function Tabs({
  items,
  activeId,
  onSelect,
  onClose,
  renderMenu,
  label,
  variant = 'primary',
  trailing,
}: TabsProps) {
  const row = useRef<HTMLDivElement>(null);
  const measure = useRef<HTMLDivElement>(null);
  const trailingRef = useRef<HTMLDivElement>(null);
  const activeIndex = items.findIndex((item) => item.id === activeId);
  const shown = useTabOverflow({ row, measure, trailing: trailingRef }, items.length, activeIndex);
  const hidden = items.filter((_, index) => !shown.has(index));
  const tabProps = { onSelect, onClose, renderMenu };

  return (
    <div className={`tabs-container tabs-${variant}`}>
      <div ref={row} className="tabs-row">
        <div role="tablist" aria-label={label} className="tabs-list">
          {items.map(
            (item, index) =>
              shown.has(index) && <Tab key={item.id} item={item} active={item.id === activeId} {...tabProps} />,
          )}
        </div>
        {hidden.length > 0 && (
          <Dropdown label={`${hidden.length} more`} title={`More ${label.toLowerCase()}`} buttonClassName="tabs-more">
            {(close) => (
              <ul>
                {hidden.map((item) => (
                  <li key={item.id}>
                    <button type="button" className="dropdown-item" onClick={() => (close(), onSelect(item.id))}>
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Dropdown>
        )}
        {trailing && (
          <div ref={trailingRef} className="tabs-trailing">
            {trailing}
          </div>
        )}
      </div>
      {/* Every tab and a More button, laid out but invisible, to measure what fits. */}
      <div ref={measure} className="tabs-list tabs-measure" aria-hidden="true" inert>
        {items.map((item) => (
          <Tab key={item.id} item={item} active={item.id === activeId} {...tabProps} />
        ))}
        <Dropdown label={`${items.length} more`} buttonClassName="tabs-more">
          {() => null}
        </Dropdown>
      </div>
    </div>
  );
}
