export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'

import { PublicPageShell } from '../_components/public-page-shell'
import { ContatoSection } from './_components/contato-section'

export const metadata: Metadata = {
  title: 'Contato | LEMM',
  description:
    'Entre em contato com o Laboratório de Estatística e Modelagem Matemática.',
}

export default function ContatoPage() {
  return (
    <PublicPageShell
      aria-label="Contato LEMM"
      title="Contato"
      lead="Canais oficiais do Laboratório de Estatística e Modelagem Matemática na PUC Goiás."
      fullWidthContent={<ContatoSection />}
    />
  )
}
