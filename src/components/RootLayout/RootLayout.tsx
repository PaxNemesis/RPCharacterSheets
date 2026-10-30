import { Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import './RootLayout.styles.css'

export function RootLayout() {
  return (
    <div className="root-layout-container">
      <nav className="root-layout-nav">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  )
}
