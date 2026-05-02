import type { Metadata } from 'next'

import { PublicPageShell } from '../_components/public-page-shell'

export const metadata: Metadata = {
  title: 'Eventos | LEMM',
  description:
    'Eventos do Laboratório de Estudos e Modelagem Matemática — PUC Goiás.',
}

export default function EventsPage() {
  return (
    <PublicPageShell
      aria-label="Eventos LEMM"
      title="Eventos"
      lead="Calendário e cadastro de eventos em construção. O fundo e o menu seguem a identidade visual LEMM."
    />
  )
}
