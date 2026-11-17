import { useEffect, useState } from 'react'
import type { CityEvent } from '../types'

type CityFeed = {
  fetchedAt: string
  source: string
  events: CityEvent[]
}

const GRACE_MS = 3 * 60 * 60 * 1000 // keep an event a few hours after it starts

function eventStart(time: string | undefined): number | null {
  if (!time) return null
  const t = Date.parse(time)
  return Number.isFinite(t) ? t : null
}

function upcomingEvents(events: CityEvent[]): CityEvent[] {
  const cutoff = Date.now() - GRACE_MS
  return events
    .filter((event) => {
      const start = eventStart(event.time)
      return start === null || start >= cutoff
    })
    .sort((a, b) => {
      const ta = eventStart(a.time)
      const tb = eventStart(b.time)
      if (ta !== null && tb !== null) return ta - tb
      if (ta !== null) return -1
      if (tb !== null) return 1
      return 0
    })
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
  /** Upcoming Hyderabad events from BookMyShow, or null when none. */
  cityEvents: CityEvent[] | null
  ready: boolean
}

/**
 * Loads the scraper-generated city feed (/feed/city.json).
 * Past events are dropped; remaining listings stay usable even if the
 * last scrape is older than a week.
 */
export function useLiveFeeds(): LiveFeeds {
  const [feeds, setFeeds] = useState<LiveFeeds>({
    cityEvents: null,
    ready: false,
  })

  useEffect(() => {
    let cancelled = false

    async function load() {
      const city = await fetchJson<CityFeed>(
        `${import.meta.env.BASE_URL}feed/city.json`,
      )
      if (cancelled) return

      const live = city?.events?.length ? upcomingEvents(city.events) : []
      setFeeds({
        cityEvents: live.length ? live : null,
        ready: true,
      })
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return feeds
}
