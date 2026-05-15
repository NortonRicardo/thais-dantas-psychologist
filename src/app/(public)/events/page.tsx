import type { Metadata } from 'next'

import { getPublicEventTypes, getPublicEvents } from '@/lib/http/events'
import { PublicPageShell } from '../_components/public-page-shell'
import { EventsSection } from './_components/events-section'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Eventos | LEMM',
  description:
    'Conferências, workshops, seminários e desafios do ecossistema LEMM — PUC Goiás.',
}

export default async function EventsPage() {
  const [data, types] = await Promise.all([getPublicEvents(), getPublicEventTypes()])

  return (
    <PublicPageShell
      aria-label="Eventos LEMM"
      fullWidthContent={<EventsSection events={data} eventTypes={types} />}
    />
  )
}
