import { useEffect, useState } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Chip,
  Stack,
  Divider,
  Button,
} from '@mui/material'
import PlaceIcon from '@mui/icons-material/Place'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { getEvent } from '../api/events'
import { trackLowSeatsExposure } from '../api/analytics'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import RegistrationForm from '../components/RegistrationForm'
import { formatEventDate } from '../utils/formatDate'

export default function EventDetailPage() {
  const { eventId } = useParams()
  const [event, setEvent] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setEvent(null)
    setError(null)
    getEvent(eventId)
      .then((data) => {
        if (!cancelled) setEvent(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load event')
      })
    return () => {
      cancelled = true
    }
  }, [eventId])

  useEffect(() => {
    if (event && typeof event.seats_available === 'number' && event.seats_available < 10) {
      trackLowSeatsExposure(event.event_id, event.seats_available)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event])

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <ErrorState message={error} />
      </Container>
    )
  }

  if (!event) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <LoadingState label="Loading event…" />
      </Container>
    )
  }

  const seatsLow = typeof event.seats_available === 'number' && event.seats_available < 10

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Button component={RouterLink} to="/" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        Back to events
      </Button>

      <Stack
        direction="row"
        sx={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}
      >
        <Typography variant="h4" component="h1" fontWeight={700}>
          {event.title}
        </Typography>
        {seatsLow && <Chip label="Only a few seats left" color="warning" />}
      </Stack>

      <Stack spacing={1} sx={{ color: 'text.secondary', my: 2 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <CalendarMonthIcon fontSize="small" />
          <Typography>{formatEventDate(event.date)}</Typography>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <PlaceIcon fontSize="small" />
          <Typography>{event.venue}</Typography>
        </Stack>
      </Stack>

      <Typography sx={{ mb: 1 }}>
        {event.seats_available ?? '—'} / {event.capacity ?? '—'} seats available
      </Typography>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
        {typeof event.ticket_price === 'number' ? `$${event.ticket_price.toFixed(2)}` : event.ticket_price}
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Box>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Register for this event
        </Typography>
        <RegistrationForm eventId={event.event_id} />
      </Box>
    </Container>
  )
}
