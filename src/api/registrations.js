import { apiClient, urls } from './client'

export const registerForEvent = (registration) =>
  apiClient.post(urls.register, registration).then((res) => res.data)

export const getRegistrations = () =>
  apiClient.get(urls.registrations).then((res) => res.data)
