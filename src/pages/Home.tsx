import { Link } from 'react-router-dom'
import { cravings } from '../data'
import { longDate } from '../lib/time'
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
  const featured = cms.events.filter((e) => e.featured).slice(0, 4)

  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <p className="kicker">Welcome to Hyderabad</p>
          <h1 className="display">The city is yours.</h1>
          <p className="lede">Your city. Your hotel. Your evening.</p>
          <div className="meta-row">
            <span>{cms.weather.temp}°</span>
            <span>Hyderabad</span>
            <span>{longDate()}</span>
          </div>
        </div>
      </section>

      <section className="section">
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

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <p className="eyebrow">Craving</p>
          <h2>What are you craving?</h2>
        </div>
        <div className="chip-row" style={{ justifyContent: 'center' }}>
          {cravings.map((c) => (
            <Link key={c.id} className="chip" to={`/dine/cravings?mood=${c.id}`}>
              {c.hint} {c.label}
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

      <section className="section">
        <div className="section-head">
          <p className="eyebrow">Curated by Trident</p>
          <h2>The Concierge’s Picks</h2>
          <p>This week’s five — and why we recommend them.</p>
        </div>
        <div className="pick-list">
          {cms.picks.map((p) => (
            <article key={p.id} className="pick-item">
              <p className="eyebrow">0{p.rank} · {p.category}</p>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: 36, margin: '8px 0' }}>{p.title}</h3>
              <p>{p.place}</p>
              <p className="quote">{p.why}</p>
            </article>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 40, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link className="btn" to="/evening">
            Build my evening
          </Link>
          <Link className="btn ghost" to="/today">
            Today’s dashboard
          </Link>
        </div>
      </section>
    </>
  )
}
