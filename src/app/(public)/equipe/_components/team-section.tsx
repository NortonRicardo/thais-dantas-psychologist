import { db } from '@/lib/db'
import { teamMembers } from '@/lib/db/schema'
import { asc } from 'drizzle-orm'

const CATEGORIES = [
  { key: 'professores', label: 'Professores' },
  { key: 'colaboradores', label: 'Colaboradores' },
  { key: 'convidados', label: 'Convidados' },
] as const

type Member = {
  id: string
  name: string
  qualification: string
  description: string | null
  photoMimeType: string | null
  photo: Buffer | null
}

function MemberCard({ member }: { member: Member }) {
  const initials = member.name
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
          <img src={photoSrc} alt={member.name} className="h-full w-full object-cover" />
        ) : (
          initials
        )}
      </div>
      <div>
        <p className="text-sm font-semibold text-white/90">{member.name}</p>
        <p className="mt-0.5 text-xs text-[#00d4ff]/80">{member.qualification}</p>
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
      category: teamMembers.category,
      name: teamMembers.name,
      qualification: teamMembers.qualification,
      description: teamMembers.description,
      photo: teamMembers.photo,
      photoMimeType: teamMembers.photoMimeType,
    })
    .from(teamMembers)
    .orderBy(asc(teamMembers.sortOrder), asc(teamMembers.createdAt))

  const grouped = Object.fromEntries(
    CATEGORIES.map(c => [c.key, rows.filter(r => r.category === c.key)])
  )

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

  return (
    <div className="mt-10 w-full space-y-12 pb-16">
      {CATEGORIES.map(({ key, label }) => {
        const members = grouped[key]
        if (!members || members.length === 0) return null
        return (
          <section key={key}>
            <h2 className="mb-6 text-xs font-semibold uppercase tracking-[4px] text-white/40">
              {label}
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {members.map(m => (
                <MemberCard key={m.id} member={m as Member} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
