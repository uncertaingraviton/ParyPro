import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import moodDine from '../assets/place-biryani.jpg'
import moodDrink from '../assets/place-chai.jpg'
import moodExplore from '../assets/place-charminar.jpg'
import moodShop from '../assets/place-laad.jpg'
import kanakImg from '../kanak1.png'
import amaraImg from '../assets/amaraNew.png'
import tuscanyImg from '../assets/TuscanyNew.png'
import ninetySixImg from '../assets/96TWO.png'
import { useLiveFeeds } from '../lib/feed'
import { useStore } from '../store'
import type { CityEvent } from '../types'

const moods = [
  { to: '/dine', label: 'Dining', icon: '🍽', img: moodDine },
  { to: '/drink', label: 'Beverages', icon: '🍵', img: moodDrink },
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
}

function formatEventWhen(time: string): string {
  if (!time) return ''
  const parsed = Date.parse(time)
  if (!Number.isFinite(parsed)) return time
  return new Date(parsed).toLocaleString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function eventMeta(event: CityEvent): string {
  const when = formatEventWhen(event.time)
  const parts = [when, event.venue].filter(Boolean)
  return parts.length ? parts.join(' · ') : 'Hyderabad'
}

// Slideshow venues
const slideshowVenues = [
  { slug: 'kanak', name: 'Kanak', image: kanakImg, tagline: 'Indian Specialty Restaurant', link: '/dine/kanak' },
  { slug: 'amara', name: 'Amara', image: amaraImg, tagline: 'All-day dining', link: '/dine/amara' },
  { slug: 'tuscany', name: 'Tuscany', image: tuscanyImg, tagline: 'A taste of Italy', link: '/dine/tuscany' },
  { slug: 'ninety-six', name: 'Ninety Six', image: ninetySixImg, tagline: 'After dark', link: '/dine/ninety-six' },
]

export function Home() {
  const { cms } = useStore()
  const { cityEvents } = useLiveFeeds()
  const [nowModal, setNowModal] = useState<NowModal | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const featured = cms.events.filter((e) => e.featured).slice(0, 4)
  const liveCity = cityEvents?.[0]
  const cityNow = liveCity ?? featured[0] ?? cms.events[0]
  const cityList = cityEvents?.length ? cityEvents : featured

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideshowVenues.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  function openCityModal(event: CityEvent) {
    setNowModal({
      kicker: 'BookMyShow · Hyderabad',
      title: event.title,
      body: event.editorial || event.description,
      meta: eventMeta(event),
      ctaTo: event.url || '/explore',
      ctaLabel: event.url ? 'Book on BookMyShow' : 'Explore the city',
      external: Boolean(event.url),
    })
  }

  return (
    <>
      <section className="slideshow-section">
        <div className="slideshow-container">
          {slideshowVenues.map((venue, index) => (
            <div
              key={venue.slug}
              className={`slideshow-slide ${index === currentSlide ? 'active' : ''}`}
            >
              <Link to={venue.link} className="slideshow-link">
                <img src={venue.image} alt={venue.name} />
                <div className="slideshow-overlay">
                  <p className="slideshow-name">{venue.name}</p>
                  <p className="slideshow-tagline">{venue.tagline}</p>
                </div>
              </Link>
            </div>
          ))}
          <div className="slideshow-dots">
            {slideshowVenues.map((_, index) => (
              <button
                key={index}
                className={`slideshow-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="now-section">
        <div className="now-grid now-grid--single">
          <Link
            to={liveCity ? cityNow.url || '/explore' : '/explore'}
            className="now-card now-card-city"
            onClick={(e) => {
              e.preventDefault()
              openCityModal(cityNow)
            }}
          >
            <p className="now-kicker">BookMyShow · Hyderabad</p>
            {cityNow ? (
              <div className="now-card-body">
                <h2>{cityNow.title}</h2>
                <p>{cityNow.editorial || cityNow.description}</p>
                <p className="now-meta">{eventMeta(cityNow)}</p>
              </div>
            ) : (
              <div className="now-card-body">
                <h2>Nothing we would send you to</h2>
                <p>The better evening may be under this roof. Ask the desk if you would like us to look again.</p>
              </div>
            )}
          </Link>
        </div>
      </section>

      <section className="section reels-section">
        <div className="section-head">
          <p className="eyebrow">@tridenthyderabad</p>
          <h2>Follow our journey</h2>
        </div>
        <div className="reels-grid">
          <div className="reel-card">
            <iframe
              src="https://www.instagram.com/reel/C9XETllTPIw/embed/?autoplay=1&muted=1&loop=1"
              title="Instagram Reel 1"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="reel-card">
            <iframe
              src="https://www.instagram.com/reel/CuTZ431hgTb/embed/?autoplay=1&muted=1&loop=1"
              title="Instagram Reel 2"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="reel-card">
            <iframe
              src="https://www.instagram.com/reel/Csko0TuB0lL/embed/?autoplay=1&muted=1&loop=1"
              title="Instagram Reel 3"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <section className="section mood-section">
        <div className="section-head">
          <p className="eyebrow">01 — Begin</p>
          <h2>What are you in the mood for?</h2>
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
          <h2>What&apos;s happening in the city</h2>
          <p>Live picks from BookMyShow — refreshed every few hours.</p>
        </div>
        <div className="event-grid event-grid--city" style={{ maxWidth: 1280, margin: '0 auto' }}>
          {cityList.map((event) =>
            event.url ? (
              <a
                href={event.url}
                target="_blank"
                rel="noreferrer"
                className="event-card"
                style={{ background: '#2a2219', color: '#faf6f0' }}
                key={event.id}
              >
                <p className="eyebrow">{formatEventWhen(event.time) || 'BookMyShow'}</p>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: 32, margin: '10px 0' }}>
                  {event.title}
                </h3>
                <p className="muted">{event.venue || 'Hyderabad'}</p>
                <p style={{ marginTop: 12 }}>{event.editorial || event.description}</p>
              </a>
            ) : (
              <Link
                to="/explore"
                className="event-card"
                style={{ background: '#2a2219', color: '#faf6f0' }}
                key={event.id}
              >
                <p className="eyebrow">{formatEventWhen(event.time) || 'BookMyShow'}</p>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: 32, margin: '10px 0' }}>
                  {event.title}
                </h3>
                <p className="muted">{event.venue || 'Hyderabad'}</p>
                <p style={{ marginTop: 12 }}>{event.editorial || event.description}</p>
              </Link>
            ),
          )}
        </div>
      </section>

      {nowModal && (
        <div className="now-modal" role="dialog" aria-modal="true" onClick={() => setNowModal(null)}>
          <div className="now-modal-panel" onClick={(e) => e.stopPropagation()}>
            <p className="now-kicker">{nowModal.kicker}</p>
            <h3>{nowModal.title}</h3>
            <p className="now-modal-body">{nowModal.body}</p>
            {nowModal.meta && <p className="now-meta">{nowModal.meta}</p>}
            <div className="now-modal-actions">
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
          </div>
        </div>
      )}
    </>
  )
}
