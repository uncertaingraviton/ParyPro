export type VenueSlug = 'amara' | 'kanak' | 'tuscany' | 'ninety-six' | 'in-room'

export type Mood =
  | 'spicy'
  | 'light'
  | 'steak'
  | 'indian'
  | 'italian'
  | 'sweet'
  | 'cocktail'
  | 'nightcap'
  | 'coffee'
  | 'breakfast'

export type EventCategory =
  | 'live-music'
  | 'theatre'
  | 'comedy'
  | 'sports'
  | 'art'
  | 'food'
  | 'opening'
  | 'party'
  | 'shopping'
  | 'culture'
  | 'business'

export type Venue = {
  slug: VenueSlug
  name: string
  kicker: string
  tagline: string
  hours: string
  openFrom: number
  openTo: number
  overnight?: boolean
  description: string
  quote: string
  image: string
  moods: Mood[]
  cuisine: string[]
  floor: string
  reservation: boolean
}

export type HotelService = {
  slug: string
  prompt: string
  detail: string
  location: string
  hours: string
  cta: string
  image?: string
}

export type CityPlace = {
  id: string
  name: string
  area: string
  category: 'old-city' | 'modern' | 'art' | 'food' | 'nightlife' | 'shopping' | 'family'
  minutes: number
  why: string
  atmosphere: 'elegant' | 'lively' | 'local'
  image: string
}

export type CityEvent = {
  id: string
  title: string
  category: EventCategory
  time: string
  venue: string
  description: string
  editorial: string
  featured: boolean
}

export type ConciergePick = {
  id: string
  rank: number
  title: string
  category: string
  why: string
  place: string
}

export type Special = {
  id: string
  venue: VenueSlug | 'hotel'
  kind: 'chef' | 'happy-hour' | 'sold-out' | 'wine' | 'bar' | 'closure'
  title: string
  detail: string
}

export type GuestPrefs = {
  name: string
  title: string
  cuisines: string[]
  drinks: string[]
  experiences: string[]
  budget: '₹' | '₹₹' | '₹₹₹' | 'luxury'
  distance: 'hotel' | '10' | '20' | 'anywhere'
}

export type EveningKind = 'romantic' | 'business' | 'friends' | 'solo' | 'family'
export type EveningMood = 'relaxed' | 'sophisticated' | 'lively' | 'adventurous'
export type EveningDistance = 'hotel' | 'nearby' | 'anywhere'
export type EveningBudget = '₹' | '₹₹' | '₹₹₹' | 'open'

export type EveningStop = {
  time: string
  title: string
  place: string
  note: string
}

export type StaffRequest = {
  id: string
  createdAt: string
  kind: 'reservation' | 'evening' | 'concierge' | 'room'
  name: string
  detail: string
  status: 'new' | 'in-progress' | 'done'
}

export type CmsState = {
  weather: { temp: number; condition: string }
  traffic: string
  events: CityEvent[]
  picks: ConciergePick[]
  specials: Special[]
  availability: Record<VenueSlug, 'open' | 'limited' | 'full'>
  requests: StaffRequest[]
  notes: string
}
