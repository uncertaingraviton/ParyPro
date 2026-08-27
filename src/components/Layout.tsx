import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { StampClip } from './StampClip'

const links = [
  { to: '/', label: 'Home' },
  { to: '/dine', label: 'Dine' },
  { to: '/drink', label: 'Drink' },
  { to: '/explore', label: 'Explore' },
]

// Pages used to expose an `openAsk` callback so they could pop the concierge
// drawer. The "Ask the Concierge" button was removed site-wide, so no page
// uses this anymore; the type is kept for source-compatibility with any
// stale `useOutletContext` calls.
export type LayoutOutlet = {
  openAsk: () => void
}

export function Layout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div className={`site${isHome ? ' is-home' : ''}`}>
      <StampClip />
      <header className="topbar">
        <div className="topbar-inner">
          <nav className="nav">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <NavLink to="/" className="brand">
            <img className="brand-trident" src={`${import.meta.env.BASE_URL}trident-letters.svg`} alt="Trident" />
            <small>Food &amp; Beverage Concierge</small>
          </NavLink>
        </div>
      </header>
      <Outlet />
      <footer className="footer">
        <span>Trident Hyderabad · HITEC City</span>
        <span>Your guide to the hotel, the table and the city.</span>
        <span>© Trident Hotels</span>
      </footer>
      <nav className="mobile-nav">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.to === '/'}>
            {l.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
