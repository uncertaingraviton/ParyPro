export function nowParts(date = new Date()) {
  const hour = date.getHours()
  const minute = date.getMinutes()
  const hh = String(hour).padStart(2, '0')
  const mm = String(minute).padStart(2, '0')
  return { hour, minute, clock: `${hh}:${mm}`, date }
}

export function greeting(hour = new Date().getHours()) {
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  if (hour < 21) return 'Good evening'
  return 'Good night'
}

export function longDate(date = new Date()) {
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function isOpen(openFrom: number, openTo: number, overnight?: boolean, hour = new Date().getHours()) {
  if (overnight && openTo < openFrom) return hour >= openFrom || hour < openTo
  return hour >= Math.floor(openFrom) && hour < openTo
}
