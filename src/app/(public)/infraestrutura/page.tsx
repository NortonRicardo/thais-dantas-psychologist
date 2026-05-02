import type { Metadata } from 'next'

import { getPublicCollaborationPartners } from '@/lib/http/collaboration-partners'
import { PublicPageShell } from '../_components/public-page-shell'
import { InfraestruturaSection } from './_components/infraestrutura-section'

export const metadata: Metadata = {
  title: 'Infraestrutura | LEMM',
  description:
    'Infraestrutura computacional do LEMM — hardware, plataformas e rede de colaboração.',
}

export default async function InfraestruturaPage() {
  const list = await getPublicCollaborationPartners()
  const partners = list.map(({ id, name, description }) => ({
    id,
    name,
    description,
  }))

  return (
    <PublicPageShell
      aria-label="Infraestrutura LEMM"
      title="Infraestrutura"
      lead="Hardware de alto desempenho, plataformas proprietárias e rede de colaboração interinstitucional para pesquisa em modelagem climática, IA e otimização."
      fullWidthContent={<InfraestruturaSection partners={partners} />}
    />
  )
}
