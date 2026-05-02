import type { Metadata } from 'next'

import { PublicPageShell } from '../_components/public-page-shell'
import { Timeline } from './_components/timeline'

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
      lead="Fundado em 2016 na PUC Goiás, o LEMM articula modelagem matemática, inteligência artificial, HPC e ciência de dados em pesquisa aplicada ao clima, otimização e inovação tecnológica."
      fullWidthContent={<Timeline />}
    />
  )
}
