import { places, venues } from '../data'
import type { EveningBudget, EveningDistance, EveningKind, EveningMood, EveningStop } from '../types'

const spend: Record<EveningBudget, string> = {
  '₹': '₹2,500–₹4,000',
  '₹₹': '₹4,500–₹7,000',
  '₹₹₹': '₹7,500–₹10,000',
  open: 'As you wish',
}

export function buildEvening(input: {
  kind: EveningKind
  mood: EveningMood
  distance: EveningDistance
  budget: EveningBudget
}): { stops: EveningStop[]; travel: string; spend: string; note: string } {
  const { kind, mood, distance } = input
  const city = distance !== 'hotel'
  const far = distance === 'anywhere'

  let stops: EveningStop[] = []

  if (kind === 'romantic' && mood !== 'lively') {
    stops = [
      { time: '18:30', title: 'Sunset drinks', place: 'Ninety Six', note: 'A first cocktail while the city cools.' },
      { time: '19:30', title: 'Dinner', place: city ? 'A quiet table in Jubilee Hills' : 'Tuscany', note: 'Italian light, unhurried wine.' },
      { time: '21:30', title: 'A slower hour', place: far ? 'Necklace Road, by car' : 'The 10th-floor pool terrace', note: 'Air, water, and very little conversation required.' },
      { time: '23:00', title: 'Nightcap', place: 'Ninety Six', note: 'Something stirred, then home.' },
    ]
  } else if (kind === 'business') {
    stops = [
      { time: '18:30', title: 'A composed drink', place: 'Ninety Six', note: 'Where conversations stay private.' },
      { time: '19:30', title: 'Dinner', place: 'Tuscany', note: 'A table that understands a working evening.' },
      { time: '21:30', title: 'If the night continues', place: 'Club Lounge or Ninety Six', note: 'One last glass. No detours.' },
    ]
  } else if (kind === 'family') {
    stops = [
      { time: '18:00', title: 'Early supper', place: 'Amara', note: 'The easiest table in the house for every appetite.' },
      { time: '19:30', title: 'An outing', place: city ? 'Shilparamam, ten minutes away' : 'The pool, 10th floor', note: 'Air and a view before bedtime.' },
    ]
  } else if (kind === 'solo' || mood === 'adventurous') {
    stops = [
      { time: '18:30', title: 'Chai, then a car', place: far ? 'The Old City' : 'HITEC City at dusk', note: 'Let the evening find its own pace.' },
      { time: '20:00', title: 'Dinner', place: city ? 'A biryani we actually send guests to' : 'Kanak', note: 'Hyderabad, properly.' },
      { time: '22:30', title: 'Live music', place: city ? 'A room in Banjara Hills' : 'Ninety Six', note: 'Stay as late as you like.' },
    ]
  } else {
    stops = [
      { time: '18:30', title: 'Cocktails', place: 'Ninety Six', note: 'Start in the house. See how you feel.' },
      { time: '19:30', title: 'Dinner', place: mood === 'lively' && city ? 'Jubilee Hills' : 'Kanak', note: 'Nizami cooking, or the city’s newer rooms.' },
      { time: '21:30', title: 'Live entertainment', place: city ? 'Tonight’s featured room' : 'Ninety Six', note: 'We will confirm what is actually good this evening.' },
      { time: '23:00', title: 'Nightcap', place: 'Ninety Six', note: 'Back under this roof.' },
    ]
  }

  const travel =
    distance === 'hotel' ? 'On property' : distance === 'nearby' ? '8–18 min' : '25–50 min, with a car'
  const note = places[0]
    ? `Curated for a ${mood} ${kind} evening. ${venues.find((v) => v.slug === 'kanak')?.name} remains the house favourite when in doubt.`
    : ''

  return { stops, travel, spend: spend[input.budget], note }
}
