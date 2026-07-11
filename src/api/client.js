import axios from 'axios'

export const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

const sharedBaseURL = import.meta.env.VITE_API_BASE_URL || ''

// Each service can override its own base URL (useful locally, where every
// service runs on its own port with no gateway in front). Falls back to the
// shared base URL, which is what production behind a single Ingress uses.
function resolveBaseURL(overrideEnvVar) {
  return import.meta.env[overrideEnvVar] || sharedBaseURL
}

export const urls = {
  events: `${resolveBaseURL('VITE_EVENTS_BASE_URL')}${import.meta.env.VITE_EVENTS_PATH || '/api/events'}`,
  program: `${resolveBaseURL('VITE_PROGRAM_BASE_URL')}${import.meta.env.VITE_PROGRAM_PATH || '/api/program'}`,
  register: `${resolveBaseURL('VITE_REGISTER_BASE_URL')}${import.meta.env.VITE_REGISTER_PATH || '/api/register'}`,
  registrations: `${resolveBaseURL('VITE_REGISTRATIONS_BASE_URL')}${import.meta.env.VITE_REGISTRATIONS_PATH || '/api/registrations'}`,
  analytics: `${resolveBaseURL('VITE_ANALYTICS_BASE_URL')}${import.meta.env.VITE_ANALYTICS_PATH || '/api/analytics'}`,
}
