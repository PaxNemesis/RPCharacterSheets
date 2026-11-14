import { Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Icon } from '@/components/Icon';
import { SettingsMenu, SheetsMenu } from './components';
import './RootLayout.styles.css';

// Production is GitHub Pages; anything served from this machine, `pnpm dev` or `pnpm preview`, is local.
const isLocal = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);

export function RootLayout() {
  return (
    <div className="root-layout-container">
      <nav className="root-layout-nav" aria-label="Main">
        <div className="root-layout-home">
          <Link to="/" className="root-layout-brand">
            RPCharacterSheets
          </Link>
          {isLocal && (
            <span className="root-layout-env" title="Running locally, not the published site">
              localhost
            </span>
          )}
        </div>
        <SheetsMenu />
        <Link to="/about" className="root-layout-bar-item" aria-label="About" title="About">
          <Icon name="info" />
          <span className="root-layout-bar-label">About</span>
        </Link>
        <SettingsMenu />
      </nav>
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  );
}
