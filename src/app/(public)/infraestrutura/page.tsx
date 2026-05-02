import type { Metadata } from 'next'

import { getPublicCollaborationPartners } from '@/lib/http/collaboration-partners'
import { getPublicDevelopedPlatforms } from '@/lib/http/developed-platforms'
import { PublicPageShell } from '../_components/public-page-shell'
import { InfraestruturaSection } from './_components/infraestrutura-section'

export const metadata: Metadata = {
  title: 'Infraestrutura | LEMM',
  description:
    'Infraestrutura computacional do LEMM — hardware, plataformas e rede de colaboração.',
}

export default async function InfraestruturaPage() {
  const [platformList, partnerList] = await Promise.all([
    getPublicDevelopedPlatforms(),
    getPublicCollaborationPartners(),
  ])

  const platforms = platformList.map(
    ({
      id,
      title,
      description,
      projectLink,
      platformLink,
      badge,
      iconKey,
    }) => ({
      id,
      title,
      description,
      projectLink,
      platformLink,
      badge,
      iconKey,
    })
  )

  const partners = partnerList.map(({ id, name, description }) => ({
    id,
    name,
    description,
  }))

  return (
    <PublicPageShell
      aria-label="Infraestrutura LEMM"
      title="Infraestrutura"
      lead="Hardware de alto desempenho, plataformas proprietárias e rede de colaboração interinstitucional para pesquisa em modelagem climática, IA e otimização."
      fullWidthContent={
        <InfraestruturaSection platforms={platforms} partners={partners} />
      }
    />
  )
}
