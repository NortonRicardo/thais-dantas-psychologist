import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { LabSceneShell } from '../../_components/lab-scene-shell'
import { LabPublicHeader } from '../../_components/lab-public-header'
import { PublicFooter } from '../../_components/public-footer'
import { ProjectDetail } from './_components/project-detail'
import { getProjectById, projects } from '../_data/projects-data'

type Props = { params: Promise<{ id: string }> }

export async function generateStaticParams() {
  return projects.map(p => ({ id: p.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const project = getProjectById(id)
  if (!project) return { title: 'Projeto não encontrado | LEMM' }
  return {
    title: `${project.title} | LEMM`,
    description: project.description.slice(0, 160),
  }
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params
  const project = getProjectById(id)
  if (!project) notFound()

  return (
    <>
      <LabSceneShell aria-label={project.title} subtlePlexus>
        <LabPublicHeader variant="static" />
        <div className="relative z-10 mt-4 w-full flex-1">
          <ProjectDetail project={project} />
        </div>
      </LabSceneShell>
      <PublicFooter />
    </>
  )
}
