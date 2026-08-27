import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { cravings, venues } from '../data'
import kanakMenu1 from '../assets/kanak-menu-1.png'
import kanakMenu2 from '../assets/kanak-menu-2.png'
import kanakMenu3 from '../assets/kanak-menu-3.png'
import kanakMenu4 from '../assets/kanak-menu-4.png'
import kanakMenu5 from '../assets/kanak-menu-5.png'
import kanakMenu6 from '../assets/kanak-menu-6.png'
import tuscanyMenu1 from '../assets/1.png'
import tuscanyMenu2 from '../assets/2.png'
import tuscanyMenu3 from '../assets/3.png'
import tuscanyMenu4 from '../assets/4.png'
import tuscanyMenu5 from '../assets/5.png'
import tuscanyMenu6 from '../assets/6.png'
import tuscanyMenu7 from '../assets/7.png'
import tuscanySetMenu from '../assets/set menu.png'
import amaraMenu1 from '../assets/A1.avif'
import amaraMenu2 from '../assets/A3.avif'
import amaraMenu3 from '../assets/A4.avif'
import amaraMenu4 from '../assets/A5.avif'
import amaraMenu5 from '../assets/A6.avif'
import amaraMenu6 from '../assets/A7.avif'
import amaraMenu7 from '../assets/A8.avif'
import amaraMenu8 from '../assets/A9.avif'
import amaraMenu9 from '../assets/A10.avif'
import amaraMenu10 from '../assets/A11.avif'

const kanakMenu = [kanakMenu1, kanakMenu2, kanakMenu3, kanakMenu4, kanakMenu5, kanakMenu6]
const tuscanyMenu = [
  tuscanyMenu1,
  tuscanyMenu2,
  tuscanyMenu3,
  tuscanyMenu4,
  tuscanyMenu5,
  tuscanyMenu6,
  tuscanyMenu7,
  tuscanySetMenu,
]
const amaraMenu = [
  amaraMenu1,
  amaraMenu2,
  amaraMenu3,
  amaraMenu4,
  amaraMenu5,
  amaraMenu6,
  amaraMenu7,
  amaraMenu8,
  amaraMenu9,
  amaraMenu10,
]
import { sendReservationEmail } from '../lib/reservations'
import { isOpen } from '../lib/time'
import { useStore } from '../store'
import type { Mood, VenueSlug } from '../types'

const diningVenues = venues.filter((v) => v.slug !== 'in-room')

/**
 * A paged restaurant menu - the same gallery + lightbox pattern used on
 * Kanak, now also serving Tuscany. The grid shows every page as a thumbnail
 * and a tap opens a full-size lightbox with previous / next / close
 * controls. Kept in this file so the venue page owns its menu state.
 */
function MenuSection({
  venueName,
  kicker,
  title,
  pages,
  altPrefix,
}: {
  venueName: string
  kicker: string
  title: string
  pages: string[]
  altPrefix: string
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  if (pages.length === 0) return null
  return (
    <section className="section">
      <p className="eyebrow">{kicker}</p>
      <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', margin: '8px 0 24px' }}>{title}</h2>
      <div className="menu-pages">
        {pages.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpenIndex(i)}
            aria-label={`Open ${venueName} menu page ${i + 1}`}
          >
            <img src={src} alt={`${altPrefix} menu, page ${i + 1}`} loading="lazy" />
          </button>
        ))}
      </div>
      <p className="muted" style={{ marginTop: 14 }}>
        Tap a page to read it full size.
      </p>
      {openIndex !== null && (
        <div
          className="now-modal"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpenIndex(null)}
        >
          <div className="menu-lightbox" onClick={(e) => e.stopPropagation()}>
            <img src={pages[openIndex]} alt={`${altPrefix} menu page ${openIndex + 1}`} />
            <div className="now-modal-actions">
              <button
                className="btn ghost"
                type="button"
                disabled={openIndex === 0}
                onClick={() => setOpenIndex(openIndex - 1)}
              >
                ← Previous
              </button>
              <span className="muted" style={{ alignSelf: 'center' }}>
                Page {openIndex + 1} of {pages.length}
              </span>
              <button
                className="btn ghost"
                type="button"
                disabled={openIndex === pages.length - 1}
                onClick={() => setOpenIndex(openIndex + 1)}
              >
                Next →
              </button>
              <button className="btn" type="button" onClick={() => setOpenIndex(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export function Dine() {
  return (
    <>
      <header className="page-hero">
        <p className="eyebrow">01 — Dine</p>
        <h1>Dine at Trident</h1>
        <p className="muted">Four rooms. One kitchen culture. The heart of the house.</p>
      </header>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="venue-grid">
          {diningVenues.map((v) => (
            <Link key={v.slug} to={`/dine/${v.slug}`} className="venue-card">
              <img src={v.image} alt="" />
              <div className="copy">
                <p className="eyebrow">{v.kicker}</p>
                <h3>{v.name}</h3>
                <p>{v.tagline}</p>
                <p className="quote">“{v.quote}”</p>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ marginTop: 40, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link className="btn" to="/dine/cravings">
            What are you craving?
          </Link>
          <Link className="btn ghost" to="/dine/reserve">
            Reservations
          </Link>
        </div>
      </section>
    </>
  )
}

export function Venue() {
  const { slug } = useParams()
  const { cms } = useStore()
  const venue = venues.find((v) => v.slug === slug)
  if (!venue) return <p className="section">That room does not exist.</p>
  const specials = cms.specials.filter((s) => s.venue === venue.slug)
  const open = isOpen(venue.openFrom, venue.openTo, venue.overnight)
  const avail = cms.availability[venue.slug as VenueSlug]

  return (
    <>
      <article className="split">
        <img src={venue.image} alt={venue.name} />
        <div className="copy">
          <p className="eyebrow">{venue.kicker}</p>
          <h1 style={{ fontSize: 'clamp(48px, 6vw, 80px)' }}>{venue.name}</h1>
          <p className="status">
            {open ? 'Open now' : 'Opening later'} · Tables {avail} · {venue.floor}
          </p>
          <p style={{ margin: '20px 0' }}>{venue.description}</p>
          <p>{venue.hours}</p>
          <p className="quote">“{venue.quote}”</p>
          {specials.map((s) => (
            <p key={s.id} style={{ marginTop: 16 }}>
              <strong>{s.title}.</strong> {s.detail}
            </p>
          ))}
          <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {venue.walkIn ? (
              <p className="walk-in">
                We do not take table reservations at {venue.name}. We request you to please walk in.
              </p>
            ) : venue.reservation ? (
              <Link className="btn" to={`/dine/reserve?venue=${venue.slug}`}>
                Reserve a table
              </Link>
            ) : null}
          </div>
        </div>
      </article>

      {venue.slug === 'kanak' && (
        <MenuSection
          venueName={venue.name}
          kicker={`${venue.name} · À la carte`}
          title="The menu"
          pages={kanakMenu}
          altPrefix="Kanak à la carte"
        />
      )}

      {venue.slug === 'tuscany' && (
        <MenuSection
          venueName={venue.name}
          kicker={`${venue.name} · À la carte`}
          title="The menu"
          pages={tuscanyMenu}
          altPrefix="Tuscany à la carte"
        />
      )}

      {venue.slug === 'amara' && (
        <MenuSection
          venueName={venue.name}
          kicker={`${venue.name} · À la carte`}
          title="The menu"
          pages={amaraMenu}
          altPrefix="Amara à la carte"
        />
      )}
    </>
  )
}

export function Cravings() {
  const [params] = useSearchParams()
  const mood = (params.get('mood') || 'indian') as Mood
  const matches = venues.filter((v) => v.moods.includes(mood))
  return (
    <section className="section">
      <p className="eyebrow">The kitchen, by mood</p>
      <h1 className="display" style={{ fontSize: 72, margin: '8px 0 24px' }}>
        What are you craving?
      </h1>
      <div className="chip-row" style={{ marginBottom: 36 }}>
        {cravings.map((c) => (
          <Link key={c.id} className={`chip ${c.id === mood ? 'active' : ''}`} to={`/dine/cravings?mood=${c.id}`}>
            {c.hint} {c.label}
          </Link>
        ))}
      </div>
      <div className="venue-grid">
        {matches.map((v) => (
          <Link key={v.slug} to={`/dine/${v.slug}`} className="venue-card">
            <img src={v.image} alt="" />
            <div className="copy">
              <p className="eyebrow">May we suggest</p>
              <h3>{v.name}</h3>
              <p>{v.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function Reserve() {
  const [params] = useSearchParams()
  const { cms, prefs, setCms } = useStore()
  const [venue, setVenue] = useState(params.get('venue') || 'kanak')
  const [sent, setSent] = useState(false)
  const [name, setName] = useState(`${prefs.title} ${prefs.name}`)
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [time, setTime] = useState('19:30')
  const [guests, setGuests] = useState('2')

  return (
    <section className="section narrow">
      <p className="eyebrow">The table</p>
      <h1 className="display" style={{ fontSize: 64 }}>Reservations</h1>
      <p className="muted" style={{ margin: '12px 0 32px' }}>
        For more than eight guests, or for tonight, the desk will telephone you. Otherwise, leave the evening with us.
      </p>
      {sent ? (
        <div className="form-card">
          <p className="quote">The request is with the restaurant. We will confirm shortly.</p>
        </div>
      ) : (
        <form
          className="form-card"
          onSubmit={(e) => {
            e.preventDefault()
            const venueName = venues.find((v) => v.slug === venue)?.name ?? venue
            setCms({
              ...cms,
              requests: [
                {
                  id: Math.random().toString(36).slice(2, 9),
                  createdAt: new Date().toISOString(),
                  kind: 'reservation',
                  name,
                  detail: `${venueName} · ${date}, ${time} · ${guests} guests`,
                  status: 'new',
                },
                ...cms.requests,
              ],
            })
            // Email the reservation desk silently in the background.
            sendReservationEmail({ venue: venueName, date, time, guests, name })
            setSent(true)
          }}
        >
          <label>
            Room
            <select className="field" value={venue} onChange={(e) => setVenue(e.target.value)}>
              {/* Only show venues that take table reservations. Walk-in bars
                  (e.g. Ninety Six) and in-room dining are not selectable. */}
              {venues
                .filter((v) => v.reservation && !v.walkIn && v.slug !== 'in-room')
                .map((v) => (
                  <option key={v.slug} value={v.slug}>
                    {v.name}
                  </option>
                ))}
            </select>
          </label>
          <p style={{ margin: '8px 0 20px' }} className="muted">
            Requesting {venues.find((v) => v.slug === venue)?.name}
          </p>
          <input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
          <label style={{ marginTop: 16 }}>
            Date
            <input className="field" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <input className="field" value={guests} onChange={(e) => setGuests(e.target.value)} placeholder="Guests" />
          <input className="field" value={time} onChange={(e) => setTime(e.target.value)} placeholder="Time" />
          <button className="btn" type="submit" style={{ marginTop: 24 }}>
            Request the table
          </button>
        </form>
      )}
    </section>
  )
}