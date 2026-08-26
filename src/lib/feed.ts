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

/**
 * Loads the scraper-generated feeds (/feed/hotel.json, /feed/city.json).
 * Returns nulls until loaded; nulls after load mean "no fresh feed" and the
 * caller should fall back to the built-in defaults.
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
    // BASE_URL keeps this correct on GitHub Pages (/ParyPro/) and locally (/).
    fetchJson<HotelFeed>(`${import.meta.env.BASE_URL}feed/hotel.json`),
    fetchJson<CityFeed>(`${import.meta.env.BASE_URL}feed/city.json`),
      ])
      if (cancelled) return
      setFeeds({
        hotelPromo:
          hotel && isFresh(hotel.fetchedAt) && hotel.promotions?.length
            ? hotel.promotions[0]
            : null,
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