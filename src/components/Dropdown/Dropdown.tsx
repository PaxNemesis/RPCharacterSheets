import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Icon, type IconName } from '@/components/Icon';
import { usePanelPosition } from './hooks/usePanelPosition';
import './Dropdown.styles.css';

type DropdownProps = {
  /** Shown before the label; leave out for a text-only button. */
  icon?: IconName;
  /** Shown beside the icon on wide screens, and the button's name for screen readers unless `title` is given. */
  label: string;
  /** The button's tooltip and accessible name, when it should say more than the label. */
  title?: string;
  /** Show only the icon, at every width. */
  iconOnly?: boolean;
  /** Styles the button to suit where it sits, such as the top bar. */
  buttonClassName?: string;
  /**
   * The panel's content, given a function that closes it. For the menu look, give links and buttons in it
   * the `dropdown-item` class (plus `dropdown-item-danger` for something destructive), group titles the
   * `dropdown-heading` class, and lines between groups the `dropdown-divider` class.
   */
  children: (close: () => void) => ReactNode;
};

/** A button that opens a panel below it. Closes on a click outside or on Escape. */
export function Dropdown({ icon, label, title = label, iconOnly = false, buttonClassName, children }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelStyle = usePanelPosition(open, buttonRef, panelRef);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="dropdown-container">
      <button
        ref={buttonRef}
        type="button"
        className={['dropdown-button', buttonClassName].filter(Boolean).join(' ')}
        aria-label={title}
        title={title}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
      >
        {icon && <Icon name={icon} />}
        {!iconOnly && <span className="dropdown-label">{label}</span>}
        {!iconOnly && <Icon name={open ? 'expand_less' : 'expand_more'} className="dropdown-caret" />}
      </button>
      {open && (
        <div ref={panelRef} id={panelId} className="dropdown-panel" style={panelStyle}>
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}
