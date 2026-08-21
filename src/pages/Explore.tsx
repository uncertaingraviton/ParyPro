import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { exploreGroups, places } from '../data'
import type { CityPlace } from '../types'

export function Explore() {
  const [params, setParams] = useSearchParams()
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
          <article key={p.id} className="place-card">
            <img src={p.image} alt="" />
            <div className="copy">
              <p className="eyebrow">{p.area} · {p.minutes} min</p>
              <h3>{p.name}</h3>
              <p>{p.why}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
