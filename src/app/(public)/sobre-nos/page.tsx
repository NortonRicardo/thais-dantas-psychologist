import type { Metadata } from 'next'

import { PublicPageShell } from '../_components/public-page-shell'

export const metadata: Metadata = {
  title: 'Sobre Nós | LEMM',
  description:
    'Conheça o Laboratório de Estudos e Modelagem Matemática da PUC Goiás.',
}

export default function SobreNosPage() {
  return (
    <PublicPageShell
      aria-label="Sobre o LEMM"
      title="Sobre Nós"
      lead="Missão, equipe e histórico do laboratório — página em construção."
    />
  )
}
