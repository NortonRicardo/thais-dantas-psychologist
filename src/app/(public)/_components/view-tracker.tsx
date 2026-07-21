'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function ViewTracker() {
  const pathname = usePathname()

  useEffect(() => {
    const payload = JSON.stringify({ path: pathname })
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        '/api/track/view',
        new Blob([payload], { type: 'application/json' })
      )
    } else {
      fetch('/api/track/view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {})
    }
  }, [pathname])

  return null
}
