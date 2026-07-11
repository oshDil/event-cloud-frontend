import { Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'
import NavBar from './components/NavBar'
import EventsPage from './pages/EventsPage'
import EventDetailPage from './pages/EventDetailPage'
import ProgramPage from './pages/ProgramPage'
import RegistrationsPage from './pages/RegistrationsPage'
import NotFoundPage from './pages/NotFoundPage'
import { usePageAnalytics } from './hooks/usePageAnalytics'

export default function App() {
  usePageAnalytics()

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <NavBar />
      <Routes>
        <Route path="/" element={<EventsPage />} />
        <Route path="/events/:eventId" element={<EventDetailPage />} />
        <Route path="/program" element={<ProgramPage />} />
        <Route path="/registrations" element={<RegistrationsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Box>
  )
}
