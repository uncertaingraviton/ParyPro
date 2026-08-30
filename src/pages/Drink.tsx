import { Link } from 'react-router-dom'
import { venues, nearbyVenues } from '../data'
import { useStore } from '../store'

const drinks = [
  { title: 'Cocktails', text: 'Signatures that change with the season. Begin at Ninety Six.', to: '/dine/ninety-six' },
  { title: 'Whisky', text: 'A serious list, or a bottle sent upstairs.', to: '/dine/ninety-six' },
  { title: 'Wine', text: 'The cellar lives at Tuscany. Pairings at Kanak, if you prefer spice with structure.', to: '/dine/tuscany' },
  { title: 'Beer', text: 'Quietly excellent, never the point — unless you want it to be.', to: '/dine/ninety-six' },
  { title: 'Coffee', text: 'Conversation at Amara, or a pot in the room.', to: '/dine/amara' },
  { title: 'Non-alcoholic', text: 'As considered as the rest of the bar. Ask; do not settle for an afterthought.', to: '/dine/ninety-six' },
]

const nightlifeVenues = nearbyVenues.filter((v) => ['monastery', 'babylon', 'air-live'].includes(v.slug))

export function Drink() {
  const { cms } = useStore()
  const bar = venues.find((v) => v.slug === 'ninety-six')!
  const happy = cms.specials.filter((s) => s.kind === 'happy-hour' || s.kind === 'bar')

  return (
    <>
      <article className="split">
        <img src={bar.image} alt="" />
        <div className="copy">
          <p className="eyebrow">02 — Drink</p>
          <h1 style={{ fontSize: 'clamp(52px, 7vw, 92px)' }}>After dark</h1>
          <p style={{ margin: '16px 0' }}>{bar.description}</p>
          <p className="status">{bar.hours} · {cms.availability['ninety-six']} seating</p>
          {happy.map((h) => (
            <p key={h.id} className="quote">
              {h.title}. {h.detail}
            </p>
          ))}
          <Link className="btn" to="/dine/ninety-six" style={{ marginTop: 24, width: 'fit-content' }}>
            Ninety Six
          </Link>
        </div>
      </article>
      <section className="section">
        <div className="service-grid">
          {drinks.map((d) => (
            <Link key={d.title} to={d.to} className="service-card">
              <p className="eyebrow">The list</p>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: 36, margin: '8px 0' }}>{d.title}</h3>
              <p>{d.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section" style={{ background: 'var(--warm)', paddingTop: 48 }}>
        <div className="section-head">
          <p className="eyebrow">Beyond the hotel</p>
          <h2>Hyderabad after dark</h2>
          <p>For guests heading into the city for a livelier evening. We can arrange a car.</p>
        </div>
        <div className="venue-grid">
          {nightlifeVenues.map((v) => (
            <div key={v.slug} className="venue-card">
              <img src={v.image} alt={v.name} />
              <div className="copy">
                <p className="eyebrow">{v.kicker} · {v.area}</p>
                <h3>{v.name}</h3>
                <p>{v.tagline}</p>
                <p style={{ marginTop: 8 }}>{v.description}</p>
                <p className="quote" style={{ marginTop: 12 }}>“{v.note}”</p>
                <div style={{ marginTop: 16 }}>
                  <a href={v.zomatoUrl} target="_blank" rel="noreferrer" className="btn ghost" style={{ fontSize: 14, padding: '8px 16px' }}>
                    Book on Zomato →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="muted" style={{ marginTop: 24, textAlign: 'center' }}>
          The concierge can arrange transport or make reservations. Dial 0 from your room.
        </p>
      </section>
    </>
  )
}
