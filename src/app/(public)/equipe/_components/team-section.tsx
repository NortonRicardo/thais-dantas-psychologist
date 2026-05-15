import { FileText, Linkedin } from 'lucide-react'
import { db } from '@/lib/db'
import {
  teamCategories,
  teamDegreeLevels,
  teamMembers,
  teamNamePrefixes,
} from '@/lib/db/schema'
import { teamMemberDisplayName, teamMemberProfessionalLine } from '@/lib/team-member-display'
import { asc, eq } from 'drizzle-orm'

type Member = {
  id: string
  name: string
  namePrefixLabel: string | null
  displayName: string
  professionalLine: string
  description: string | null
  photoMimeType: string | null
  photo: Buffer | null
  linkedinUrl: string | null
  lattesUrl: string | null
}

type Section = {
  categoryId: string
  title: string
  members: Member[]
}

/** Ordem fixa na página pública (independente do título no banco para outras categorias) */
const SECTION_TITLE_ORDER = new Map<string, number>([
  ['Professores', 0],
  ['Colaboradores', 1],
  ['Convidados', 2],
])

function MemberCard({ member }: { member: Member }) {
  const initials = member.displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')

  let photoSrc: string | null = null
  if (member.photo && member.photoMimeType) {
    const b64 = Buffer.from(member.photo as unknown as ArrayBuffer).toString('base64')
    photoSrc = `data:${member.photoMimeType};base64,${b64}`
  }

  return (
    <div
      className="flex flex-col items-center gap-3 rounded-2xl px-5 py-6 text-center"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.18)',
        boxShadow: '0 8px 32px 0 rgba(0,0,0,0.37)',
      }}
    >
      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/10 text-xl font-bold text-white/50">
        {photoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoSrc} alt={member.displayName} className="h-full w-full object-cover" />
        ) : (
          initials
        )}
      </div>
      <div>
        <p className="text-sm font-semibold text-white/90">{member.displayName}</p>
        <p className="mt-0.5 text-xs text-[#00d4ff]/80">{member.professionalLine}</p>
        {(member.linkedinUrl || member.lattesUrl) && (
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {member.linkedinUrl ? (
              <a
                href={member.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-sky-400/90 transition hover:text-sky-300"
              >
                <Linkedin className="h-3.5 w-3.5" />
                LinkedIn
              </a>
            ) : null}
            {member.lattesUrl ? (
              <a
                href={member.lattesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-teal-400/90 transition hover:text-teal-300"
              >
                <FileText className="h-3.5 w-3.5" />
                Lattes
              </a>
            ) : null}
          </div>
        )}
      </div>
      {member.description && (
        <p className="text-xs leading-relaxed text-white/50">{member.description}</p>
      )}
    </div>
  )
}

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
    })
    .from(teamMembers)
    .innerJoin(teamCategories, eq(teamMembers.categoryId, teamCategories.id))
    .leftJoin(teamNamePrefixes, eq(teamMembers.namePrefixId, teamNamePrefixes.id))
    .leftJoin(teamDegreeLevels, eq(teamMembers.degreeLevelId, teamDegreeLevels.id))
    .orderBy(asc(teamCategories.title), asc(teamMembers.name))

  const hasAny = rows.length > 0

  if (!hasAny) {
    return (
      <div className="mt-10 w-full pb-16">
        <p className="text-center text-sm text-white/35">Equipe em atualização.</p>
      </div>
    )
  }

  const sections: Section[] = []
  const indexByCategory = new Map<string, number>()

  for (const r of rows) {
    let idx = indexByCategory.get(r.categoryId)
    if (idx === undefined) {
      idx = sections.length
      indexByCategory.set(r.categoryId, idx)
      sections.push({
        categoryId: r.categoryId,
        title: r.categoryTitle,
        members: [],
      })
    }
    sections[idx].members.push({
      id: r.id,
      name: r.name,
      namePrefixLabel: r.namePrefixLabel,
      displayName: teamMemberDisplayName(r.name, r.namePrefixLabel),
      professionalLine: teamMemberProfessionalLine({
        degreeLevelLabel: r.degreeLevelLabel,
        qualification: r.qualification,
        formationInstitution: r.formationInstitution,
      }),
      description: r.description,
      photo: r.photo,
      photoMimeType: r.photoMimeType,
      linkedinUrl: r.linkedinUrl,
      lattesUrl: r.lattesUrl,
    })
  }

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

  return (
    <div className="mt-10 w-full space-y-12 pb-16">
      {sections.map(section => (
        <section key={section.categoryId}>
          <h2 className="mb-6 text-xs font-semibold uppercase tracking-[4px] text-white/40">
            {section.title}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {section.members.map(m => (
              <MemberCard key={m.id} member={m} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
