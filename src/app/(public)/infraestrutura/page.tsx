import type { Metadata } from 'next'

import { getPublicCollaborationPartners } from '@/lib/http/collaboration-partners'
import { getPublicDevelopedPlatforms } from '@/lib/http/developed-platforms'
import { getPublicHardwareList } from '@/lib/http/hardware'
import { PublicPageShell } from '../_components/public-page-shell'
import { InfraestruturaSection } from './_components/infraestrutura-section'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Infraestrutura | LEMM',
  description:
    'Infraestrutura computacional do LEMM — hardware, plataformas e Parcerias.',
}

export default async function InfraestruturaPage() {
  const [platformList, partnerList, hardwareBlocks] = await Promise.all([
    getPublicDevelopedPlatforms(),
    getPublicCollaborationPartners(),
    getPublicHardwareList(),
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
      lead="Hardware de alto desempenho, plataformas proprietárias e Parcerias interinstitucional para pesquisa em modelagem climática, IA e otimização."
      fullWidthContent={
        <InfraestruturaSection
          hardwareBlocks={hardwareBlocks.map(({ id, title, modules }) => ({
            id,
            title,
            modules: modules.map(m => ({
              id: m.id,
              title: m.title,
              iconKey: m.iconKey,
              description: m.description,
            })),
          }))}
          platforms={platforms}
          partners={partners}
        />
      }
    />
  )
}
