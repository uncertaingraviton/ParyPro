import { Navigate, useParams } from 'react-router-dom'

const map: Record<string, string> = {
  room: '/today',
  restaurant: '/explore',
  bar: '/drink',
  elevator: '/explore',
  pool: '/hotel',
  lobby: '/concierge',
}

export function QrRedirect() {
  const { place } = useParams()
  return <Navigate to={map[place ?? ''] ?? '/'} replace />
}
