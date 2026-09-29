import { useEffect, useState } from 'react'
import type { CityEvent } from '../types'

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
  /** Hyderabad city events from BookMyShow, or null when stale/missing. */
  cityEvents: CityEvent[] | null
}

/**
 * Loads the scraper-generated city feed (/feed/city.json).
 *
 * Returns null until loaded; null after load means "no fresh feed" and the
 * caller should fall back to desk-curated defaults.
 */
export function useLiveFeeds(): LiveFeeds {
  const [feeds, setFeeds] = useState<LiveFeeds>({
    cityEvents: null,
  })

  useEffect(() => {
    let cancelled = false

    async function load() {
      const city = await fetchJson<CityFeed>(
        `${import.meta.env.BASE_URL}feed/city.json`,
      )
      if (cancelled) return

      setFeeds({
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
