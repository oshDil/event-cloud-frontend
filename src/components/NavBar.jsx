import { AppBar, Toolbar, Typography, Button, Stack, Container } from '@mui/material'
import { NavLink } from 'react-router-dom'
import EventIcon from '@mui/icons-material/Event'
import { trackButtonClick } from '../api/analytics'

const navLinks = [
  { to: '/', label: 'Events' },
  { to: '/program', label: 'Program' },
  { to: '/registrations', label: 'Registrations' },
]

export default function NavBar() {
  return (
    <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: 'white' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <EventIcon color="primary" />
            <Typography variant="h6" component={NavLink} to="/" sx={{ textDecoration: 'none', color: 'text.primary', fontWeight: 700 }}>
              EventCloud
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            {navLinks.map((link) => (
              <Button
                key={link.to}
                component={NavLink}
                to={link.to}
                onClick={() => trackButtonClick(`nav_${link.label.toLowerCase()}`)}
                sx={{
                  color: 'text.secondary',
                  '&.active': { color: 'primary.main', fontWeight: 700 },
                }}
              >
                {link.label}
              </Button>
            ))}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
