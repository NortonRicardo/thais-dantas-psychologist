import type { Metadata } from 'next'

import { PublicPageShell } from '../_components/public-page-shell'
import { EventsSection } from './_components/events-section'

export const metadata: Metadata = {
  title: 'Eventos | LEMM',
  description:
    'Conferências, workshops, seminários e desafios do ecossistema LEMM — PUC Goiás.',
}

export default function EventsPage() {
  return (
    <PublicPageShell
      aria-label="Eventos LEMM"
      title="Eventos"
      lead="Conferências, workshops, seminários e desafios científicos do ecossistema LEMM."
      fullWidthContent={<EventsSection />}
    />
  )
}
