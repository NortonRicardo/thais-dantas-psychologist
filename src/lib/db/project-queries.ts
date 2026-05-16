import { asc, eq, inArray } from 'drizzle-orm'

import { db } from '@/lib/db'
import {
  projectCategories,
  projectOtherMembers,
  projectProjectThemes,
  projects,
  projectThemes,
  teamMembers,
  teamNamePrefixes,
} from '@/lib/db/schema'
import {
  fetchTeamMembersDisplayMap,
  fetchTeamMembersInfoMap,
  type TeamMemberInfo,
} from '@/lib/db/team-member-display-map'
import { teamMemberDisplayName } from '@/lib/team-member-display'

export type ProjectThemeTag = { name: string; pillColor: string }

export type HydratedProjectBase = {
  id: string
  slug: string
  title: string
  categoryId: string
  categoryTitle: string
  categoryColor: string
  categoryChipBg: string
  categoryChipBorder: string
  categoryChipText: string
  themes: string[]
  themeIds: string[]
  themeTags: ProjectThemeTag[]
  description: string
  imageMimeType: string | null
  pdfMimeType: string | null
  /** Display names of "outros" membros (sourced from junction table) */
  authors: string[]
  /** IDs dos "outros" membros (para hidratar o form de edição) */
  otherMemberIds: string[]
  startDate: string
  endDate: string | null
  gitUrl: string | null
  publicationUrl: string | null
  advisorId: string | null
  coAdvisorId: string | null
  researchLeadId: string | null
  updatedAt: string
  advisorName: string | null
  coAdvisorName: string | null
  researchLeadName: string | null
  /** Info de todos os membros referenciados neste projeto (para avatares). */
  memberInfoMap: Record<string, TeamMemberInfo>
}

type JoinedProjectRow = {
  id: string
  slug: string
  title: string
  categoryId: string
  categoryTitle: string
  categoryColor: string
  categoryChipBg: string
  categoryChipBorder: string
  categoryChipText: string
  description: string
  imageMimeType: string | null
  pdfMimeType: string | null
  startDate: Date
  endDate: Date | null
  gitUrl: string | null
  publicationUrl: string | null
  advisorId: string | null
  coAdvisorId: string | null
  researchLeadId: string | null
  updatedAt: Date
}

const projectSelectFields = {
  id: projects.id,
  slug: projects.slug,
  title: projects.title,
  categoryId: projects.categoryId,
  categoryTitle: projectCategories.title,
  categoryColor: projectCategories.color,
  categoryChipBg: projectCategories.chipBg,
  categoryChipBorder: projectCategories.chipBorder,
  categoryChipText: projectCategories.chipText,
  description: projects.description,
  imageMimeType: projects.imageMimeType,
  pdfMimeType: projects.pdfMimeType,
  startDate: projects.startDate,
  endDate: projects.endDate,
  gitUrl: projects.gitUrl,
  publicationUrl: projects.publicationUrl,
  advisorId: projects.advisorId,
  coAdvisorId: projects.coAdvisorId,
  researchLeadId: projects.researchLeadId,
  updatedAt: projects.updatedAt,
}

async function attachThemesAndMembers(
  rows: JoinedProjectRow[]
): Promise<HydratedProjectBase[]> {
  if (rows.length === 0) return []

  const ids = rows.map(r => r.id)

  const [themeLinks, otherMemberLinks, memberMap, infoMap] = await Promise.all([
    db
      .select({
        projectId: projectProjectThemes.projectId,
        themeId: projectThemes.id,
        name: projectThemes.name,
        pillColor: projectThemes.pillColor,
      })
      .from(projectProjectThemes)
      .innerJoin(projectThemes, eq(projectProjectThemes.themeId, projectThemes.id))
      .where(inArray(projectProjectThemes.projectId, ids)),

    db
      .select({
        projectId: projectOtherMembers.projectId,
        memberId: projectOtherMembers.memberId,
        sortOrder: projectOtherMembers.sortOrder,
        name: teamMembers.name,
        prefixLabel: teamNamePrefixes.label,
      })
      .from(projectOtherMembers)
      .innerJoin(teamMembers, eq(projectOtherMembers.memberId, teamMembers.id))
      .leftJoin(teamNamePrefixes, eq(teamMembers.namePrefixId, teamNamePrefixes.id))
      .where(inArray(projectOtherMembers.projectId, ids))
      .orderBy(projectOtherMembers.sortOrder),

    fetchTeamMembersDisplayMap(),
    fetchTeamMembersInfoMap(),
  ])

  const byProject = new Map<string, { name: string; pillColor: string; id: string }[]>()
  for (const l of themeLinks) {
    const list = byProject.get(l.projectId) ?? []
    list.push({ id: l.themeId, name: l.name, pillColor: l.pillColor })
    byProject.set(l.projectId, list)
  }

  const otherByProject = new Map<string, { memberId: string; displayName: string }[]>()
  for (const l of otherMemberLinks) {
    const list = otherByProject.get(l.projectId) ?? []
    list.push({ memberId: l.memberId, displayName: teamMemberDisplayName(l.name, l.prefixLabel) })
    otherByProject.set(l.projectId, list)
  }

  return rows.map(row => {
    const tags = (byProject.get(row.id) ?? []).sort((a, b) =>
      a.name.localeCompare(b.name, 'pt-BR')
    )
    const otherMembers = otherByProject.get(row.id) ?? []
    const referencedIds = [
      row.advisorId,
      row.coAdvisorId,
      row.researchLeadId,
      ...otherMembers.map(m => m.memberId),
    ].filter((id): id is string => id !== null)
    const memberInfoMap: Record<string, TeamMemberInfo> = {}
    for (const id of referencedIds) {
      if (infoMap[id]) memberInfoMap[id] = infoMap[id]
    }
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      categoryId: row.categoryId,
      categoryTitle: row.categoryTitle,
      categoryColor: row.categoryColor,
      categoryChipBg: row.categoryChipBg,
      categoryChipBorder: row.categoryChipBorder,
      categoryChipText: row.categoryChipText,
      themes: tags.map(t => t.name),
      themeIds: tags.map(t => t.id),
      themeTags: tags.map(t => ({ name: t.name, pillColor: t.pillColor })),
      description: row.description,
      imageMimeType: row.imageMimeType,
      pdfMimeType: row.pdfMimeType,
      authors: otherMembers.map(m => m.displayName),
      otherMemberIds: otherMembers.map(m => m.memberId),
      startDate: row.startDate.toISOString(),
      endDate: row.endDate ? row.endDate.toISOString() : null,
      gitUrl: row.gitUrl,
      publicationUrl: row.publicationUrl,
      advisorId: row.advisorId,
      coAdvisorId: row.coAdvisorId,
      researchLeadId: row.researchLeadId,
      updatedAt: row.updatedAt.toISOString(),
      advisorName: row.advisorId ? (memberMap[row.advisorId] ?? null) : null,
      coAdvisorName: row.coAdvisorId ? (memberMap[row.coAdvisorId] ?? null) : null,
      researchLeadName: row.researchLeadId ? (memberMap[row.researchLeadId] ?? null) : null,
      memberInfoMap,
    }
  })
}

export async function fetchProjectsHydrated(): Promise<HydratedProjectBase[]> {
  const rows = await db
    .select(projectSelectFields)
    .from(projects)
    .innerJoin(projectCategories, eq(projects.categoryId, projectCategories.id))
    .orderBy(projects.startDate)

  return attachThemesAndMembers(rows as JoinedProjectRow[])
}

export async function fetchProjectHydratedBySlug(
  slug: string
): Promise<HydratedProjectBase | null> {
  const [row] = await db
    .select(projectSelectFields)
    .from(projects)
    .innerJoin(projectCategories, eq(projects.categoryId, projectCategories.id))
    .where(eq(projects.slug, slug))

  if (!row) return null
  const [full] = await attachThemesAndMembers([row as JoinedProjectRow])
  return full ?? null
}

export async function fetchProjectHydratedById(
  id: string
): Promise<HydratedProjectBase | null> {
  const [row] = await db
    .select(projectSelectFields)
    .from(projects)
    .innerJoin(projectCategories, eq(projects.categoryId, projectCategories.id))
    .where(eq(projects.id, id))

  if (!row) return null
  const [full] = await attachThemesAndMembers([row as JoinedProjectRow])
  return full ?? null
}

export async function fetchProjectThemesCatalog() {
  return db
    .select({
      id: projectThemes.id,
      name: projectThemes.name,
      slug: projectThemes.slug,
      color: projectThemes.color,
      pillColor: projectThemes.pillColor,
      filterBg: projectThemes.filterBg,
      filterBorder: projectThemes.filterBorder,
      filterText: projectThemes.filterText,
      filterActiveBg: projectThemes.filterActiveBg,
    })
    .from(projectThemes)
    .orderBy(asc(projectThemes.name))
}

/** Resumo para a página Equipe (membro ↔ projetos) */
export async function fetchProjectSummariesForEquipe(): Promise<
  {
    id: string
    slug: string
    title: string
    category: string
    description: string
    themes: string[]
    authors: string[]
    startDate: Date
    endDate: Date | null
    gitUrl: string | null
    publicationUrl: string | null
    advisorId: string | null
    coAdvisorId: string | null
    researchLeadId: string | null
  }[]
> {
  const base = await db
    .select({
      id: projects.id,
      slug: projects.slug,
      title: projects.title,
      category: projectCategories.title,
      description: projects.description,
      startDate: projects.startDate,
      endDate: projects.endDate,
      gitUrl: projects.gitUrl,
      publicationUrl: projects.publicationUrl,
      advisorId: projects.advisorId,
      coAdvisorId: projects.coAdvisorId,
      researchLeadId: projects.researchLeadId,
    })
    .from(projects)
    .innerJoin(projectCategories, eq(projects.categoryId, projectCategories.id))

  const ids = base.map(r => r.id)
  if (ids.length === 0) return []

  const [themeLinks, otherMemberLinks] = await Promise.all([
    db
      .select({ projectId: projectProjectThemes.projectId, name: projectThemes.name })
      .from(projectProjectThemes)
      .innerJoin(projectThemes, eq(projectProjectThemes.themeId, projectThemes.id))
      .where(inArray(projectProjectThemes.projectId, ids)),

    db
      .select({
        projectId: projectOtherMembers.projectId,
        name: teamMembers.name,
        prefixLabel: teamNamePrefixes.label,
      })
      .from(projectOtherMembers)
      .innerJoin(teamMembers, eq(projectOtherMembers.memberId, teamMembers.id))
      .leftJoin(teamNamePrefixes, eq(teamMembers.namePrefixId, teamNamePrefixes.id))
      .where(inArray(projectOtherMembers.projectId, ids))
      .orderBy(projectOtherMembers.sortOrder),
  ])

  const byProject = new Map<string, string[]>()
  for (const l of themeLinks) {
    const list = byProject.get(l.projectId) ?? []
    list.push(l.name)
    byProject.set(l.projectId, list)
  }

  const authorsByProject = new Map<string, string[]>()
  for (const l of otherMemberLinks) {
    const list = authorsByProject.get(l.projectId) ?? []
    list.push(teamMemberDisplayName(l.name, l.prefixLabel))
    authorsByProject.set(l.projectId, list)
  }

  return base.map(row => ({
    ...row,
    themes: (byProject.get(row.id) ?? []).sort((a, b) => a.localeCompare(b, 'pt-BR')),
    authors: authorsByProject.get(row.id) ?? [],
  }))
}
