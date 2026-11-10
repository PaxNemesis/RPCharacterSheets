import { Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { NavMenu } from './components';
import { NAV_LINKS } from './RootLayout.constants';
import './RootLayout.styles.css';

// Production is GitHub Pages; anything served from this machine, `pnpm dev` or `pnpm preview`, is local.
const isLocal = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);

export function RootLayout() {
  return (
    <div className="root-layout-container">
      <nav className="root-layout-nav">
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
        {/* Wide screens show the links; narrow ones put them in a menu. */}
        <div className="root-layout-links">
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
        </div>
        <div className="root-layout-menu">
          <NavMenu />
        </div>
      </nav>
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  );
}
