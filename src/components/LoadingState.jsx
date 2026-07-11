import { Box, CircularProgress, Typography } from '@mui/material'

export default function LoadingState({ label = 'Loading…' }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 8 }}>
      <CircularProgress />
      <Typography color="text.secondary">{label}</Typography>
    </Box>
  )
}
