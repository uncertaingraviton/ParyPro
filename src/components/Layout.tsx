import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { AskDrawer } from './AskDrawer'

const links = [
  { to: '/', label: 'Home' },
  { to: '/dine', label: 'Dine' },
  { to: '/drink', label: 'Drink' },
  { to: '/explore', label: 'Explore' },
  { to: '/tonight', label: 'Tonight' },
  { to: '/concierge', label: 'Concierge' },
]

export function Layout() {
  const [ask, setAsk] = useState(false)

  return (
    <div className="site">
      <header className="topbar">
        <NavLink to="/" className="brand">
          <small>The Concierge</small>
          <strong>TRIDENT</strong>
        </NavLink>
        <nav className="nav">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
              {l.label}
            </NavLink>
          ))}
          <button className="ask-link" type="button" onClick={() => setAsk(true)}>
            Ask
          </button>
        </nav>
      </header>
      <Outlet />
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
        {links.slice(0, 5).map((l) => (
          <NavLink key={l.to} to={l.to} end={l.to === '/'}>
            {l.label}
          </NavLink>
        ))}
      </nav>
      <button className="ask-fab" type="button" onClick={() => setAsk(true)}>
        Ask the Concierge
      </button>
      <AskDrawer open={ask} onClose={() => setAsk(false)} />
    </div>
  )
}
