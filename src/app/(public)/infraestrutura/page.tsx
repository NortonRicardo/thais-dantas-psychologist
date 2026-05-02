import type { Metadata } from 'next'

import { PublicPageShell } from '../_components/public-page-shell'

export const metadata: Metadata = {
  title: 'Infraestrutura | LEMM',
  description:
    'Infraestrutura de computação e laboratórios do LEMM — PUC Goiás.',
}

export default function InfraestruturaPage() {
  return (
    <PublicPageShell
      aria-label="Infraestrutura LEMM"
      title="Infraestrutura"
      lead="Equipamentos, clusters e ambiente de pesquisa — detalhes em breve."
    />
  )
}
