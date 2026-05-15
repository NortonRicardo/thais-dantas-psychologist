import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { eq } from 'drizzle-orm'

import { db } from '@/lib/db'
import { projects } from '@/lib/db/schema'
import { fetchTeamMembersDisplayMap } from '@/lib/db/team-member-display-map'
import { LabSceneShell } from '../../_components/lab-scene-shell'
import { LabPublicHeader } from '../../_components/lab-public-header'
import { ProjectDetail } from './_components/project-detail'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ id: string }> }

async function fetchProject(slug: string) {
  const [row] = await db
    .select()
    .from(projects)
    .where(eq(projects.slug, slug))

  if (!row) return null

  const memberMap = await fetchTeamMembersDisplayMap()

  return {
    ...row,
    image: undefined,
    pdf: undefined,
    startDate: row.startDate.toISOString(),
    endDate: row.endDate ? row.endDate.toISOString() : null,
    updatedAt: row.updatedAt.toISOString(),
    advisorName: row.advisorId ? (memberMap[row.advisorId] ?? null) : null,
    coAdvisorName: row.coAdvisorId ? (memberMap[row.coAdvisorId] ?? null) : null,
    researchLeadName: row.researchLeadId ? (memberMap[row.researchLeadId] ?? null) : null,
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const project = await fetchProject(id)
  if (!project) return { title: 'Projeto não encontrado | LEMM' }
  return {
    title: `${project.title} | LEMM`,
    description: project.description.slice(0, 160),
  }
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params
  const project = await fetchProject(id)
  if (!project) notFound()

  return (
    <>
      <LabSceneShell aria-label={project.title} subtlePlexus>
        <LabPublicHeader variant="static" />
        <div className="relative z-10 mt-4 w-full flex-1">
          <ProjectDetail project={project} />
        </div>
      </LabSceneShell>
    </>
  )
}
