import type { ReactNode } from 'react'
import type { TabItem } from './Tabs.types'
import './Tabs.styles.css'

type TabsProps = {
  items: TabItem[]
  activeId: string
  onSelect: (id: string) => void
  /** Shows a close button on each tab when given. */
  onClose?: (id: string) => void
  label: string
  variant?: 'primary' | 'secondary'
  /** Content after the last tab, e.g. an add button. */
  trailing?: ReactNode
}

export function Tabs({ items, activeId, onSelect, onClose, label, variant = 'primary', trailing }: TabsProps) {
  return (
    <div className={`tabs-container tabs-${variant}`}>
      <div role="tablist" aria-label={label} className="tabs-list">
        {items.map((item) => (
          <div key={item.id} className={item.id === activeId ? 'tabs-tab tabs-tab-active' : 'tabs-tab'}>
            <button
              type="button"
              role="tab"
              aria-selected={item.id === activeId}
              className="tabs-select"
              onClick={() => onSelect(item.id)}
            >
              {item.label}
            </button>
            {onClose && (
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
        ))}
      </div>
      {trailing}
    </div>
  )
}
