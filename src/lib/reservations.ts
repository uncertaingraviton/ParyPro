/**
 * Reservation requests are delivered silently by FormSubmit's AJAX endpoint -
 * no mail client opens on the guest's device.
 *
 * One-time setup: FormSubmit requires the recipient address to be verified
 * once. The first submission emails an activation link; clicking it once
 * enables all future deliveries automatically.
 */
export const RESERVATION_EMAIL = 'r.singh@oberoigroup.com'

export type ReservationDetails = {
  event?: string
  venue: string
  date: string
  time: string
  guests: string
  name?: string
}

export function sendReservationEmail(details: ReservationDetails): void {
  const subject = details.event
    ? `Reservation request — ${details.event} at ${details.venue}`
    : `Reservation request — ${details.venue}`

  void fetch(`https://formsubmit.co/ajax/${RESERVATION_EMAIL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      _subject: subject,
      _template: 'table',
      Event: details.event ?? '—',
      Venue: details.venue,
      Date: details.date,
      Time: details.time,
      Guests: details.guests,
      Name: details.name ?? 'Guest — digital concierge',
      Requested_at: new Date().toLocaleString('en-IN'),
    }),
  }).catch(() => {
    /* delivery is best-effort; the desk also sees the logged request */
  })
}