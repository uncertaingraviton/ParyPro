import { defaultCms, defaultPrefs } from '../data'
import type { CmsState, GuestPrefs } from '../types'

const CMS_KEY = 'trident-concierge-cms'
const PREFS_KEY = 'trident-concierge-prefs'

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? ({ ...fallback, ...JSON.parse(raw) } as T) : fallback
  } catch {
    return fallback
  }
}

export function loadCms(): CmsState {
  const stored = read<CmsState>(CMS_KEY, defaultCms)
  return {
    ...defaultCms,
    ...stored,
    events: stored.events?.length ? stored.events : defaultCms.events,
    picks: stored.picks?.length ? stored.picks : defaultCms.picks,
    specials: stored.specials ?? defaultCms.specials,
    availability: { ...defaultCms.availability, ...stored.availability },
    requests: stored.requests ?? [],
  }
}

export function saveCms(next: CmsState) {
  localStorage.setItem(CMS_KEY, JSON.stringify(next))
}

export function loadPrefs(): GuestPrefs {
  return read<GuestPrefs>(PREFS_KEY, defaultPrefs)
}

export function savePrefs(next: GuestPrefs) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(next))
}

export function uid() {
  return Math.random().toString(36).slice(2, 9)
}
