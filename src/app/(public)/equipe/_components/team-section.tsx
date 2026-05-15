import { db } from '@/lib/db'
import {
  teamCategories,
  teamDegreeLevels,
  teamMembers,
  teamNamePrefixes,
} from '@/lib/db/schema'
import { fetchProjectSummariesForEquipe } from '@/lib/db/project-queries'
import {
  teamMemberDisplayName,
  teamMemberProfessionalLine,
} from '@/lib/team-member-display'
import { asc, eq } from 'drizzle-orm'

import { TeamEquipeInteractive } from './team-equipe-interactive'
import type {
  EquipeProjectSummary,
  EquipeSectionView,
} from './team-equipe-interactive'

const ROLE_ADVISOR = 'Orientador(a)'
const ROLE_COADVISOR = 'Coorientador(a)'
const ROLE_LEAD = 'Liderança de pesquisa'

export async function TeamSection() {
  const rows = await db
    .select({
      id: teamMembers.id,
      name: teamMembers.name,
      namePrefixLabel: teamNamePrefixes.label,
      degreeLevelLabel: teamDegreeLevels.label,
      qualification: teamMembers.qualification,
      formationInstitution: teamMembers.formationInstitution,
      description: teamMembers.description,
      photo: teamMembers.photo,
      photoMimeType: teamMembers.photoMimeType,
      linkedinUrl: teamMembers.linkedinUrl,
      lattesUrl: teamMembers.lattesUrl,
      categoryId: teamCategories.id,
      categoryTitle: teamCategories.title,
      categoryColor: teamCategories.color,
    })
    .from(teamMembers)
    .innerJoin(teamCategories, eq(teamMembers.categoryId, teamCategories.id))
    .leftJoin(
      teamNamePrefixes,
      eq(teamMembers.namePrefixId, teamNamePrefixes.id)
    )
    .leftJoin(
      teamDegreeLevels,
      eq(teamMembers.degreeLevelId, teamDegreeLevels.id)
    )
    .orderBy(asc(teamCategories.title), asc(teamMembers.name))

  const projectRows = await fetchProjectSummariesForEquipe()

  const projectsByMember = new Map<string, EquipeProjectSummary[]>()

  function attachMemberProject(
    memberId: string | null,
    summary: EquipeProjectSummary,
    role: string
  ) {
    if (!memberId) return
    const list = projectsByMember.get(memberId) ?? []
    const existing = list.find(x => x.slug === summary.slug)
    if (existing) {
      if (!existing.roles.includes(role)) existing.roles.push(role)
      return
    }
    list.push({ ...summary, roles: [role] })
    projectsByMember.set(memberId, list)
  }

  for (const p of projectRows) {
    const summary: EquipeProjectSummary = {
      slug: p.slug,
      title: p.title,
      category: p.category,
      description: p.description,
      themes: [...(p.themes ?? [])],
      authors: [...(p.authors ?? [])],
      startDate: p.startDate.toISOString(),
      endDate: p.endDate ? p.endDate.toISOString() : null,
      gitUrl: p.gitUrl,
      publicationUrl: p.publicationUrl,
      roles: [],
    }
    attachMemberProject(p.advisorId, summary, ROLE_ADVISOR)
    attachMemberProject(p.coAdvisorId, summary, ROLE_COADVISOR)
    attachMemberProject(p.researchLeadId, summary, ROLE_LEAD)
  }

  for (const list of projectsByMember.values()) {
    list.sort((a, b) => {
      const ta =
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      if (ta !== 0) return ta
      return a.title.localeCompare(b.title, 'pt-BR')
    })
  }

  const hasAny = rows.length > 0

  if (!hasAny) {
    return (
      <div className="mt-10 w-full pb-16">
        <p className="text-center text-sm text-white/35">
          Equipe em atualização.
        </p>
      </div>
    )
  }

  const sections: EquipeSectionView[] = []
  const indexByCategory = new Map<string, number>()

  for (const r of rows) {
    let idx = indexByCategory.get(r.categoryId)
    if (idx === undefined) {
      idx = sections.length
      indexByCategory.set(r.categoryId, idx)
      sections.push({
        categoryId: r.categoryId,
        title: r.categoryTitle,
        categoryColor: r.categoryColor,
        members: [],
      })
    }
    sections[idx].members.push({
      id: r.id,
      name: r.name,
      displayName: teamMemberDisplayName(r.name, r.namePrefixLabel),
      professionalLine: teamMemberProfessionalLine({
        degreeLevelLabel: r.degreeLevelLabel,
        qualification: r.qualification,
        formationInstitution: r.formationInstitution,
      }),
      categoryId: r.categoryId,
      categoryTitle: r.categoryTitle,
      categoryColor: r.categoryColor,
      degreeLevelLabel: r.degreeLevelLabel,
      description: r.description,
      linkedinUrl: r.linkedinUrl,
      lattesUrl: r.lattesUrl,
      hasPhoto: !!(r.photo && r.photoMimeType),
      projects: projectsByMember.get(r.id) ?? [],
    })
  }

  const SECTION_TITLE_ORDER = new Map<string, number>([
    ['Professores', 0],
    ['Colaboradores', 1],
    ['Convidados', 2],
  ])

  sections.sort((a, b) => {
    const pa = SECTION_TITLE_ORDER.has(a.title)
      ? SECTION_TITLE_ORDER.get(a.title)!
      : 100
    const pb = SECTION_TITLE_ORDER.has(b.title)
      ? SECTION_TITLE_ORDER.get(b.title)!
      : 100
    if (pa !== pb) return pa - pb
    return a.title.localeCompare(b.title, 'pt-BR')
  })

  return <TeamEquipeInteractive sections={sections} />
}
