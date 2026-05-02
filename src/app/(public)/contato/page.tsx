import type { Metadata } from 'next'

import { PublicPageShell } from '../_components/public-page-shell'

export const metadata: Metadata = {
  title: 'Contato | LEMM',
  description:
    'Entre em contato com o Laboratório de Estudos e Modelagem Matemática.',
}

export default function ContatoPage() {
  return (
    <PublicPageShell
      aria-label="Contato LEMM"
      title="Contato"
      lead="Formulário e canais oficiais serão disponibilizados em breve."
    />
  )
}
