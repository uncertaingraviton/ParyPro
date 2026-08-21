import { places, venues } from '../data'
import type { CmsState, GuestPrefs } from '../types'

export type ChatMsg = { role: 'guest' | 'concierge'; text: string }

function includesAny(q: string, words: string[]) {
  return words.some((w) => q.includes(w))
}

export function conciergeReply(raw: string, cms: CmsState, prefs: GuestPrefs): string {
  const q = raw.toLowerCase().trim()
  const kanak = venues.find((v) => v.slug === 'kanak')!
  const tuscany = venues.find((v) => v.slug === 'tuscany')!
  const ninety = venues.find((v) => v.slug === 'ninety-six')!
  const amara = venues.find((v) => v.slug === 'amara')!
  const featured = cms.events.filter((e) => e.featured)
  const pick = cms.picks[0]

  if (!q || includesAny(q, ['hello', 'hi ', 'good evening', 'good morning'])) {
    return `Good evening, ${prefs.title} ${prefs.name}. I am the concierge.\n\nWould you like dinner in the hotel, something in the city, or shall I simply tell you what is worth doing tonight?`
  }

  if (includesAny(q, ['biryani', 'haleem', 'nizam'])) {
    return `For biryani, I would begin at **${kanak.name}** — Nizami-inspired cooking, five minutes from your room, and we still have ${cms.availability.kanak === 'full' ? 'a wait' : 'a table'} this evening.\n\nIf you would rather eat in the city, I can arrange a car to a kitchen we actually send our own guests to — not the first name that appears on a map. Shall I keep you in the hotel, or take you out?`
  }

  if (includesAny(q, ['wife', 'romantic', 'anniversary', 'date'])) {
    return `I would keep the evening close.\n\n**18:30** — A first drink at **${ninety.name}**.\n**19:30** — Dinner at **${tuscany.name}**, or **${kanak.name}** if she prefers the flavours of this city.\n**22:30** — A nightcap, still in the house.\n\nIf you would rather leave the hotel, I can hold a quiet table in Jubilee Hills, about twenty minutes away. Which atmosphere would you like: elegant, lively, or local?`
  }

  if (includesAny(q, ['bored', "don't know", 'dont know', 'surprise', 'anything'])) {
    return `Then allow me.\n\nBegin at **${ninety.name}**. Order something stirred. At 19:30, sit down at **${kanak.name}** — it is the most Hyderabad thing we do under this roof.\n\nAfter dinner: ${featured[0] ? `**${featured[0].title}** at ${featured[0].time}. ${featured[0].editorial}` : 'I will check what is still worth seeing tonight.'}\n\nIf that feels too much like a plan, walk to the 10th-floor pool and watch the city until you are hungry.`
  }

  if (includesAny(q, ['tonight', 'happening', 'event', 'music', "what's on", 'whats on'])) {
    const lines = featured.map((e) => `• **${e.time}** — ${e.title} (${e.venue}). ${e.editorial}`)
    return `Tonight in Hyderabad, as we would send you:\n\n${lines.join('\n') || 'The house is the better evening tonight — Kanak, then Ninety Six.'}\n\n${cms.traffic}\n\nWould you like me to book any of these?`
  }

  if (includesAny(q, ['lively', 'party', 'friends', 'fun', 'loud'])) {
    return `I'd suggest starting with cocktails at **${ninety.name}**, followed by dinner at **${tuscany.name}** if you want to stay elegant, or a table in Banjara Hills if you want the city.\n\nIf you'd rather experience Hyderabad beyond the hotel, I can curate three options:\n\n**1. Elegant** — Jubilee Hills, a serious dining room, a car both ways.\n**2. Lively** — a bar we trust, then a late table.\n**3. Local** — old-city flavours, pearls if the shops are still open, chai whenever you like.`
  }

  if (includesAny(q, ['spa', 'massage', 'pool', 'workout', 'gym', 'fitness'])) {
    return `The fitness centre and pool are on the **10th floor**, reserved for resident guests. The gym is open now; the pool until 10:00 p.m.\n\nTrident Spa is by appointment — Ayurvedic and Western therapies, with the city below you. Shall I hold a treatment this afternoon?`
  }

  if (includesAny(q, ['cocktail', 'drink', 'whisky', 'whiskey', 'wine', 'beer', 'nightcap', 'bar'])) {
    const happy = cms.specials.find((s) => s.kind === 'happy-hour')
    return `**${ninety.name}** is open until 4:00 a.m. — cocktails, spirits, and a room that improves after ten.\n\n${happy ? `${happy.title}: ${happy.detail}` : 'Ask the bartender for the house signature; it changes with the season.'}\n\nWine belongs at **${tuscany.name}**. A quiet whisky can be sent to your room, of course.`
  }

  if (includesAny(q, ['italian', 'pasta', 'pizza'])) {
    return `**${tuscany.name}**, 7:00 p.m. to 11:00 p.m. A proper Italian dinner, and the cellar is the point.\n\nAvailability tonight: **${cms.availability.tuscany}**. Shall I reserve?`
  }

  if (includesAny(q, ['breakfast', 'coffee', 'chai'])) {
    return `Breakfast is at **${amara.name}** from 7:00 a.m., or in bed whenever you ring.\n\nFor Irani chai in the city, I would not send you to a café that photographs well. Tell me how far you are willing to go.`
  }

  if (includesAny(q, ['shop', 'pearl', 'bangle', 'market'])) {
    return `For pearls, we use a dealer — not a stall. For bangles and atmosphere, **Laad Bazaar** beside Charminar.\n\nLuxury shopping sits in Banjara Hills, about twenty minutes from here. I can have a car downstairs in fifteen.`
  }

  if (includesAny(q, ['old city', 'charminar', 'golconda', 'chowmahalla'])) {
    const p = places.find((x) => x.id === 'charminar')!
    return `**${p.name}** is about ${p.minutes} minutes, depending on the evening. ${p.why}\n\nI would pair it with Chowmahalla if you have the morning, or with haleem if you only have the night. A car and a discreet guide are wiser than a taxi app after dark.`
  }

  if (includesAny(q, ['weather', 'hot', 'rain', 'temperature'])) {
    return `Hyderabad is **${cms.weather.temp}°C**, ${cms.weather.condition.toLowerCase()}.\n\nIf it is close, stay in the house — **${kanak.name}** and **${ninety.name}**. If you want air, the 10th-floor pool is the finest terrace we have.`
  }

  if (includesAny(q, ['steak', 'spicy', 'sweet', 'hungry', 'dinner', 'eat', 'food'])) {
    const spicy = q.includes('spicy')
    return spicy
      ? `**${kanak.name}.** Tell the captain you want heat with manners. ${cms.specials.find((s) => s.venue === 'kanak')?.detail ?? ''}\n\nIf you would rather the city, I have a chilli-honest room twenty minutes away.`
      : `For dinner in the hotel: **${kanak.name}** for Hyderabad, **${tuscany.name}** for Italy, **${amara.name}** if you want the menu to be easy.\n\nThis week's concierge pick: **${pick?.title}** — ${pick?.why}`
  }

  if (includesAny(q, ['wifi', 'password', 'housekeeping', 'laundry', 'checkout', 'check-out', 'taxi', 'airport'])) {
    return `Of course.\n\n• **Wi-Fi** is complimentary throughout the hotel — the front desk will confirm tonight’s network.\n• **Housekeeping and laundry** can be arranged from your room, or I can place the request now.\n• **Airport** is about 40 minutes; I would leave extra time in the evening.\n\nWhat should I arrange?`
  }

  return `I would treat that as an evening, not an errand.\n\nStay in the hotel: cocktails at **${ninety.name}**, dinner at **${prefs.cuisines.includes('Italian') ? tuscany.name : kanak.name}**.\n\nOr let me curate three atmospheres beyond the door:\n\n**1. Elegant**\n**2. Lively**\n**3. Local**\n\nTell me which, how far you will travel (${prefs.distance === 'hotel' ? 'you prefer the hotel' : 'you are willing to leave the property'}), and I will build the night.`
}
