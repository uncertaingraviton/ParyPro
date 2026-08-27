import { Link } from 'react-router-dom'

const codes = [
  { place: 'Guest room', line: 'Discover Hyderabad →', to: '/today' },
  { place: 'Restaurant', line: 'Explore Hyderabad’s recommendations →', to: '/explore' },
  { place: 'Bar', line: 'Find your next drink →', to: '/drink' },
  { place: 'Elevator', line: 'What’s happening in the city? →', to: '/explore' },
  { place: 'Pool', line: 'Discover your afternoon →', to: '/hotel' },
  { place: 'Lobby', line: 'Ask our digital concierge →', to: '/concierge' },
]

export function Qr() {
  return (
    <section className="section">
      <div className="section-head">
        <p className="eyebrow">In the house</p>
        <h2>QR-code ecosystem</h2>
        <p>Each code opens the relevant section — never a generic homepage.</p>
      </div>
      <div className="qr-grid">
        {codes.map((c) => (
          <Link key={c.place} to={c.to} className="qr-card">
            <p className="eyebrow">{c.place}</p>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: 28, marginTop: 12 }}>{c.line}</h3>
          </Link>
        ))}
      </div>
    </section>
  )
}
