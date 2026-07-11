import { useEffect } from 'react'
import { Card, CardContent, CardActions, Typography, Button, Chip, Stack } from '@mui/material'
import PlaceIcon from '@mui/icons-material/Place'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { Link as RouterLink } from 'react-router-dom'
import { trackButtonClick, trackLowSeatsExposure } from '../api/analytics'
import { formatEventDate } from '../utils/formatDate'

export default function EventCard({ event }) {
  const seatsLow = typeof event.seats_available === 'number' && event.seats_available < 10

  useEffect(() => {
    if (seatsLow) {
      trackLowSeatsExposure(event.event_id, event.seats_available)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event.event_id, seatsLow])

  return (
    <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack
          direction="row"
          sx={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}
        >
          <Typography variant="h6" component="h3" gutterBottom>
            {event.title}
          </Typography>
          {seatsLow && <Chip label="Almost full" color="warning" size="small" />}
        </Stack>

        <Stack spacing={0.5} sx={{ color: 'text.secondary', mb: 1.5 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <CalendarMonthIcon fontSize="small" />
            <Typography variant="body2">{formatEventDate(event.date)}</Typography>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <PlaceIcon fontSize="small" />
            <Typography variant="body2">{event.venue}</Typography>
          </Stack>
        </Stack>

        <Typography variant="body2">
          {event.seats_available ?? '—'} / {event.capacity ?? '—'} seats available
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 700 }}>
          {typeof event.ticket_price === 'number' ? `$${event.ticket_price.toFixed(2)}` : event.ticket_price}
        </Typography>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button
          component={RouterLink}
          to={`/events/${event.event_id}`}
          variant="contained"
          fullWidth
          onClick={() => trackButtonClick('view_event_details', { event_id: event.event_id })}
        >
          View details
        </Button>
      </CardActions>
    </Card>
  )
}
