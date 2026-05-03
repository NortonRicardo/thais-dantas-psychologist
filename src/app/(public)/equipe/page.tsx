import type { Metadata } from 'next'

import { PublicPageShell } from '../_components/public-page-shell'
import { TeamSection } from './_components/team-section'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Equipe | LEMM',
  description:
    'Conheça os professores, colaboradores e convidados do Laboratório de Estudos e Modelagem Matemática.',
}

export default function EquipePage() {
  return (
    <PublicPageShell
      aria-label="Equipe LEMM"
      title="Equipe"
      lead="Professores, colaboradores e convidados que integram o Laboratório de Estudos e Modelagem Matemática da PUC Goiás."
      fullWidthContent={<TeamSection />}
    />
  )
}
