import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { fetchProjectHydratedBySlug } from '@/lib/db/project-queries'
import { LabSceneShell } from '../../_components/lab-scene-shell'
import { LabPublicHeader } from '../../_components/lab-public-header'
import { ProjectDetail } from './_components/project-detail'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ id: string }> }

async function fetchPublicProject(slug: string) {
  const h = await fetchProjectHydratedBySlug(slug)
  if (!h) return null
  return {
    id: h.id,
    slug: h.slug,
    title: h.title,
    category: h.categoryTitle,
    categoryChipBg: h.categoryChipBg,
    categoryChipBorder: h.categoryChipBorder,
    categoryChipText: h.categoryChipText,
    themes: h.themes,
    themeTags: h.themeTags,
    description: h.description,
    imageMimeType: h.imageMimeType,
    pdfMimeType: h.pdfMimeType,
    authors: h.authors,
    startDate: h.startDate,
    endDate: h.endDate,
    gitUrl: h.gitUrl,
    publicationUrl: h.publicationUrl,
    advisorName: h.advisorName,
    coAdvisorName: h.coAdvisorName,
    researchLeadName: h.researchLeadName,
    updatedAt: h.updatedAt,
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const project = await fetchPublicProject(id)
  if (!project) return { title: 'Projeto não encontrado | LEMM' }
  return {
    title: `${project.title} | LEMM`,
    description: project.description.slice(0, 160),
  }
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params
  const project = await fetchPublicProject(id)
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
