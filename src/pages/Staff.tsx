import { useStore } from '../store'
import type { CityEvent, CmsState, ConciergePick, Special, VenueSlug } from '../types'
import { uid } from '../lib/cms'
import { defaultCms } from '../data'

export function Staff() {
  const { cms, setCms } = useStore()

  function patch(partial: Partial<CmsState>) {
    setCms({ ...cms, ...partial })
  }

  return (
    <section className="section">
      <p className="eyebrow">Operations</p>
      <h1 className="display" style={{ fontSize: 64 }}>Concierge dashboard</h1>
      <p className="muted" style={{ marginBottom: 32 }}>
        The guest site reads this desk. Change tonight without a developer.
      </p>
      <div className="staff-grid">
        <div className="panel">
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: 28 }}>Hyderabad now</h3>
          <label>
            Temperature
            <input
              className="field"
              type="number"
              value={cms.weather.temp}
              onChange={(e) => patch({ weather: { ...cms.weather, temp: Number(e.target.value) } })}
            />
          </label>
          <input
            className="field"
            value={cms.weather.condition}
            onChange={(e) => patch({ weather: { ...cms.weather, condition: e.target.value } })}
            placeholder="Condition"
          />
          <textarea
            className="field"
            rows={3}
            value={cms.traffic}
            onChange={(e) => patch({ traffic: e.target.value })}
            placeholder="Traffic"
          />
          <textarea
            className="field"
            rows={3}
            value={cms.notes}
            onChange={(e) => patch({ notes: e.target.value })}
            placeholder="Desk notes"
          />
        </div>
        <div className="panel">
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: 28 }}>Restaurant availability</h3>
          {(Object.keys(cms.availability) as VenueSlug[]).map((slug) => (
            <p key={slug} style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, textTransform: 'capitalize' }}>
              {slug.replace('-', ' ')}
              <select
                value={cms.availability[slug]}
                onChange={(e) =>
                  patch({ availability: { ...cms.availability, [slug]: e.target.value as CmsState['availability'][VenueSlug] } })
                }
              >
                <option value="open">Open</option>
                <option value="limited">Limited</option>
                <option value="full">Full</option>
              </select>
            </p>
          ))}
        </div>
        <div className="panel">
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: 28 }}>Today’s events</h3>
          {cms.events.map((e) => (
            <div key={e.id} style={{ borderBottom: '1px solid var(--line)', padding: '12px 0' }}>
              <input
                className="field"
                value={e.title}
                onChange={(ev) => patch({ events: cms.events.map((x) => (x.id === e.id ? { ...x, title: ev.target.value } : x)) })}
              />
              <button className="chip" type="button" onClick={() => patch({ events: cms.events.filter((x) => x.id !== e.id) })}>
                Remove
              </button>
            </div>
          ))}
          <button
            className="btn ghost"
            type="button"
            style={{ marginTop: 12 }}
            onClick={() =>
              patch({
                events: [
                  ...cms.events,
                  {
                    id: uid(),
                    title: 'New city note',
                    category: 'culture',
                    time: '20:00',
                    venue: 'To be confirmed',
                    description: 'Added from the desk.',
                    editorial: 'Why we would send a guest.',
                    featured: false,
                  } satisfies CityEvent,
                ],
              })
            }
          >
            Add event
          </button>
        </div>
        <div className="panel">
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: 28 }}>Specials</h3>
          {cms.specials.map((s) => (
            <p key={s.id}>
              <strong>{s.title}</strong> — {s.detail}
            </p>
          ))}
          <button
            className="btn ghost"
            type="button"
            style={{ marginTop: 12 }}
            onClick={() =>
              patch({
                specials: [
                  ...cms.specials,
                  { id: uid(), venue: 'amara', kind: 'chef', title: 'Chef’s special', detail: 'Ask the captain.' } satisfies Special,
                ],
              })
            }
          >
            Add special
          </button>
        </div>
        <div className="panel">
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: 28 }}>This week’s five</h3>
          {cms.picks.map((p) => (
            <textarea
              key={p.id}
              className="field"
              rows={3}
              value={`${p.title}\n${p.why}`}
              onChange={(e) => {
                const [title, ...rest] = e.target.value.split('\n')
                patch({
                  picks: cms.picks.map((x) => (x.id === p.id ? ({ ...x, title, why: rest.join('\n') } satisfies ConciergePick) : x)),
                })
              }}
            />
          ))}
        </div>
        <div className="panel">
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: 28 }}>Guest requests</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Kind</th>
                <th>Detail</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cms.requests.map((r) => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>{r.kind}</td>
                  <td>{r.detail}</td>
                  <td>
                    <select
                      value={r.status}
                      onChange={(e) =>
                        patch({
                          requests: cms.requests.map((x) =>
                            x.id === r.id ? { ...x, status: e.target.value as typeof r.status } : x,
                          ),
                        })
                      }
                    >
                      <option value="new">New</option>
                      <option value="in-progress">In progress</option>
                      <option value="done">Done</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn ghost" type="button" style={{ marginTop: 16 }} onClick={() => setCms(defaultCms)}>
            Reset editorial content
          </button>
        </div>
      </div>
    </section>
  )
}
