import { apiClient, urls } from './client'

export const getEvents = () => apiClient.get(urls.events).then((res) => res.data)

export const getEvent = (eventId) =>
  apiClient.get(`${urls.events}/${eventId}`).then((res) => res.data)

export const createEvent = (event) =>
  apiClient.post(urls.events, event).then((res) => res.data)

export const updateEvent = (eventId, event) =>
  apiClient.put(`${urls.events}/${eventId}`, event).then((res) => res.data)

export const deleteEvent = (eventId) =>
  apiClient.delete(`${urls.events}/${eventId}`).then((res) => res.data)
