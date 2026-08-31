import { useEffect, useState } from 'react'
import type { CityEvent } from '../types'

export type HotelPromotion = {
  title: string
  detail: string
  /** Schedule line from the caption, e.g. '26 August | Lunch'. */
  when?: string
  /** Event start date (ISO), parsed from the caption. */
  startDate?: string
  /** Event end date (ISO) when the event spans multiple days. */
  endDate?: string
  /** Meal or time from the caption, e.g. 'Lunch' or '7 PM'. */
  timeLabel?: string
  /** Outlet the promotion runs at, e.g. 'Kanak'. */
  venueName?: string
  /** Cleanly written description for the detail view. */
  story?: string
  /** Full caption text for the detail view. */
  full?: string
  image: string
  url: string
  postedAt: string
}

type HotelFeed = {
  fetchedAt: string
  source: string
  promotions: HotelPromotion[]
}

type CityFeed = {
  fetchedAt: string
  source: string
  events: CityEvent[]
}

const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000 // ignore feeds older than 7 days

function isFresh(fetchedAt: string | undefined): boolean {
  if (!fetchedAt) return false
  const t = Date.parse(fetchedAt)
  return Number.isFinite(t) && Date.now() - t < MAX_AGE_MS
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

export type LiveFeeds = {
  /** Newest Trident Hyderabad F&B promotion from Instagram, or null. */
  hotelPromo: HotelPromotion | null
  /** Curated Hyderabad city events from BookMyShow, or null. */
  cityEvents: CityEvent[] | null
}

/** Latest local-clock time a same-day meal slot is still "today". */
const MEAL_SLOT_END: Record<string, string> = {
  Breakfast: '09:00',
  Brunch: '13:30',
  Lunch: '14:30',
  'High Tea': '17:30',
  'Afternoon Tea': '17:30',
  Dinner: '20:30',
}

function parseLocalDate(iso: string): Date | null {
  if (!iso) return null
  // The scraper stores date-only ISO strings (e.g. '2026-08-26') which we
  // interpret as hotel-local (IST) dates so "today" comparisons match Hyderabad.
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso.trim())
  if (!m) return null
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  return Number.isFinite(d.getTime()) ? d : null
}

function localTimeString(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  const h = d.getHours()
  if (Number.isNaN(h)) return '00:00'
  return `${pad(h)}:${pad(d.getMinutes())}`
}

function mealEndTime(timeLabel: string): string | null {
  const low = (timeLabel || '').trim().toLowerCase()
  const meal = Object.keys(MEAL_SLOT_END).find(
    (k) => k.toLowerCase() === low
  )
  if (meal) return MEAL_SLOT_END[meal]

  // Explicit times such as '7 PM', '19:00', '7:30 pm'.
  const t = /^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i.exec(low)
  if (t) {
    let h = Number(t[1])
    const m = t[2] ? Number(t[2]) : 0
    if (/pm/i.test(t[3]) && h !== 12) h += 12
    if (/am/i.test(t[3]) && h === 12) h = 0
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  }
  const hm = /^(\d{2}):(\d{2})$/.exec(low)
  if (hm) return `${hm[1]}:${hm[2]}`

  return null
}

/**
 * Is a scraped promotion still relevant right now?
 *
 * A single-day lunch event ("26 August | Lunch") must drop off once lunch is
 * over on the 26th, and a multi-day event is only current while within its date
 * range. Future events stay visible so guests can book ahead. If we can't work
 * out the timing we keep the event (better to surface than to hide).
 * 
 * Events with dates in the past (before today) are filtered out - the scraper
 * should find other promotions, but this is a safety net.
 */
function isEventCurrent(p: HotelPromotion): boolean {
  const start = parseLocalDate(p.startDate ?? '')
  if (!start) return true

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  // Strictly past events are filtered out
  if (start.getTime() < today.getTime()) return false

  const end = parseLocalDate(p.endDate ?? '')
  // Past end of a range already passed today.
  if (end && end.getTime() < today.getTime()) return false

  // Same-day meal slot: still current until the slot's last service is over.
  if (start.getTime() >= today.getTime() && start.getTime() <= today.getTime() + 24 * 60 * 60 * 1000 - 1) {
    const slotEnd = mealEndTime(p.timeLabel || '')
    if (slotEnd) {
      return localTimeString(now) <= slotEnd
    }
    // Single-day event with no recognised meal/time: keep for the whole day.
    if (end && end.getTime() === start.getTime()) return true
    return true
  }

  return true
}

/**
 * Loads the scraper-generated feeds (/feed/hotel.json, /feed/city.json).
 *
 * Returns nulls until loaded; nulls after load mean "no fresh feed" and the
 * caller should fall back to the built-in defaults. Expired same-day events
 * (e.g. a lunch special after lunch time) are filtered out so the homepage
 * always reflects the current date and time.
 */
export function useLiveFeeds(): LiveFeeds {
  const [feeds, setFeeds] = useState<LiveFeeds>({
    hotelPromo: null,
    cityEvents: null,
  })

  useEffect(() => {
    let cancelled = false

    async function load() {
      const [hotel, city] = await Promise.all([
        fetchJson<HotelFeed>(`${import.meta.env.BASE_URL}feed/hotel.json`),
        fetchJson<CityFeed>(`${import.meta.env.BASE_URL}feed/city.json`),
      ])
      if (cancelled) return

      const promos =
        hotel && isFresh(hotel.fetchedAt) && hotel.promotions
          ? hotel.promotions.filter(isEventCurrent)
          : []

      setFeeds({
        hotelPromo: promos.length ? promos[0] : null,
        cityEvents:
          city && isFresh(city.fetchedAt) && city.events?.length
            ? city.events
            : null,
      })
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return feeds
}
