import { Link, useMatchRoute } from '@tanstack/react-router';
import { Icon } from '@/components/Icon';
import { SHEET_LINKS } from '../RootLayout.constants';
import { Dropdown } from './Dropdown';

/** The character sheet pages. The button shows the sheet that's open, if any. */
export function SheetsMenu() {
  const matchRoute = useMatchRoute();
  const current = SHEET_LINKS.find((link) => matchRoute({ to: link.to, fuzzy: true }));

  return (
    <Dropdown
      icon={current?.icon ?? 'description'}
      label={current?.label ?? 'Sheets'}
      title={current ? `Sheets: ${current.label}` : 'Sheets'}
    >
      {(close) => (
        <ul className="root-layout-link-list">
          {SHEET_LINKS.map((link) => (
            <li key={link.to}>
              <Link to={link.to} onClick={close}>
                <Icon name={link.icon} />
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Dropdown>
  );
}
