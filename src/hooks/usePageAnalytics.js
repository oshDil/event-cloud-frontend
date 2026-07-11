import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView, trackScrollDepth, trackTimeOnPage } from '../api/analytics'

/**
 * Tracks page views, max scroll depth, and time on page for every route change.
 * Scroll depth and time-on-page are flushed when the user navigates away.
 */
export function usePageAnalytics() {
  const location = useLocation()

  useEffect(() => {
    const page = location.pathname
    const startTime = Date.now()
    let maxScrollPercent = 0

    trackPageView(page)

    const handleScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollableHeight <= 0) return
      const percent = Math.round((window.scrollY / scrollableHeight) * 100)
      maxScrollPercent = Math.max(maxScrollPercent, Math.min(percent, 100))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (maxScrollPercent > 0) {
        trackScrollDepth(page, maxScrollPercent)
      }
      const secondsOnPage = Math.round((Date.now() - startTime) / 1000)
      trackTimeOnPage(page, secondsOnPage)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])
}
