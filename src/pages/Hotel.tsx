import { Link } from 'react-router-dom'
import { services } from '../data'
import { isOpen } from '../lib/time'
import { uid } from '../lib/cms'
import { useStore } from '../store'
import { useState } from 'react'

const images: Record<string, string> = {
  fitness:
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
  pool: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
  spa: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
}

export function Hotel() {
  const { cms, prefs, setCms } = useStore()
  const [done, setDone] = useState<string | null>(null)

  function request(label: string) {
    setCms({
      ...cms,
      requests: [
        {
          id: uid(),
          createdAt: new Date().toISOString(),
          kind: 'room',
          name: `${prefs.title} ${prefs.name}`,
          detail: label,
          status: 'new',
        },
        ...cms.requests,
      ],
    })
    setDone(label)
  }

  return (
    <section className="section">
      <div className="section-head">
        <p className="eyebrow">Inside Trident</p>
        <h2>The house, conversationally</h2>
        <p>323 rooms and suites in HITEC City. Ask as you would at the desk.</p>
      </div>
      {done && (
        <p className="quote" style={{ textAlign: 'center', marginBottom: 24 }}>
          Noted: {done}. The desk has the request.
        </p>
      )}
      <div className="service-grid">
        {services.map((s) => (
          <article key={s.slug} className="service-card">
            {images[s.slug] && <img src={images[s.slug]} alt="" style={{ height: 160, margin: '-28px -28px 20px' }} />}
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: 28 }}>{s.prompt}</h3>
            <p style={{ margin: '12px 0' }}>{s.detail}</p>
            <p className="muted">
              {s.location}
              {s.slug === 'fitness' && isOpen(0, 24) ? ' · Open now' : ` · ${s.hours}`}
            </p>
            <button className="btn ghost" type="button" style={{ marginTop: 16 }} onClick={() => request(s.prompt)}>
              {s.cta}
            </button>
          </article>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <Link className="btn" to="/today">
          Open today’s dashboard
        </Link>
      </div>
    </section>
  )
}
