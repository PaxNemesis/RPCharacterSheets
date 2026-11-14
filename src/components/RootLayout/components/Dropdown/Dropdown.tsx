import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Icon, type IconName } from '@/components/Icon';
import './Dropdown.styles.css';

type DropdownProps = {
  icon: IconName;
  /** Shown beside the icon on wide screens, and the button's name for screen readers unless `title` is given. */
  label: string;
  /** The button's tooltip and accessible name, when it should say more than the label. */
  title?: string;
  /** Show only the icon, at every width. */
  iconOnly?: boolean;
  /** The panel's content, given a function that closes it, for links that navigate away. */
  children: (close: () => void) => ReactNode;
};

/** A top bar button that opens a panel below it. Closes on a click outside or on Escape. */
export function Dropdown({ icon, label, title = label, iconOnly = false, children }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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
        className="root-layout-bar-item"
        aria-label={title}
        title={title}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
      >
        <Icon name={icon} />
        {!iconOnly && <span className="root-layout-bar-label">{label}</span>}
        {!iconOnly && <Icon name={open ? 'expand_less' : 'expand_more'} className="dropdown-caret" />}
      </button>
      {open && (
        <div id={panelId} className="dropdown-panel">
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}
