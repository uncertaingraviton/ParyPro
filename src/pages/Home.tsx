import { useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import type { LayoutOutlet } from '../components/Layout'
import { venues } from '../data'
import moodDine from '../assets/place-biryani.jpg'
import moodDrink from '../assets/place-chai.jpg'
import moodExperience from '../assets/place-golconda.jpg'
import moodExplore from '../assets/place-charminar.jpg'
import moodShop from '../assets/place-laad.jpg'
import { useLiveFeeds } from '../lib/feed'
import { sendReservationEmail } from '../lib/reservations'
import { isOpen } from '../lib/time'
import { useStore } from '../store'

const moods = [
  { to: '/dine', label: 'Dine', icon: '🍽', img: moodDine },
  { to: '/drink', label: 'Drink', icon: '🍵', img: moodDrink },
  { to: '/explore', label: 'Experience', icon: '🏰', img: moodExperience },
  { to: '/explore', label: 'Explore', icon: '🕌', img: moodExplore },
  { to: '/explore?group=shopping', label: 'Shop', icon: '🛍', img: moodShop },
]

type NowModal = {
  kicker: string
  title: string
  body: string
  meta: string
  ctaTo: string
  ctaLabel: string
  external?: boolean
  reservation?: {
    venue: string
    startDate: string
    endDate?: string
    timeLabel?: string
  }
}

const MEAL_SLOTS: Record<string, string[]> = {
  Breakfast: ['07:00', '08:00', '09:00'],
  Brunch: ['12:00', '12:30', '13:30'],
  Lunch: ['12:30', '13:30', '14:30'],
  'High Tea': ['16:00', '16:30', '17:30'],
  'Afternoon Tea': ['16:00', '16:30', '17:30'],
  Dinner: ['19:00', '19:30', '20:30'],
}

function slotsFor(timeLabel?: string): string[] {
  if (timeLabel && MEAL_SLOTS[timeLabel]) return MEAL_SLOTS[timeLabel]
  if (timeLabel && /\d/.test(timeLabel)) return [timeLabel]
  return ['12:30', '13:30', '19:00', '19:30', '20:30']
}

export function Home() {
  const { cms, setCms } = useStore()
  const { openAsk } = useOutletContext<LayoutOutlet>()
  const { hotelPromo, cityEvents } = useLiveFeeds()
  const [nowModal, setNowModal] = useState<NowModal | null>(null)
  const [resv, setResv] = useState<{ date: string; time: string; guests: string } | null>(null)
  const [resvDone, setResvDone] = useState(false)
  const featured = cms.events.filter((e) => e.featured).slice(0, 4)
  const hotelSpecial = cms.specials[0]
  const hotelVenue = venues.find((v) => v.slug === hotelSpecial?.venue) ?? venues.find((v) => v.slug === 'kanak')
  // Live scraped data wins; fall back to desk-curated defaults.
  const liveCity = cityEvents?.[0]
  const cityNow = liveCity ?? featured[0] ?? cms.events[0]

  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div className="now-grid">
            <Link
              to={hotelVenue ? `/dine/${hotelVenue.slug}` : '/dine'}
              className="now-card now-card-hotel"
              onClick={(e) => {
                e.preventDefault()
                setResv(null)
                setResvDone(false)
                setNowModal(
                  hotelPromo
                    ? {
                        kicker: 'Inside the hotel',
                        title: hotelPromo.title,
                        body: hotelPromo.story || hotelPromo.detail,
                        meta: [
                          hotelPromo.when,
                          hotelPromo.postedAt &&
                            new Date(hotelPromo.postedAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                            }),
                        ]
                        .filter(Boolean)
                        .join(' · '),
                        ctaTo: hotelPromo.url,
                        ctaLabel: 'See the post on Instagram',
                        external: true,
                        reservation: hotelPromo.startDate
                          ? {
                              venue: hotelPromo.venueName ?? 'Trident Hyderabad',
                              startDate: hotelPromo.startDate,
                              endDate: hotelPromo.endDate,
                              timeLabel: hotelPromo.timeLabel,
                            }
                          : undefined,
                      }
                    : {
                        kicker: 'Inside the hotel',
                        title: hotelSpecial?.title ?? 'A quiet house',
                        body:
                          hotelSpecial?.detail ??
                          'No specials on the board. Amara, Kanak, Tuscany and Ninety Six are as usual.',
                        meta: hotelVenue?.hours ?? '',
                        ctaTo: hotelVenue ? `/dine/${hotelVenue.slug}` : '/dine',
                        ctaLabel: hotelVenue ? `Explore ${hotelVenue.name}` : 'Explore dining',
                      },
                )
              }}
            >
              <p className="now-kicker">Inside the hotel</p>
              {hotelPromo ? (
                <div className="now-card-body">
                  <h2>{hotelPromo.title}</h2>
                  <p>{hotelPromo.detail}</p>
                  <p className="now-meta">
                    {hotelPromo.when && `${hotelPromo.when} · `}
                    From @tridenthyderabad
                    {hotelPromo.postedAt &&
                      ` · ${new Date(hotelPromo.postedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}`}
                  </p>
                </div>
              ) : hotelSpecial ? (
                <>
                  <div className="now-card-body">
                    <h2>{hotelSpecial.title}</h2>
                    <p>{hotelSpecial.detail}</p>
                    {hotelVenue && (
                      <p className="now-meta">
                        {hotelVenue.name}
                        {isOpen(hotelVenue.openFrom, hotelVenue.openTo, hotelVenue.overnight)
                          ? ' · Open now'
                          : ` · ${hotelVenue.hours}`}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="now-card-body">
                    <h2>A quiet house</h2>
                    <p>No specials on the board. Amara, Kanak, Tuscany and Ninety Six are as usual.</p>
                  </div>
                </>
              )}
            </Link>
            <Link
              to={liveCity ? cityNow.url || '/tonight' : '/tonight'}
              className="now-card"
              onClick={(e) => {
                e.preventDefault()
                setNowModal({
                  kicker: 'Nearby in the city',
                  title: cityNow.title,
                  body: cityNow.editorial || cityNow.description,
                  meta: [cityNow.time, cityNow.venue].filter(Boolean).join(' · '),
                  ctaTo: cityNow.url || '/tonight',
                  ctaLabel: cityNow.url ? 'Book on BookMyShow' : 'Tonight in Hyderabad',
                  external: Boolean(cityNow.url),
                })
              }}
            >
              <p className="now-kicker">Nearby in the city</p>
              {cityNow ? (
                <>
                  <div className="now-card-body">
                    <h2>{cityNow.title}</h2>
                    <p>{cityNow.editorial || cityNow.description}</p>
                    <p className="now-meta">
                      {cityNow.time} · {cityNow.venue}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="now-card-body">
                    <h2>Nothing we would send you to</h2>
                    <p>The better evening may be under this roof. Ask the desk if you would like us to look again.</p>
                  </div>
                </>
              )}
            </Link>
          </div>
          <button className="hero-ask" type="button" onClick={openAsk}>
            Ask the Concierge
          </button>
        </div>
      </section>

      <section className="section mood-section">
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

      <section className="section dark" style={{ maxWidth: 'none' }}>
        <div className="section-head">
          <p className="eyebrow">Hyderabad Now</p>
          <h2>What’s happening today</h2>
          <p>Live updates from our outlets and the city.</p>
        </div>
        <div className="event-grid" style={{ maxWidth: 1280, margin: '0 auto' }}>
          {hotelPromo ? (
            hotelPromo.url ? (
              <a
                href={hotelPromo.url}
                target="_blank"
                rel="noreferrer"
                className="event-card"
                style={{ background: '#2a2219', color: '#faf6f0' }}
                key="hotel-promo"
              >
                <p className="eyebrow">{hotelPromo.when || hotelPromo.timeLabel}</p>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: 32, margin: '10px 0' }}>
                  {hotelPromo.title}
                </h3>
                <p className="muted">{hotelPromo.venueName}</p>
                <p style={{ marginTop: 12 }}>{hotelPromo.detail}</p>
              </a>
            ) : (
              <Link to="/dine" className="event-card" style={{ background: '#2a2219', color: '#faf6f0' }} key="hotel-promo">
                <p className="eyebrow">{hotelPromo.when || hotelPromo.timeLabel}</p>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: 32, margin: '10px 0' }}>
                  {hotelPromo.title}
                </h3>
                <p className="muted">{hotelPromo.venueName}</p>
                <p style={{ marginTop: 12 }}>{hotelPromo.detail}</p>
              </Link>
            )
          ) : null}
          {cityEvents?.map((event) => (
            event.url ? (
              <a
                href={event.url}
                target="_blank"
                rel="noreferrer"
                className="event-card"
                style={{ background: '#2a2219', color: '#faf6f0' }}
                key={event.id}
              >
                <p className="eyebrow">{event.time}</p>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: 32, margin: '10px 0' }}>
                  {event.title}
                </h3>
                <p className="muted">{event.venue}</p>
                <p style={{ marginTop: 12 }}>{event.editorial || event.description}</p>
              </a>
            ) : (
              <Link to={event.url || '/tonight'} className="event-card" style={{ background: '#2a2219', color: '#faf6f0' }} key={event.id}>
                <p className="eyebrow">{event.time}</p>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: 32, margin: '10px 0' }}>
                  {event.title}
                </h3>
                <p className="muted">{event.venue}</p>
                <p style={{ marginTop: 12 }}>{event.editorial || event.description}</p>
              </Link>
            )
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 36 }}>
          <Link className="btn gold" to="/tonight">
            Tonight in Hyderabad
          </Link>
        </div>
      </section>
      {nowModal && (
        <div className="now-modal" role="dialog" aria-modal="true" onClick={() => setNowModal(null)}>
          <div className="now-modal-panel" onClick={(e) => e.stopPropagation()}>
            <p className="now-kicker">{nowModal.kicker}</p>
            <h3>{nowModal.title}</h3>
            <p className="now-modal-body">{nowModal.body}</p>
            {nowModal.meta && <p className="now-meta">{nowModal.meta}</p>}
            {nowModal.reservation && !resvDone && (
              <form
                className="resv-form"
                onSubmit={(e) => {
                  e.preventDefault()
                  const r = nowModal.reservation
                  if (!r) return
                  const date = resv?.date || r.startDate
                  const time = resv?.time || slotsFor(r.timeLabel)[0]
                  const guests = resv?.guests || '2'
                  setCms({
                    ...cms,
                    requests: [
                      {
                        id: `req-${Date.now()}`,
                        createdAt: new Date().toISOString(),
                        kind: 'reservation',
                        name: 'Guest — digital concierge',
                        detail: `Reservation request: ${nowModal.title} at ${r.venue} on ${date}, ${time}, ${guests} guest(s). Confirm by phone.`,
                        status: 'new',
                      },
                      ...cms.requests,
                    ],
                  })
                  // Email the reservation desk silently in the background -
                  // no mail client opens on the guest's device.
                  sendReservationEmail({
                    event: nowModal.title,
                    venue: r.venue,
                    date,
                    time,
                    guests,
                  })
                  setResvDone(true)
                }}
              >
                <p className="resv-title">Reserve at {nowModal.reservation.venue}</p>
                <div className="resv-row">
                  <label>
                    Date
                    <input
                      type="date"
                      required
                      value={resv?.date ?? nowModal.reservation.startDate}
                      min={nowModal.reservation.startDate}
                      max={nowModal.reservation.endDate ?? nowModal.reservation.startDate}
                      onChange={(e) =>
                        setResv({
                          date: e.target.value,
                          time: resv?.time ?? slotsFor(nowModal.reservation?.timeLabel)[0],
                          guests: resv?.guests ?? '',
                        })
                      }
                    />
                  </label>
                  <label>
                    Time
                    <select
                      value={resv?.time ?? slotsFor(nowModal.reservation.timeLabel)[0]}
                      onChange={(e) =>
                        setResv({
                          date: resv?.date ?? nowModal.reservation?.startDate ?? '',
                          time: e.target.value,
                          guests: resv?.guests ?? '',
                        })
                      }
                    >
                      {slotsFor(nowModal.reservation.timeLabel).map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Guests
                    <input
                      type="number"
                      inputMode="numeric"
                      required
                      min={1}
                      max={16}
                      placeholder="2"
                      value={resv?.guests ?? ''}
                      onChange={(e) =>
                        setResv({
                          date: resv?.date ?? nowModal.reservation?.startDate ?? '',
                          time: resv?.time ?? slotsFor(nowModal.reservation?.timeLabel)[0],
                          guests: e.target.value.replace(/\D/g, ''),
                        })
                      }
                    />
                  </label>
                </div>
                {nowModal.reservation.endDate && (
                  <p className="resv-note">
                    Runs {nowModal.reservation.startDate} to {nowModal.reservation.endDate} — pick your date.
                  </p>
                )}
                <div className="now-modal-actions">
                  <button className="btn gold" type="submit">
                    Request reservation
                  </button>
                  {nowModal.external && (
                    <a className="btn ghost" href={nowModal.ctaTo} target="_blank" rel="noreferrer">
                      {nowModal.ctaLabel}
                    </a>
                  )}
                  <button className="btn ghost" type="button" onClick={() => setNowModal(null)}>
                    Close
                  </button>
                </div>
              </form>
            )}
            {(!nowModal.reservation || resvDone) && (
              <div className="now-modal-actions">
                {resvDone && <p className="resv-note">Noted — the desk will call to confirm your table.</p>}
                {nowModal.external ? (
                  <a className="btn gold" href={nowModal.ctaTo} target="_blank" rel="noreferrer">
                    {nowModal.ctaLabel}
                  </a>
                ) : (
                  <Link className="btn gold" to={nowModal.ctaTo}>
                    {nowModal.ctaLabel}
                  </Link>
                )}
                <button className="btn ghost" type="button" onClick={() => setNowModal(null)}>
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}