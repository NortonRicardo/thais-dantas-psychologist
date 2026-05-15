import type { Metadata } from 'next'
import { Suspense } from 'react'

import {
  fetchProjectThemesCatalog,
  fetchProjectsHydrated,
} from '@/lib/db/project-queries'
import { PublicPageShell } from '../_components/public-page-shell'
import {
  ProjectsGrid,
  type ThemeFilterOption,
} from './_components/projects-grid'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Projetos | LEMM',
  description:
    'Projetos de pesquisa, TCC, mestrado e plataformas do ecossistema LEMM — PUC Goiás.',
}

function mapToPublicProjects(
  rows: Awaited<ReturnType<typeof fetchProjectsHydrated>>
) {
  return rows.map(h => ({
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
  }))
}

export default async function ProjetosPage() {
  const [hydrated, themeRows] = await Promise.all([
    fetchProjectsHydrated(),
    fetchProjectThemesCatalog(),
  ])

  const data = mapToPublicProjects(hydrated)
  const themeFilters: ThemeFilterOption[] = themeRows.map(t => ({
    slug: t.slug,
    name: t.name,
    filterBg: t.filterBg,
    filterBorder: t.filterBorder,
    filterText: t.filterText,
    filterActiveBg: t.filterActiveBg,
  }))

  return (
    <PublicPageShell
      aria-label="Projetos LEMM"
      title="Projetos"
      lead="Pesquisas, TCCs, dissertações e plataformas desenvolvidas no ecossistema LEMM."
      fullWidthContent={
        <Suspense>
          <ProjectsGrid projects={data} themeFilters={themeFilters} />
        </Suspense>
      }
    />
  )
}
