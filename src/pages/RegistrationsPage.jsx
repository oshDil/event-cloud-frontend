import { useEffect, useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
} from '@mui/material'
import { getRegistrations } from '../api/registrations'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    getRegistrations()
      .then((data) => {
        if (!cancelled) setRegistrations(Array.isArray(data) ? data : data.registrations || [])
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load registrations')
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
          Registrations
        </Typography>
        <Typography color="text.secondary">
          All registrations recorded across events.
        </Typography>
      </Box>

      {error && <ErrorState message={error} />}
      {!error && !registrations && <LoadingState label="Loading registrations…" />}
      {!error && registrations && registrations.length === 0 && (
        <Typography color="text.secondary">No registrations yet.</Typography>
      )}

      {!error && registrations && registrations.length > 0 && (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Registration ID</TableCell>
                <TableCell>Event ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Tickets</TableCell>
                <TableCell>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {registrations.map((registration) => (
                <TableRow key={registration.registration_id}>
                  <TableCell>{registration.registration_id}</TableCell>
                  <TableCell>{registration.event_id}</TableCell>
                  <TableCell>{registration.name}</TableCell>
                  <TableCell>{registration.email}</TableCell>
                  <TableCell>{registration.ticket_count}</TableCell>
                  <TableCell>{registration.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  )
}
