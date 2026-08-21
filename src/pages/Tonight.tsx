import { Link } from 'react-router-dom'
import { eventFilters } from '../data'
import { useStore } from '../store'
import { useState } from 'react'
import type { CityEvent } from '../types'

export function Tonight() {
  const { cms } = useStore()
  const [filter, setFilter] = useState<CityEvent['category'] | 'all'>('all')
  const events = cms.events.filter((e) => filter === 'all' || e.category === filter)

  return (
    <>
      <header className="page-hero">
        <p className="eyebrow">Signature</p>
        <h1>Tonight in Hyderabad</h1>
        <p className="muted">Curated for you. Not a search bar.</p>
      </header>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="timeline">
          <div className="timeline-item">
            <div className="time">19:30</div>
            <div>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: 32 }}>Dinner at Kanak</h3>
              <p>Nizami-inspired cuisine</p>
              <p className="muted">5 min from your room · Tables {cms.availability.kanak}</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="time">21:00</div>
            <div>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: 32 }}>Cocktails at Ninety Six</h3>
              <p>Signature cocktails & late-evening atmosphere</p>
              <p className="muted">Open until 4:00 a.m.</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="time">22:30</div>
            <div>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: 32 }}>Hyderabad After Dark</h3>
              <p>Our concierge’s selection of what’s happening tonight.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="section dark" style={{ maxWidth: 'none' }}>
        <div className="section-head">
          <p className="eyebrow">Hyderabad Now</p>
          <h2>What’s trending</h2>
        </div>
        <div className="chip-row" style={{ justifyContent: 'center', marginBottom: 28 }}>
          {eventFilters.map((f) => (
            <button
              key={f.id}
              className={`chip ${filter === f.id ? 'active' : ''}`}
              type="button"
              onClick={() => setFilter(f.id)}
              style={filter === f.id ? { background: '#faf6f0', color: '#16110c' } : { color: '#faf6f0', borderColor: 'rgba(250,246,240,0.2)' }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="event-grid" style={{ maxWidth: 1280, margin: '0 auto' }}>
          {events.length === 0 && <p>Nothing in that register tonight. Ask the desk; we may have something unpublished.</p>}
          {events.map((e) => (
            <article key={e.id} className="event-card" style={{ background: '#2a2219' }}>
              <p className="eyebrow">{e.category.replace('-', ' ')} · {e.time}</p>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: 30, margin: '10px 0' }}>{e.title}</h3>
              <p>{e.description}</p>
              <p className="quote" style={{ fontSize: 18 }}>{e.editorial}</p>
            </article>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 36 }}>
          <Link className="btn gold" to="/evening">
            Build my evening
          </Link>
        </div>
      </section>
    </>
  )
}
