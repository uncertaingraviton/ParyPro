import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ConciergePage } from './pages/Concierge'
import { Cravings, Dine, Reserve, Venue } from './pages/Dine'
import { Drink } from './pages/Drink'
import { Evening } from './pages/Evening'
import { Explore } from './pages/Explore'
import { Home } from './pages/Home'
import { Hotel } from './pages/Hotel'
import { Qr } from './pages/Qr'
import { QrRedirect } from './pages/QrRedirect'
import { Staff } from './pages/Staff'
import { Today } from './pages/Today'
import { Tonight } from './pages/Tonight'
import { StoreProvider } from './store'

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="dine" element={<Dine />} />
            <Route path="dine/cravings" element={<Cravings />} />
            <Route path="dine/reserve" element={<Reserve />} />
            <Route path="dine/:slug" element={<Venue />} />
            <Route path="drink" element={<Drink />} />
            <Route path="explore" element={<Explore />} />
            <Route path="tonight" element={<Tonight />} />
            <Route path="hotel" element={<Hotel />} />
            <Route path="today" element={<Today />} />
            <Route path="evening" element={<Evening />} />
            <Route path="concierge" element={<ConciergePage />} />
            <Route path="staff" element={<Staff />} />
            <Route path="qr" element={<Qr />} />
            <Route path="qr/:place" element={<QrRedirect />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}
