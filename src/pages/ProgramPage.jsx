import { useEffect, useMemo, useState } from 'react'
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
  Chip,
} from '@mui/material'
import { getProgram } from '../api/program'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'

export default function ProgramPage() {
  const [sessions, setSessions] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    getProgram()
      .then((data) => {
        if (!cancelled) setSessions(Array.isArray(data) ? data : data.program || [])
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load program')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const sessionsByDay = useMemo(() => {
    if (!sessions) return {}
    return sessions.reduce((acc, session) => {
      const day = session.day || 'TBD'
      acc[day] = acc[day] || []
      acc[day].push(session)
      return acc
    }, {})
  }, [sessions])

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
          Program Schedule
        </Typography>
        <Typography color="text.secondary">
          Sessions, tracks, and speakers across the event days.
        </Typography>
      </Box>

      {error && <ErrorState message={error} />}
      {!error && !sessions && <LoadingState label="Loading program…" />}
      {!error && sessions && sessions.length === 0 && (
        <Typography color="text.secondary">No sessions published yet.</Typography>
      )}

      {!error &&
        Object.entries(sessionsByDay).map(([day, daySessions]) => (
          <Box key={day} sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>
              {day}
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Time</TableCell>
                    <TableCell>Session</TableCell>
                    <TableCell>Speaker</TableCell>
                    <TableCell>Track</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {daySessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>{session.time}</TableCell>
                      <TableCell>{session.session}</TableCell>
                      <TableCell>{session.speaker}</TableCell>
                      <TableCell>
                        <Chip label={session.track} size="small" variant="outlined" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))}
    </Container>
  )
}
