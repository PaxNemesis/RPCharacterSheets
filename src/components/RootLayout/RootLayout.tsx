import { Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import './RootLayout.styles.css'

// Production is GitHub Pages; anything served from this machine, `pnpm dev` or `pnpm preview`, is local.
const isLocal = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname)

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
        <Link to="/iron-kingdoms-fmf">Iron Kingdoms</Link>
        <Link to="/fabula-ultima">Fabula Ultima</Link>
        <Link to="/about">About</Link>
      </nav>
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  )
}
