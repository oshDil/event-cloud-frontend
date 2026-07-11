import { useEffect, useState } from 'react'
import { Container, Typography, Grid, Box } from '@mui/material'
import { getEvents } from '../api/events'
import EventCard from '../components/EventCard'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'

export default function EventsPage() {
  const [events, setEvents] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    getEvents()
      .then((data) => {
        if (!cancelled) setEvents(Array.isArray(data) ? data : data.events || [])
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load events')
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
          Upcoming Events
        </Typography>
        <Typography color="text.secondary">
          Browse events and register while seats last.
        </Typography>
      </Box>

      {error && <ErrorState message={error} />}
      {!error && !events && <LoadingState label="Loading events…" />}
      {!error && events && events.length === 0 && (
        <Typography color="text.secondary">No events available right now.</Typography>
      )}

      {!error && events && events.length > 0 && (
        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid key={event.event_id} size={{ xs: 12, sm: 6, md: 4 }}>
              <EventCard event={event} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}
