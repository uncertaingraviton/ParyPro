import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { exploreGroups, places } from '../data'
import type { CityPlace } from '../types'

export function Explore() {
  const [params, setParams] = useSearchParams()
  const [active, setActive] = useState<CityPlace | null>(null)
  const group = params.get('group') || 'old-city'
  const list = useMemo(
    () => places.filter((p) => p.category === (group as CityPlace['category'])),
    [group],
  )

  return (
    <section className="section">
      <div className="section-head">
        <p className="eyebrow">Discover</p>
        <h2>Explore Hyderabad</h2>
        <p>Experiences, not a map. The concierge’s city, not the internet’s.</p>
      </div>
      <div className="chip-row" style={{ justifyContent: 'center', marginBottom: 36 }}>
        {exploreGroups.map((g) => (
          <button
            key={g.id}
            className={`chip ${g.id === group ? 'active' : ''}`}
            type="button"
            onClick={() => setParams({ group: g.id })}
          >
            {g.title}
          </button>
        ))}
      </div>
      <p className="muted" style={{ textAlign: 'center', marginBottom: 28 }}>
        {exploreGroups.find((g) => g.id === group)?.subtitle}
      </p>
      <div className="place-grid">
        {(list.length ? list : places).map((p) => (
          <article
            key={p.id}
            className="place-card"
            role="button"
            tabIndex={0}
            onClick={() => setActive(p)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setActive(p)
            }}
          >
            <img src={p.image} alt={p.name} loading="lazy" />
            <div className="copy">
              <p className="eyebrow">{p.area} · {p.minutes} min</p>
              <h3>{p.name}</h3>
              <p>{p.why}</p>
              <p className="quote">Tap for the story & how to get there →</p>
            </div>
          </article>
        ))}
      </div>

      {active && (
        <div className="now-modal" role="dialog" aria-modal="true" onClick={() => setActive(null)}>
          <div className="now-modal-panel place-modal" onClick={(e) => e.stopPropagation()}>
            <img className="place-modal-img" src={active.image} alt={active.name} />
            <p className="eyebrow">{active.area} · {active.minutes} min from the hotel</p>
            <h3>{active.name}</h3>
            <p className="now-modal-body">{active.why}</p>
            <p className="resv-title">Getting there from Trident</p>
            <p className="now-modal-body">{active.directions}</p>
            <iframe
              className="place-map"
              title={`Map of ${active.name}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent(active.mapQuery)}&output=embed`}
            />
            <div className="now-modal-actions">
              <a
                className="btn gold"
                target="_blank"
                rel="noreferrer"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(active.mapQuery)}`}
              >
                Open in Google Maps
              </a>
              <button className="btn ghost" type="button" onClick={() => setActive(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}