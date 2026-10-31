import { Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import './RootLayout.styles.css'

export function RootLayout() {
  return (
    <div className="root-layout-container">
      <nav className="root-layout-nav">
        <Link to="/" className="root-layout-brand">
          RPCharacterSheets
        </Link>
        <Link to="/iron-kingdoms-fmf">Iron Kingdoms</Link>
        <Link to="/fabula-ultima">Fabula Ultima</Link>
        <Link to="/about">About</Link>
      </nav>
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  )
}
