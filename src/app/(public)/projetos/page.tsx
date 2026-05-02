import type { Metadata } from 'next'

import { PublicPageShell } from '../_components/public-page-shell'
import { ProjectsGrid } from './_components/projects-grid'

export const metadata: Metadata = {
  title: 'Projetos | LEMM',
  description: 'Projetos de pesquisa, TCC, mestrado e plataformas do ecossistema LEMM — PUC Goiás.',
}

export default function ProjetosPage() {
  return (
    <PublicPageShell
      aria-label="Projetos LEMM"
      title="Projetos"
      lead="Pesquisas, TCCs, dissertações e plataformas desenvolvidas no ecossistema LEMM."
      fullWidthContent={<ProjectsGrid />}
    />
  )
}
