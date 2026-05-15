import type { Metadata } from 'next'
import { Suspense } from 'react'

import { db } from '@/lib/db'
import { projects } from '@/lib/db/schema'
import { fetchTeamMembersDisplayMap } from '@/lib/db/team-member-display-map'
import { PublicPageShell } from '../_components/public-page-shell'
import { ProjectsGrid } from './_components/projects-grid'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Projetos | LEMM',
  description:
    'Projetos de pesquisa, TCC, mestrado e plataformas do ecossistema LEMM — PUC Goiás.',
}

async function fetchProjects() {
  const rows = await db
    .select({
      id: projects.id,
      slug: projects.slug,
      title: projects.title,
      category: projects.category,
      themes: projects.themes,
      description: projects.description,
      imageMimeType: projects.imageMimeType,
      pdfMimeType: projects.pdfMimeType,
      authors: projects.authors,
      startDate: projects.startDate,
      endDate: projects.endDate,
      gitUrl: projects.gitUrl,
      publicationUrl: projects.publicationUrl,
      advisorId: projects.advisorId,
      coAdvisorId: projects.coAdvisorId,
      researchLeadId: projects.researchLeadId,
      updatedAt: projects.updatedAt,
    })
    .from(projects)
    .orderBy(projects.startDate)

  const memberMap = await fetchTeamMembersDisplayMap()

  return rows.map(r => ({
    ...r,
    startDate: r.startDate.toISOString(),
    endDate: r.endDate ? r.endDate.toISOString() : null,
    updatedAt: r.updatedAt.toISOString(),
    advisorName: r.advisorId ? (memberMap[r.advisorId] ?? null) : null,
    coAdvisorName: r.coAdvisorId ? (memberMap[r.coAdvisorId] ?? null) : null,
    researchLeadName: r.researchLeadId ? (memberMap[r.researchLeadId] ?? null) : null,
  }))
}

export default async function ProjetosPage() {
  const data = await fetchProjects()

  return (
    <PublicPageShell
      aria-label="Projetos LEMM"
      title="Projetos"
      lead="Pesquisas, TCCs, dissertações e plataformas desenvolvidas no ecossistema LEMM."
      fullWidthContent={
        <Suspense>
          <ProjectsGrid projects={data} />
        </Suspense>
      }
    />
  )
}
