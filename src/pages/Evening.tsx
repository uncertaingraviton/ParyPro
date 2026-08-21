import { useState, type ReactNode } from 'react'
import { buildEvening } from '../lib/evening'
import { uid } from '../lib/cms'
import { useStore } from '../store'
import type { EveningBudget, EveningDistance, EveningKind, EveningMood } from '../types'

const kinds: EveningKind[] = ['romantic', 'business', 'friends', 'solo', 'family']
const moods: EveningMood[] = ['relaxed', 'sophisticated', 'lively', 'adventurous']
const distances: EveningDistance[] = ['hotel', 'nearby', 'anywhere']
const budgets: EveningBudget[] = ['₹', '₹₹', '₹₹₹', 'open']

export function Evening() {
  const { cms, prefs, setCms } = useStore()
  const [kind, setKind] = useState<EveningKind>('romantic')
  const [mood, setMood] = useState<EveningMood>('sophisticated')
  const [distance, setDistance] = useState<EveningDistance>('hotel')
  const [budget, setBudget] = useState<EveningBudget>('₹₹₹')
  const [built, setBuilt] = useState(false)
  const [booked, setBooked] = useState(false)
  const plan = built ? buildEvening({ kind, mood, distance, budget }) : null

  return (
    <section className="section narrow">
      <p className="eyebrow">The killer feature</p>
      <h1 className="display" style={{ fontSize: 72 }}>Build my evening</h1>
      <p className="muted" style={{ marginBottom: 32 }}>Four questions. Then a night, not a list.</p>

      <Field label="What kind of evening?">
        {kinds.map((k) => (
          <button key={k} className={`chip ${kind === k ? 'active' : ''}`} type="button" onClick={() => setKind(k)}>
            {k}
          </button>
        ))}
      </Field>
      <Field label="What’s your mood?">
        {moods.map((k) => (
          <button key={k} className={`chip ${mood === k ? 'active' : ''}`} type="button" onClick={() => setMood(k)}>
            {k}
          </button>
        ))}
      </Field>
      <Field label="How far?">
        {distances.map((k) => (
          <button key={k} className={`chip ${distance === k ? 'active' : ''}`} type="button" onClick={() => setDistance(k)}>
            {k}
          </button>
        ))}
      </Field>
      <Field label="Budget?">
        {budgets.map((k) => (
          <button key={k} className={`chip ${budget === k ? 'active' : ''}`} type="button" onClick={() => setBudget(k)}>
            {k === 'open' ? "Don't worry about it" : k}
          </button>
        ))}
      </Field>

      <button className="btn" type="button" onClick={() => setBuilt(true)}>
        Compose the evening
      </button>

      {plan && (
        <div className="form-card" style={{ marginTop: 36 }}>
          <p className="eyebrow">Your evening</p>
          <div className="timeline">
            {plan.stops.map((s) => (
              <div className="timeline-item" key={s.time}>
                <div className="time">{s.time}</div>
                <div>
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: 28 }}>{s.title}</h3>
                  <p>{s.place}</p>
                  <p className="muted">{s.note}</p>
                </div>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 16 }}>
            Travel time: {plan.travel}. Estimated spend: {plan.spend}.
          </p>
          {booked ? (
            <p className="quote">The desk is holding the evening. We will confirm each table in turn.</p>
          ) : (
            <button
              className="btn"
              type="button"
              style={{ marginTop: 20 }}
              onClick={() => {
                setCms({
                  ...cms,
                  requests: [
                    {
                      id: uid(),
                      createdAt: new Date().toISOString(),
                      kind: 'evening',
                      name: `${prefs.title} ${prefs.name}`,
                      detail: `${kind} / ${mood} / ${distance} / ${budget}`,
                      status: 'new',
                    },
                    ...cms.requests,
                  ],
                })
                setBooked(true)
              }}
            >
              Book my evening
            </button>
          )}
        </div>
      )}
    </section>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <p style={{ marginBottom: 12 }}>{label}</p>
      <div className="chip-row">{children}</div>
    </div>
  )
}
