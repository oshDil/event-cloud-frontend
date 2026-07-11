import { useState } from 'react'
import { TextField, Button, Stack, Alert } from '@mui/material'
import { registerForEvent } from '../api/registrations'
import { trackButtonClick, trackRegistrationAttempt } from '../api/analytics'

const initialForm = { name: '', email: '', ticket_count: 1 }

export default function RegistrationForm({ eventId }) {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (field) => (e) => {
    const value = field === 'ticket_count' ? Number(e.target.value) : e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')
    trackButtonClick('submit_registration', { event_id: eventId })
    trackRegistrationAttempt(eventId, 'attempted')

    try {
      await registerForEvent({ event_id: eventId, ...form })
      setStatus('success')
      trackRegistrationAttempt(eventId, 'success')
      setForm(initialForm)
    } catch (err) {
      setStatus('error')
      const message = err.response?.data?.message || err.message || 'Registration failed'
      setErrorMessage(message)
      trackRegistrationAttempt(eventId, 'failure', { error: message })
    }
  }

  if (status === 'success') {
    return <Alert severity="success">You're registered! Check your email for confirmation.</Alert>
  }

  return (
    <Stack component="form" spacing={2} onSubmit={handleSubmit} sx={{ maxWidth: 420 }}>
      {status === 'error' && <Alert severity="error">{errorMessage}</Alert>}
      <TextField
        label="Full name"
        required
        value={form.name}
        onChange={handleChange('name')}
      />
      <TextField
        label="Email"
        type="email"
        required
        value={form.email}
        onChange={handleChange('email')}
      />
      <TextField
        label="Number of tickets"
        type="number"
        required
        slotProps={{ htmlInput: { min: 1 } }}
        value={form.ticket_count}
        onChange={handleChange('ticket_count')}
      />
      <Button type="submit" variant="contained" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Registering…' : 'Register'}
      </Button>
    </Stack>
  )
}
