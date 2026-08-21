import { Link } from 'react-router-dom'
import { greeting, longDate } from '../lib/time'
import { useStore } from '../store'

export function Today() {
  const { cms, prefs } = useStore()
  const hour = new Date().getHours()
  const word = greeting(hour)

  const day = [
    { time: '07:00', title: 'Breakfast at Amara', note: 'Or in bed. The kitchen will not mind.' },
    { time: '10:00', title: 'Meetings', note: 'HITEC City is at the door. The business centre is awake.' },
    { time: '13:00', title: 'Lunch', note: cms.availability.kanak !== 'full' ? 'Kanak, if you want the city at the table.' : 'Amara — Kanak is full at lunch.' },
    { time: '18:30', title: 'Sunset', note: 'The 10th-floor pool, or Necklace Road if you have a car.' },
    { time: '20:30', title: 'Dinner', note: prefs.cuisines.includes('Italian') ? 'Tuscany is the more romantic room tonight.' : 'Kanak. Nizami, and close.' },
    { time: '22:30', title: 'Cocktails', note: 'Ninety Six, until you say otherwise.' },
  ]

  return (
    <section className="today-hero">
      <p className="eyebrow">{longDate()}</p>
      <h1>
        {word}, {prefs.title} {prefs.name}
      </h1>
      <p className="muted" style={{ margin: '12px 0 36px', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
        Hyderabad · {cms.weather.temp}°C · {cms.weather.condition}
      </p>
      <div className="day-grid">
        <div className="panel">
          <p className="eyebrow">Your day</p>
          <div className="timeline">
            {day.map((d) => (
              <div className="timeline-item" key={d.time}>
                <div className="time">{d.time}</div>
                <div>
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: 28 }}>{d.title}</h3>
                  <p className="muted">{d.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <aside className="panel">
          <p className="eyebrow">Something you might enjoy</p>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: 32, margin: '12px 0' }}>
            Tonight’s Hyderabad recommendations have been curated for you.
          </h3>
          <p>{cms.notes}</p>
          <p style={{ marginTop: 16 }}>{cms.traffic}</p>
          <Link className="btn" to="/tonight" style={{ marginTop: 24 }}>
            Open tonight
          </Link>
        </aside>
      </div>
    </section>
  )
}
