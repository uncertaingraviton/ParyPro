import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { AskDrawer } from './AskDrawer'
import { StampClip } from './StampClip'

const links = [
  { to: '/', label: 'Home' },
  { to: '/dine', label: 'Dine' },
  { to: '/drink', label: 'Drink' },
  { to: '/explore', label: 'Explore' },
  { to: '/tonight', label: 'Tonight' },
]

export type LayoutOutlet = {
  openAsk: () => void
}

export function Layout() {
  const [ask, setAsk] = useState(false)
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
            <img className="brand-trident" src="/trident-letters.svg" alt="Trident" />
            <small>Food &amp; Beverage Concierge</small>
          </NavLink>
        </div>
      </header>
      <Outlet context={{ openAsk: () => setAsk(true) } satisfies LayoutOutlet} />
      <footer className="footer">
        <span>Trident Hyderabad · HITEC City</span>
        <span>Your guide to the hotel, the table and the city.</span>
        <span>
          <NavLink to="/hotel">Hotel</NavLink>
          {' · '}
          <NavLink to="/qr">QR</NavLink>
          {' · '}
          <NavLink to="/staff">Staff</NavLink>
        </span>
      </footer>
      <nav className="mobile-nav">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.to === '/'}>
            {l.label}
          </NavLink>
        ))}
      </nav>
      {!isHome && (
        <button className="ask-fab" type="button" onClick={() => setAsk(true)}>
          Ask the Concierge
        </button>
      )}
      <AskDrawer open={ask} onClose={() => setAsk(false)} />
    </div>
  )
}
