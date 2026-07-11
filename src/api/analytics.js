import { urls } from './client'

const SESSION_KEY = 'analytics_session_id'

function getSessionId() {
  let sessionId = sessionStorage.getItem(SESSION_KEY)
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    sessionStorage.setItem(SESSION_KEY, sessionId)
  }
  return sessionId
}

const analyticsURL = urls.analytics

/**
 * Sends an analytics event to the backend, which forwards it to ClickHouse.
 * Uses sendBeacon when available so events survive page unload/navigation.
 */
export function trackEvent(eventType, payload = {}) {
  const body = JSON.stringify({
    event_type: eventType,
    session_id: getSessionId(),
    page: window.location.pathname,
    timestamp: new Date().toISOString(),
    ...payload,
  })

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: 'application/json' })
    navigator.sendBeacon(analyticsURL, blob)
    return
  }

  fetch(analyticsURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {
    // Analytics failures should never break the user experience.
  })
}

export const trackPageView = (page) => trackEvent('page_viewed', { page })

export const trackScrollDepth = (page, maxScrollPercent) =>
  trackEvent('scroll_depth', { page, scroll_percent: maxScrollPercent })

export const trackButtonClick = (buttonName, meta = {}) =>
  trackEvent('button_click', { button: buttonName, ...meta })

export const trackTimeOnPage = (page, seconds) =>
  trackEvent('time_on_page', { page, duration_seconds: seconds })

export const trackRegistrationAttempt = (eventId, status, meta = {}) =>
  trackEvent('registration_attempt', { event_id: eventId, status, ...meta })

// Fires when a viewer sees the "Almost full" badge on a low-seat event —
// lets us correlate scarcity messaging with registration_attempt to see
// whether urgency actually drives conversion for this platform.
export const trackLowSeatsExposure = (eventId, seatsAvailable) =>
  trackEvent('low_seats_exposure', { event_id: eventId, seats_available: seatsAvailable })
