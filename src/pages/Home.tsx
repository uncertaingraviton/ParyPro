import { useState, type MouseEvent } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import type { LayoutOutlet } from '../components/Layout'
import { menuSnippets, venues } from '../data'
import { isOpen } from '../lib/time'
import { useStore } from '../store'

const moods = [
  { to: '/dine', label: 'Dine', icon: '🍽', img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=70' },
  { to: '/drink', label: 'Drink', icon: '🍸', img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=900&q=70' },
  { to: '/explore', label: 'Experience', icon: '🎵', img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=70' },
  { to: '/explore', label: 'Explore', icon: '🏙', img: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=900&q=70' },
  { to: '/explore?group=shopping', label: 'Shop', icon: '🛍', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=70' },
  { to: '/tonight', label: 'Tonight', icon: '🌙', img: 'https://images.unsplash.com/photo-1514565131-fce0801d3f73?auto=format&fit=crop&w=900&q=70' },
]

export function Home() {
  const { cms } = useStore()
  const { openAsk } = useOutletContext<LayoutOutlet>()
  const featured = cms.events.filter((e) => e.featured).slice(0, 4)
  const hotelSpecial = cms.specials[0]
  const nextSpecial = cms.specials[1]
  const hotelVenue = venues.find((v) => v.slug === hotelSpecial?.venue) ?? venues.find((v) => v.slug === 'kanak')
  const menuLines = hotelVenue ? menuSnippets[hotelVenue.slug] : menuSnippets.kanak
  const cityNow = featured[0] ?? cms.events[0]
  const cityNext = featured[1] ?? cms.events[1]
  const [menuCursor, setMenuCursor] = useState<{ x: number; y: number } | null>(null)
  const snippet = menuLines.slice(0, 3)

  function moveMenuCursor(e: MouseEvent<HTMLAnchorElement>) {
    setMenuCursor({
      x: e.clientX + 14,
      y: e.clientY + 14,
    })
  }

  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div className="now-grid">
            <Link
              to={hotelVenue ? `/dine/${hotelVenue.slug}` : '/dine'}
              className={`now-card now-card-hotel${menuCursor ? ' is-tracking' : ''}`}
              onMouseMove={moveMenuCursor}
              onMouseLeave={() => setMenuCursor(null)}
            >
              <p className="now-kicker">Inside the hotel</p>
              {hotelSpecial ? (
                <>
                  <div className="now-card-body">
                    <h2>{hotelSpecial.title}</h2>
                    <p>{hotelSpecial.detail}</p>
                    {hotelVenue && (
                      <p className="now-meta">
                        {hotelVenue.name}
                        {isOpen(hotelVenue.openFrom, hotelVenue.openTo, hotelVenue.overnight)
                          ? ' · Open now'
                          : ` · ${hotelVenue.hours}`}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="now-card-body">
                    <h2>A quiet house</h2>
                    <p>No specials on the board. Amara, Kanak, Tuscany and Ninety Six are as usual.</p>
                  </div>
                </>
              )}
            </Link>
            <Link to="/tonight" className="now-card">
              <p className="now-kicker">Nearby in the city</p>
              {cityNow ? (
                <>
                  <div className="now-card-body">
                    <h2>{cityNow.title}</h2>
                    <p>{cityNow.editorial || cityNow.description}</p>
                    <p className="now-meta">
                      {cityNow.time} · {cityNow.venue}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="now-card-body">
                    <h2>Nothing we would send you to</h2>
                    <p>The better evening may be under this roof. Ask the desk if you would like us to look again.</p>
                  </div>
                </>
              )}
            </Link>
          </div>
          <button className="hero-ask" type="button" onClick={openAsk}>
            Ask the Concierge
          </button>
        </div>
      </section>

      <section className="section mood-section">
        <div className="section-head">
          <p className="eyebrow">01 — Begin</p>
          <h2>What are you in the mood for?</h2>
          <p>Not restaurants, rooms and facilities. A night.</p>
        </div>
        <div className="mood-grid">
          {moods.map((m) => (
            <Link key={m.label} to={m.to} className="mood-card" style={{ backgroundImage: `url(${m.img})` }}>
              <span>{m.icon}</span>
              <strong>{m.label}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="section dark" style={{ maxWidth: 'none' }}>
        <div className="section-head">
          <p className="eyebrow">Hyderabad Now</p>
          <h2>What’s happening today</h2>
          <p>Editorial, not scraped. Updated by the desk.</p>
        </div>
        <div className="event-grid" style={{ maxWidth: 1280, margin: '0 auto' }}>
          {featured.map((e) => (
            <article key={e.id} className="event-card" style={{ background: '#2a2219', color: '#faf6f0' }}>
              <p className="eyebrow">{e.time}</p>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: 32, margin: '10px 0' }}>{e.title}</h3>
              <p className="muted">{e.venue}</p>
              <p style={{ marginTop: 12 }}>{e.editorial}</p>
            </article>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 36 }}>
          <Link className="btn gold" to="/tonight">
            Tonight in Hyderabad
          </Link>
        </div>
      </section>
      {menuCursor && (
        <aside
          className="menu-cursor"
          aria-hidden="true"
          style={{ left: menuCursor.x, top: menuCursor.y }}
        >
          <p>Menu · {hotelVenue?.name}</p>
          <ul>
            {snippet.map((line) => (
              <li key={line.name}>
                <strong>{line.name}</strong>
                <span>{line.note}</span>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </>
  )
}
