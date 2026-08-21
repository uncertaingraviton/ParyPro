import { Navigate, useParams } from 'react-router-dom'

const map: Record<string, string> = {
  room: '/today',
  restaurant: '/tonight',
  bar: '/drink',
  elevator: '/tonight',
  pool: '/hotel',
  lobby: '/concierge',
}

export function QrRedirect() {
  const { place } = useParams()
  return <Navigate to={map[place ?? ''] ?? '/'} replace />
}
