import { Alert, AlertTitle } from '@mui/material'

export default function ErrorState({ message = 'Something went wrong.' }) {
  return (
    <Alert severity="error" sx={{ my: 4 }}>
      <AlertTitle>Unable to load data</AlertTitle>
      {message}
    </Alert>
  )
}
